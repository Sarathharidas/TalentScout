import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackgroundFX } from "@/components/BackgroundFX";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, MapPin, Phone, School, Calendar, Ruler, Weight, Trophy, Video } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/player_profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Spotrial" },
      { name: "description", content: "Your Spotrial player profile." },
    ],
  }),
  component: PlayerProfilePage,
});

type Profile = {
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  gender_other: string | null;
  contact_number: string | null;
  city: string | null;
  district: string | null;
  state: string | null;
  school_college_academy: string | null;
  height: string | null;
  weight: string | null;
  preferred_foot: string | null;
  preferred_position: string | null;
  played_tournaments: boolean | null;
  tournament_names: string | null;
  match_highlights_urls: string[];
  training_videos_urls: string[];
  skill_videos_urls: string[];
  open_for_trials: boolean | null;
  preferred_trial_location: string | null;
  willing_to_relocate: string | null;
  allow_clubs_view: boolean;
  agree_terms: boolean;
  reference_name: string | null;
  reference_contact: string | null;
  updated_at: string;
};

function calcAge(dob: string | null) {
  if (!dob) return null;
  const d = new Date(dob);
  const diff = Date.now() - d.getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

const MOCK_PROFILE: Profile = {
  full_name: "Arjun Sharma",
  date_of_birth: "2006-08-14",
  gender: "Male",
  gender_other: null,
  contact_number: "+91 98765 43210",
  city: "Bengaluru",
  district: "Bengaluru Urban",
  state: "Karnataka",
  school_college_academy: "Bangalore Football Academy",
  height: "5'10\" (178 cm)",
  weight: "68 kg",
  preferred_foot: "Right",
  preferred_position: "Attacking Midfielder",
  played_tournaments: true,
  tournament_names:
    "• Karnataka State League 2024 — Top scorer (12 goals)\n• Subroto Cup 2023 — Quarter-finalist\n• Reliance Foundation Youth Sports 2023 — Winner",
  match_highlights_urls: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  ],
  training_videos_urls: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  ],
  skill_videos_urls: [
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  ],
  open_for_trials: true,
  preferred_trial_location: "Bengaluru / Mumbai / Goa",
  willing_to_relocate: "Yes, anywhere in India",
  allow_clubs_view: true,
  agree_terms: true,
  reference_name: "Coach Ramesh Iyer",
  reference_contact: "+91 99887 76655",
  updated_at: new Date().toISOString(),
};

function PlayerProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) {
        setEmail("arjun.sharma@example.com");
        setProfile(MOCK_PROFILE);
        setLoading(false);
        return;
      }
      setEmail(u.user.email ?? null);
      const { data, error } = await supabase
        .from("player_profiles")
        .select("*")
        .eq("user_id", u.user.id)
        .maybeSingle();
      if (error) toast.error(error.message);
      setProfile((data as Profile | null) ?? MOCK_PROFILE);
      setLoading(false);
    })();
  }, [navigate]);


  if (loading) {
    return (
      <div className="relative min-h-screen bg-background">
        <BackgroundFX />
        <div className="relative z-10 flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="relative min-h-screen bg-background">
        <BackgroundFX />
        <div className="relative z-10 mx-auto max-w-2xl px-4 py-20 text-center">
          <h1 className="text-3xl font-bold">No profile yet</h1>
          <p className="mt-3 text-muted-foreground">
            Complete your registration to create your scouting profile.
          </p>
          <Button asChild className="mt-6" size="lg">
            <Link to="/player_registration">Start registration</Link>
          </Button>
        </div>
      </div>
    );
  }

  const age = calcAge(profile.date_of_birth);
  const location = [profile.city, profile.district, profile.state]
    .filter(Boolean)
    .join(", ");
  const genderDisplay =
    profile.gender === "Other" ? profile.gender_other : profile.gender;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <BackgroundFX />
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-12 md:py-16">
        {/* Header */}
        <div className="rounded-xl border border-border bg-card/80 p-6 backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="flex items-start gap-5">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/15 text-2xl font-bold text-primary">
                {profile.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">
                  {profile.full_name}
                </h1>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  {age !== null && <span>{age} yrs</span>}
                  {genderDisplay && <span>{genderDisplay}</span>}
                  {profile.preferred_position && (
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">
                      {profile.preferred_position}
                    </span>
                  )}
                </div>
                {email && (
                  <p className="mt-2 text-sm text-muted-foreground">{email}</p>
                )}
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/player_registration">
                <Pencil className="mr-2 h-4 w-4" />
                Edit profile
              </Link>
            </Button>
          </div>

          {/* Quick info */}
          <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6 md:grid-cols-4">
            <InfoStat icon={<Ruler className="h-4 w-4" />} label="Height" value={profile.height} />
            <InfoStat icon={<Weight className="h-4 w-4" />} label="Weight" value={profile.weight} />
            <InfoStat
              icon={<Trophy className="h-4 w-4" />}
              label="Preferred Foot"
              value={profile.preferred_foot}
            />
            <InfoStat
              icon={<Calendar className="h-4 w-4" />}
              label="DOB"
              value={profile.date_of_birth}
            />
          </div>
        </div>

        {/* Contact & Location */}
        <Section title="Contact & Location">
          <Row icon={<Phone className="h-4 w-4" />} label="Contact" value={profile.contact_number} />
          <Row icon={<MapPin className="h-4 w-4" />} label="Location" value={location || null} />
          <Row
            icon={<School className="h-4 w-4" />}
            label="School / Academy"
            value={profile.school_college_academy}
          />
        </Section>

        {/* Tournaments */}
        <Section title="Tournament History">
          <Row
            label="Played in tournaments"
            value={
              profile.played_tournaments === true
                ? "Yes"
                : profile.played_tournaments === false
                ? "No"
                : null
            }
          />
          {profile.tournament_names && (
            <div className="rounded-md border border-border bg-muted/30 p-3 text-sm whitespace-pre-wrap">
              {profile.tournament_names}
            </div>
          )}
        </Section>

        {/* Videos */}
        <Section title="Videos">
          <VideoGroup label="Match Highlights" urls={profile.match_highlights_urls} />
          <VideoGroup label="Training Videos" urls={profile.training_videos_urls} />
          <VideoGroup label="Skill Showcase" urls={profile.skill_videos_urls} />
        </Section>

        {/* Trial */}
        <Section title="Trial Availability">
          <Row
            label="Open for trials"
            value={
              profile.open_for_trials === true
                ? "Yes"
                : profile.open_for_trials === false
                ? "No"
                : null
            }
          />
          <Row label="Preferred location" value={profile.preferred_trial_location} />
          <Row label="Willing to relocate" value={profile.willing_to_relocate} />
        </Section>

        {/* Consent */}
        <Section title="Consent">
          <Row
            label="Allow clubs to view profile"
            value={profile.allow_clubs_view ? "Yes" : "No"}
          />
          <Row
            label="Agreed to platform terms"
            value={profile.agree_terms ? "Yes" : "No"}
          />
        </Section>

        {/* Reference */}
        {(profile.reference_name || profile.reference_contact) && (
          <Section title="Reference">
            <Row label="Name" value={profile.reference_name} />
            <Row label="Contact" value={profile.reference_contact} />
          </Section>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Last updated {new Date(profile.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-xl border border-border bg-card/80 p-6 backdrop-blur md:p-8">
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function InfoStat({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-1 text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string | null;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border/50 pb-2 last:border-0 last:pb-0">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-right text-sm font-medium">{value || "—"}</p>
    </div>
  );
}

function VideoGroup({ label, urls }: { label: string; urls: string[] }) {
  return (
    <div>
      <h3 className="mb-2 flex items-center gap-2 text-sm font-medium">
        <Video className="h-4 w-4 text-primary" />
        {label}{" "}
        <span className="text-xs text-muted-foreground">({urls?.length ?? 0})</span>
      </h3>
      {urls && urls.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {urls.map((u) => (
            <video
              key={u}
              src={u}
              controls
              className="w-full rounded-md border border-border bg-black"
            />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No videos uploaded.</p>
      )}
    </div>
  );
}
