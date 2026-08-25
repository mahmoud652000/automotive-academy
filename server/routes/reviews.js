import express from 'express'
import db, { formatRow, formatRows, prepareBody, buildInsert, buildUpdate } from '../db.js'

const router = express.Router()
const table = 'reviews'

// GET /api/reviews
router.get('/', (req, res) => {
  try {
    const { active } = req.query
    const rows = active === 'true'
      ? db.prepare('SELECT * FROM reviews WHERE active = 1 ORDER BY created_at DESC').all()
      : db.prepare('SELECT * FROM reviews ORDER BY created_at DESC').all()
    res.json({ success: true, count: rows.length, data: formatRows(rows, table) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/reviews
router.post('/', (req, res) => {
  try {
    const data = prepareBody(req.body, table)
    const { sql, values } = buildInsert(table, data)
    const info = db.prepare(sql).run(...values)
    const row = db.prepare('SELECT * FROM reviews WHERE id = ?').get(info.lastInsertRowid)
    res.status(201).json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/reviews/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM reviews WHERE id = ?').get(Number(req.params.id))
    if (!row) return res.status(404).json({ success: false, message: 'الرأي غير موجود' })
    res.json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PUT /api/reviews/:id
router.put('/:id', (req, res) => {
  try {
    const data = prepareBody(req.body, table)
    const { sql, values } = buildUpdate(table, data)
    const info = db.prepare(sql).run(...values, Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'الرأي غير موجود' })
    const row = db.prepare('SELECT * FROM reviews WHERE id = ?').get(Number(req.params.id))
    res.json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/reviews/:id
router.delete('/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM reviews WHERE id = ?').run(Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'الرأي غير موجود' })
    res.json({ success: true, message: 'تم حذف الرأي' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
