import express from 'express'
import db, { formatRow, formatRows, prepareBody, buildInsert, buildUpdate } from '../db.js'

const router = express.Router()
const table = 'bookings'

// POST /api/bookings
router.post('/', (req, res) => {
  try {
    const data = prepareBody(req.body, table)
    const { sql, values } = buildInsert(table, data)
    const info = db.prepare(sql).run(...values)
    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(info.lastInsertRowid)
    res.status(201).json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/bookings
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all()
    res.json({ success: true, count: rows.length, data: formatRows(rows, table) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/bookings/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(Number(req.params.id))
    if (!row) return res.status(404).json({ success: false, message: 'الحجز غير موجود' })
    res.json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/bookings/:id — update status
router.patch('/:id', (req, res) => {
  try {
    const info = db.prepare("UPDATE bookings SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .run(req.body.status, Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'الحجز غير موجود' })
    const row = db.prepare('SELECT * FROM bookings WHERE id = ?').get(Number(req.params.id))
    res.json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/bookings/:id
router.delete('/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM bookings WHERE id = ?').run(Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'الحجز غير موجود' })
    res.json({ success: true, message: 'تم حذف الحجز' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
