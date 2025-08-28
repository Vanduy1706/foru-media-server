import mongoose, { Schema } from "mongoose"

const speechSchema = new mongoose.Schema({
  content: {
    type: String,
    maxLength: [200, "Your speech is too long"],
  },
  voteCount: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
  shareCount: {
    type: Number,
    default: 0,
  },
  isSoftDeleted: {
    type: Boolean,
    default: false,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const speechModel = mongoose.model("speeches", speechSchema)
