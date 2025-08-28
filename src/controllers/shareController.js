import { findAllShares } from "../services/share/find-all-shares.js"
import { findShare } from "../services/share/find-share.js"
import { shareTarget } from "../services/share/shareSpeechOrComment.js"

async function shareSpeechOrComment(req, res, next) {
  try {
    const { targetType, targetId } = req.body
    const author = req.user

    if (!["speech", "comment"].includes(targetType)) {
      const error = new Error("Invalid targetType")
      error.status = 400
      throw error
    }

    const result = await shareTarget(targetType, targetId, author)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getShare(req, res, next) {
  try {
    const author = req.user
    const targetId = req.params.id

    const result = await findShare({ author, targetId })

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getAllShares(req, res, next) {
  try {
    const result = await findAllShares()

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export { shareSpeechOrComment, getShare, getAllShares }
