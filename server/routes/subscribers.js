import express from 'express'
import crypto from 'crypto'
import db, { formatRow, formatRows } from '../db.js'
import { sendConfirmationEmail } from '../services/email.js'

const router = express.Router()
const table = 'subscribers'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// POST /api/subscribers — subscribe
router.post('/', async (req, res) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase()

    if (!email || !EMAIL_RE.test(email)) {
      return res.status(400).json({ success: false, message: 'بريد إلكتروني غير صالح' })
    }

    // Check if already exists
    const existing = db.prepare('SELECT * FROM subscribers WHERE email = ?').get(email)

    if (existing) {
      if (existing.status === 'confirmed') {
        return res.status(200).json({ success: true, message: 'أنت مشترك بالفعل في النشرة البريدية', alreadySubscribed: true })
      }
      if (existing.status === 'pending') {
        // Resend confirmation email
        const token = crypto.randomUUID()
        db.prepare("UPDATE subscribers SET token = ?, updated_at = datetime('now') WHERE id = ?").run(token, existing.id)
        try {
          await sendConfirmationEmail(email, token)
        } catch (e) {
          console.error('[subscribers] Confirmation email failed:', e.message)
        }
        return res.status(200).json({ success: true, message: 'تم إرسال إيميل التأكيد مرة أخرى، تحقق من بريدك' })
      }
      // Was unsubscribed — reactivate
      const token = crypto.randomUUID()
      db.prepare("UPDATE subscribers SET status = 'pending', token = ?, updated_at = datetime('now') WHERE id = ?").run(token, existing.id)
      try {
        await sendConfirmationEmail(email, token)
      } catch (e) {
        console.error('[subscribers] Confirmation email failed:', e.message)
      }
      return res.status(201).json({ success: true, message: 'تم تسجيلك مرة أخرى، تحقق من بريدك لتأكيد الاشتراك' })
    }

    // New subscriber
    const token = crypto.randomUUID()
    db.prepare('INSERT INTO subscribers (email, status, token) VALUES (?, ?, ?)').run(email, 'pending', token)

    try {
      await sendConfirmationEmail(email, token)
    } catch (e) {
      console.error('[subscribers] Confirmation email failed:', e.message)
    }

    res.status(201).json({ success: true, message: 'تم تسجيل اشتراكك، تحقق من بريدك الإلكتروني لتأكيد الاشتراك' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/subscribers/confirm/:token — confirm subscription
router.get('/confirm/:token', (req, res) => {
  try {
    const { token } = req.params
    const sub = db.prepare('SELECT * FROM subscribers WHERE token = ?').get(token)

    if (!sub) {
      return res.status(404).json({ success: false, message: 'رابط التأكيد غير صالح أو منتهي الصلاحية' })
    }

    if (sub.status === 'confirmed') {
      return res.json({ success: true, message: 'تم تأكيد اشتراكك مسبقاً', alreadyConfirmed: true })
    }

    db.prepare("UPDATE subscribers SET status = 'confirmed', updated_at = datetime('now') WHERE id = ?").run(sub.id)
    res.json({ success: true, message: 'تم تأكيد اشتراكك في النشرة البريدية بنجاح!' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/subscribers/unsubscribe/:token — unsubscribe
router.get('/unsubscribe/:token', (req, res) => {
  try {
    const { token } = req.params
    const sub = db.prepare('SELECT * FROM subscribers WHERE token = ?').get(token)

    if (!sub) {
      return res.status(404).json({ success: false, message: 'رابط إلغاء الاشتراك غير صالح' })
    }

    if (sub.status === 'unsubscribed') {
      return res.json({ success: true, message: 'تم إلغاء اشتراكك مسبقاً', alreadyUnsubscribed: true })
    }

    db.prepare("UPDATE subscribers SET status = 'unsubscribed', updated_at = datetime('now') WHERE id = ?").run(sub.id)
    res.json({ success: true, message: 'تم إلغاء اشتراكك في النشرة البريدية بنجاح' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// GET /api/subscribers — list all (for dashboard)
router.get('/', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM subscribers ORDER BY created_at DESC').all()
    const data = rows.map(r => {
      const formatted = formatRow(r, table)
      return formatted
    })
    res.json({ success: true, count: rows.length, data })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

// DELETE /api/subscribers/:id — delete subscriber (for dashboard)
router.delete('/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM subscribers WHERE id = ?').run(Number(req.params.id))
    if (info.changes === 0) return res.status(404).json({ success: false, message: 'المشترك غير موجود' })
    res.json({ success: true, message: 'تم حذف المشترك' })
  } catch (error) {
    res.status(500).json({ success: false, message: error.message })
  }
})

export default router
