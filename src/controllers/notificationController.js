import { getAllMessage } from "../services/notification/get-all-message.js"
import { markAllMessages } from "../services/notification/mark-all-message.js"

async function getAllNotifications(req, res, next) {
  try {
    const author = req.user

    const notifications = await getAllMessage(author)
    notifications.sort((a, b) => {
      const firstNotification = new Date(a.createdAt)
      const secondNotification = new Date(b.createdAt)

      if (firstNotification < secondNotification) {
        return 1
      }

      if (firstNotification > secondNotification) {
        return -1
      }

      return 0
    })

    res.status(200).json(notifications)
  } catch (error) {
    next(error)
  }
}

async function markupNotification(req, res, next) {
  try {
    const author = req.user

    await markAllMessages(author)

    return res.status(200).json({ message: "All marked" })
  } catch (error) {
    next(error)
  }
}

export { getAllNotifications, markupNotification }
