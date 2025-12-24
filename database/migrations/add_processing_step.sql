-- Add processing_step column for real-time status tracking
-- Possible values: 'transcription', 'formatting', 'saving', NULL (completed)

ALTER TABLE recordings
ADD COLUMN IF NOT EXISTS processing_step TEXT
CHECK (processing_step IN ('transcription', 'formatting', 'saving'));

-- Add index for processing recordings to improve polling performance
CREATE INDEX IF NOT EXISTS idx_recordings_processing
ON recordings(user_id, status)
WHERE status = 'processing';
