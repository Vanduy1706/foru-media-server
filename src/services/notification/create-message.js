import { notificationModel } from "../../models/notification.model.js"

async function createMessage({
  toAuthor,
  fromAuthor,
  targetType,
  targetId,
  notifyType,
  message,
}) {
  try {
    let newMessage = await notificationModel.create({
      toAuthor: toAuthor,
      fromAuthor: fromAuthor,
      targetType: targetType,
      notifyType: notifyType,
      targetId: targetId,
      message: message,
    })

    newMessage = await newMessage.populate([
      {
        path: "toAuthor",
        select: ["username", "nickname"],
      },
      {
        path: "fromAuthor",
        select: ["username", "nickname"],
      },
    ])

    return newMessage
  } catch (error) {
    throw error
  }
}

export { createMessage }
