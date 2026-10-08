/** 9 — Footer. */
export default function Footer() {
  return (
    <footer className="border-t border-pink-500/10 px-4 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
        <a href="#top" className="flex items-center gap-2.5">
          <span className="brand-gradient-bg flex h-8 w-8 items-center justify-center rounded-full text-base font-semibold text-white">
            A
          </span>
          <span className="text-sm font-bold text-zinc-900">
            Aurum<span className="brand-gradient-text"> Wallet</span>
          </span>
        </a>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-zinc-600">
          <a href="#features" className="hover:text-pink-500">Features</a>
          <a href="#how-it-works" className="hover:text-pink-500">How it works</a>
          <a href="#security" className="hover:text-pink-500">Security</a>
          <a href="#faq" className="hover:text-pink-500">FAQ</a>
        </nav>

        <p className="text-xs text-zinc-500">
          © 2026 Aurum Wallet · MVP — verify with your voice
        </p>
      </div>
    </footer>
  );
}
