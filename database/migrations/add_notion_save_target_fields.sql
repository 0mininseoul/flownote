-- Add notion save target type and title fields to users table
-- These fields store the type (database/page) and title of the selected Notion save target

ALTER TABLE users
ADD COLUMN IF NOT EXISTS notion_save_target_type TEXT CHECK (notion_save_target_type IN ('database', 'page'));

ALTER TABLE users
ADD COLUMN IF NOT EXISTS notion_save_target_title TEXT;

-- Add comment for documentation
COMMENT ON COLUMN users.notion_save_target_type IS 'Type of Notion save target: database or page';
COMMENT ON COLUMN users.notion_save_target_title IS 'Display title of the selected Notion save target';
