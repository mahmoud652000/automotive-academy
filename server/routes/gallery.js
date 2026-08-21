import express from 'express'
import Gallery from '../models/Gallery.js'

const router = express.Router()

// GET /api/gallery - Get all gallery items
router.get('/', async (req, res) => {
  try {
    const { active } = req.query
    const filter = active === 'true' ? { active: true } : {}
    const items = await Gallery.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: items.length, data: items })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/gallery - Create a gallery item
router.post('/', async (req, res) => {
  try {
    const item = new Gallery(req.body)
    const saved = await item.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// PUT /api/gallery/:id - Update a gallery item
router.put('/:id', async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!item) {
      return res.status(404).json({ success: false, message: 'العنصر غير موجود' })
    }
    res.json({ success: true, data: item })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/gallery/:id - Delete a gallery item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id)
    if (!item) {
      return res.status(404).json({ success: false, message: 'العنصر غير موجود' })
    }
    res.json({ success: true, message: 'تم حذف العنصر' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
