-- Run this in your Supabase SQL editor to create the schema

create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  attending boolean not null,
  arrival text check (arrival in ('none', 'two_nights', 'one_night')),
  note text,
  song text
);

-- If the table already exists with the old ('friday', 'saturday') constraint,
-- run this to migrate it to the new accommodation options:
-- alter table submissions drop constraint submissions_arrival_check;
-- alter table submissions add constraint submissions_arrival_check
--   check (arrival in ('none', 'two_nights', 'one_night'));
-- (If you have existing rows still storing the old 'friday'/'saturday' values,
-- update them first, e.g. update submissions set arrival = 'two_nights' where arrival = 'friday';)

create table if not exists people (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  name text not null,
  allergies text,
  is_submitter boolean not null default false
);

create index if not exists people_submission_id_idx on people(submission_id);
