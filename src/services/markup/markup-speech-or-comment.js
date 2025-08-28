import { commentModel } from "../../models/comment.model.js"
import { speechModel } from "../../models/speech.model.js"
import { markUpModel } from "../../models/markup.model.js"

async function markUpTarget(targetType, targetId, author) {
  try {
    const targetModel = targetType === "speech" ? speechModel : commentModel
    const isTargetExist = await targetModel.findById(targetId)

    if (!isTargetExist) {
      const error = new Error(`${targetType} not found`)
      error.status = 404
      throw error
    }

    const existingMarkUp = await markUpModel.findOne({
      author: author.sub,
      targetId: targetId,
      targetType: targetType,
    })

    if (existingMarkUp) {
      await markUpModel.deleteOne({ _id: existingMarkUp._id })

      const markup = await markUpModel.findOne({ _id: existingMarkUp._id })
      return markup
    } else {
      const markup = await markUpModel.create({
        author: author.sub,
        targetId: targetId,
        targetType: targetType,
      })
      return markup
    }
  } catch (error) {
    throw error
  }
}

export { markUpTarget }
