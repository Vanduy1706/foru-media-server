import express from "express"
import {
  createSpeech,
  getAllSpeeches,
  getSpeechDetail,
  updateSpeech,
  softDeleteSpeech,
  getAllSpeechIds,
  getAllForum,
  getTrendingSpeeches,
} from "../controllers/speechController.js"
import { authHandler } from "../middlewares/auth/authHandler.js"

const router = express.Router()

router.post("/", authHandler, createSpeech)
router.get("/", authHandler, getAllSpeeches)
router.get("/forum", authHandler, getAllForum)
router.get("/trending", authHandler, getTrendingSpeeches)
router.get("/:id", authHandler, getSpeechDetail)
router.patch("/:id", authHandler, updateSpeech)
router.patch("/delete/:id", authHandler, softDeleteSpeech)
router.get("/all/id", authHandler, getAllSpeechIds)

export default router
