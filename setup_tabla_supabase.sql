-- Script SQL para crear/ajustar la tabla evaluaciones en Supabase
-- Ejecuta esto completo en el SQL Editor de Supabase

-- Crear la tabla si no existe
create table if not exists public.evaluaciones (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now()
);

-- Eliminar columnas que no usamos (evaluador_id, evaluado_id) si existen
alter table public.evaluaciones
  drop column if exists evaluador_id,
  drop column if exists evaluado_id;

-- Agregar todas las columnas necesarias (si no existen)
alter table public.evaluaciones
  add column if not exists nombre text not null default '',
  add column if not exists evaluador text not null default '',
  add column if not exists periodo text,
  add column if not exists fecha date not null default current_date,
  add column if not exists puntaje_total numeric(4,1) not null default 0,
  add column if not exists total_correctas integer not null default 0,
  add column if not exists respuestas text[] not null default '{}'::text[],
  add column if not exists fortalezas text[] not null default '{}'::text[],
  add column if not exists areas_mejora text[] not null default '{}'::text[],
  add column if not exists competencias jsonb not null default '{}'::jsonb,
  add column if not exists metadata jsonb;

-- Si las columnas evaluador_id/evaluado_id ya existen y tienen NOT NULL, hacerlas opcionales
alter table public.evaluaciones
  alter column evaluador_id drop not null,
  alter column evaluado_id drop not null;

-- Crear índices para búsquedas rápidas
create index if not exists idx_evaluaciones_nombre on public.evaluaciones(nombre);
create index if not exists idx_evaluaciones_evaluador on public.evaluaciones(evaluador);
create index if not exists idx_evaluaciones_fecha on public.evaluaciones(fecha);

-- Verificar que la tabla esté correcta
select column_name, data_type, is_nullable
from information_schema.columns
where table_schema = 'public' and table_name = 'evaluaciones'
order by ordinal_position;

