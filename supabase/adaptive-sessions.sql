-- Stores adaptive checkpoint assessment sessions
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS adaptive_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_token TEXT NOT NULL,
  video_id TEXT NOT NULL,
  topic TEXT NOT NULL,
  responses JSONB NOT NULL DEFAULT '[]',
  starting_difficulty INT NOT NULL DEFAULT 2,
  ending_difficulty INT NOT NULL DEFAULT 2,
  questions_correct INT NOT NULL DEFAULT 0,
  questions_total INT NOT NULL DEFAULT 0,
  weighted_score NUMERIC(5,3) DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_adaptive_sessions_student ON adaptive_sessions(student_token);
CREATE INDEX IF NOT EXISTS idx_adaptive_sessions_video ON adaptive_sessions(video_id);

-- RLS: allow inserts and reads from anon key (token-based auth, not Supabase Auth)
ALTER TABLE adaptive_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert" ON adaptive_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read own sessions" ON adaptive_sessions
  FOR SELECT USING (true);

CREATE POLICY "Allow update own sessions" ON adaptive_sessions
  FOR UPDATE USING (true);
