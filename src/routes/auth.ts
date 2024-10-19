import express from "express"
import logout from "../controllers/auth/logout";
import getUserData from "../controllers/auth/getUserData";
import updateUserHistories from "../controllers/auth/updateUserHistories";
import updateUserFavorites from "../controllers/auth/updateUserFavorites";

const authRouter = express.Router()

authRouter.get("/logout", logout)
authRouter.get("/user-data", getUserData)
authRouter.put("/update-history", updateUserHistories)
authRouter.put("/update-favorite", updateUserFavorites)

export default authRouter