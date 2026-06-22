-- Auto-create a public.users profile row whenever a new auth user signs up.
-- This keeps Supabase Auth (auth.users) and the application profile table
-- (public.users) in sync automatically and atomically, server-side.
--
-- The username / full_name are read from the metadata passed to
-- supabase.auth.signUp({ options: { data: { username, full_name } } }),
-- which Supabase stores in auth.users.raw_user_meta_data.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, username, full_name)
  values (
    new.id,
    new.email,
    -- Use the chosen username, or fall back to a unique derived value
    coalesce(
      nullif(new.raw_user_meta_data ->> 'username', ''),
      split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 8)
    ),
    nullif(new.raw_user_meta_data ->> 'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Recreate the trigger so re-running this script is safe
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Backfill: create profile rows for any existing auth users that don't have one
insert into public.users (id, email, username, full_name)
select
  au.id,
  au.email,
  coalesce(
    nullif(au.raw_user_meta_data ->> 'username', ''),
    split_part(au.email, '@', 1) || '_' || substr(au.id::text, 1, 8)
  ),
  nullif(au.raw_user_meta_data ->> 'full_name', '')
from auth.users au
left join public.users pu on pu.id = au.id
where pu.id is null
on conflict (id) do nothing;
