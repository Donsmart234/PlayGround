"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (resp: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
          revoke: (token: string, done?: () => void) => void;
        };
      };
    };
  }
}

export type GoogleUser = {
  sub: string;
  name: string;
  email: string;
  picture?: string;
};

type GoogleSession = {
  user: GoogleUser;
  accessToken: string;
  expiresAt: number;
};

type Status = "loading" | "authenticated" | "unauthenticated";

type GoogleAuthCtx = {
  status: Status;
  user: GoogleUser | null;
  /** False when NEXT_PUBLIC_GOOGLE_CLIENT_ID is missing. */
  configured: boolean;
  signIn: () => void;
  signOut: () => void;
  error: string | null;
};

const Ctx = createContext<GoogleAuthCtx>({
  status: "loading",
  user: null,
  configured: false,
  signIn: () => {},
  signOut: () => {},
  error: null,
});

const STORAGE_KEY = "aurum-google-session";
const GIS_SRC = "https://accounts.google.com/gsi/client";

function loadGis(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("No window"));
  if (window.google?.accounts?.oauth2) return Promise.resolve();
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${GIS_SRC}"]`)) {
      // Script tag exists but library not ready yet — poll briefly.
      let tries = 0;
      const t = setInterval(() => {
        if (window.google?.accounts?.oauth2) {
          clearInterval(t);
          resolve();
        } else if (++tries > 50) {
          clearInterval(t);
          reject(new Error("Google Identity Services failed to load."));
        }
      }, 100);
      return;
    }
    const s = document.createElement("script");
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("Could not load Google sign-in (check connection)."));
    document.head.appendChild(s);
  });
}

async function fetchProfile(token: string): Promise<GoogleUser> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Could not read Google profile.");
  const p = (await res.json()) as {
    sub: string;
    name?: string;
    email?: string;
    picture?: string;
  };
  if (!p.sub || !p.email) throw new Error("Incomplete Google profile.");
  return { sub: p.sub, name: p.name ?? p.email, email: p.email, picture: p.picture };
}

function readStored(): GoogleSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as GoogleSession;
    if (!s.accessToken || !s.user?.email || Date.now() >= s.expiresAt) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}

/**
 * Standalone Google auth via Google Identity Services (OAuth2 popup flow).
 * 100% client-side — works with the static export, zero Privy dependency.
 * Client ID is public by design; no secret needed for this flow.
 */
export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";
  const [status, setStatus] = useState<Status>("loading");
  const [user, setUser] = useState<GoogleUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const clientRef = useRef<{ requestAccessToken: () => void } | null>(null);

  useEffect(() => {
    const stored = readStored();
    if (stored) {
      setUser(stored.user);
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const signIn = useCallback(() => {
    setError(null);
    if (!clientId) {
      setError("missing-config");
      return;
    }
    setStatus((s) => (s === "authenticated" ? s : s));
    loadGis()
      .then(() => {
        const oauth2 = window.google?.accounts?.oauth2;
        if (!oauth2) throw new Error("Google sign-in unavailable.");
        clientRef.current = oauth2.initTokenClient({
          client_id: clientId,
          scope: "openid email profile",
          callback: async (resp) => {
            try {
              if (resp.error || !resp.access_token) {
                throw new Error("Google sign-in was cancelled.");
              }
              const profile = await fetchProfile(resp.access_token);
              const session: GoogleSession = {
                user: profile,
                accessToken: resp.access_token,
                expiresAt: Date.now() + 55 * 60 * 1000, // refresh margin under the 1h token life
              };
              localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
              setUser(profile);
              setStatus("authenticated");
            } catch (e) {
              setError(e instanceof Error ? e.message : "Google sign-in failed.");
              setStatus("unauthenticated");
            }
          },
        });
        clientRef.current.requestAccessToken();
      })
      .catch((e: Error) => {
        setError(e.message);
      });
  }, [clientId]);

  const signOut = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const token = raw ? ((JSON.parse(raw) as GoogleSession).accessToken ?? null) : null;
      if (token && window.google?.accounts?.oauth2) {
        window.google.accounts.oauth2.revoke(token);
      }
    } catch {
      // ignore — clearing local state is what matters
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const value = useMemo<GoogleAuthCtx>(
    () => ({
      status,
      user,
      configured: Boolean(clientId),
      signIn,
      signOut,
      error,
    }),
    [status, user, clientId, signIn, signOut, error]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useGoogleAuth() {
  return useContext(Ctx);
}
