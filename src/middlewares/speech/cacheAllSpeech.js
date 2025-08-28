import { get } from "../../services/cache/cache.memory.js"

async function cacheAllSpeech(req, res, next) {
  const cachedData = await get("speeches_cache")

  if (cachedData) {
    return res.status(200).json(cachedData)
  }

  next()
}

export { cacheAllSpeech }
