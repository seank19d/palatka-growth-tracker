alter table affiliate_products add column if not exists status text not null default 'ok';
alter table affiliate_products add column if not exists last_checked_at timestamptz;
alter table affiliate_products add column if not exists check_note text;
