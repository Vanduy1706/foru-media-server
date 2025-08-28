import { speechModel } from "../../models/speech.model.js"

async function updateOneSpeech(speechId, author, content) {
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

    const newSpeech = await speechModel
      .findByIdAndUpdate(
        speechId,
        {
          $set: {
            content: content,
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

    return newSpeech
  } catch (error) {
    throw error
  }
}

export { updateOneSpeech }
