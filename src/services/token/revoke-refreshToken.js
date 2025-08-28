import { refreshModel } from "../../models/refreshToken.model.js"

async function revokeRefreshToken(userId) {
  try {
    await refreshModel.findOneAndDelete({ userId: userId })

    return { status: 200, message: "Refresh token has been revoked" }
  } catch (error) {
    throw error
  }
}

export default revokeRefreshToken
