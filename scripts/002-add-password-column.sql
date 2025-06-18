-- Add password_hash column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Update the users table to make password_hash NOT NULL for new users
-- (existing users without password will need to be handled separately)

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Verify the schema
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
