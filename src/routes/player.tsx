import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { BackgroundFX } from "@/components/BackgroundFX";
import { supabase } from "@/integrations/supabase/client";
import { signInWithGoogleToken } from "@/lib/google-auth";
import { toast } from "sonner";

export const Route = createFileRoute("/player")({
  head: () => ({
    meta: [
      { title: "Player Sign Up — Spotrial" },
      {
        name: "description",
        content:
          "Create your verified player profile on Spotrial. Sign up with email or Google and get discovered by clubs, scouts and academies.",
      },
      { property: "og:title", content: "Player Sign Up — Spotrial" },
      {
        property: "og:description",
        content: "Build your player profile and get discovered.",
      },
    ],
  }),
  component: PlayerAuthPage,
});

/** Wraps the inner component with the Google OAuth provider context */
function PlayerAuthPage() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""}>
      <PlayerAuth />
    </GoogleOAuthProvider>
  );
}

function PlayerAuth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSessionEmail(session?.user?.email ?? null);
      if (event === "SIGNED_IN") navigate({ to: "/player_registration" });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSessionEmail(data.session?.user?.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSessionEmail(null);
    toast.success("Signed out.");
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: { full_name: fullName, role: "player" },
          },
        });
        if (error) throw error;
        toast.success("Welcome to Spotrial!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in.");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    flow: "implicit",
    onSuccess: async ({ access_token }) => {
      setLoading(true);
      try {
        // Exchange the Google access token for a Supabase session (server-side)
        const { token_hash } = await signInWithGoogleToken({ data: { accessToken: access_token } });
        const { error } = await supabase.auth.verifyOtp({ token_hash, type: "magiclink" });
        if (error) throw error;
        toast.success("Signed in with Google!");
        // onAuthStateChange will fire SIGNED_IN and navigate to /player_registration
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Google sign-in failed";
        toast.error(msg);
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google sign-in was cancelled or failed");
      setLoading(false);
    },
  });

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

      {/* Hero with video bg */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 pitch-lines opacity-60" />
          <video
            src="/video/hero-loop.mp4"
            autoPlay loop muted playsInline preload="auto"
            className="h-full w-full object-cover object-center bg-background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          <div className="absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-primary/20 blur-[120px]" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 pb-24 pt-12 md:grid-cols-2 md:px-10 md:pt-20">
          {/* Left copy */}
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
              For the players
            </p>
            <h1 className="mt-6 display text-balance text-[56px] leading-[0.95] sm:text-[72px] md:text-[88px]">
              Your <span className="italic text-primary">Profile.</span>
              <br />Your Pitch.
            </h1>
            <p className="mt-8 max-w-md text-lg leading-relaxed text-muted-foreground">
              Create your verified player profile. Stats, footage, endorsements - everything scouts and clubs need to find you.
            </p>
          </div>

          {/* Right auth card */}
          <div className="md:pt-8">
            <div className="rounded-sm border border-border bg-card/80 p-6 backdrop-blur-md md:p-8">
              {sessionEmail && (
                <div className="mb-5 rounded-sm border border-primary/40 bg-primary/10 px-4 py-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Signed in as</p>
                  <p className="mt-1 truncate text-sm text-foreground">{sessionEmail}</p>
                  <button
                    onClick={handleSignOut}
                    className="mt-3 font-mono text-[10px] uppercase tracking-widest text-primary hover:underline"
                  >
                    Sign out to use a different account
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1 rounded-sm border border-border bg-background/60 p-1">
                {(["signup", "signin"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 rounded-sm px-4 py-2 font-mono text-[11px] uppercase tracking-widest transition ${
                      mode === m
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "signup" ? "Sign Up" : "Sign In"}
                  </button>
                ))}
              </div>

              <button
                onClick={() => { setLoading(true); loginWithGoogle(); }}
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-sm border border-border bg-background/80 px-4 py-3 text-sm font-medium transition hover:border-primary hover:bg-background disabled:opacity-50"
              >
                {/* Official Google "G" logo colours */}
                <svg viewBox="0 0 24 24" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      Full name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Arjun Menon"
                      className="mt-2 w-full rounded-sm border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition focus:border-primary"
                    />
                  </div>
                )}
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-sm border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition focus:border-primary"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="mt-2 w-full rounded-sm border border-border bg-background/60 px-4 py-2.5 text-sm outline-none transition focus:border-primary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-2 flex w-full items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 font-mono text-xs uppercase tracking-widest text-primary-foreground transition hover:brightness-110 glow-amber disabled:opacity-60"
                >
                  {loading ? "Working…" : mode === "signup" ? "Create player account" : "Sign in"}
                  <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 transition group-hover:translate-x-0.5">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </form>

              <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                By continuing you agree to Spotrial's terms.
              </p>
            </div>

            <div className="mt-6">
              <Link
                to="/"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-muted-foreground transition hover:text-foreground"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-3 w-3 transition group-hover:-translate-x-0.5">
                  <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
