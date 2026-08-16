import express from 'express'
import Contact from '../models/Contact.js'

const router = express.Router()

// POST /api/contacts - Submit a contact message
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body)
    const saved = await contact.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/contacts - Get all contact messages
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json({ success: true, count: contacts.length, data: contacts })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/contacts/:id - Update contact status
router.patch('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    )
    if (!contact) {
      return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' })
    }
    res.json({ success: true, data: contact })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/contacts/:id - Delete a contact message
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id)
    if (!contact) {
      return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' })
    }
    res.json({ success: true, message: 'تم حذف الرسالة' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
