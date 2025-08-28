import { speechModel } from "../../models/speech.model.js"
async function getAllSpeechesWithAuthor({ limit, lastCreatedAt }) {
  try {
    let query = { isSoftDeleted: { $ne: "true" } }

    if (lastCreatedAt) {
      const newCreatedAt = new Date(lastCreatedAt)
      query.createdAt = { $lt: newCreatedAt }
    }

    const speeches = await speechModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: "author",
        select: ["username", "nickname"],
      })
      .exec()

    return speeches
  } catch (error) {
    throw error
  }
}

async function getAllSpeechIdsWithAuthor() {
  try {
    const speechIds = await speechModel
      .find({ isSoftDeleted: { $ne: "true" } })
      .select("_id")
      .exec()

    return speechIds
  } catch (error) {
    throw error
  }
}
export { getAllSpeechesWithAuthor, getAllSpeechIdsWithAuthor }
