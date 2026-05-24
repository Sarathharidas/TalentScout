
-- Player profiles table
CREATE TABLE public.player_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  date_of_birth date,
  gender text,
  gender_other text,
  contact_number text,
  city text,
  district text,
  state text,
  school_college_academy text,
  height text,
  weight text,
  preferred_foot text,
  preferred_position text,
  played_tournaments boolean,
  tournament_names text,
  match_highlights_urls text[] NOT NULL DEFAULT '{}',
  training_videos_urls text[] NOT NULL DEFAULT '{}',
  skill_videos_urls text[] NOT NULL DEFAULT '{}',
  open_for_trials boolean,
  preferred_trial_location text,
  willing_to_relocate text,
  allow_clubs_view boolean NOT NULL DEFAULT false,
  agree_terms boolean NOT NULL DEFAULT false,
  reference_name text,
  reference_contact text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.player_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Players view own profile" ON public.player_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Players insert own profile" ON public.player_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Players update own profile" ON public.player_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER player_profiles_set_updated_at
  BEFORE UPDATE ON public.player_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Storage bucket for player videos
INSERT INTO storage.buckets (id, name, public) VALUES ('player-videos', 'player-videos', true);

CREATE POLICY "Player videos are publicly viewable" ON storage.objects
  FOR SELECT USING (bucket_id = 'player-videos');
CREATE POLICY "Players upload own videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'player-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Players update own videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'player-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Players delete own videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'player-videos' AND auth.uid()::text = (storage.foldername(name))[1]);
