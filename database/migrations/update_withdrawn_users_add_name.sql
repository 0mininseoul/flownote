-- Migration: Add name column to withdrawn_users table
-- This allows easy identification of withdrawn users in the dashboard

ALTER TABLE withdrawn_users
ADD COLUMN IF NOT EXISTS name TEXT;

-- Add comment for documentation
COMMENT ON COLUMN withdrawn_users.name IS 'Display name of the user at the time of withdrawal';
