import express from 'express'
import Service from '../models/Service.js'

const router = express.Router()

// GET /api/services - Get all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 })
    res.json({ success: true, count: services.length, data: services })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/services - Create a service
router.post('/', async (req, res) => {
  try {
    const service = new Service(req.body)
    const saved = await service.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/services/:id - Get a single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) {
      return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' })
    }
    res.json({ success: true, data: service })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PUT /api/services/:id - Update a service
router.put('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!service) {
      return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' })
    }
    res.json({ success: true, data: service })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/services/:id - Delete a service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id)
    if (!service) {
      return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' })
    }
    res.json({ success: true, message: 'تم حذف الخدمة' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
