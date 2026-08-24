import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import bookingsRouter from './routes/bookings.js'
import contactsRouter from './routes/contacts.js'
import servicesRouter from './routes/services.js'
import offersRouter from './routes/offers.js'
import eventsRouter from './routes/events.js'
import coursesRouter from './routes/courses.js'
import galleryRouter from './routes/gallery.js'
import articlesRouter from './routes/articles.js'
import Offer from './models/Offer.js'
import Service from './models/Service.js'
import Course from './models/Course.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Lazy MongoDB connection (works in serverless)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/automotive-academy'

app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(MONGODB_URI)
    } catch (err) {
      console.error('MongoDB connection error:', err.message)
    }
  }
  next()
})

app.use('/api/bookings', bookingsRouter)
app.use('/api/contacts', contactsRouter)
app.use('/api/services', servicesRouter)
app.use('/api/offers', offersRouter)
app.use('/api/events', eventsRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/gallery', galleryRouter)
app.use('/api/articles', articlesRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Automotive Academy API' })
})

// Seed endpoint — populates DB with default data if empty
app.post('/api/seed', async (req, res) => {
  try {
    const { offers: seedOffers, services: seedServices, courses: seedCourses } = req.body

    if (seedOffers?.length) {
      await Offer.deleteMany({})
      await Offer.insertMany(seedOffers)
    }
    if (seedServices?.length) {
      await Service.deleteMany({})
      await Service.insertMany(seedServices)
    }
    if (seedCourses?.length) {
      await Course.deleteMany({})
      await Course.insertMany(seedCourses)
    }

    res.json({ success: true, message: 'تم تهيئة البيانات بنجاح' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// Only listen on port when running locally (not on Vercel)
if (process.env.VERCEL !== '1') {
  const PORT = process.env.PORT || 5000
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log('MongoDB connected')
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
      })
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err.message)
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} (without DB)`)
      })
    })
}

export default app
