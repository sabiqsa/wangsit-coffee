-- Repoint orders.user_id at public.profiles instead of auth.users so PostgREST
-- can embed profile (name/email) directly in an orders select for the admin UI,
-- e.g. .select('*, profiles(name,email)'). profiles.id is always == auth.users.id
-- (enforced by handle_new_user trigger + FK), so this changes nothing referentially.
alter table public.orders drop constraint orders_user_id_fkey;
alter table public.orders
  add constraint orders_user_id_fkey foreign key (user_id) references public.profiles(id) on delete restrict;
