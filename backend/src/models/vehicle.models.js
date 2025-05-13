import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  model: {
    type: String,
    required: true
  },
  numberPlate: {
    type: String,
    required: true,
    unique: true // Assuming each vehicle has a unique number plate
  },
  color: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1 // Minimum passenger capacity
  },
  vehicleType: {
    type: String,
    enum: ['sedan', 'suv', 'bike'],
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

export default Vehicle;