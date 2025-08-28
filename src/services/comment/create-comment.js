import { getIO } from "../../../socket.js"
import { commentModel } from "../../models/comment.model.js"
import { speechModel } from "../../models/speech.model.js"
import { createMessage } from "../notification/create-message.js"

async function createComment(content, author, parentSpeech, path) {
  try {
    const io = getIO()
    const newComment = new commentModel({
      content: content,
      author: author.sub,
      parentSpeech: parentSpeech,
      path: [...path, parentSpeech],
    })

    const [, speech] = await Promise.all([
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
    ])

    if (String(speech.author) !== String(author.sub)) {
      const notification = await createMessage({
        toAuthor: speech.author,
        fromAuthor: author.sub,
        targetType: "speech",
        notifyType: "speech",
        targetId: speech._id,
        message: `commented in your speech`,
      })

      io.to(String(notification.toAuthor._id)).emit(
        "notification",
        notification
      )
    }

    const updated = await commentModel
      .findOne({ _id: newComment._id })
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

export { createComment }
