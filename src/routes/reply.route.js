import express from "express"
import {
  createReply,
  getReplyCommentNested,
} from "../controllers/commentController.js"
import { authHandler } from "../middlewares/auth/authHandler.js"

const router = express.Router()

router.post("/", authHandler, createReply)
router.get("/:id", authHandler, getReplyCommentNested)

export default router
