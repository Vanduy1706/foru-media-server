import mongoose, { Schema } from "mongoose"

const shareSchema = new mongoose.Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  targetId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  targetType: {
    type: String,
    enum: ["speech", "comment"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

shareSchema.index({ author: 1, targetType: 1, targetId: 1 }, { unique: true })

export const shareModel = mongoose.model("shares", shareSchema)
