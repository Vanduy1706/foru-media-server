import { getIO } from "../../../socket.js"
import { commentModel } from "../../models/comment.model.js"
import { speechModel } from "../../models/speech.model.js"
import { voteModel } from "../../models/vote.model.js"
import { notificationModel } from "../../models/notification.model.js"
import { createMessage } from "../notification/create-message.js"
import { deleteMessage } from "../notification/delete-message.js"

async function voteTarget(targetType, targetId, author) {
  try {
    const io = getIO()
    const targetModel = targetType === "speech" ? speechModel : commentModel
    const isTargetExist = await targetModel.findById(targetId)

    if (!isTargetExist) {
      const error = new Error(`${targetType} not found`)
      error.status = 404
      throw error
    }

    const existingVote = await voteModel.findOne({
      author: author.sub,
      targetId: targetId,
      targetType: targetType,
    })

    if (existingVote) {
      const [deleteVote, updated] = await Promise.all([
        voteModel.deleteOne({ _id: existingVote._id }),
        targetModel
          .findByIdAndUpdate(
            targetId,
            {
              $inc: {
                voteCount: -1,
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
          notifyType: "vote",
          targetId: targetId,
        })
      }

      return { vote: updated, isVoted: null }
    } else {
      const [newVote, updated] = await Promise.all([
        voteModel.create({
          author: author.sub,
          targetId: targetId,
          targetType: targetType,
        }),
        targetModel
          .findByIdAndUpdate(
            targetId,
            {
              $inc: {
                voteCount: 1,
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
          notifyType: "vote",
          targetId: targetId,
          message: `${
            targetType === "speech" ? "voted your speech" : "voted your comment"
          }`,
        })

        io.to(String(notification.toAuthor._id)).emit(
          "notification",
          notification
        )
      }

      return { vote: updated, isVoted: newVote }
    }
  } catch (error) {
    throw error
  }
}

export { voteTarget }
