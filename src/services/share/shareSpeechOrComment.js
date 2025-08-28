import { getIO } from "../../../socket.js"
import { commentModel } from "../../models/comment.model.js"
import { shareModel } from "../../models/share.model.js"
import { speechModel } from "../../models/speech.model.js"
import { createMessage } from "../notification/create-message.js"
import { deleteMessage } from "../notification/delete-message.js"

async function shareTarget(targetType, targetId, author) {
  try {
    const io = getIO()
    const targetModel = targetType === "speech" ? speechModel : commentModel
    const isTargetExist = await targetModel.findById(targetId)

    if (!isTargetExist) {
      const error = new Error(`${targetType} not found`)
      error.status = 404
      throw error
    }

    const existingShare = await shareModel.findOne({
      author: author.sub,
      targetId: targetId,
      targetType: targetType,
    })

    if (existingShare) {
      const [, updated] = await Promise.all([
        shareModel.deleteOne({ _id: existingShare._id }),
        targetModel
          .findByIdAndUpdate(
            targetId,
            {
              $inc: {
                shareCount: -1,
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
          .exec(),
      ])

      if (String(updated.author._id) !== String(author.sub)) {
        await deleteMessage({
          toAuthor: updated.author._id,
          fromAuthor: author.sub,
          targetType: targetType,
          notifyType: "share",
          targetId: targetId,
        })
      }
      return { share: updated, isShared: null }
    } else {
      const [newShare, updated] = await Promise.all([
        shareModel.create({
          author: author.sub,
          targetId: targetId,
          targetType: targetType,
        }),
        targetModel
          .findByIdAndUpdate(
            targetId,
            {
              $inc: {
                shareCount: 1,
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
          .exec(),
      ])

      if (String(updated.author._id) !== String(author.sub)) {
        const notification = await createMessage({
          toAuthor: updated.author._id,
          fromAuthor: author.sub,
          targetType: targetType,
          notifyType: "share",
          targetId: targetId,
          message: `${
            targetType === "speech"
              ? "shared your speech"
              : "shared your comment"
          }`,
        })

        io.to(String(notification.toAuthor._id)).emit(
          "notification",
          notification
        )
      }
      return { share: updated, isShared: newShare }
    }
  } catch (error) {
    throw error
  }
}

export { shareTarget }
