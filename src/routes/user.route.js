import express from "express"
import { getProfileUser, updateProfile } from "../controllers/userController.js"
import { authHandler } from "../middlewares/auth/authHandler.js"
import { cacheProfileUser } from "../middlewares/user/cacheProfileUser.js"

const router = express.Router()

router.get("/profile", authHandler, getProfileUser)
router.patch("/profile/:id", authHandler, updateProfile)

export default router
