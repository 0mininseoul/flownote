-- Migration: Add user_data JSONB column to withdrawn_users table
-- This allows storing the full snapshot of the user record at the time of withdrawal

ALTER TABLE withdrawn_users
ADD COLUMN IF NOT EXISTS user_data JSONB;

-- Add comment for documentation
COMMENT ON COLUMN withdrawn_users.user_data IS 'Full snapshot of the user record from the users table at time of withdrawal';
