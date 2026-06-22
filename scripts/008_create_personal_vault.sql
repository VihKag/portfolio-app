-- Create personal vault table
-- A hidden "secret room" of personal info and favourite things.
-- Managed in the dashboard "Personal" tab. On the public portfolio it is NOT
-- rendered inline — it only appears when the visitor triggers the hidden
-- element (the footer heart), opening the SecretVault overlay.
CREATE TABLE IF NOT EXISTS public.personal_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL DEFAULT 'favorite', -- 'favorite' (things I like) | 'fact' (personal info)
  label TEXT NOT NULL,            -- e.g. "Favourite movie" or "Nickname"
  value TEXT,                     -- e.g. "Inception" or "Khang"
  emoji TEXT,                     -- optional decorative emoji/icon
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS. Reads are public (the data is "hidden" in the UI, not secret at
-- the database level) so anonymous portfolio visitors can load it on demand.
ALTER TABLE public.personal_vault ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Personal vault is publicly visible" ON public.personal_vault FOR SELECT USING (true);
CREATE POLICY "Users can insert own personal vault" ON public.personal_vault FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own personal vault" ON public.personal_vault FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own personal vault" ON public.personal_vault FOR DELETE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_personal_vault_user_id ON public.personal_vault(user_id);
CREATE INDEX IF NOT EXISTS idx_personal_vault_category ON public.personal_vault(category);
