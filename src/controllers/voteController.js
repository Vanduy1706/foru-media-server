import { findVote } from "../services/vote/find-vote.js"
import { voteTarget } from "../services/vote/vote-speech-or-comment.js"

async function voteSpeechOrComment(req, res, next) {
  try {
    const { targetType, targetId } = req.body
    const author = req.user

    if (!["speech", "comment"].includes(targetType)) {
      const error = new Error("Invalid targetType")
      error.status = 400
      throw error
    }

    const result = await voteTarget(targetType, targetId, author)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getVote(req, res, next) {
  try {
    const author = req.user
    const targetId = req.params.id

    const result = await findVote({ author, targetId })

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export { voteSpeechOrComment, getVote }
