-- VoiceNote Database Schema
-- Supabase PostgreSQL

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  google_id TEXT UNIQUE NOT NULL,
  notion_access_token TEXT,
  notion_database_id TEXT,
  slack_access_token TEXT,
  slack_channel_id TEXT,
  monthly_minutes_used INTEGER DEFAULT 0,
  last_reset_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Recordings table
CREATE TABLE recordings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  audio_file_path TEXT NOT NULL,
  duration_seconds INTEGER NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('meeting', 'interview', 'lecture', 'custom')),
  status TEXT DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
  transcript TEXT,
  formatted_content TEXT,
  notion_page_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Custom formats table
CREATE TABLE custom_formats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  prompt TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recordings ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_formats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for recordings
CREATE POLICY "Users can view own recordings" ON recordings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recordings" ON recordings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recordings" ON recordings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recordings" ON recordings
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for custom_formats
CREATE POLICY "Users can view own formats" ON custom_formats
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own formats" ON custom_formats
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own formats" ON custom_formats
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own formats" ON custom_formats
  FOR DELETE USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_recordings_user_id ON recordings(user_id);
CREATE INDEX idx_recordings_created_at ON recordings(created_at DESC);
CREATE INDEX idx_custom_formats_user_id ON custom_formats(user_id);

-- Function to auto-delete old recordings (30 days)
CREATE OR REPLACE FUNCTION delete_old_recordings()
RETURNS void AS $$
BEGIN
  DELETE FROM recordings
  WHERE created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly usage
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE users
  SET monthly_minutes_used = 0,
      last_reset_at = NOW()
  WHERE last_reset_at < DATE_TRUNC('month', NOW());
END;
$$ LANGUAGE plpgsql;

-- Storage bucket for recordings (run this in Supabase dashboard or via API)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('recordings', 'recordings', false);

-- Storage policies
CREATE POLICY "Users can upload own recordings"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view own recordings"
ON storage.objects FOR SELECT
USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own recordings"
ON storage.objects FOR DELETE
USING (bucket_id = 'recordings' AND auth.uid()::text = (storage.foldername(name))[1]);
