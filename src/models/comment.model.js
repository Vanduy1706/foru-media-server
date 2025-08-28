import mongoose, { Schema } from "mongoose"

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    maxLength: [200, "Your comment is too long"],
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
  parentSpeech: {
    type: Schema.Types.ObjectId,
    ref: "speeches",
  },
  path: {
    type: [Schema.Types.ObjectId],
    required: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const commentModel = mongoose.model("comments", commentSchema)
