-- Palatka Homes Report schema

create table if not exists projects (
  id serial primary key,
  slug text not null unique,
  name text not null,
  location_label text not null,
  area text not null,
  lat double precision,
  lng double precision,
  status text not null,
  acres numeric,
  lots_current integer,
  lots_rezoning integer,
  units_note text,
  commercial_sqft integer,
  builder text,
  developer text,
  county_case text,
  ordinance text,
  sjrwmd_file text,
  official_links text not null default '[]',
  latest_summary text,
  latest_summary_at timestamptz,
  confidence text not null default 'confirmed',
  published boolean not null default true,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_idx on projects (status);
create index if not exists projects_published_idx on projects (published);

create table if not exists project_milestones (
  id serial primary key,
  project_id integer not null references projects(id) on delete cascade,
  occurred_on date not null,
  title text not null,
  body text,
  source_url text,
  source_label text,
  sort_order integer not null default 0
);

create index if not exists project_milestones_project_idx on project_milestones (project_id, occurred_on);

create table if not exists project_updates (
  id serial primary key,
  project_id integer references projects(id) on delete set null,
  title text not null,
  body text not null,
  kind text not null default 'update',
  source_label text,
  created_at timestamptz not null default now()
);

create index if not exists project_updates_created_idx on project_updates (created_at desc);

create table if not exists sources (
  id serial primary key,
  name text not null,
  url text not null,
  kind text not null,
  enabled boolean not null default true,
  last_checked_at timestamptz,
  last_success_at timestamptz,
  last_error text
);

create table if not exists source_items (
  id serial primary key,
  source_id integer references sources(id) on delete cascade,
  title text not null,
  url text,
  snippet text,
  published_at timestamptz,
  matched_project_id integer references projects(id) on delete set null,
  is_new_project_candidate boolean not null default false,
  created_at timestamptz not null default now()
);

create unique index if not exists source_items_url_idx on source_items (url) where url is not null;

create table if not exists job_runs (
  id serial primary key,
  job_name text not null,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  status text not null,
  summary text,
  error text
);

create index if not exists job_runs_started_idx on job_runs (started_at desc);

create table if not exists guide_pages (
  slug text primary key,
  title text not null,
  nav_label text not null,
  excerpt text not null,
  body text not null,
  sort_order integer not null default 0,
  last_refreshed_at timestamptz,
  affiliate_category text
);

create table if not exists faqs (
  id serial primary key,
  question text not null,
  answer text not null,
  sort_order integer not null default 0,
  generated boolean not null default false
);

create table if not exists affiliate_products (
  id serial primary key,
  asin text,
  title text not null,
  category text not null,
  blurb text not null,
  search_query text not null,
  sort_order integer not null default 0
);

create table if not exists market_snapshots (
  id serial primary key,
  captured_on date not null,
  median_sale_low integer,
  median_sale_high integer,
  median_note text not null,
  days_on_market integer,
  source_note text not null
);

create table if not exists site_settings (
  key text primary key,
  value text not null
);
