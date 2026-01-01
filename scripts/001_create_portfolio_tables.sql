-- Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create portfolio items table
CREATE TABLE IF NOT EXISTS public.portfolio_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  content_type TEXT NOT NULL, -- 'image', 'project', 'blog', 'video'
  image_url TEXT,
  video_url TEXT,
  project_url TEXT,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contact messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  portfolio_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create social links table
CREATE TABLE IF NOT EXISTS public.social_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  platform TEXT NOT NULL, -- 'twitter', 'linkedin', 'github', 'instagram', 'website'
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view any user profile" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Enable RLS for portfolio_items table
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Portfolio items are publicly visible" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Users can insert own portfolio items" ON public.portfolio_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolio items" ON public.portfolio_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own portfolio items" ON public.portfolio_items FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS for contact_messages table
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view messages sent to their portfolio" ON public.contact_messages FOR SELECT USING (auth.uid() = portfolio_user_id);
CREATE POLICY "Anyone can send contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- Enable RLS for social_links table
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Social links are publicly visible" ON public.social_links FOR SELECT USING (true);
CREATE POLICY "Users can manage own social links" ON public.social_links FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own social links" ON public.social_links FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own social links" ON public.social_links FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_portfolio_items_user_id ON public.portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_created_at ON public.portfolio_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_portfolio_user_id ON public.contact_messages(portfolio_user_id);
CREATE INDEX IF NOT EXISTS idx_social_links_user_id ON public.social_links(user_id);
