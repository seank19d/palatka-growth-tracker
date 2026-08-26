alter table affiliate_products add column if not exists image_url text;
alter table affiliate_products add column if not exists price_label text;
alter table affiliate_products add column if not exists last_synced_at timestamptz;

create table if not exists affiliate_clicks (
  id serial primary key,
  product_id integer references affiliate_products(id) on delete cascade,
  path text,
  created_at timestamptz not null default now()
);
create index if not exists affiliate_clicks_created_at_idx on affiliate_clicks (created_at desc);
create index if not exists affiliate_clicks_product_id_idx on affiliate_clicks (product_id);

create table if not exists affiliate_orders (
  id serial primary key,
  product_id integer references affiliate_products(id) on delete set null,
  ordered_on date not null,
  items integer not null default 1,
  commission_cents integer,
  note text,
  created_at timestamptz not null default now()
);
