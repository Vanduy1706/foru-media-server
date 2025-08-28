import { voteModel } from "../../models/vote.model.js"

async function findVote({ author, targetId }) {
  try {
    const existingVote = await voteModel.findOne({
      author: author.sub,
      targetId: targetId,
    })

    return existingVote
  } catch (error) {
    throw error
  }
}

export { findVote }
