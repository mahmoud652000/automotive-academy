import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleEn: { type: String, default: '' },
  description: { type: String, required: true },
  descriptionEn: { type: String, default: '' },
  oldPrice: { type: Number, default: 0 },
  newPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true },
  categoryEn: { type: String, default: '' },
  image: { type: String, default: '' },
  icon: { type: String, default: 'Tag' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Offer', offerSchema)
