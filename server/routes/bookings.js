import express from 'express'
import Booking from '../models/Booking.js'

const router = express.Router()

// POST /api/bookings - Create a booking
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body)
    const saved = await booking.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/bookings - Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 })
    res.json({ success: true, count: bookings.length, data: bookings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/bookings/:id - Get a single booking
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: 'الحجز غير موجود' })
    }
    res.json({ success: true, data: booking })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/bookings/:id - Update booking status
router.patch('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!booking) {
      return res.status(404).json({ success: false, message: 'الحجز غير موجود' })
    }
    res.json({ success: true, data: booking })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/bookings/:id - Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id)
    if (!booking) {
      return res.status(404).json({ success: false, message: 'الحجز غير موجود' })
    }
    res.json({ success: true, message: 'تم حذف الحجز' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
