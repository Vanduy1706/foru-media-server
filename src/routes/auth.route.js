import express from "express"
import {
  loginWithEmail,
  verifyEmail,
  registerUser,
  generateNewToken,
  logout,
} from "../controllers/authController.js"
import { loginHandler } from "../middlewares/auth/authHandler.js"

const router = express.Router()

router.post("/login", loginWithEmail)
router.post("/verify", verifyEmail)
router.post("/register", registerUser)
router.post("/refresh-token", generateNewToken)
router.post("/logout", logout)
router.get("/login", loginHandler)

export default router
