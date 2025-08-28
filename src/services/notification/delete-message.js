import { notificationModel } from "../../models/notification.model.js"

async function deleteMessage({
  toAuthor,
  fromAuthor,
  targetType,
  notifyType,
  targetId,
}) {
  try {
    await notificationModel.deleteOne({
      toAuthor: toAuthor,
      fromAuthor: fromAuthor,
      targetType: targetType,
      notifyType: notifyType,
      targetId: targetId,
    })
  } catch (error) {
    throw error
  }
}

export { deleteMessage }
