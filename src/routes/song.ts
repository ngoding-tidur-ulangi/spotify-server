import express from "express"
import upload from "../utils/multer";
import create from "../controllers/song/create";
import getMany from "../controllers/song/getMany";
import getByArtist from "../controllers/song/getByArtist";
import getRelatedSongs from "../controllers/song/getRelatedSongs";
import getRelatedSongsFromQueue from "../controllers/song/getRelatedSongsFromQueue";
import getByTitle from "../controllers/song/getByTitle";

const songRouter = express.Router()

songRouter.get("/", getMany)
songRouter.get("/related-song", getRelatedSongs)
songRouter.get("/title/:title", getByTitle)
songRouter.get("/:artistId", getByArtist)
songRouter.post("/create", upload.fields([{ name: 'image' }, { name: 'audio' }]), create)
songRouter.post("/related-song-from-queue", getRelatedSongsFromQueue)

export default songRouter