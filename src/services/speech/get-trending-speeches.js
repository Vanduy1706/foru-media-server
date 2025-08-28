import { speechModel } from "../../models/speech.model.js"

async function getTopSpeeches({ currentDate, lastWeekDate }) {
  try {
    let popularSpeeches = await speechModel
      .find({
        createdAt: { $gt: lastWeekDate, $lt: currentDate },
        isSoftDeleted: false,
      })
      .populate({
        path: "author",
        select: ["username", "nickname"],
      })
      .lean()
      .exec()

    popularSpeeches = popularSpeeches.map((speech) => {
      return {
        ...speech,
        trendingScore:
          (speech.voteCount +
            speech.commentCount * 2 +
            speech.shareCount * 1.5) /
          4,
      }
    })

    popularSpeeches = popularSpeeches.sort(
      (sp1, sp2) => sp2.trendingScore - sp1.trendingScore
    )

    popularSpeeches = popularSpeeches.filter(
      (speech) => speech.trendingScore > 0
    )

    return popularSpeeches.slice(0, 10)
  } catch (error) {
    throw error
  }
}

export { getTopSpeeches }
