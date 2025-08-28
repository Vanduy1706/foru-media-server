import { commentModel } from "../../models/comment.model.js"

async function softDeleteOneComment(commentId, author) {
  try {
    const isAllowed = await commentModel.findOne({
      _id: commentId,
      author: author.sub,
    })

    if (!isAllowed) {
      const error = new Error("Not Allowed")
      error.status = 403
      throw error
    }

    const result = await commentModel
      .findByIdAndUpdate(
        commentId,
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

export { softDeleteOneComment }
