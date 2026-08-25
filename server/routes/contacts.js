import express from 'express'
import db, { formatRow, formatRows, prepareBody, buildInsert, buildUpdate } from '../db.js'

const router = express.Router()
const table = 'contacts'

// POST /api/contacts
router.post('/', (req, res) => {
  try {
    const data = prepareBody(req.body, table)
    const { sql, values } = buildInsert(table, data)
    const info = db.prepare(sql).run(...values)
    const row = db.prepare('SELECT * FROM contacts WHERE id = ?').get(info.lastInsertRowid)
    res.status(201).json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/contacts
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all()
    res.json({ success: true, count: rows.length, data: formatRows(rows, table) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PATCH /api/contacts/:id — update status
router.patch('/:id', (req, res) => {
  try {
    const info = db.prepare("UPDATE contacts SET status = ?, updated_at = datetime('now') WHERE id = ?")
      .run(req.body.status, Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' })
    const row = db.prepare('SELECT * FROM contacts WHERE id = ?').get(Number(req.params.id))
    res.json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/contacts/:id
router.delete('/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM contacts WHERE id = ?').run(Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'الرسالة غير موجودة' })
    res.json({ success: true, message: 'تم حذف الرسالة' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
