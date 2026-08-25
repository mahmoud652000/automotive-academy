import express from 'express'
import db from '../db.js'

const router = express.Router()

// GET /api/settings — returns all settings as a flat object
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT key, value FROM settings').all()
    const settings = {}
    for (const row of rows) {
      settings[row.key] = row.value
    }
    res.json({ success: true, data: settings })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// PUT /api/settings — accepts a flat object, upserts each key
router.put('/', (req, res) => {
  try {
    const data = req.body || {}
    const upsert = db.prepare(
      'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value'
    )
    const tx = db.transaction((entries) => {
      for (const [key, value] of entries) {
        upsert.run(key, String(value ?? ''))
      }
    })
    tx(Object.entries(data))
    res.json({ success: true, message: 'تم حفظ الإعدادات بنجاح' })
  } catch (error) {
    res.status(400).json({ success: false, message: error.message })
  }
})

export default router
