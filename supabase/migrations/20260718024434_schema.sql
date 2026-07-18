create extension if not exists pg_trgm;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null default 'user' check (role in ('user','admin')),
  addresses jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index categories_slug_idx on public.categories (slug);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null,
  price numeric(12,2) not null check (price >= 0),
  stock int not null default 0 check (stock >= 0),
  category_id uuid not null references public.categories(id) on delete restrict,
  images text[] not null default '{}',
  variants jsonb not null default '[]'::jsonb,
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  sold int not null default 0,
  search_vector tsvector generated always as (
    setweight(to_tsvector('simple', coalesce(name,'')), 'A') ||
    setweight(to_tsvector('simple', coalesce(description,'')), 'B')
  ) stored,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index products_slug_idx on public.products (slug);
create index products_category_idx on public.products (category_id);
create index products_search_idx on public.products using gin (search_vector);
create index products_name_trgm_idx on public.products using gin (name gin_trgm_ops);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete restrict,
  total_price numeric(12,2) not null default 0 check (total_price >= 0),
  status text not null default 'pending'
    check (status in ('pending','paid','processing','shipped','delivered','cancelled')),
  payment_method text not null check (payment_method in ('midtrans','qris')),
  midtrans_transaction_id text,
  shipping_address jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_user_id_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name text not null,
  image text not null,
  price numeric(12,2) not null check (price >= 0),
  quantity int not null check (quantity >= 1),
  variant jsonb,
  created_at timestamptz not null default now()
);
create index order_items_order_id_idx on public.order_items (order_id);

-- updated_at triggers (plpgsql, no external extension dependency)
create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger set_updated_at_profiles before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger set_updated_at_categories before update on public.categories
  for each row execute function public.set_updated_at();
create trigger set_updated_at_products before update on public.products
  for each row execute function public.set_updated_at();
create trigger set_updated_at_orders before update on public.orders
  for each row execute function public.set_updated_at();
