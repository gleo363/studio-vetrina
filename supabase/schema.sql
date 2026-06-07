-- ============================================================
-- Studio Vetrina — Schema Supabase
-- Eseguire questo file sulla dashboard Supabase (SQL Editor)
-- ============================================================

-- Tabella partner (collegata agli utenti autenticati)
create table partner (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  nome text not null,
  email text not null,
  codice text unique not null,
  commissione numeric default 0.10,
  iban text,
  creato_il timestamptz default now()
);

-- Tabella segnalazioni
create table segnalazione (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid references partner(id) on delete cascade,
  nome_attivita text not null,
  nome_referente text,
  email text,
  telefono text,
  messaggio text,
  stato text default 'segnalato'
    check (stato in ('segnalato','firmato','pagato','rifiutato')),
  valore_progetto numeric default 0,
  commissione_maturata numeric default 0,
  commissione_liquidata boolean default false,
  note text,
  creato_il timestamptz default now(),
  firmato_il timestamptz,
  pagato_il timestamptz
);

-- Row Level Security
alter table partner enable row level security;
alter table segnalazione enable row level security;

create policy "partner vede sé stesso" on partner
  for select using (auth.uid() = user_id);

create policy "partner inserisce sé stesso" on partner
  for insert with check (auth.uid() = user_id);

create policy "partner vede le proprie segnalazioni" on segnalazione
  for select using (
    partner_id in (select id from partner where user_id = auth.uid())
  );

create policy "partner inserisce le proprie segnalazioni" on segnalazione
  for insert with check (
    partner_id in (select id from partner where user_id = auth.uid())
  );
