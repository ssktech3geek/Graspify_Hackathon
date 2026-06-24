-- Increase avatar_url column size to TEXT to store base64 images
ALTER TABLE users ALTER COLUMN avatar_url TYPE TEXT;
