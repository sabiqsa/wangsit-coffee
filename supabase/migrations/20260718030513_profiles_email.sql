-- Denormalize email onto profiles so admin UI (orders/users lists) can read it
-- through RLS without needing the service-role client for a simple display join.
alter table public.profiles add column email text;
update public.profiles p set email = u.email from auth.users u where u.id = p.id;
alter table public.profiles alter column email set not null;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, name, email, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', split_part(new.email,'@',1)), new.email, 'user');
  return new;
end; $$;
