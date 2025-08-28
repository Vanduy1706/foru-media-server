import { findAllShares } from "../services/share/find-all-shares.js"
import { createSpeechWithAuthor } from "../services/speech/create-speech.js"
import { softDeleteOneSpeech } from "../services/speech/delete-one-speech.js"
import {
  getAllSpeechesWithAuthor,
  getAllSpeechIdsWithAuthor,
} from "../services/speech/get-all-speeches.js"
import { getOneSpeech } from "../services/speech/get-one-speech.js"
import { updateOneSpeech } from "../services/speech/update-one-speech.js"
import { getTopSpeeches } from "../services/speech/get-trending-speeches.js"

async function createSpeech(req, res, next) {
  try {
    const content = req.body?.content
    const author = req.user

    if (typeof content !== "string") {
      const error = new Error("Content must be string")
      error.status = 400
      throw error
    }

    const result = await createSpeechWithAuthor(content, author)

    res.status(201).json({ message: "Published", speech: result })
  } catch (error) {
    next(error)
  }
}

async function getAllSpeeches(req, res, next) {
  try {
    const speeches = await getAllSpeechesWithAuthor()
    if (speeches.length === 0) {
      const error = new Error("No speech")
      error.status = 404
      throw error
    }

    res.status(200).json(speeches)
  } catch (error) {
    next(error)
  }
}

async function getAllForum(req, res, next) {
  try {
    const limit = 10
    const lastCreatedAt = req.query?.lastCreatedAt

    const speeches = await getAllSpeechesWithAuthor({
      limit: limit,
      lastCreatedAt,
    })

    const shares = await findAllShares({ limit: limit, lastCreatedAt })

    let forum = [...speeches, ...shares]

    forum.sort((a, b) => {
      const firstSpeech = new Date(a.createdAt)
      const secondSpeech = new Date(b.createdAt)

      if (firstSpeech < secondSpeech) {
        return 1
      }

      if (firstSpeech > secondSpeech) {
        return -1
      }

      return 0
    })

    forum = forum.slice(0, limit)

    res.status(200).json(forum)
  } catch (error) {
    next(error)
  }
}

async function getTrendingSpeeches(req, res, next) {
  try {
    const currentDate = new Date()

    const lastWeekDate = new Date(
      currentDate.getTime() - 7 * 24 * 60 * 60 * 1000
    )

    const topTrendingSpeechesThisWeek = await getTopSpeeches({
      currentDate,
      lastWeekDate,
    })

    res.status(200).json(topTrendingSpeechesThisWeek)
  } catch (error) {
    next(error)
  }
}
async function getAllSpeechIds(req, res, next) {
  try {
    const speeches = await getAllSpeechIdsWithAuthor()
    if (speeches.length === 0) {
      const error = new Error("No speech")
      error.status = 404
      throw error
    }

    res.status(200).json(speeches)
  } catch (error) {
    next(error)
  }
}

async function getSpeechDetail(req, res, next) {
  try {
    const speechId = req.params?.id

    const detailSpeech = await getOneSpeech(speechId)
    if (!detailSpeech) {
      const error = new Error("Speech not found")
      error.status = 404
      throw error
    }

    res.status(200).json(detailSpeech)
  } catch (error) {
    next(error)
  }
}

async function updateSpeech(req, res, next) {
  try {
    const speechId = req.params?.id
    const author = req.user
    const content = req.body?.content

    if (!content && typeof content !== "string") {
      const error = new Error("Content invalid")
      error.status = 400
      throw error
    }

    const updated = await updateOneSpeech(speechId, author, content)

    res.status(200).json(updated)
  } catch (error) {
    next(error)
  }
}

async function softDeleteSpeech(req, res, next) {
  try {
    const speechId = req.params?.id
    const author = req.user

    const deleted = await softDeleteOneSpeech(speechId, author)

    res.status(200).json(deleted)
  } catch (error) {
    next(error)
  }
}

export {
  createSpeech,
  getAllSpeeches,
  getSpeechDetail,
  updateSpeech,
  softDeleteSpeech,
  getAllSpeechIds,
  getAllForum,
  getTrendingSpeeches,
}
