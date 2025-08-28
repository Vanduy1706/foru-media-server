import { commentModel } from "../../models/comment.model.js"

async function getCommentById(commentId) {
  try {
    const comment = await commentModel
      .findOne({ _id: commentId })
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

export { getCommentById }
