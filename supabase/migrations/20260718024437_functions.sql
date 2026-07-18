create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), 'user');
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

-- Recomputes price server-side; the only sanctioned way to create an order/order_items.
create or replace function public.create_order(
  p_items jsonb,              -- [{product_id, quantity, variant}]
  p_shipping_address jsonb,
  p_payment_method text
) returns public.orders
language plpgsql security definer set search_path = public as $$
declare
  v_order public.orders;
  v_item jsonb;
  v_product public.products;
  v_total numeric(12,2) := 0;
  v_line_price numeric(12,2);
begin
  if auth.uid() is null then raise exception 'Not authenticated'; end if;

  insert into public.orders (user_id, total_price, payment_method, shipping_address)
  values (auth.uid(), 0, p_payment_method, p_shipping_address)
  returning * into v_order;

  for v_item in select * from jsonb_array_elements(p_items) loop
    select * into v_product from public.products where id = (v_item->>'product_id')::uuid;
    if v_product is null then raise exception 'Product not found: %', v_item->>'product_id'; end if;

    v_line_price := coalesce((v_item->'variant'->>'price')::numeric, v_product.price);

    insert into public.order_items (order_id, product_id, name, image, price, quantity, variant)
    values (v_order.id, v_product.id, v_product.name, coalesce(v_product.images[1], ''),
            v_line_price, (v_item->>'quantity')::int, v_item->'variant');

    v_total := v_total + v_line_price * (v_item->>'quantity')::int;
  end loop;

  update public.orders set total_price = v_total where id = v_order.id returning * into v_order;
  return v_order;
end; $$;

grant execute on function public.create_order(jsonb, jsonb, text) to authenticated;

create or replace function public.set_user_role(p_user_id uuid, p_role text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Forbidden'; end if;
  if p_role not in ('user','admin') then raise exception 'Invalid role'; end if;
  update public.profiles set role = p_role where id = p_user_id;
end; $$;

grant execute on function public.set_user_role(uuid, text) to authenticated;
