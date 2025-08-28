import { commentModel } from "../../models/comment.model.js"

async function getReplyNested(commentId) {
  try {
    const comment = await commentModel.findOne({ _id: commentId })
    if (!comment) {
      const error = new Error("Not found")
      error.status = 404
      throw error
    }

    const currentPath = comment.path

    const nestedReply = await Promise.all(
      currentPath.slice(1).map(async (id) => {
        return await commentModel
          .findOne({ _id: id, isSoftDeleted: false })
          .populate({
            path: "author",
            select: ["username", "nickname"],
          })
          .exec()
      })
    )

    return nestedReply
  } catch (error) {
    error.status = 500
    throw error
  }
}

export { getReplyNested }
