import { speechModel } from "../../models/speech.model.js"

async function getOneSpeech(speechId) {
  try {
    const speech = speechModel
      .findOne({ _id: speechId })
      .populate({
        path: "author",
        select: ["username", "nickname"],
      })
      .exec()

    return speech
  } catch (error) {
    throw error
  }
}

export { getOneSpeech }
