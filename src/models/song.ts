import mongoose from "mongoose";

const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artists: { type: [String], required: true },
    genres: { type: [String], required: true},
    image: { type: String, required: true},
    audio: { type: String, required: true},
    createdAt: { type: Date, default: Date.now }
})

const Song = mongoose.model('song', songSchema)

export default Song