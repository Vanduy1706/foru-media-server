import express from "express"
import { authHandler } from "../middlewares/auth/authHandler.js"
import {
  markupSpeechOrComment,
  allUserMarkUp,
  getMarkUp,
} from "../controllers/markupController.js"

const router = express.Router()

router.post("/", authHandler, markupSpeechOrComment)
router.get("/", authHandler, allUserMarkUp)
router.get("/:id", authHandler, getMarkUp)

export default router
