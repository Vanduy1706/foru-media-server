import mongoose from "mongoose"

async function main() {
  await mongoose.connect(process.env.MONGO_URI)
  console.log("db running")
}

export default main
