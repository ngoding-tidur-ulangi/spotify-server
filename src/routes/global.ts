import express from "express"
import getImage from "../controllers/global/getImage"
import getAudio from "../controllers/global/getAudio"

const globalRouter = express.Router()

globalRouter.get("/image/:filename", getImage)
globalRouter.get("/audio/:filename", getAudio)

export default globalRouter