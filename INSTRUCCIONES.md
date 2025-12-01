# 🚀 Backend - Evaluación Técnica con Supabase

## Configuración Inicial

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la carpeta `backend/` con:

```env
SUPABASE_URL=https://cuguxnuagbzizmzkgvvy.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1Z3V4bnVhZ2J6aXptemtndnZ5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDU5NzU0MCwiZXhwIjoyMDgwMTczNTQwfQ.lko4xhxKXNIBheNlCgz2MjxVVATH-iVWjVLj9hCHMNg
PORT=4000
```

### 3. Crear tabla en Supabase

Ejecuta este SQL en tu proyecto de Supabase:

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

-- Opcional: Crear índice para búsquedas rápidas
create index idx_evaluaciones_nombre on public.evaluaciones(nombre);
create index idx_evaluaciones_evaluador on public.evaluaciones(evaluador);
create index idx_evaluaciones_fecha on public.evaluaciones(fecha);
```

### 4. Ejecutar el backend

```bash
npm run dev
```

El backend estará disponible en `http://localhost:4000`

## Endpoints

### GET /api/health
Verifica que el backend esté funcionando.

**Respuesta:**
```json
{
  "ok": true,
  "message": "Backend de evaluación técnica activo"
}
```

### POST /api/evaluaciones
Guarda una evaluación en Supabase.

**Body (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "evaluador": "María González",
  "periodo": "Enero 2024",
  "fecha": "2025-12-01",
  "puntaje_total": 16,
  "totalCorrectas": 8,
  "respuestas": ["A", "B", "C", "A", "B", "A", "C", "B", "A", "B"],
  "fortalezas": ["Algoritmos y Estructuras de Datos"],
  "areas_mejora": ["DevOps y CI/CD"],
  "competencias": {
    "Algoritmos y Estructuras de Datos": { "correctas": 1, "total": 1 }
  }
}
```

**Respuesta exitosa (201):**
```json
{
  "ok": true,
  "evaluacion": {
    "id": "uuid-generado",
    "nombre": "Juan Pérez",
    ...
  }
}
```

## Flujo de Evaluación entre Estudiantes

1. **Estudiante A** completa el formulario:
   - **Evaluador**: Nombre del Estudiante A (quien evalúa)
   - **Evaluado**: Nombre del Estudiante B (compañero a evaluar)

2. **Estudiante A** responde las 10 preguntas

3. Al completar, **automáticamente se guarda en Supabase**:
   - Se registra quién evaluó (evaluador)
   - Se registra quién fue evaluado (nombre)
   - Se guardan todas las respuestas
   - Se guarda la nota final

4. Cada evaluación queda registrada en la base de datos con:
   - Fecha y hora de creación
   - Todas las respuestas del evaluador
   - Puntaje y análisis de competencias

## Ver Evaluaciones en Supabase

Puedes ver todas las evaluaciones en el dashboard de Supabase:
1. Ve a tu proyecto en https://supabase.com
2. Navega a "Table Editor"
3. Selecciona la tabla `evaluaciones`
4. Verás todas las evaluaciones guardadas

## Solución de Problemas

**Error: "SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configuradas"**
- Verifica que el archivo `.env` existe en la carpeta `backend/`
- Verifica que las variables estén correctamente escritas

**Error: "Error al guardar en Supabase"**
- Verifica que la tabla `evaluaciones` existe en Supabase
- Verifica que las columnas coincidan con el esquema
- Revisa los logs del backend para más detalles

**Error de conexión desde el frontend**
- Asegúrate de que el backend esté corriendo en `http://localhost:4000`
- Verifica que CORS esté configurado correctamente

