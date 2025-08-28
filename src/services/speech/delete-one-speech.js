import { speechModel } from "../../models/speech.model.js"

async function softDeleteOneSpeech(speechId, author) {
  try {
    const isAllowed = await speechModel.findOne({
      _id: speechId,
      author: author.sub,
    })

    if (!isAllowed) {
      const error = new Error("Not Allowed")
      error.status = 403
      throw error
    }

    const result = await speechModel
      .findByIdAndUpdate(
        speechId,
        {
          $set: {
            isSoftDeleted: true,
            createdAt: Date.now(),
          },
        },
        {
          new: true,
          runValidators: true,
        }
      )
      .populate({
        path: "author",
        select: ["username", "nickname"],
      })
      .exec()

    return result
  } catch (error) {
    throw error
  }
}

export { softDeleteOneSpeech }
