import { userModel } from "../../models/user.model.js"

async function updateUser({ userId, username, nickname }) {
  try {
    const user = await userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: username,
          nickname: nickname,
          createdAt: Date.now(),
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!user) {
      const error = new Error("User not found")
      error.status = 404
      throw error
    }

    return user
  } catch (error) {
    throw new Error(error.message)
  }
}

export { updateUser }
