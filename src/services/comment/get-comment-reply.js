import { commentModel } from "../../models/comment.model.js"

async function getCommentReply(parentSpeech, commentId) {
  try {
    const currentComment = await commentModel.findById(commentId)
    const currentPath = currentComment.path

    const reply = await commentModel
      .find({
        parentSpeech: parentSpeech,
        path: [...currentPath, commentId],
        isSoftDeleted: false,
      })
      .populate({
        path: "author",
        select: ["username", "nickname"],
      })
      .exec()

    // const nestedReply = await Promise.all(
    //   currentPath.slice(1).map(async (id) => {
    //     return await commentModel
    //       .findOne({ _id: id })
    //       .populate({
    //         path: "author",
    //         select: ["username", "nickname"],
    //       })
    //       .exec()
    //   })
    // )
    // return { reply, nestedReply }
    return reply
  } catch (error) {
    throw error
  }
}

export { getCommentReply }
