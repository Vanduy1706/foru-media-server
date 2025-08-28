import { speechModel } from "../../models/speech.model.js"

async function getSpeechWithInput(searchInput) {
  try {
    let speeches = await speechModel
      .find()
      .sort({ createdAt: -1 })
      .lean()
      .populate({
        path: "author",
        select: ["username", "nickname"],
      })

    speeches = speeches.filter(
      (speech) =>
        speech.author.nickname
          .toLowerCase()
          .includes(searchInput.toLowerCase()) ||
        speech.content.toLowerCase().includes(searchInput.toLowerCase())
    )

    return speeches
  } catch (error) {
    throw error
  }
}

export { getSpeechWithInput }
