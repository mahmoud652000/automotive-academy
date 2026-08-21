import express from 'express'
import Course from '../models/Course.js'

const router = express.Router()

// GET /api/courses - Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 })
    res.json({ success: true, count: courses.length, data: courses })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/courses - Create a course
router.post('/', async (req, res) => {
  try {
    const course = new Course(req.body)
    const saved = await course.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/courses/:id - Get a single course
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    if (!course) {
      return res.status(404).json({ success: false, message: 'الدورة غير موجودة' })
    }
    res.json({ success: true, data: course })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PUT /api/courses/:id - Update a course
router.put('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!course) {
      return res.status(404).json({ success: false, message: 'الدورة غير موجودة' })
    }
    res.json({ success: true, data: course })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/courses/:id - Delete a course
router.delete('/:id', async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id)
    if (!course) {
      return res.status(404).json({ success: false, message: 'الدورة غير موجودة' })
    }
    res.json({ success: true, message: 'تم حذف الدورة' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
