import GoogleLoginButton from "@/components/auth/GoogleLoginButton";
import PrivyLoginButton from "@/components/auth/PrivyLoginButton";
import OrbBackground from "@/components/ui/OrbBackground";
import Reveal from "./Reveal";

/** 8 — Final CTA (repeats Google + Privy buttons). */
export default function FinalCta() {
  return (
    <section className="relative px-4 py-20">
      <div className="glass-strong relative mx-auto max-w-4xl overflow-hidden rounded-[2rem] px-6 py-14 text-center sm:py-16">
        <OrbBackground variant="compact" />
        <Reveal>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl">
            Your wallet should know <span className="brand-gradient-text">it&apos;s you.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-zinc-600">
            Join the MVP: sign in, link a wallet, and verify with your voice.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <GoogleLoginButton className="w-full sm:w-auto" />
            <PrivyLoginButton className="w-full sm:w-auto" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
