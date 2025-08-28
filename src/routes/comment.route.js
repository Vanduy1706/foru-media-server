import express from "express"
import {
  createCommentOnSpeech,
  getCommentOnSpeech,
  getDetailComment,
  getReplyOnComment,
  updateComment,
  softDeleteComment,
} from "../controllers/commentController.js"
import { authHandler } from "../middlewares/auth/authHandler.js"

const router = express.Router()

router.post("/", authHandler, createCommentOnSpeech)
router.get("/speech/:id", authHandler, getCommentOnSpeech)
router.get("/:id", authHandler, getDetailComment)
router.get("/:commentId/speech/:speechId", authHandler, getReplyOnComment)
router.patch("/:id", authHandler, updateComment)
router.patch("/delete/:id", authHandler, softDeleteComment)

export default router
