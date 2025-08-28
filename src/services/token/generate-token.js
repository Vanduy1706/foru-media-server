import jwt from "jsonwebtoken"
import { refreshModel } from "../../models/refreshToken.model.js"
import findUserById from "../user/find-user-byId.js"

export default async function generateToken(userId) {
  try {
    const user = await findUserById(userId)
    if (!user) {
      const error = new Error("User not found")
      error.status = 404
      throw error
    }

    const payload = {
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
    }

    const access_token = jwt.sign(payload, process.env.ACCESS_TOKEN, {
      algorithm: "HS256",
      subject: user._id.toString(),
      expiresIn: "1d",
    })

    const refresh_token = jwt.sign({}, process.env.REFRESH_TOKEN, {
      algorithm: "HS256",
      subject: user._id.toString(),
      expiresIn: "7d",
    })

    const newToken = new refreshModel({
      userId: user._id,
      refreshToken: refresh_token,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    await newToken.save()

    return { access_token, refresh_token }
  } catch (error) {
    throw error
  }
}
