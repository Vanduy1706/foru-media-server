import mongoose, { Schema } from "mongoose"

const notificationSchema = new mongoose.Schema({
  toAuthor: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  fromAuthor: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  targetType: {
    type: String,
    enum: ["comment", "speech"],
  },
  notifyType: {
    type: String,
    enum: ["vote", "comment", "share", "speech"],
  },
  targetId: {
    type: Schema.Types.ObjectId,
  },
  message: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

notificationSchema.index({
  toAuthor: 1,
  fromAuthor: 1,
  targetType: 1,
  notifyType: 1,
  targetId: 1,
})

export const notificationModel = mongoose.model(
  "notifications",
  notificationSchema
)
