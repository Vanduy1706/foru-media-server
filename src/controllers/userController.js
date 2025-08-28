import { set } from "../services/cache/cache.memory.js"
import findUserWithEmail from "../services/user/find-user.js"
import { updateUser } from "../services/user/update-user.js"

async function getProfileUser(req, res, next) {
  try {
    const userProfile = await findUserWithEmail(req.user.email)
    if (!userProfile) {
      const error = new Error("User not found")
      error.status = 404
      throw error
    }

    return res.status(200).json(userProfile)
  } catch (error) {
    next(error)
  }
}

async function updateProfile(req, res, next) {
  try {
    const userId = req.params.id
    const username = req.body.username
    const nickname = req.body.nickname
    const author = req.user

    if (userId !== author.sub) {
      const error = new Error("Not Allowed")
      error.status = 403
      throw error
    }

    if (!username && username.length === 0 && typeof username !== "string") {
      const error = new Error("Username invalid")
      error.status = 400
      throw error
    }

    if (!nickname && nickname.length === 0 && typeof nickname !== "string") {
      const error = new Error("Nickname invalid")
      error.status = 400
      throw error
    }

    const updated = await updateUser({ userId, username, nickname, author })

    res.status(200).json(updated)
  } catch (error) {
    next(error)
  }
}

export { getProfileUser, updateProfile }
