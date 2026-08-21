import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleEn: { type: String, default: '' },
  description: { type: String, required: true },
  descriptionEn: { type: String, default: '' },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  category: { type: String, default: 'عام' },
}, { timestamps: true })

export default mongoose.model('Service', serviceSchema)
