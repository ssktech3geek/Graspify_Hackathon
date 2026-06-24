-- Add missing columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS user_pass VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(20);

-- Update existing records to have default auth_provider
UPDATE users SET auth_provider = 'GOOGLE' WHERE auth_provider IS NULL;
