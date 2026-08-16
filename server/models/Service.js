import mongoose from 'mongoose'

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, default: '' },
  image: { type: String, default: '' },
  category: { type: String, default: 'عام' },
}, { timestamps: true })

export default mongoose.model('Service', serviceSchema)
