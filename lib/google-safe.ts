const MISSING_GOOGLE_MSG =
  "Google login is not configured yet.\n\n" +
  "1. Google Cloud Console → APIs & Services → Credentials → Create OAuth client (type: Web app)\n" +
  "2. Authorized JavaScript origins → add http://localhost:3000 (plus your production domain later)\n" +
  "   (No redirect URIs needed — sign-in uses a popup.)\n" +
  "3. Put the Client ID in .env.local as NEXT_PUBLIC_GOOGLE_CLIENT_ID (see .env.example)\n" +
  "4. Restart the dev server.";

export function missingGoogleAlert() {
  alert(MISSING_GOOGLE_MSG);
}
