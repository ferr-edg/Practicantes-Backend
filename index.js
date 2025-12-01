import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// CORS: ajusta origin si cambias el puerto del frontend
app.use(
  cors({
    origin: 'http://localhost:5173',
  })
)

app.use(express.json())

// Variables de entorno para Supabase
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.warn(
    '⚠️ SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY no están configuradas en .env'
  )
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Backend de evaluación técnica activo' })
})

// Guardar evaluación
app.post('/api/evaluaciones', async (req, res) => {
  try {
    const data = req.body

    if (!data?.nombre || !data?.evaluador || !data?.fecha) {
      return res
        .status(400)
        .json({ error: 'nombre, evaluador y fecha son obligatorios' })
    }

    const payload = {
      nombre: data.nombre,
      evaluador: data.evaluador,
      periodo: data.periodo || null,
      fecha: data.fecha,
      puntaje_total: data.puntaje_total ?? 0,
      total_correctas: data.totalCorrectas ?? 0,
      respuestas: data.respuestas || [],
      fortalezas: data.fortalezas || [],
      areas_mejora: data.areas_mejora || [],
      competencias: data.competencias || {},
      metadata: data.metadata || null,
    }

    const { data: insertData, error } = await supabase
      .from('evaluaciones')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error('Error al insertar en Supabase:', error)
      console.error('Payload enviado:', JSON.stringify(payload, null, 2))
      return res.status(500).json({ 
        error: 'Error al guardar en Supabase',
        details: error.message,
        code: error.code
      })
    }

    return res.status(201).json({ ok: true, evaluacion: insertData })
  } catch (err) {
    console.error('Error en /api/evaluaciones:', err)
    return res.status(500).json({ error: 'Error interno del servidor' })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`)
})


