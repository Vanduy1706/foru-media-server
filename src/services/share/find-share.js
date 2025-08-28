import { shareModel } from "../../models/share.model.js"

async function findShare({ author, targetId }) {
  try {
    const existingShare = await shareModel.findOne({
      author: author.sub,
      targetId: targetId,
    })

    return existingShare
  } catch (error) {
    throw error
  }
}

export { findShare }
