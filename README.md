# Backend Evaluación Técnica (Supabase)

## 1. Configuración de Supabase

En tu proyecto de Supabase crea la tabla:

```sql
create table public.evaluaciones (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  evaluador text not null,
  periodo text,
  fecha date not null,
  puntaje_total numeric(4,1) not null,
  total_correctas integer not null,
  respuestas text[] not null,
  fortalezas text[] not null,
  areas_mejora text[] not null,
  competencias jsonb not null,
  metadata jsonb,
  created_at timestamptz default now()
);
```

Asegúrate de que la política RLS permita insertar desde el `service_role` (puedes empezar con RLS desactivado y luego endurecer).

## 2. Variables de entorno

Crea un archivo `.env` dentro de `backend/` con:

```env
SUPABASE_URL=https://TU_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY_SECRETO
PORT=4000
```

**Importante**: Usa la `service_role key` solo en el backend. No la expongas en el frontend ni la subas a Git.

## 3. Instalar dependencias

Desde la carpeta `backend` ejecuta:

```bash
npm install
```

Si faltan dependencias:

```bash
npm install express cors dotenv @supabase/supabase-js
```

## 4. Ejecutar el servidor

Desde `backend`:

```bash
npm run dev
```

El backend escuchará en `http://localhost:4000`.

## 5. Endpoint disponible

### `POST /api/evaluaciones`

Cuerpo esperado (ejemplo):

```json
{
  "nombre": "Juan Pérez",
  "evaluador": "Ing. María González",
  "periodo": "Enero 2024",
  "fecha": "2024-01-15",
  "puntaje_total": 16,
  "totalCorrectas": 8,
  "respuestas": ["A", "B", "C", "A", "B", "A", "C", "B", "A", "B"],
  "fortalezas": ["Algoritmos y Estructuras de Datos"],
  "areas_mejora": ["DevOps y CI/CD"],
  "competencias": {
    "Algoritmos y Estructuras de Datos": { "correctas": 1, "total": 1 }
  },
  "metadata": null
}
```

Respuesta:

```json
{
  "ok": true,
  "evaluacion": { "...": "registro insertado" }
}
```


