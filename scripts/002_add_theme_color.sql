-- Add theme_color column to users table
ALTER TABLE users ADD COLUMN theme_color TEXT DEFAULT '#14b8a6';

-- Create index for faster theme queries
CREATE INDEX idx_users_theme_color ON users(theme_color);
