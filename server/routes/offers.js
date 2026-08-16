import express from 'express'
import Offer from '../models/Offer.js'

const router = express.Router()

// GET /api/offers - Get all active offers
router.get('/', async (req, res) => {
  try {
    const { active } = req.query
    const filter = active === 'true' ? { active: true } : {}
    const offers = await Offer.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: offers.length, data: offers })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/offers - Create an offer
router.post('/', async (req, res) => {
  try {
    const offer = new Offer(req.body)
    const saved = await offer.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/offers/:id - Get a single offer
router.get('/:id', async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id)
    if (!offer) {
      return res.status(404).json({ success: false, message: 'العرض غير موجود' })
    }
    res.json({ success: true, data: offer })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PUT /api/offers/:id - Update an offer
router.put('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!offer) {
      return res.status(404).json({ success: false, message: 'العرض غير موجود' })
    }
    res.json({ success: true, data: offer })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/offers/:id - Delete an offer
router.delete('/:id', async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id)
    if (!offer) {
      return res.status(404).json({ success: false, message: 'العرض غير موجود' })
    }
    res.json({ success: true, message: 'تم حذف العرض' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
