import mongoose from "mongoose"

const refreshSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "UserId required"],
    ref: "users",
  },
  refreshToken: {
    type: String,
    required: [true, "Refresh token required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
})

refreshSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const refreshModel = mongoose.model("refreshtoken", refreshSchema)
