// import nodemailer from "nodemailer"
import sgMail from "@sendgrid/mail"

export default async function sendMail(params) {
  try {
    // const info = await params.transporter.sendMail({
    //   from: process.env.GMAIL,
    //   to: params.emailFromBody,
    //   subject: "Verification code",
    //   html: `<p>Your verification code is:</p></br><h2>${params.code}</h2>`,
    // })

    // return {
    //   information: nodemailer.getTestMessageUrl(info),
    // }

    sgMail.setApiKey(process.env.SMTP_PASSWORD)

    await sgMail.send({
      from: process.env.GMAIL,
      to: params.emailFromBody,
      subject: "Verification code",
      html: `<p>Your verification code is:</p></br><h2>${params.code}</h2>`,
    })
  } catch (error) {
    throw new Error(error.message)
  }
}
