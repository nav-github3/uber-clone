import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  ride: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
    required: true
  },
  method: {
    type: String,
    enum: ['cash', 'card', 'wallet'],
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;