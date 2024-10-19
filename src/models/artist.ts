import mongoose from "mongoose";

const artistSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true},
    createdAt: { type: Date, default: Date.now }
})

const Artist = mongoose.model('artist', artistSchema)

export default Artist