alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- profiles
create policy "profiles_select_own_or_admin" on public.profiles
  for select using (auth.uid() = id or public.is_admin());
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
revoke update on public.profiles from authenticated;
grant update (name, addresses) on public.profiles to authenticated;
-- role changes ONLY via public.set_user_role() RPC (is_admin()-gated)

-- categories (closes: currently zero auth check, anyone can write)
create policy "categories_select_all" on public.categories for select using (true);
create policy "categories_write_admin" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- products (closes: currently zero auth check, anyone can write)
create policy "products_select_all" on public.products for select using (true);
create policy "products_write_admin" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- orders (closes: missing ownership check on GET by id; unrestricted PATCH body)
create policy "orders_select_own_or_admin" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
revoke insert, update on public.orders from authenticated; -- writes only via create_order() RPC
create policy "orders_status_update_admin" on public.orders
  for update using (public.is_admin()) with check (public.is_admin());
grant update (status, midtrans_transaction_id) on public.orders to authenticated;

-- order_items
create policy "order_items_select_via_order" on public.order_items for select
  using (exists (select 1 from public.orders o where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())));
revoke insert, update, delete on public.order_items from authenticated; -- only via create_order()
