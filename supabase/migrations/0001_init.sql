-- ============================================================================
-- Noah Community — initial schema
-- Run this in the Supabase SQL Editor for the NEW noah-community project.
-- Do NOT run this against the noah-ikuji (existing, husband/wife) project.
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- profiles — 1:1 with auth.users
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  country text,
  language text not null default 'ja',
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- posts — top-level community posts ("つぶやき")
-- ----------------------------------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  country text,
  language text,
  reply_count int not null default 0,
  like_count int not null default 0,
  moderation_status text not null default 'approved', -- reserved for future AI moderation
  created_at timestamptz not null default now()
);

create index if not exists posts_created_at_idx on public.posts (created_at desc);
create index if not exists posts_language_idx on public.posts (language);
create index if not exists posts_country_idx on public.posts (country);

-- ----------------------------------------------------------------------------
-- replies — thread replies to a post
-- ----------------------------------------------------------------------------
create table if not exists public.replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  content text not null check (char_length(content) between 1 and 2000),
  moderation_status text not null default 'approved',
  created_at timestamptz not null default now()
);

create index if not exists replies_post_id_idx on public.replies (post_id, created_at asc);

-- ----------------------------------------------------------------------------
-- post_likes
-- ----------------------------------------------------------------------------
create table if not exists public.post_likes (
  post_id uuid not null references public.posts(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (post_id, user_id)
);

-- ============================================================================
-- Auto-create a profiles row whenever a new auth.users row is created
-- (covers both email signup and Google OAuth signup). Country/language come
-- from the metadata passed at signUp() time for email; for Google, only
-- display_name is usually available, so country stays null until the user
-- fills in the "complete your profile" screen and language falls back to 'ja'.
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, country, language)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'country',
    coalesce(new.raw_user_meta_data->>'language', 'ja')
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- reply_count / like_count maintenance triggers
-- ============================================================================
create or replace function public.handle_reply_insert()
returns trigger as $$
begin
  update public.posts set reply_count = reply_count + 1 where id = new.post_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.handle_reply_delete()
returns trigger as $$
begin
  update public.posts set reply_count = greatest(reply_count - 1, 0) where id = old.post_id;
  return old;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_reply_insert on public.replies;
create trigger on_reply_insert after insert on public.replies
  for each row execute function public.handle_reply_insert();

drop trigger if exists on_reply_delete on public.replies;
create trigger on_reply_delete after delete on public.replies
  for each row execute function public.handle_reply_delete();

create or replace function public.handle_like_insert()
returns trigger as $$
begin
  update public.posts set like_count = like_count + 1 where id = new.post_id;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create or replace function public.handle_like_delete()
returns trigger as $$
begin
  update public.posts set like_count = greatest(like_count - 1, 0) where id = old.post_id;
  return old;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists on_like_insert on public.post_likes;
create trigger on_like_insert after insert on public.post_likes
  for each row execute function public.handle_like_insert();

drop trigger if exists on_like_delete on public.post_likes;
create trigger on_like_delete after delete on public.post_likes
  for each row execute function public.handle_like_delete();

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.replies enable row level security;
alter table public.post_likes enable row level security;

-- profiles: any signed-in user can read profiles (needed to show display_name
-- on posts/replies); only the owner can update their own row. Inserts happen
-- only via the handle_new_user() trigger (security definer), not directly by clients.
create policy "profiles are readable by signed-in users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- posts: signed-in users can read all; only the author can insert/delete their own
create policy "posts are readable by signed-in users"
  on public.posts for select
  using (auth.role() = 'authenticated');

create policy "users can insert their own posts"
  on public.posts for insert
  with check (auth.uid() = user_id);

create policy "users can delete their own posts"
  on public.posts for delete
  using (auth.uid() = user_id);

-- replies: same pattern
create policy "replies are readable by signed-in users"
  on public.replies for select
  using (auth.role() = 'authenticated');

create policy "users can insert their own replies"
  on public.replies for insert
  with check (auth.uid() = user_id);

create policy "users can delete their own replies"
  on public.replies for delete
  using (auth.uid() = user_id);

-- post_likes: users manage only their own like row; anyone signed-in can read
-- (needed to show "have I liked this" state)
create policy "post_likes are readable by signed-in users"
  on public.post_likes for select
  using (auth.role() = 'authenticated');

create policy "users can insert their own likes"
  on public.post_likes for insert
  with check (auth.uid() = user_id);

create policy "users can delete their own likes"
  on public.post_likes for delete
  using (auth.uid() = user_id);
