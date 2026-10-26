create extension if not exists pgcrypto;

create table if not exists public.food_boxes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  partner_name text not null,
  category text not null check (category in ('Bakery', 'Café', 'Restaurant', 'Grocery')),
  description text not null,
  original_price numeric(10,2) not null check (original_price > 0),
  rescue_price numeric(10,2) not null check (rescue_price > 0 and rescue_price <= original_price),
  quantity_available integer not null default 0 check (quantity_available >= 0),
  pickup_start timestamptz not null,
  pickup_end timestamptz not null,
  location text not null,
  image_url text not null,
  status text not null default 'active' check (status in ('active', 'sold_out', 'inactive')),
  created_at timestamptz not null default now(),
  check (pickup_end > pickup_start)
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_code text unique not null,
  food_box_id uuid not null references public.food_boxes(id),
  customer_name text not null,
  email text not null,
  phone text not null,
  quantity integer not null check (quantity > 0),
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'collected')),
  created_at timestamptz not null default now()
);

create index if not exists reservations_food_box_id_idx on public.reservations(food_box_id);
create index if not exists reservations_created_at_idx on public.reservations(created_at desc);

alter table public.food_boxes enable row level security;
alter table public.reservations enable row level security;

-- Public discovery is handled server-side in this prototype. The service role is never exposed to the browser.
-- Reservation creation is exposed through the controlled RPC below.

drop function if exists public.reserve_food_box(uuid, text, text, text, integer);
create or replace function public.reserve_food_box(
  p_food_box_id uuid,
  p_customer_name text,
  p_email text,
  p_phone text,
  p_quantity integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_box public.food_boxes%rowtype;
  v_code text;
  v_id uuid;
begin
  select * into v_box
  from public.food_boxes
  where id = p_food_box_id
  for update;

  if not found then
    raise exception 'Food box not found';
  end if;

  if v_box.status <> 'active' or v_box.quantity_available <= 0 then
    raise exception 'Food box is no longer available';
  end if;

  if p_quantity < 1 or p_quantity > v_box.quantity_available then
    raise exception 'Insufficient availability';
  end if;

  v_code := 'FR-' || upper(substr(encode(gen_random_bytes(4), 'hex'), 1, 8));

  insert into public.reservations (
    reservation_code,
    food_box_id,
    customer_name,
    email,
    phone,
    quantity
  ) values (
    v_code,
    p_food_box_id,
    trim(p_customer_name),
    lower(trim(p_email)),
    trim(p_phone),
    p_quantity
  ) returning id into v_id;

  update public.food_boxes
  set quantity_available = quantity_available - p_quantity,
      status = case when quantity_available - p_quantity = 0 then 'sold_out' else status end
  where id = p_food_box_id;

  return jsonb_build_object(
    'reservation_code', v_code,
    'reservation_id', v_id
  );
end;
$$;

grant execute on function public.reserve_food_box(uuid, text, text, text, integer) to anon, authenticated;
