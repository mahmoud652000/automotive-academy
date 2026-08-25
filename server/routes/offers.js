import express from 'express'
import db, { formatRow, formatRows, prepareBody, buildInsert, buildUpdate } from '../db.js'
import { sendNewsletterEmail } from '../services/email.js'

const router = express.Router()
const table = 'offers'

// GET /api/offers
router.get('/', (req, res) => {
  try {
    const { active } = req.query
    const rows = active === 'true'
      ? db.prepare('SELECT * FROM offers WHERE active = 1 ORDER BY created_at DESC').all()
      : db.prepare('SELECT * FROM offers ORDER BY created_at DESC').all()
    res.json({ success: true, count: rows.length, data: formatRows(rows, table) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// POST /api/offers
router.post('/', (req, res) => {
  try {
    const data = prepareBody(req.body, table)
    const { sql, values } = buildInsert(table, data)
    const info = db.prepare(sql).run(...values)
    const row = db.prepare('SELECT * FROM offers WHERE id = ?').get(info.lastInsertRowid)
    const formatted = formatRow(row, table)

    // Send newsletter to confirmed subscribers (non-blocking)
    const confirmedSubs = db.prepare("SELECT email, token FROM subscribers WHERE status = 'confirmed'").all()
    if (confirmedSubs.length > 0) {
      sendNewsletterEmail(confirmedSubs, 'offer', formatted).catch(e => console.error('[offers] Newsletter send failed:', e.message))
    }

    res.status(201).json({ success: true, data: formatted })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// GET /api/offers/:id
router.get('/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM offers WHERE id = ?').get(Number(req.params.id))
    if (!row) return res.status(404).json({ success: false, message: 'العرض غير موجود' })
    res.json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PUT /api/offers/:id
router.put('/:id', (req, res) => {
  try {
    const data = prepareBody(req.body, table)
    const { sql, values } = buildUpdate(table, data)
    const info = db.prepare(sql).run(...values, Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'العرض غير موجود' })
    const row = db.prepare('SELECT * FROM offers WHERE id = ?').get(Number(req.params.id))
    res.json({ success: true, data: formatRow(row, table) })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

// DELETE /api/offers/:id
router.delete('/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM offers WHERE id = ?').run(Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'العرض غير موجود' })
    res.json({ success: true, message: 'تم حذف العرض' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
