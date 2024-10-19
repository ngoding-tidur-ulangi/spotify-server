import express from "express"
import create from "../controllers/artist/create";
import upload from "../utils/multer";
import getById from "../controllers/artist/getById";
import getMany from "../controllers/artist/getMany";

const artistRouter = express.Router()

artistRouter.get("/get-by-id/:id", getById)
artistRouter.get("/", getMany)
artistRouter.post("/create", upload.single('image'), create)

export default artistRouter