import mongoose from 'mongoose'

const gallerySchema = new mongoose.Schema({
  type: { type: String, enum: ['photo', 'video'], required: true },
  title: { type: String, required: true },
  titleEn: { type: String, default: '' },
  category: { type: String, default: 'صيانة' },
  categoryEn: { type: String, default: 'Maintenance' },
  // For photos
  beforeImage: { type: String, default: '' },
  afterImage: { type: String, default: '' },
  // For videos
  videoUrl: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Gallery', gallerySchema)
