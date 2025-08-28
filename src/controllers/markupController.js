import { findMarkUp } from "../services/markup/find-mark-up.js"
import { getAllMarkUp } from "../services/markup/get-all-markup.js"
import { markUpTarget } from "../services/markup/markup-speech-or-comment.js"

async function markupSpeechOrComment(req, res, next) {
  try {
    const { targetType, targetId } = req.body
    const author = req.user

    if (!["speech", "comment"].includes(targetType)) {
      const error = new Error("Invalid targetType")
      error.status = 400
      throw error
    }

    const result = await markUpTarget(targetType, targetId, author)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function allUserMarkUp(req, res, next) {
  try {
    const author = req.user

    const result = await getAllMarkUp(author)

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

async function getMarkUp(req, res, next) {
  try {
    const author = req.user
    const targetId = req.params.id

    const result = await findMarkUp({ author, targetId })

    res.status(200).json(result)
  } catch (error) {
    next(error)
  }
}

export { markupSpeechOrComment, allUserMarkUp, getMarkUp }
