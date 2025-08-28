import { commentModel } from "../../models/comment.model.js"
import { markUpModel } from "../../models/markup.model.js"
import { speechModel } from "../../models/speech.model.js"

async function getAllMarkUp(author) {
  try {
    const allMarkups = await markUpModel.find({ author: author.sub })

    if (allMarkups.length === 0) {
      throw new Error("Not found")
    }

    allMarkups.sort((a, b) => {
      const firstBookmark = new Date(a.createdAt)
      const secondBookmark = new Date(b.createdAt)

      if (firstBookmark < secondBookmark) {
        return 1
      }

      if (firstBookmark > secondBookmark) {
        return -1
      }

      return 0
    })

    const allMarkUpDetail = await Promise.all(
      allMarkups.map(async (markup) => {
        if (markup.targetType === "speech") {
          const speech = await speechModel.findOne({ _id: markup.targetId })
          if (speech && !speech.isSoftDeleted) {
            return markup
          }
        }

        if (markup.targetType === "comment") {
          const comment = await commentModel.findOne({ _id: markup.targetId })
          if (comment && !comment.isSoftDeleted) {
            return markup
          }
        }

        return null
      })
    )

    return allMarkUpDetail.filter(Boolean)
  } catch (error) {
    throw error
  }
}

export { getAllMarkUp }
