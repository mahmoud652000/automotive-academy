import mongoose from 'mongoose'

const eventSchema = new mongoose.Schema({
  type: { type: String, enum: ['post', 'offer'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: '' },
  discount: { type: Number, default: 0 },
  oldPrice: { type: Number, default: 0 },
  newPrice: { type: Number, default: 0 },
  expiryDate: { type: String, default: '' },
  active: { type: Boolean, default: true },
}, { timestamps: true })

export default mongoose.model('Event', eventSchema)
