import mongoose from "mongoose"
import { speechModel } from "../../models/speech.model.js"
import { getIO } from "../../../socket.js"

async function createSpeechWithAuthor(content, author) {
  try {
    const speech = new speechModel({
      content: content,
      author: new mongoose.Types.ObjectId(String(author.sub)),
    })

    await speech.save()

    const speechDetail = await speechModel
      .findOne({ _id: speech._id })
      .populate({
        path: "author",
        select: ["username", "nickname"],
      })

    return speechDetail
  } catch (error) {
    throw error
  }
}

export { createSpeechWithAuthor }
