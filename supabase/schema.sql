-- Run this in your Supabase SQL editor to create the schema

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  attending boolean not null,
  arrival text check (arrival in ('friday', 'saturday')),
  note text,
  song text
);

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  name text not null,
  allergies text,
  is_submitter boolean not null default false
);

create index if not exists people_submission_id_idx on people(submission_id);
