import { createFileRoute, Link } from "@tanstack/react-router";
import heroImg from "@/assets/hero-player.jpg";
import { BackgroundFX } from "@/components/BackgroundFX";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spotrial - A LinkedIn for Indian Football. Coming soon." },
      {
        name: "description",
        content:
          "India's first scouting network for football. Players build verified profiles, clubs and scouts discover real talent. Join the waitlist.",
      },
      { property: "og:title", content: "Spotrial - A LinkedIn for Indian Football" },
      {
        property: "og:description",
        content: "Where India's next football stars get discovered. Coming soon.",
      },
    ],
  }),
  component: ComingSoon,
});

function ComingSoon() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-transparent text-foreground">
      <BackgroundFX />

      {/* Top bar */}
      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-7 md:px-10">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-primary text-primary-foreground">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
              <path d="M12 3l3 6-3 3-3-3 3-6zM12 21l-3-6 3-3 3 3-3 6zM3 12l6-3 3 3-3 3-6-3zM21 12l-6 3-3-3 3-3 6 3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="display text-2xl tracking-wider">SPOTRIAL</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-primary animate-pulse-dot" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Pre-launch · 2026
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Hero video background, restricted to this section */}
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
        <div className="relative z-10 mx-auto max-w-7xl px-6 pb-24 pt-12 md:px-10 md:pt-20">
        <div className="max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
            01 - Coming soon · Starting in Kerala
          </p>
          <h1 className="mt-6 display text-balance text-[56px] leading-[0.95] sm:text-[80px] md:text-[112px]">
            Find the Next <span className="italic text-primary">Star</span>
            <br />
            Before Anyone Else.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
            From the seven-a-side turfs of Malappuram to the school grounds of
            Kozhikode and Thrissur - Kerala has produced India's finest, and
            there's so much more waiting. Spotrial is the professional network for
            Indian football: verified player profiles, transparent stats, and a
            direct line to scouts and clubs. We're starting from God's Own
            Footballing Country.
          </p>

          {/* CTA */}
          <div className="mt-10 max-w-xl">
            <div className="flex flex-wrap gap-3">
              {[
                { label: "Player", href: "/player" },
                { label: "Coach", href: "/coach" },
                { label: "Club", href: "/club" },
                { label: "Agent", href: "/agent" },
              ].map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="group inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary-foreground transition hover:brightness-110 glow-amber"
                >
                  {item.label}
                  <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 transition group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              ))}
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Choose your role and join the waitlist
            </p>
          </div>
        </div>
        </div>
      </section>

      {/* Three pillars */}
      <section className="relative z-10 mx-auto max-w-7xl border-t border-border px-6 py-20 md:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">02 - How it works</p>
            <h2 className="mt-3 display text-4xl md:text-5xl">A pitch with no boundaries.</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border bg-border md:grid-cols-3">
          {[
            {
              k: "01",
              t: "Verified profiles",
              d: "Position, footedness, match footage, coach endorsements, academy history. One source of truth - no DMs, no whispers.",
            },
            {
              k: "02",
              t: "Stats that travel",
              d: "Goals, assists, sprint data, trial results - recorded by referees and coaches. Your numbers follow you, even if you switch leagues.",
            },
            {
              k: "03",
              t: "Scout-grade search",
              d: "Filter 50,000+ players by age, position, district, foot, height. Shortlist in minutes. Reach out in one click.",
            },
          ].map((p) => (
            <div key={p.k} className="bg-card p-8 transition hover:bg-secondary">
              <span className="font-mono text-xs text-muted-foreground">{p.k}</span>
              <h3 className="mt-6 display text-3xl">{p.t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Player profile preview */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="mb-12 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              03 - A player profile
            </p>
            <h2 className="mt-3 display text-4xl md:text-5xl">
              Every kid, a scouting dossier.
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            A glimpse of what scouts see. Verified by coaches, refs and academy
            staff - not self-reported.
          </p>
        </div>

        <div className="overflow-hidden rounded-sm border border-border bg-card/70 backdrop-blur-md">
          {/* Header strip */}
          <div className="relative flex flex-col gap-6 border-b border-border bg-gradient-to-br from-secondary/60 via-card to-card p-6 md:flex-row md:items-center md:p-8">
            <div className="flex items-center gap-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-sm border border-border bg-secondary">
                <div className="absolute inset-0 flex items-center justify-center display text-4xl text-primary">
                  AM
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-primary">
                  <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 text-primary-foreground">
                    <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="display text-3xl tracking-wide">Arjun Menon</h3>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary">Verified</span>
                </div>
                <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Left winger · 17 yrs · Malappuram, Kerala
                </p>
              </div>
            </div>
            <div className="md:ml-auto flex flex-wrap gap-2">
              <span className="rounded-sm border border-border bg-card/80 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Kerala Premier League U-18
              </span>
              <span className="rounded-sm border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                Open to trials
              </span>
            </div>
          </div>

          {/* Body grid */}
          <div className="grid grid-cols-1 gap-px bg-border md:grid-cols-12">
            {/* Vitals */}
            <div className="bg-card p-6 md:col-span-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Vitals</p>
              <dl className="mt-5 space-y-4 text-sm">
                {[
                  ["Foot", "Right"],
                  ["Height", "172 cm"],
                  ["Weight", "62 kg"],
                  ["Sprint 40m", "5.21 s"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between border-b border-border/60 pb-2">
                    <dt className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">{k}</dt>
                    <dd className="display text-lg text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Season stats */}
            <div className="bg-card p-6 md:col-span-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Season 2025–26</p>
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">14 apps</span>
              </div>
              <div className="mt-5 grid grid-cols-4 gap-3">
                {[
                  { n: "9", l: "Goals" },
                  { n: "6", l: "Assists" },
                  { n: "82%", l: "Pass acc." },
                  { n: "3.4", l: "Dribbles/g" },
                ].map((s) => (
                  <div key={s.l} className="rounded-sm border border-border bg-background/40 p-3 text-center">
                    <div className="display text-3xl text-primary">{s.n}</div>
                    <div className="mt-1 font-mono text-[9px] uppercase tracking-widest text-muted-foreground">{s.l}</div>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Form · last 6</p>
                <div className="mt-3 flex items-end gap-2 h-16">
                  {[40, 65, 35, 80, 55, 92].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/30 to-primary" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Endorsements + footage */}
            <div className="bg-card p-6 md:col-span-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Endorsed by</p>
              <ul className="mt-4 space-y-3 text-sm">
                {[
                  { n: "Coach T. Pradeep", r: "Gokulam Kerala U-18 · Head coach" },
                  { n: "Ref. K. Suresh", r: "AIFF certified · 5 matches" },
                  { n: "Sait Nagjee Academy", r: "Kozhikode · 2021–24" },
                ].map((e) => (
                  <li key={e.n} className="flex gap-3 border-b border-border/60 pb-3 last:border-0">
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                    <div>
                      <div className="text-foreground">{e.n}</div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{e.r}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-center justify-between rounded-sm border border-border bg-background/40 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-primary-foreground">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <div>
                    <div className="text-sm">Match reel · 2:14</div>
                    <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">vs. Kovalam FC · Hat-trick</div>
                  </div>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">HD</span>
              </div>
            </div>
          </div>

          {/* Drill videos */}
          <div className="border-t border-border bg-gradient-to-b from-card to-background/40 p-6 md:p-8">
            <div className="flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  Drill reel
                </p>
                <h4 className="mt-2 display text-2xl md:text-3xl">
                  Standardised drills. Same yardstick for every kid.
                </h4>
              </div>
              <span className="hidden font-mono text-[10px] uppercase tracking-widest text-accent md:inline">
                Recorded · Kozhikode · Mar 2026
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {[
                { t: "Cone dribble", m: "0:42", v: "8.9 s", l: "Top 6%" },
                { t: "1v1 finishing", m: "1:08", v: "7 / 10", l: "Top 12%" },
                { t: "40m sprint", m: "0:28", v: "5.21 s", l: "Top 9%" },
                { t: "Wall pass · 60s", m: "1:00", v: "47", l: "Top 14%" },
              ].map((d) => (
                <div
                  key={d.t}
                  className="group relative overflow-hidden rounded-sm border border-border bg-card"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-secondary via-card to-background">
                    <div className="absolute inset-0 pitch-lines opacity-40" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground glow-amber transition group-hover:scale-110">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4 translate-x-[1px]">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 rounded-sm bg-background/80 px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-foreground backdrop-blur">
                      {d.m}
                    </div>
                    <div className="absolute left-2 top-2 rounded-sm border border-accent/50 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-accent backdrop-blur">
                      {d.l}
                    </div>
                  </div>
                  {/* Caption */}
                  <div className="flex items-baseline justify-between border-t border-border bg-card px-3 py-2.5">
                    <span className="text-sm">{d.t}</span>
                    <span className="display text-base text-primary">{d.v}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="mt-5 max-w-xl font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Filmed by Spotrial staff at district trial camps. Tagged, timed,
              and percentile-ranked against every U-18 in the region.
            </p>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="relative z-10 mx-auto max-w-7xl px-6 py-24 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">04 - Why now</p>
          </div>
          <div className="md:col-span-7">
            <p className="display text-3xl leading-tight text-balance md:text-5xl">
              For every Sunil Chhetri,{" "}
              <span className="text-muted-foreground">
                a thousand kids never got the trial.
              </span>{" "}
              Scouting in India still runs on phone calls and personal favours.
              We're rebuilding it on{" "}
              <span className="italic text-primary">data, video, and trust.</span>
            </p>
          </div>
        </div>
      </section>

      {/* Ticker */}
      <div className="relative z-10 overflow-hidden border-y border-border bg-card/40 py-5">
        <div className="flex w-max animate-ticker gap-16 whitespace-nowrap font-mono text-sm uppercase tracking-[0.25em] text-muted-foreground">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-16">
              <span className="text-primary">Malappuram</span><span className="text-primary">★</span>
              <span className="text-primary">Kozhikode</span><span className="text-primary">★</span>
              <span className="text-primary">Thrissur</span><span className="text-primary">★</span>
              <span className="text-primary">Kannur</span><span className="text-primary">★</span>
              <span className="text-primary">Kochi</span><span className="text-primary">★</span>
              <span className="text-primary">Thiruvananthapuram</span><span className="text-primary">★</span>
              <span>Bengaluru</span><span className="text-primary">●</span>
              <span>Goa</span><span className="text-primary">●</span>
              <span>Kolkata</span><span className="text-primary">●</span>
              <span>Aizawl</span><span className="text-primary">●</span>
              <span>Imphal</span><span className="text-primary">●</span>
              <span>Mumbai</span><span className="text-primary">●</span>
            </div>
          ))}
        </div>
      </div>

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
