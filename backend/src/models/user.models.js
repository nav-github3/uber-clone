import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    avatar: {
        type: String, // URL to the profile picture
    },
    role: {
        type: String,
        enum: ['passenger', 'driver'],
        default: 'passenger'
    },
    currentLocation: {
        lat: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    },
    isAvailable: {
        type: Boolean,
        default: false, // Only applicable for drivers
    },
    vehicleDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    }
}, { timestamps: true });

export const User = mongoose.model("User", UserSchema); 


