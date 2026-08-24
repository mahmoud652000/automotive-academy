import express from 'express'
import Article from '../models/Article.js'

const router = express.Router()

// GET /api/articles - Get all active articles
router.get('/', async (req, res) => {
  try {
    const { active } = req.query
    const filter = active === 'true' ? { active: true } : {}
    const articles = await Article.find(filter).sort({ createdAt: -1 })
    res.json({ success: true, count: articles.length, data: articles })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/articles - Create an article
router.post('/', async (req, res) => {
  try {
    const article = new Article(req.body)
    const saved = await article.save()
    res.status(201).json({ success: true, data: saved })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/articles/:id - Get a single article
router.get('/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id)
    if (!article) {
      return res.status(404).json({ success: false, message: 'المقال غير موجود' })
    }
    res.json({ success: true, data: article })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PUT /api/articles/:id - Update an article
router.put('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    if (!article) {
      return res.status(404).json({ success: false, message: 'المقال غير موجود' })
    }
    res.json({ success: true, data: article })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/articles/:id - Delete an article
router.delete('/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id)
    if (!article) {
      return res.status(404).json({ success: false, message: 'المقال غير موجود' })
    }
    res.json({ success: true, message: 'تم حذف المقال' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
