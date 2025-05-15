import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
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

// Middleware to update the updatedAt field before saving
UserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});




UserSchema.pre("save", async function (next) {
  if(!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10)
  next()
})

UserSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password, this.password)
}




// Method to generate access token
UserSchema.methods.generateAccessToken = function() {
  const accessToken = jwt.sign({ _id: this._id, fullName: this.fullName , email : this.email }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRE // Token expiration time
  });
  return accessToken;
};

// Method to generate refresh token
UserSchema.methods.generateRefreshToken = function() {
  const refreshToken = jwt.sign({ _id: this._id, fullName: this.fullName }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_SECRET_EXPIRE // Token expiration time
  });
  return refreshToken;
};





export const User = mongoose.model("User", UserSchema); 


