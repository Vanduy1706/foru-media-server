import { commentModel } from "../../models/comment.model.js"

async function getComment(parentSpeech) {
  try {
    const comment = await commentModel
      .find({
        parentSpeech: parentSpeech,
        path: [parentSpeech],
        isSoftDeleted: false,
      })
      .populate({
        path: "author",
        select: ["username", "nickname"],
      })
      .exec()

    return comment
  } catch (error) {
    throw error
  }
}

export { getComment }
