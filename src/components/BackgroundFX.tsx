// Hudl-inspired ambient background: tactical pass-maps, floodlight beams,
// drifting heatmap blobs and a faint data-grid. Pure SVG/CSS, fixed behind content.
export function BackgroundFX() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background"
    >
      {/* Pitch grid */}
      <div className="absolute inset-0 pitch-lines opacity-40" />

      {/* Floodlight beams */}
      <div className="absolute -top-40 left-[10%] h-[700px] w-[520px] rotate-12 bg-gradient-to-b from-primary/25 via-primary/5 to-transparent blur-3xl animate-beam-slow" />
      <div className="absolute -top-40 right-[8%] h-[800px] w-[480px] -rotate-12 bg-gradient-to-b from-accent/20 via-accent/5 to-transparent blur-3xl animate-beam-slower" />

      {/* Heatmap blobs */}
      <div className="absolute left-[55%] top-[35%] h-[420px] w-[420px] rounded-full bg-primary/15 blur-[120px] animate-drift" />
      <div className="absolute left-[15%] top-[70%] h-[360px] w-[360px] rounded-full bg-accent/15 blur-[120px] animate-drift-rev" />

      {/* Tactical pass-map SVG */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.18]"
        viewBox="0 0 1440 1024"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="passLine" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="oklch(0.78 0.17 60)" stopOpacity="0" />
            <stop offset="50%" stopColor="oklch(0.78 0.17 60)" stopOpacity="1" />
            <stop offset="100%" stopColor="oklch(0.62 0.13 195)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="node" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.78 0.17 60)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.78 0.17 60)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Pitch outline (subtle) */}
        <g stroke="oklch(0.97 0.01 80 / 0.18)" strokeWidth="1" fill="none">
          <rect x="120" y="120" width="1200" height="784" />
          <line x1="720" y1="120" x2="720" y2="904" />
          <circle cx="720" cy="512" r="92" />
          <rect x="120" y="332" width="160" height="360" />
          <rect x="1160" y="332" width="160" height="360" />
        </g>

        {/* Pass arcs */}
        <g fill="none" stroke="url(#passLine)" strokeWidth="1.5" strokeLinecap="round">
          <path d="M 220 720 Q 520 380 880 460" className="animate-dash" strokeDasharray="6 10" />
          <path d="M 880 460 Q 1040 600 1240 540" className="animate-dash-2" strokeDasharray="4 8" />
          <path d="M 360 260 Q 700 440 980 280" className="animate-dash-3" strokeDasharray="5 9" />
          <path d="M 540 820 Q 820 700 1120 800" className="animate-dash-2" strokeDasharray="3 7" />
          <path d="M 720 512 Q 980 360 1240 380" className="animate-dash" strokeDasharray="4 10" />
        </g>

        {/* Player nodes */}
        <g>
          {[
            [220, 720], [880, 460], [1240, 540], [360, 260],
            [980, 280], [540, 820], [1120, 800], [720, 512],
            [1240, 380],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="22" fill="url(#node)" />
              <circle cx={cx} cy={cy} r="3.5" fill="oklch(0.78 0.17 60)" />
            </g>
          ))}
        </g>
      </svg>

      {/* Drifting data chips */}
      <div className="absolute left-[6%] top-[22%] hidden md:block animate-float-slow">
        <DataChip label="xG" value="0.74" />
      </div>
      <div className="absolute right-[10%] top-[58%] hidden md:block animate-float-slower">
        <DataChip label="Sprint" value="32.1 km/h" tone="accent" />
      </div>
      <div className="absolute left-[42%] bottom-[12%] hidden md:block animate-float-slow">
        <DataChip label="Press" value="High" />
      </div>

      {/* Vignette to keep content legible */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,oklch(0.16_0.02_180/0.55)_70%,oklch(0.16_0.02_180)_100%)]" />
    </div>
  );
}

function DataChip({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: string;
  tone?: "primary" | "accent";
}) {
  return (
    <div className="flex items-center gap-2 rounded-sm border border-border bg-card/60 px-2.5 py-1.5 backdrop-blur-md">
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          tone === "accent" ? "bg-accent" : "bg-primary"
        } animate-pulse-dot`}
      />
      <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-[11px] text-foreground">{value}</span>
    </div>
  );
}
