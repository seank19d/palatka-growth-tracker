-- File alerts, tips, and local-resource inquiries

create table if not exists file_alerts (
  id serial primary key,
  email text not null,
  project_slug text not null default 'all',
  source_path text,
  created_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

create unique index if not exists file_alerts_email_slug_idx
  on file_alerts (lower(email), project_slug)
  where unsubscribed_at is null;

create index if not exists file_alerts_created_idx on file_alerts (created_at desc);

create table if not exists site_messages (
  id serial primary key,
  kind text not null,
  email text,
  name text,
  body text not null,
  source_path text,
  created_at timestamptz not null default now()
);

create index if not exists site_messages_created_idx on site_messages (created_at desc);
