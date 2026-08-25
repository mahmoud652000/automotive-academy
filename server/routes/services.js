import express from 'express'
import db, { formatRow, formatRows, prepareBody, buildInsert, buildUpdate } from '../db.js'

const router = express.Router()
const table = 'services'

// GET /api/services
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM services ORDER BY created_at DESC').all()
    res.json({ success: true, count: rows.length, data: formatRows(rows, table) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/services
router.post('/', (req, res) => {
  try {
    const data = prepareBody(req.body, table)
    const { sql, values } = buildInsert(table, data)
    const info = db.prepare(sql).run(...values)
    const row = db.prepare('SELECT * FROM services WHERE id = ?').get(info.lastInsertRowid)
    res.status(201).json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/services/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM services WHERE id = ?').get(Number(req.params.id))
    if (!row) return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' })
    res.json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PUT /api/services/:id
router.put('/:id', (req, res) => {
  try {
    const data = prepareBody(req.body, table)
    const { sql, values } = buildUpdate(table, data)
    const info = db.prepare(sql).run(...values, Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' })
    const row = db.prepare('SELECT * FROM services WHERE id = ?').get(Number(req.params.id))
    res.json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/services/:id
router.delete('/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM services WHERE id = ?').run(Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'الخدمة غير موجودة' })
    res.json({ success: true, message: 'تم حذف الخدمة' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
