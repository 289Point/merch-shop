-- ============================================
-- Esegui questo file in Supabase:
-- Dashboard -> SQL Editor -> New query -> incolla -> Run
-- ============================================

-- Tabella prodotti
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  price numeric(10, 2) not null,
  image_url text,
  created_at timestamptz not null default now()
);

-- Attiva la sicurezza a livello di riga (RLS)
alter table products enable row level security;

-- Regola 1: TUTTI (anche non registrati) possono LEGGERE i prodotti
create policy "Chiunque può vedere i prodotti"
  on products for select
  using (true);

-- Regola 2: solo il TUO account admin può INSERIRE prodotti
-- Sostituisci 'tuaemail@esempio.com' con la tua email reale prima di eseguire
create policy "Solo admin può inserire prodotti"
  on products for insert
  with check (auth.jwt() ->> 'email' = 'tuaemail@esempio.com');

-- Regola 3: solo il TUO account admin può MODIFICARE prodotti
create policy "Solo admin può modificare prodotti"
  on products for update
  using (auth.jwt() ->> 'email' = 'tuaemail@esempio.com');

-- Regola 4: solo il TUO account admin può ELIMINARE prodotti
create policy "Solo admin può eliminare prodotti"
  on products for delete
  using (auth.jwt() ->> 'email' = 'tuaemail@esempio.com');
