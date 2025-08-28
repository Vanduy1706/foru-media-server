import { notificationModel } from "../../models/notification.model.js"

async function getAllMessage(author) {
  try {
    const messages = await notificationModel
      .find({
        toAuthor: author.sub,
        isRead: false,
      })
      .populate([
        {
          path: "toAuthor",
          select: ["username", "nickname"],
        },
        {
          path: "fromAuthor",
          select: ["username", "nickname"],
        },
      ])

    return messages
  } catch (error) {
    throw error
  }
}

export { getAllMessage }
