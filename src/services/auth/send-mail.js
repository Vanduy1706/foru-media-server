import nodemailer from "nodemailer"

export default async function sendMail(params) {
  try {
    const info = await params.transporter.sendMail({
      from: process.env.GMAIL,
      to: params.emailFromBody,
      subject: "Verification code",
      html: `<p>Your verification code is:</p></br><h2>${params.code}</h2>`,
    })

    return {
      information: nodemailer.getTestMessageUrl(info),
    }
  } catch (error) {
    throw new Error(error.message)
  }
}
