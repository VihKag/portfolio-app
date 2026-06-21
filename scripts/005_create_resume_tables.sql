-- Resume / CV tables
-- Power the dashboard "Resume" tab and the public portfolio "Resume" section.

-- Work experience
CREATE TABLE IF NOT EXISTS public.experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  company TEXT,
  location TEXT,
  start_date TEXT,        -- free text so values like "05/2025" or "Present" are allowed
  end_date TEXT,
  description TEXT,       -- newline-separated bullet points
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Education
CREATE TABLE IF NOT EXISTS public.education (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  degree TEXT NOT NULL,
  school TEXT,
  location TEXT,
  start_date TEXT,
  end_date TEXT,
  details TEXT,          -- newline-separated bullet points
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skills (grouped by category)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,            -- e.g. "Languages", "Back-End"
  items TEXT[] DEFAULT '{}',         -- e.g. {"Java","C#","SQL"}
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Certifications
CREATE TABLE IF NOT EXISTS public.certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  issuer TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Row level security: publicly readable, owner-managed (mirrors existing tables)
DO $$
DECLARE
  t TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['experiences', 'education', 'skills', 'certifications']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY "%1$s are publicly visible" ON public.%1$I FOR SELECT USING (true);', t);
    EXECUTE format('CREATE POLICY "Users can insert own %1$s" ON public.%1$I FOR INSERT WITH CHECK (auth.uid() = user_id);', t);
    EXECUTE format('CREATE POLICY "Users can update own %1$s" ON public.%1$I FOR UPDATE USING (auth.uid() = user_id);', t);
    EXECUTE format('CREATE POLICY "Users can delete own %1$s" ON public.%1$I FOR DELETE USING (auth.uid() = user_id);', t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%1$s_user_id ON public.%1$I(user_id);', t);
  END LOOP;
END $$;
