-- Fourmulauto Database Schema
-- This SQL should be run in your Supabase SQL Editor

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  upvotes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY,
  post_id BIGINT REFERENCES posts(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (since we don't have authentication)
CREATE POLICY "Allow all operations on posts" ON posts
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on comments" ON comments
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_posts_upvotes ON posts(upvotes);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);

-- Insert some sample data
INSERT INTO posts (title, content, image_url, upvotes) VALUES
('Who is your favorite Founding Father?', 'Mine is Thomas Jefferson! What about you?', 'https://i.imgur.com/0QpthJU.jpg', 3),
('I''m in love with the Holy Roman Empire', NULL, NULL, 23),
('Was Caesar overrated?', NULL, NULL, 11);

INSERT INTO comments (post_id, content) VALUES
(1, 'Did you forget about Ben Franklin?'),
(1, 'It''s got to be George Washington!');
