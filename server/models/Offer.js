import mongoose from 'mongoose'

const offerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  discount: { type: Number, required: true },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Offer', offerSchema)
