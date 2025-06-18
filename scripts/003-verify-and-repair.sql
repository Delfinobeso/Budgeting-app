-- Verify current schema
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name IN ('users', 'budgets', 'expenses')
ORDER BY table_name, ordinal_position;

-- Check if password_hash column exists
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'users' 
    AND column_name = 'password_hash'
) as password_hash_exists;

-- If needed, add the column (this is safe to run multiple times)
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

-- Verify users table structure
\d users;
