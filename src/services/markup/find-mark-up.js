import { markUpModel } from "../../models/markup.model.js"

async function findMarkUp({ author, targetId }) {
  try {
    const existingMarkUp = await markUpModel.findOne({
      author: author.sub,
      targetId: targetId,
    })

    return existingMarkUp
  } catch (error) {
    throw error
  }
}

export { findMarkUp }
