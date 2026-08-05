import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      {/* Navbar */}
      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="text-3xl font-bold">
            🚀 FlowOS
          </Link>

          <nav className="hidden md:flex gap-8 text-slate-300">
            <a href="#features" className="hover:text-white">
              Features
            </a>
            <a href="#pricing" className="hover:text-white">
              Pricing
            </a>
            <a href="#faq" className="hover:text-white">
              FAQ
            </a>
          </nav>

          <div className="flex gap-3">
            <button className="rounded-xl border border-slate-700 px-5 py-2 hover:bg-slate-800">
              Login
            </button>

            <button className="rounded-xl bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700">
              Start Free
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-24 text-center">
        <span className="rounded-full bg-blue-600/20 px-4 py-2 text-sm text-blue-300">
          Built for Instagram Creators
        </span>

        <h1 className="mt-8 max-w-4xl text-5xl font-extrabold leading-tight md:text-7xl">
          Turn Your Instagram Audience Into{" "}
          <span className="text-blue-400">Paying Customers</span>
        </h1>

        <p className="mt-8 max-w-2xl text-lg text-slate-400">
          Sell courses, ebooks and digital products from one simple platform.
          No coding. No complicated setup.
        </p>

        <div className="mt-10 flex gap-4">
          <button className="rounded-xl bg-blue-600 px-8 py-4 font-bold hover:bg-blue-700">
            🚀 Start Free
          </button>

          <button className="rounded-xl border border-slate-700 px-8 py-4 hover:bg-slate-800">
            ▶ Watch Demo
          </button>
        </div>
      </section>
    </main>
  );
}