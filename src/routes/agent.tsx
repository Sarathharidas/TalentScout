import { createFileRoute, Link } from "@tanstack/react-router";
import { BackgroundFX } from "@/components/BackgroundFX";

export const Route = createFileRoute("/agent")({
  head: () => ({
    meta: [
      { title: "Spotrial for Agents — Coming Soon" },
      {
        name: "description",
        content:
          "Represent players, connect with clubs, and manage deals on Spotrial.",
      },
      { property: "og:title", content: "Spotrial for Agents — Coming Soon" },
      {
        property: "og:description",
        content: "The professional network for football agents in India.",
      },
    ],
  }),
  component: AgentComingSoon,
});

function AgentComingSoon() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-foreground">
      <BackgroundFX />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-10">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 3l3 6-3 3-3-3 3-6zM12 21l-3-6 3-3 3 3-3 6zM3 12l6-3 3 3-3 3-6-3zM21 12l-6 3-3-3 3-3 6 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="display text-2xl tracking-wider">SPOTRIAL</span>
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Pre-launch · 2026
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 pitch-lines opacity-60" />
          <video
            src="/video/hero-loop.mp4"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="h-full w-full object-cover object-center bg-background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30 md:from-background/95 md:via-background/60 md:to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-primary/20 blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center justify-center px-6 pb-32 pt-20 text-center md:px-10 md:pt-32">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            For the agents who move the market
          </p>
          <h1 className="mt-6 display text-balance text-[56px] leading-[0.95] sm:text-[80px] md:text-[112px]">
            <span className="italic text-primary">Coming</span>
            <br />
            Soon.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Represent verified players, connect directly with clubs and scouts, track deal flow, and build your reputation as the bridge between India's talent and the world's opportunities.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/"
              className="group inline-flex items-center justify-center gap-2 rounded-sm border border-border bg-card/80 px-6 py-3 font-mono text-xs uppercase tracking-widest text-foreground transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 transition group-hover:-translate-x-0.5">
                <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center md:px-10">
        <div className="flex items-center gap-2.5">
          <span className="display text-xl tracking-wider">SPOTRIAL</span>
          <span className="font-mono text-xs text-muted-foreground">© 2026</span>
        </div>
        <div className="flex items-center gap-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <a href="#" className="transition hover:text-foreground">Instagram</a>
          <a href="#" className="transition hover:text-foreground">LinkedIn</a>
        </div>
      </footer>
    </main>
  );
}
