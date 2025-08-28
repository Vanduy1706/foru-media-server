import { commentModel } from "../../models/comment.model.js"

async function updateCommentWithAuthor(content, commentId, author) {
  try {
    const isUserAllowed = await commentModel.findOne({
      _id: commentId,
      author: author.sub,
    })

    if (!isUserAllowed) {
      const error = new Error("Not Allowed")
      error.status = 403
      throw error
    }

    const updated = await commentModel
      .findByIdAndUpdate(
        commentId,
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

    return updated
  } catch (error) {
    throw error
  }
}

export { updateCommentWithAuthor }
