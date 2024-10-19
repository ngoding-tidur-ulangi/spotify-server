import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    googleId: { type: String, required: true, unique: true },
    displayName: { type: String, required: true },
    email: { type: String, required: true },
    favorites: { type: Array, required: true },
    histories: { type: Array, required: true },
    createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('user', userSchema)

export default User