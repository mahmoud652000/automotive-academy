import mongoose from 'mongoose'

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  carModel: { type: String, default: '' },
  service: { type: String, default: '' },
  course: { type: String, default: '' },
  offer: { type: String, default: '' },
  type: { type: String, enum: ['service', 'course', 'offer'], default: 'service' },
  date: { type: String, default: '' },
  time: { type: String, default: '' },
  notes: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true })

export default mongoose.model('Booking', bookingSchema)
