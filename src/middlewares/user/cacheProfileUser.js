import { get } from "../../services/cache/cache.memory.js"

async function cacheProfileUser(req, res, next) {
  const cachedData = await get("profile_cache")

  if (cachedData) {
    return res.status(200).json(cachedData)
  }

  next()
}

export { cacheProfileUser }
