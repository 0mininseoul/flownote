-- Migration: Make audio_file_path nullable
-- Audio files are no longer stored - only transcript is saved

ALTER TABLE recordings ALTER COLUMN audio_file_path DROP NOT NULL;

