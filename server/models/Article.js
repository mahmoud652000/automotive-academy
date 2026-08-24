import mongoose from 'mongoose'

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, default: '' },
  content: { type: String, required: true },
  image: { type: String, default: '' },
  category: { type: String, default: 'صيانة' },
  tags: { type: [String], default: [] },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Article', articleSchema)
