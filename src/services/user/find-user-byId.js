import { userModel } from "../../models/user.model.js"

async function findUserById(userId) {
  const user = await userModel.findOne({ _id: userId }).exec()

  return user
}

export default findUserById
