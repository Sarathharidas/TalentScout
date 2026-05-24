import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BackgroundFX } from "@/components/BackgroundFX";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, X, Loader2 } from "lucide-react";

export const Route = createFileRoute("/player_registration")({
  head: () => ({
    meta: [
      { title: "Player Registration & Scouting Profile — Spotrial" },
      {
        name: "description",
        content:
          "Complete your player registration and scouting profile on Spotrial — share videos, position, availability and get discovered.",
      },
      { property: "og:title", content: "Player Registration — Spotrial" },
      {
        property: "og:description",
        content: "Complete your scouting profile and get discovered.",
      },
    ],
  }),
  component: PlayerRegistration,
});

type VideoField =
  | "match_highlights_urls"
  | "training_videos_urls"
  | "skill_videos_urls";

const POSITIONS = ["Goalkeeper", "Defender", "Midfielder", "Winger", "Striker"];
const TRIAL_LOCATIONS = ["Kerala", "South India", "North India"];

function PlayerRegistration() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<VideoField | null>(null);

  // Form state
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [genderOther, setGenderOther] = useState("");
  const [contact, setContact] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");
  const [school, setSchool] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [foot, setFoot] = useState("");
  const [position, setPosition] = useState("");
  const [playedTournaments, setPlayedTournaments] = useState<string>("");
  const [tournamentNames, setTournamentNames] = useState("");
  const [matchHighlights, setMatchHighlights] = useState<string[]>([]);
  const [training, setTraining] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [openTrials, setOpenTrials] = useState<string>("");
  const [trialLocation, setTrialLocation] = useState("");
  const [relocate, setRelocate] = useState("");
  const [allowClubs, setAllowClubs] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [refName, setRefName] = useState("");
  const [refContact, setRefContact] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        setUserId(null);
        return;
      }
      setUserId(data.user.id);
      // Prefill from existing profile if any
      supabase
        .from("player_profiles")
        .select("*")
        .eq("user_id", data.user.id)
        .maybeSingle()
        .then(({ data: p }) => {
          if (!p) return;
          setFullName(p.full_name ?? "");
          setDob(p.date_of_birth ?? "");
          setGender(p.gender ?? "");
          setGenderOther(p.gender_other ?? "");
          setContact(p.contact_number ?? "");
          setCity(p.city ?? "");
          setDistrict(p.district ?? "");
          setState(p.state ?? "");
          setSchool(p.school_college_academy ?? "");
          setHeight(p.height ?? "");
          setWeight(p.weight ?? "");
          setFoot(p.preferred_foot ?? "");
          setPosition(p.preferred_position ?? "");
          setPlayedTournaments(
            p.played_tournaments === true ? "Yes" : p.played_tournaments === false ? "No" : "",
          );
          setTournamentNames(p.tournament_names ?? "");
          setMatchHighlights(p.match_highlights_urls ?? []);
          setTraining(p.training_videos_urls ?? []);
          setSkills(p.skill_videos_urls ?? []);
          setOpenTrials(
            p.open_for_trials === true ? "Yes" : p.open_for_trials === false ? "No" : "",
          );
          setTrialLocation(p.preferred_trial_location ?? "");
          setRelocate(p.willing_to_relocate ?? "");
          setAllowClubs(p.allow_clubs_view ?? false);
          setAgreeTerms(p.agree_terms ?? false);
          setRefName(p.reference_name ?? "");
          setRefContact(p.reference_contact ?? "");
        });
    });
  }, [navigate]);

  const handleUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: VideoField,
  ) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File must be under 100MB.");
      return;
    }
    setUploading(field);
    try {
      const ext = file.name.split(".").pop();
      const path = `${userId}/${field}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage
        .from("player-videos")
        .upload(path, file, { upsert: false });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("player-videos").getPublicUrl(path);
      const url = pub.publicUrl;
      if (field === "match_highlights_urls") setMatchHighlights((p) => [...p, url]);
      if (field === "training_videos_urls") setTraining((p) => [...p, url]);
      if (field === "skill_videos_urls") setSkills((p) => [...p, url]);
      toast.success("Video uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
      e.target.value = "";
    }
  };

  const removeVideo = (field: VideoField, url: string) => {
    const filter = (arr: string[]) => arr.filter((u) => u !== url);
    if (field === "match_highlights_urls") setMatchHighlights(filter);
    if (field === "training_videos_urls") setTraining(filter);
    if (field === "skill_videos_urls") setSkills(filter);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    if (!fullName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please agree to the platform terms.");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        user_id: userId,
        full_name: fullName.trim(),
        date_of_birth: dob || null,
        gender: gender || null,
        gender_other: gender === "Other" ? genderOther.trim() || null : null,
        contact_number: contact || null,
        city: city || null,
        district: district || null,
        state: state || null,
        school_college_academy: school || null,
        height: height || null,
        weight: weight || null,
        preferred_foot: foot || null,
        preferred_position: position || null,
        played_tournaments:
          playedTournaments === "Yes" ? true : playedTournaments === "No" ? false : null,
        tournament_names: tournamentNames || null,
        match_highlights_urls: matchHighlights,
        training_videos_urls: training,
        skill_videos_urls: skills,
        open_for_trials:
          openTrials === "Yes" ? true : openTrials === "No" ? false : null,
        preferred_trial_location: trialLocation || null,
        willing_to_relocate: relocate || null,
        allow_clubs_view: allowClubs,
        agree_terms: agreeTerms,
        reference_name: refName || null,
        reference_contact: refContact || null,
      };
      const { error } = await supabase
        .from("player_profiles")
        .upsert(payload, { onConflict: "user_id" });
      if (error) throw error;
      toast.success("Profile saved!");
      navigate({ to: "/player_profile" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const VideoUploader = ({
    label,
    field,
    urls,
  }: {
    label: string;
    field: VideoField;
    urls: string[];
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-accent">
          {uploading === field ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          <span>Upload video</span>
          <input
            type="file"
            accept="video/*"
            className="hidden"
            disabled={uploading !== null}
            onChange={(e) => handleUpload(e, field)}
          />
        </label>
      </div>
      {urls.length > 0 && (
        <ul className="space-y-1 text-sm">
          {urls.map((u) => (
            <li
              key={u}
              className="flex items-center justify-between gap-2 rounded border border-border bg-muted/30 px-2 py-1"
            >
              <a
                href={u}
                target="_blank"
                rel="noreferrer"
                className="truncate text-primary underline"
              >
                {u.split("/").pop()}
              </a>
              <button
                type="button"
                onClick={() => removeVideo(field, u)}
                className="text-muted-foreground hover:text-destructive"
                aria-label="Remove"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <BackgroundFX />
      <div className="relative z-10 mx-auto max-w-3xl px-4 py-12 md:py-16">
        <header className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">
            Player Registration & Scouting Profile
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="text-destructive">*</span> Indicates required question
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="space-y-8 rounded-xl border border-border bg-card/80 p-6 backdrop-blur md:p-8"
        >
          {/* Personal */}
          <section className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                maxLength={120}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <RadioGroup value={gender} onValueChange={setGender}>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Male" id="g-m" />
                  <Label htmlFor="g-m" className="font-normal">Male</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Female" id="g-f" />
                  <Label htmlFor="g-f" className="font-normal">Female</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Other" id="g-o" />
                  <Label htmlFor="g-o" className="font-normal">Other:</Label>
                  <Input
                    value={genderOther}
                    onChange={(e) => setGenderOther(e.target.value)}
                    disabled={gender !== "Other"}
                    className="h-8 flex-1"
                    maxLength={50}
                  />
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact">Contact / Whatsapp Number</Label>
              <Input
                id="contact"
                type="tel"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                maxLength={20}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} maxLength={80} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input id="district" value={district} onChange={(e) => setDistrict(e.target.value)} maxLength={80} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" value={state} onChange={(e) => setState(e.target.value)} maxLength={80} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="school">School / College / Academy</Label>
              <Input
                id="school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                maxLength={150}
              />
            </div>
          </section>

          {/* Football Info */}
          <section className="space-y-5 border-t border-border pt-6">
            <div>
              <h2 className="text-xl font-semibold">Football Information</h2>
              <p className="text-sm text-muted-foreground">Fill out your sport related information</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="height">Height</Label>
                <Input id="height" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 5'8&quot; or 173cm" maxLength={20} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input id="weight" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 65kg" maxLength={20} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Preferred Foot</Label>
              <RadioGroup value={foot} onValueChange={setFoot} className="flex flex-wrap gap-4">
                {["Right", "Left", "Both"].map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <RadioGroupItem value={v} id={`f-${v}`} />
                    <Label htmlFor={`f-${v}`} className="font-normal">{v}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Preferred Position</Label>
              <RadioGroup value={position} onValueChange={setPosition}>
                {POSITIONS.map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <RadioGroupItem value={v} id={`p-${v}`} />
                    <Label htmlFor={`p-${v}`} className="font-normal">{v}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Have you played in tournaments or leagues?</Label>
              <RadioGroup
                value={playedTournaments}
                onValueChange={setPlayedTournaments}
                className="flex gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Yes" id="t-y" />
                  <Label htmlFor="t-y" className="font-normal">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="No" id="t-n" />
                  <Label htmlFor="t-n" className="font-normal">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tournaments">If yes, mention tournament names</Label>
              <Textarea
                id="tournaments"
                value={tournamentNames}
                onChange={(e) => setTournamentNames(e.target.value)}
                rows={4}
                maxLength={1000}
              />
            </div>
          </section>

          {/* Videos */}
          <section className="space-y-5 border-t border-border pt-6">
            <div>
              <h2 className="text-xl font-semibold">Player Videos</h2>
              <p className="text-sm text-muted-foreground">Upload your football videos</p>
            </div>
            <VideoUploader label="Upload Match Highlights" field="match_highlights_urls" urls={matchHighlights} />
            <VideoUploader label="Upload Training Videos" field="training_videos_urls" urls={training} />
            <VideoUploader label="Upload Skill Showcase Videos" field="skill_videos_urls" urls={skills} />
          </section>

          {/* Trial */}
          <section className="space-y-5 border-t border-border pt-6">
            <div>
              <h2 className="text-xl font-semibold">Trial Availability</h2>
              <p className="text-sm text-muted-foreground">Update your availability for trial</p>
            </div>

            <div className="space-y-2">
              <Label>Are you open for trials?</Label>
              <RadioGroup value={openTrials} onValueChange={setOpenTrials} className="flex gap-6">
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="Yes" id="ot-y" />
                  <Label htmlFor="ot-y" className="font-normal">Yes</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="No" id="ot-n" />
                  <Label htmlFor="ot-n" className="font-normal">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Preferred Trial Locations</Label>
              <RadioGroup value={trialLocation} onValueChange={setTrialLocation}>
                {TRIAL_LOCATIONS.map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <RadioGroupItem value={v} id={`tl-${v}`} />
                    <Label htmlFor={`tl-${v}`} className="font-normal">{v}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Are you willing to relocate for football opportunities?</Label>
              <RadioGroup value={relocate} onValueChange={setRelocate} className="flex flex-wrap gap-6">
                {["Yes", "No", "Maybe"].map((v) => (
                  <div key={v} className="flex items-center gap-2">
                    <RadioGroupItem value={v} id={`r-${v}`} />
                    <Label htmlFor={`r-${v}`} className="font-normal">{v}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </section>

          {/* Consent */}
          <section className="space-y-5 border-t border-border pt-6">
            <div>
              <h2 className="text-xl font-semibold">Player Consent</h2>
              <p className="text-sm text-muted-foreground">Give us your consent for profile sharing</p>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="allowClubs"
                checked={allowClubs}
                onCheckedChange={(v) => setAllowClubs(v === true)}
              />
              <Label htmlFor="allowClubs" className="font-normal leading-snug">
                Do you allow clubs and scouts to view your profile and videos?
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="agreeTerms"
                checked={agreeTerms}
                onCheckedChange={(v) => setAgreeTerms(v === true)}
              />
              <Label htmlFor="agreeTerms" className="font-normal leading-snug">
                Do you agree to platform terms and player verification process?{" "}
                <span className="text-destructive">*</span>
              </Label>
            </div>
          </section>

          {/* Reference */}
          <section className="space-y-5 border-t border-border pt-6">
            <div>
              <h2 className="text-xl font-semibold">Reference Details</h2>
              <p className="text-sm text-muted-foreground">Who referred you to Spotrial?</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="refName">Reference Name</Label>
                <Input id="refName" value={refName} onChange={(e) => setRefName(e.target.value)} maxLength={120} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="refContact">Reference Contact</Label>
                <Input id="refContact" value={refContact} onChange={(e) => setRefContact(e.target.value)} maxLength={50} />
              </div>
            </div>
          </section>

          <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
            <Button type="submit" disabled={loading || uploading !== null} size="lg">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
