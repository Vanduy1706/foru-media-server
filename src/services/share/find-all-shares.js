import { shareModel } from "../../models/share.model.js"

async function findAllShares({ limit, lastCreatedAt }) {
  try {
    let query = {}

    if (lastCreatedAt) {
      const newCreatedAt = new Date(lastCreatedAt)
      query.createdAt = { $lt: newCreatedAt }
    }

    const shares = await shareModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: "author",
        select: ["username", "nickname"],
      })
      .exec()

    return shares
  } catch (error) {
    throw error
  }
}

export { findAllShares }
