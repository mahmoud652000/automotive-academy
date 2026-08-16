import express from 'express'
import Event from '../models/Event.js'

const router = express.Router()

// GET /api/events - Get all active events
router.get('/', async (req, res) => {
  try {
    const { active } = req.query
    const filter = active === 'true' ? { active: true } : {}
    const events = await Event.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: events.length, data: events })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/events - Create an event
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body)
    const saved = await event.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/events/:id - Get a single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'الحدث غير موجود' })
    }
    res.json({ success: true, data: event })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PUT /api/events/:id - Update an event
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!event) {
      return res.status(404).json({ success: false, message: 'الحدث غير موجود' })
    }
    res.json({ success: true, data: event })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/events/:id - Delete an event
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) {
      return res.status(404).json({ success: false, message: 'الحدث غير موجود' })
    }
    res.json({ success: true, message: 'تم حذف الحدث' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
