import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email field required"],
    minLength: [11, "Email is not long enough"],
    maxLength: [100, "Email is too long"],
    validate: {
      validator: function (value) {
        return /\@gmail\.com$/.test(value)
      },
      message: (props) => `${props.value} is not a valid Email`,
    },
  },
  nickname: {
    type: String,
    required: [true, "Nick name field required"],
    minLength: [1, "User name is not long enough"],
    maxLength: [60, "Nick name is too long"],
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9]+$/.test(value)
      },
      message: (props) => `${props.value} is not a valid nickname`,
    },
  },
  username: {
    type: String,
    required: [true, "User name field required"],
    minLength: [1, "User name is not long enough"],
    maxLength: [60, "User name is too long"],
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

userSchema.index({ email: 1, unique: true })

export const userModel = mongoose.model("users", userSchema)
