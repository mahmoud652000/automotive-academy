import express from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsDir = path.join(__dirname, '..', 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname) || (file.mimetype.startsWith('image') ? '.jpg' : file.mimetype.startsWith('video') ? '.mp4' : '')
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`
    cb(null, name)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('نوع الملف غير مدعوم — يُسمح بالصور والفيديوهات فقط'))
    }
  },
})

const router = express.Router()

// POST /api/upload — single file
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'لم يتم رفع أي ملف' })
  const url = `/uploads/${req.file.filename}`
  res.status(201).json({ success: true, data: { url, filename: req.file.filename } })
})

export default router
