-- Create listening_progress table
CREATE TABLE public.listening_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  show_id TEXT NOT NULL,
  season_number INTEGER NOT NULL,
  episode_id TEXT NOT NULL,
  episode_title TEXT NOT NULL,
  episode_file TEXT,
  playback_position REAL NOT NULL DEFAULT 0,
  duration REAL NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false,
  last_played_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, show_id, season_number, episode_id)
);

-- Enable RLS on listening_progress
ALTER TABLE public.listening_progress ENABLE ROW LEVEL SECURITY;

-- Listening progress policies
CREATE POLICY "Users can view their own listening progress"
ON public.listening_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own listening progress"
ON public.listening_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own listening progress"
ON public.listening_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own listening progress"
ON public.listening_progress FOR DELETE
USING (auth.uid() = user_id);