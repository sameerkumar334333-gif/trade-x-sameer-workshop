-- Run once in your Supabase project's SQL Editor.
-- Registrations cannot be read, updated or deleted by public visitors.
begin;
create table if not exists public.workshop_registrations (
  id uuid primary key default gen_random_uuid(),
  workshop_slug text not null default 'trading-zero-2026-10-11',
  full_name text not null check (char_length(full_name) between 2 and 100),
  email text not null check (char_length(email) <= 254 and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  whatsapp text not null check (whatsapp ~ '^\+[1-9][0-9]{7,14}$'),
  consent_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique(workshop_slug, email)
);
alter table public.workshop_registrations enable row level security;
revoke all on public.workshop_registrations from public, anon, authenticated;
grant all on public.workshop_registrations to service_role;
create or replace function public.register_workshop(p_full_name text, p_email text, p_whatsapp text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare clean_name text := trim(p_full_name); clean_email text := lower(trim(p_email));
begin
  if clean_name is null or char_length(clean_name) not between 2 and 100
    or clean_email is null or char_length(clean_email) > 254
    or clean_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or p_whatsapp is null or p_whatsapp !~ '^\+[1-9][0-9]{7,14}$' then
    raise exception 'Invalid registration details' using errcode = '22023';
  end if;
  insert into public.workshop_registrations (full_name, email, whatsapp)
  values (clean_name, clean_email, p_whatsapp)
  on conflict (workshop_slug, email) do nothing;
  -- Same response for existing emails; never expose attendee details.
  return jsonb_build_object('ok', true);
end;
$$;
revoke all on function public.register_workshop(text,text,text) from public;
grant execute on function public.register_workshop(text,text,text) to anon, authenticated;
commit;
