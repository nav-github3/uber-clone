import mongoose from 'mongoose';

const rideSchema = new mongoose.Schema({
  passenger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
  },
  status: {
    type: String,
    enum: ['requested', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'requested',
    required: true
  },
  pickupLocation: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  dropLocation: {
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    address: {
      type: String,
      required: true
    }
  },
  fare: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Ride = mongoose.model('Ride', rideSchema);

export default Ride;