import express from "express"
import { voteSpeechOrComment, getVote } from "../controllers/voteController.js"
import { authHandler } from "../middlewares/auth/authHandler.js"

const router = express.Router()

router.post("/", authHandler, voteSpeechOrComment)
router.get("/:id", authHandler, getVote)

export default router
