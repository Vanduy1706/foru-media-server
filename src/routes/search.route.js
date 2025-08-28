import express from "express"
import { authHandler } from "../middlewares/auth/authHandler.js"
import { searchSpeech } from "../controllers/searchController.js"

const router = express.Router()
router.get("/", authHandler, searchSpeech)

export default router
