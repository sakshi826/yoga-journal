-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create yoga_entries table
CREATE TABLE IF NOT EXISTS yoga_entries (
  id SERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  practice TEXT,
  mood TEXT,
  gratitude TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance and user isolation
CREATE INDEX IF NOT EXISTS idx_yoga_entries_user_id ON yoga_entries(user_id);
