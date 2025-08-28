import express from "express"
import { authHandler } from "../middlewares/auth/authHandler.js"
import {
  getAllNotifications,
  markupNotification,
} from "../controllers/notificationController.js"

const router = express.Router()

router.get("/", authHandler, getAllNotifications)
router.patch("/mark", authHandler, markupNotification)

export default router
