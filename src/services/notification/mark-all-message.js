import { notificationModel } from "../../models/notification.model.js"

async function markAllMessages(author) {
  try {
    const allIds = await notificationModel
      .find({ toAuthor: author.sub })
      .select("_id")
    if (allIds.length === 0) {
      const error = new Error("Marked allIds")
      error.status = 404
      throw error
    }

    await notificationModel.updateMany(
      { _id: { $in: allIds } },
      { $set: { isRead: true } }
    )
  } catch (error) {
    throw error
  }
}

export { markAllMessages }
