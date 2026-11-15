-- Jalankan sekali: Supabase > SQL Editor > New query > Run. Aman dijalankan ulang.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  division text not null default '',
  service_id text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  date date not null,
  kind text not null check (kind in ('duty', 'izin')),
  start_time time,
  end_time time,
  content text not null,
  photo_path text,
  created_at timestamptz not null default now(),
  unique (user_id, date),
  check (kind <> 'duty' or (start_time is not null and end_time is not null and end_time > start_time))
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category text not null check (category in ('Penangkapan', 'Kasus Besar', 'Patroli', 'Backup', 'Penilangan', 'Administrasi')),
  title text not null,
  description text not null,
  date date not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  member_name text not null,
  action text not null,
  detail text not null default '',
  photo_path text,
  created_at timestamptz not null default now()
);
create index if not exists activity_log_user_time on public.activity_log (user_id, created_at desc);

-- Row Level Security: setiap anggota hanya melihat dan menulis datanya sendiri.
alter table public.profiles enable row level security;
alter table public.attendance enable row level security;
alter table public.reports enable row level security;
alter table public.notes enable row level security;
alter table public.activity_log enable row level security;

drop policy if exists "profiles select own" on public.profiles;
drop policy if exists "profiles insert own" on public.profiles;
drop policy if exists "profiles update own" on public.profiles;
create policy "profiles select own" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profiles insert own" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profiles update own" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "attendance select own" on public.attendance;
drop policy if exists "attendance insert own" on public.attendance;
create policy "attendance select own" on public.attendance for select to authenticated using (user_id = auth.uid());
create policy "attendance insert own" on public.attendance for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "reports select own" on public.reports;
drop policy if exists "reports insert own" on public.reports;
create policy "reports select own" on public.reports for select to authenticated using (user_id = auth.uid());
create policy "reports insert own" on public.reports for insert to authenticated with check (user_id = auth.uid());

drop policy if exists "notes select own" on public.notes;
drop policy if exists "notes insert own" on public.notes;
drop policy if exists "notes update own" on public.notes;
drop policy if exists "notes delete own" on public.notes;
create policy "notes select own" on public.notes for select to authenticated using (user_id = auth.uid());
create policy "notes insert own" on public.notes for insert to authenticated with check (user_id = auth.uid());
create policy "notes update own" on public.notes for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "notes delete own" on public.notes for delete to authenticated using (user_id = auth.uid());

-- Log hanya bisa dibaca. Isinya ditulis trigger di bawah, jadi tidak bisa dipalsukan dari browser.
drop policy if exists "log select own" on public.activity_log;
create policy "log select own" on public.activity_log for select to authenticated using (user_id = auth.uid());

create or replace function public.log_attendance() returns trigger
language plpgsql security definer set search_path = public as $$
declare n text;
begin
  select name into n from public.profiles where id = new.user_id;
  n := coalesce(n, 'Anggota');
  if new.kind = 'duty' then
    insert into public.activity_log (user_id, member_name, action, detail)
    values (new.user_id, n, 'mengisi absensi', 'Duty ' || to_char(new.date, 'DD-MM-YYYY'));
    insert into public.activity_log (user_id, member_name, action, detail, photo_path, created_at)
    values (new.user_id, n, 'mengirim laporan Duty',
      to_char(new.date, 'DD-MM-YYYY') || ', ' || to_char(new.start_time, 'HH24:MI') || '-' || to_char(new.end_time, 'HH24:MI'),
      new.photo_path, clock_timestamp());
  else
    insert into public.activity_log (user_id, member_name, action, detail)
    values (new.user_id, n, 'mengajukan izin', to_char(new.date, 'DD-MM-YYYY'));
  end if;
  return new;
end $$;

create or replace function public.log_report() returns trigger
language plpgsql security definer set search_path = public as $$
declare n text;
begin
  select name into n from public.profiles where id = new.user_id;
  insert into public.activity_log (user_id, member_name, action, detail)
  values (new.user_id, coalesce(n, 'Anggota'), 'mengirim laporan', new.category || ': ' || new.title);
  return new;
end $$;

create or replace function public.log_note() returns trigger
language plpgsql security definer set search_path = public as $$
declare n text;
begin
  select name into n from public.profiles where id = new.user_id;
  insert into public.activity_log (user_id, member_name, action, detail)
  values (new.user_id, coalesce(n, 'Anggota'), 'menulis catatan', new.title);
  return new;
end $$;

drop trigger if exists trg_log_attendance on public.attendance;
drop trigger if exists trg_log_report on public.reports;
drop trigger if exists trg_log_note on public.notes;
create trigger trg_log_attendance after insert on public.attendance for each row execute function public.log_attendance();
create trigger trg_log_report after insert on public.reports for each row execute function public.log_report();
create trigger trg_log_note after insert on public.notes for each row execute function public.log_note();

-- Foto bukti duty: bucket privat, tiap anggota hanya akses folder miliknya (folder = id akun).
insert into storage.buckets (id, name, public) values ('duty-photos', 'duty-photos', false) on conflict (id) do nothing;
drop policy if exists "duty photos insert own" on storage.objects;
drop policy if exists "duty photos select own" on storage.objects;
create policy "duty photos insert own" on storage.objects for insert to authenticated
  with check (bucket_id = 'duty-photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "duty photos select own" on storage.objects for select to authenticated
  using (bucket_id = 'duty-photos' and (storage.foldername(name))[1] = auth.uid()::text);
