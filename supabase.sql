-- Salão da Jana - Supabase SQL
-- Execute no Supabase > SQL Editor > New Query > Run

create extension if not exists pgcrypto;

create table if not exists public.sales (
  id uuid primary key default gen_random_uuid(),
  sale_date date not null default current_date,
  client_name text not null,
  service text not null,
  value numeric(10,2) not null default 0,
  payment_method text default 'Pix',
  status text default 'Pago',
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  appointment_date date not null default current_date,
  appointment_time time not null default '09:00',
  client_name text not null,
  phone text default '',
  service text not null,
  status text default 'Agendado',
  notes text default '',
  created_at timestamptz not null default now()
);

create table if not exists public.notes (
  id int primary key default 1,
  content text default '',
  updated_at timestamptz not null default now(),
  constraint notes_single_row check (id = 1)
);

insert into public.notes (id, content)
values (1, '')
on conflict (id) do nothing;

-- Segurança:
-- As tabelas ficam com RLS ligado e sem policies públicas.
-- O site usa a service_role key apenas no servidor para acessar os dados.
alter table public.sales enable row level security;
alter table public.appointments enable row level security;
alter table public.notes enable row level security;

-- Índices para deixar consultas por data mais rápidas.
create index if not exists sales_sale_date_idx on public.sales (sale_date desc);
create index if not exists appointments_date_time_idx on public.appointments (appointment_date asc, appointment_time asc);
