import { getIO } from "../../../socket.js"
import { commentModel } from "../../models/comment.model.js"
import { speechModel } from "../../models/speech.model.js"
import { createMessage } from "../notification/create-message.js"

async function createReplyOnComment(
  commentId,
  content,
  author,
  parentSpeech,
  path
) {
  try {
    const io = getIO()
    const newComment = new commentModel({
      content: content,
      author: author.sub,
      parentSpeech: parentSpeech,
      path: [...path, commentId],
    })

    const [, speech, comment] = await Promise.all([
      newComment.save(),
      speechModel
        .findByIdAndUpdate(
          parentSpeech,
          {
            $inc: {
              commentCount: 1,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        )
        .exec(),
      commentModel
        .findByIdAndUpdate(
          commentId,
          {
            $inc: {
              commentCount: 1,
            },
          },
          {
            new: true,
            runValidators: true,
          }
        )
        .exec(),
      Promise.all(
        path.slice(1).map(async (id) => {
          return await commentModel.findByIdAndUpdate(
            id,
            {
              $inc: {
                commentCount: 1,
              },
            },
            {
              runValidators: true,
            }
          )
        })
      ),
    ])

    if (String(speech.author) !== String(author.sub)) {
      const notification = await createMessage({
        toAuthor: speech.author,
        fromAuthor: author.sub,
        targetType: "speech",
        notifyType: "speech",
        targetId: speech._id,
        message: `replied in your speech`,
      })

      io.to(String(notification.toAuthor._id)).emit(
        "notification",
        notification
      )
    }

    if (String(comment.author) !== String(author.sub)) {
      const notification = await createMessage({
        toAuthor: comment.author,
        fromAuthor: author.sub,
        targetType: "comment",
        notifyType: "comment",
        targetId: comment._id,
        message: `replied in your comment`,
      })

      io.to(String(notification.toAuthor._id)).emit(
        "notification",
        notification
      )
    }

    const reply = await commentModel
      .findOne({ _id: newComment._id })
      .populate({
        path: "author",
        select: ["username", "nickname"],
      })
      .exec()

    return reply
  } catch (error) {
    throw error
  }
}

export { createReplyOnComment }
