import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import db, { prepareBody } from './db.js'
import bookingsRouter from './routes/bookings.js'
import contactsRouter from './routes/contacts.js'
import servicesRouter from './routes/services.js'
import offersRouter from './routes/offers.js'
import eventsRouter from './routes/events.js'
import coursesRouter from './routes/courses.js'
import galleryRouter from './routes/gallery.js'
import articlesRouter from './routes/articles.js'
import reviewsRouter from './routes/reviews.js'
import settingsRouter from './routes/settings.js'
import uploadsRouter from './routes/uploads.js'
import subscribersRouter from './routes/subscribers.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

const uploadsDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}
app.use('/uploads', express.static(uploadsDir))

app.use('/api/bookings', bookingsRouter)
app.use('/api/contacts', contactsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/offers', offersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/gallery', galleryRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/reviews', reviewsRouter)
app.use('/api/settings', settingsRouter)
app.use('/api/upload', uploadsRouter)
app.use('/api/subscribers', subscribersRouter)

// --- التعديل هنا: تشغيل واجهة الموقع ---
const clientPath = path.join(__dirname, '../client/dist')
if (fs.existsSync(clientPath)) {
  app.use(express.static(clientPath))
  // اي رابط مش API يرجع للواجهة
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(clientPath, 'index.html'))
  })
} else {
  app.get('/', (req, res) => {
    res.json({ message: 'Automotive Academy API - ابني الفرونت أولا npm run build' })
  })
}

app.post('/api/seed', (req, res) => {
  try {
    const { offers: seedOffers, services: seedServices, courses: seedCourses } = req.body

    const insertIfEmpty = (table, items) => {
      const count = db.prepare(`SELECT COUNT(*) as c FROM ${table}`).get().c
      if (count > 0) return
      const tx = db.transaction((rows) => {
        for (const row of rows) {
          const data = prepareBody(row, table)
          const keys = Object.keys(data)
          const placeholders = keys.map(() => '?').join(', ')
          db.prepare(`INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`).run(...Object.values(data))
        }
      })
      tx(items)
    }

    if (seedOffers?.length) insertIfEmpty('offers', seedOffers)
    if (seedServices?.length) insertIfEmpty('services', seedServices)
    if (seedCourses?.length) insertIfEmpty('courses', seedCourses)

    res.json({ success: true, message: 'تم تهيئة البيانات بنجاح' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
