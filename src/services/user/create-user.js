import { userModel } from "../../models/user.model.js"
import findUserWithEmail from "./find-user.js"

export default async function createUser(params) {
  try {
    const user = await findUserWithEmail(params.client.email)
    if (user) {
      const err = new Error(`${params.client.email} already existed`)
      err.status = 400
      throw err
    }

    const newUser = new userModel({
      email: params.client.email,
      nickname: params.nickName,
      username: params.userName,
    })

    await newUser.validate()
    await newUser.save()

    return { status: 201, message: "Login successfully" }
  } catch (error) {
    throw error
  }
}
