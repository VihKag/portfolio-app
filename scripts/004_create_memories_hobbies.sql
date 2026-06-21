-- Create memories & hobbies table
-- Used by the dashboard "Memories" tab and the public portfolio "About Me" section.
CREATE TABLE IF NOT EXISTS public.memories_hobbies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'memory', -- 'memory' | 'hobby'
  image_url TEXT,
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE public.memories_hobbies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Memories & hobbies are publicly visible" ON public.memories_hobbies FOR SELECT USING (true);
CREATE POLICY "Users can insert own memories & hobbies" ON public.memories_hobbies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memories & hobbies" ON public.memories_hobbies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memories & hobbies" ON public.memories_hobbies FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memories_hobbies_user_id ON public.memories_hobbies(user_id);
CREATE INDEX IF NOT EXISTS idx_memories_hobbies_category ON public.memories_hobbies(category);
