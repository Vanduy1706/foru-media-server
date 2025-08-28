import nodemailer from "nodemailer"

export default async function createTransport() {
  if (process.env.NODE_ENV === "production") {
    return nodemailer.createTransport({
      host: "smtp.sendgrid.net",
      port: "587",
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    })
  }

  // let testAccount = await nodemailer.createTestAccount()
  return nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: "587",
    secure: false,
    auth: {
      user: process.env.ETHEREAL_USERNAME,
      pass: process.env.ETHEREAL_PASSWORD,
    },
  })
}
