import crypto from "crypto"
export default async function generateOTPCode() {
  const array = new Uint16Array(1)
  return await crypto.getRandomValues(array)[0]
}
