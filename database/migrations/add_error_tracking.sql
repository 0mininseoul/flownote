-- Add error tracking columns to recordings table
ALTER TABLE recordings
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS error_step TEXT CHECK (error_step IN ('upload', 'transcription', 'formatting', 'notion', 'slack'));

-- Add index for failed recordings
CREATE INDEX IF NOT EXISTS idx_recordings_failed ON recordings(status, error_step) WHERE status = 'failed';

-- Add comment for documentation
COMMENT ON COLUMN recordings.error_message IS 'Detailed error message when processing fails';
COMMENT ON COLUMN recordings.error_step IS 'Step where the error occurred: upload, transcription, formatting, notion, or slack';
