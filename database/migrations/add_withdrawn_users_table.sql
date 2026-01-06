-- Add withdrawn_users table for archiving deleted accounts
-- This stores anonymized statistics and withdrawal reason for service improvement
-- No personal information is stored (GDPR compliant)

CREATE TABLE IF NOT EXISTS withdrawn_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Original user reference (for internal tracking only, not for re-signup prevention)
  original_user_id UUID NOT NULL,

  -- Withdrawal metadata
  withdrawal_reason TEXT, -- Optional: user-selected reason
  withdrawn_at TIMESTAMP DEFAULT NOW(),

  -- Anonymized usage statistics (for service improvement)
  total_recordings_count INTEGER DEFAULT 0,
  total_minutes_used INTEGER DEFAULT 0,
  account_created_at TIMESTAMP,
  account_age_days INTEGER, -- Calculated: days between created_at and withdrawn_at

  -- Optional: feature usage statistics
  had_notion_integration BOOLEAN DEFAULT false,
  had_slack_integration BOOLEAN DEFAULT false,
  had_custom_formats BOOLEAN DEFAULT false,
  language TEXT, -- 'ko' or 'en'

  -- Referral statistics (if applicable)
  referred_users_count INTEGER DEFAULT 0,
  was_referred BOOLEAN DEFAULT false
);

-- Index for querying withdrawal statistics
CREATE INDEX idx_withdrawn_users_withdrawn_at ON withdrawn_users(withdrawn_at DESC);
CREATE INDEX idx_withdrawn_users_reason ON withdrawn_users(withdrawal_reason) WHERE withdrawal_reason IS NOT NULL;

-- Row Level Security (no user access needed - admin only)
ALTER TABLE withdrawn_users ENABLE ROW LEVEL SECURITY;

-- No policies: Only accessible via service role, not by users
-- This ensures withdrawn user data is only accessible for analytics, not by end users

-- Comment for documentation
COMMENT ON TABLE withdrawn_users IS 'Archives anonymized statistics from deleted user accounts for service improvement. No personal identifying information stored.';
COMMENT ON COLUMN withdrawn_users.withdrawal_reason IS 'User-selected reason for withdrawal (optional)';
COMMENT ON COLUMN withdrawn_users.original_user_id IS 'Original UUID for internal tracking only, not linked to any personal data';
