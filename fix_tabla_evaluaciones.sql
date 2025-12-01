-- Script SQL para ARREGLAR la tabla evaluaciones en Supabase
-- Ejecuta esto completo en el SQL Editor de Supabase

-- PASO 1: Hacer opcionales las columnas que causan error (si existen)
alter table public.evaluaciones
  alter column evaluado_id drop not null,
  alter column evaluador_id drop not null;

-- PASO 2: Eliminar columnas que no usamos (pregunta_id, etc.)
-- Si tienes columnas pregunta_1, pregunta_2, etc., elimínalas
alter table public.evaluaciones
  drop column if exists pregunta_1,
  drop column if exists pregunta_2,
  drop column if exists pregunta_3,
  drop column if exists pregunta_4,
  drop column if exists pregunta_5,
  drop column if exists pregunta_6,
  drop column if exists pregunta_7,
  drop column if exists pregunta_8,
  drop column if exists pregunta_9,
  drop column if exists pregunta_10;

-- PASO 3: Agregar TODAS las columnas que el backend SÍ está enviando
alter table public.evaluaciones
  add column if not exists nombre text,
  add column if not exists evaluador text,
  add column if not exists periodo text,
  add column if not exists fecha date,
  add column if not exists puntaje_total numeric(4,1),
  add column if not exists total_correctas integer,
  add column if not exists respuestas text[],
  add column if not exists fortalezas text[],
  add column if not exists areas_mejora text[],
  add column if not exists competencias jsonb,
  add column if not exists metadata jsonb;

-- PASO 4: Si las columnas ya existen pero son NULL, establecer valores por defecto
alter table public.evaluaciones
  alter column nombre set default '',
  alter column evaluador set default '',
  alter column puntaje_total set default 0,
  alter column total_correctas set default 0,
  alter column respuestas set default '{}'::text[],
  alter column fortalezas set default '{}'::text[],
  alter column areas_mejora set default '{}'::text[],
  alter column competencias set default '{}'::jsonb;

-- PASO 5: Hacer NOT NULL solo las columnas esenciales (después de tener datos)
-- Comentar esto si la tabla ya tiene datos y quieres mantenerlos
-- alter table public.evaluaciones
--   alter column nombre set not null,
--   alter column evaluador set not null,
--   alter column fecha set not null;

-- PASO 6: Cambiar el tipo de id de int4 a uuid (si es necesario)
-- Solo si tu tabla tiene id como int4 y quieres cambiarlo a uuid
-- ALERTA: Esto puede requerir migración de datos
-- alter table public.evaluaciones
--   alter column id type uuid using gen_random_uuid();

-- PASO 7: Crear índices para búsquedas rápidas
create index if not exists idx_evaluaciones_nombre on public.evaluaciones(nombre);
create index if not exists idx_evaluaciones_evaluador on public.evaluaciones(evaluador);
create index if not exists idx_evaluaciones_fecha on public.evaluaciones(fecha);

-- PASO 8: Verificar la estructura final de la tabla
select 
  column_name, 
  data_type, 
  is_nullable,
  column_default
from information_schema.columns
where table_schema = 'public' 
  and table_name = 'evaluaciones'
order by ordinal_position;

