import { getSpeechWithInput } from "../services/search/get-speech-with-input.js"

async function searchSpeech(req, res, next) {
  try {
    let searchInput = req.query.input

    const searchResult = await getSpeechWithInput(searchInput)

    res.status(200).json(searchResult)
  } catch (error) {
    next(error)
  }
}

export { searchSpeech }
