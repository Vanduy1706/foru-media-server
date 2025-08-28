import express from "express"
import { authHandler } from "../middlewares/auth/authHandler.js"
import {
  shareSpeechOrComment,
  getShare,
  getAllShares,
} from "../controllers/shareController.js"

const router = express.Router()

router.post("/", authHandler, shareSpeechOrComment)
router.get("/:id", authHandler, getShare)
router.get("/", authHandler, getAllShares)

export default router
