import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000

// CORS: configuración para desarrollo y producción
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : []

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requests sin origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true)
      
      // Si hay orígenes específicos configurados, solo permite esos
      if (allowedOrigins.length > 0) {
        if (allowedOrigins.includes(origin)) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
        return
      }
      
      // Si no hay orígenes configurados, permite todos (útil para desarrollo y producción)
      // En producción, puedes restringir esto configurando ALLOWED_ORIGINS
      callback(null, true)
    },
    credentials: true,
  })
)

app.use(express.json())

// Variables de entorno para Supabase
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Debug: mostrar qué variables están disponibles (sin mostrar valores sensibles)
console.log('🔍 Verificando variables de entorno...')
console.log('SUPABASE_URL está configurada:', !!SUPABASE_URL)
console.log('SUPABASE_SERVICE_ROLE_KEY está configurada:', !!SUPABASE_SERVICE_ROLE_KEY)
console.log('Variables de entorno disponibles:', Object.keys(process.env).filter(key => 
  key.includes('SUPABASE') || key.includes('PORT') || key.includes('NODE')
).join(', '))

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('')
  console.error('❌ ERROR: Variables de entorno faltantes')
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.error('SUPABASE_URL:', SUPABASE_URL ? '✅ Configurada' : '❌ FALTA')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY ? '✅ Configurada' : '❌ FALTA')
  console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.error('')
  console.error('📝 INSTRUCCIONES PARA RENDER:')
  console.error('1. Ve a tu servicio en Render Dashboard')
  console.error('2. Click en "Environment" en el menú lateral')
  console.error('3. Agrega estas dos variables:')
  console.error('   - Key: SUPABASE_URL')
  console.error('     Value: https://tu-proyecto.supabase.co')
  console.error('   - Key: SUPABASE_SERVICE_ROLE_KEY')
  console.error('     Value: tu_service_role_key_secreta')
  console.error('4. Guarda los cambios (Render redesplegará automáticamente)')
  console.error('')
  console.error('💡 Las variables deben estar en la sección "Environment Variables" de Render')
  console.error('')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

// Ruta raíz
app.get('/', (req, res) => {
  res.json({ 
    ok: true, 
    message: 'Backend de evaluación técnica - API activa',
    endpoints: {
      health: '/api/health',
      evaluaciones: 'POST /api/evaluaciones'
    }
  })
})

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend escuchando en puerto ${PORT}`)
  console.log(`✅ Servidor listo para recibir peticiones`)
})


