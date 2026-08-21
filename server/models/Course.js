import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleEn: { type: String, default: '' },
  desc: { type: String, required: true },
  descEn: { type: String, default: '' },
  duration: { type: String, required: true },
  durationEn: { type: String, default: '' },
  image: { type: String, default: '/course-2.png' },
}, { timestamps: true })

export default mongoose.model('Course', courseSchema)
