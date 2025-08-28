import { userModel } from "../../models/user.model.js"

export default async function findUserWithEmail(email) {
  const user = await userModel.findOne({ email: email }).exec()

  return user
}
