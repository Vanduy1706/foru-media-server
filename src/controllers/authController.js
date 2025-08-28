import createUser from "../services/user/create-user.js"
import createTransport from "../services/auth/mail-transport.js"
import sendMail from "../services/auth/send-mail.js"
import generateOTPCode from "../utils/otp.util.js"
import generateToken from "../services/token/generate-token.js"
import findUserWithEmail from "../services/user/find-user.js"
import revokeRefreshToken from "../services/token/revoke-refreshToken.js"
import jwt from "jsonwebtoken"

function isEmailInvalid(email) {
  return (
    !email ||
    email.length === 0 ||
    typeof email !== "string" ||
    email.match(/\@gmail\.com$/) === null
  )
}

async function loginWithEmail(req, res, next) {
  try {
    let emailFromBody = req.body.email
    let code = await generateOTPCode()
    let transporter = await createTransport()

    if (isEmailInvalid(emailFromBody)) {
      const error = new Error("Invalid Email")
      error.status = 400
      throw error
    }

    if (!code) {
      const error = new Error("Can't generate code.")
      error.status = 500
      throw error
    }

    if (!transporter) {
      const error = new Error("Can't open the Email host")
      error.status = 500
      throw error
    }

    await sendMail({
      emailFromBody,
      code,
      transporter,
    })

    req.session.verifyData = { email: emailFromBody, code: code, enterCount: 3 }
    res
      .status(200)
      .json({ message: "Sent successfully", redirectTo: "/verification" })
  } catch (error) {
    next(error)
  }
}

async function verifyEmail(req, res, next) {
  try {
    const sentCodeFromBody = req.body.verifiedCode
    const savedOTPObj = req.session.verifyData

    if (
      sentCodeFromBody.length === 0 ||
      (!sentCodeFromBody && typeof sentCodeFromBody !== "number")
    ) {
      const error = new Error("Required code field")
      error.status = 400
      throw error
    }

    if (!savedOTPObj) {
      const error = new Error("Code not generated yet")
      error.status = 500
      throw error
    }

    if (savedOTPObj.code !== sentCodeFromBody && savedOTPObj.enterCount > 1) {
      savedOTPObj.enterCount = savedOTPObj.enterCount - 1
      const error = new Error(
        `Incorrect code, you have ${savedOTPObj.enterCount} times left, please re-enter`
      )
      error.status = 400
      throw error
    }

    if (savedOTPObj.code !== sentCodeFromBody && savedOTPObj.enterCount === 1) {
      req.session.destroy((err) => {
        if (err) {
          throw err
        }

        res.clearCookie("connect.sid")
        res.status(403).json({ message: "login failed", redirectTo: "/" })
      })
      return
    }

    const user = await findUserWithEmail(savedOTPObj.email)

    if (user) {
      const token = await generateToken(user._id)

      res.cookie("access_token", token.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      res.cookie("refresh_token", token.refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      req.session.destroy((err) => {
        if (err) {
          throw err
        }

        res.clearCookie("connect.sid")
        res
          .status(200)
          .json({ message: "Login successfully", redirectTo: "/home" })
      })

      return
    }

    req.session.isVerified = true
    res.status(200).json({
      message: "Authentication successfully",
      redirectTo: "/register",
    })
  } catch (error) {
    next(error)
  }
}

function isInvalid(username, nickname) {
  return (
    !username ||
    username.length === 0 ||
    !nickname ||
    nickname.length === 0 ||
    typeof username !== "string" ||
    typeof nickname !== "string"
  )
}

async function registerUser(req, res, next) {
  try {
    const userName = req.body.username
    const nickName = req.body.nickname
    const client = req.session.verifyData
    const isEmailVerified = req.session.isVerified

    if (isInvalid(userName, nickName)) {
      const error = new Error("Data field required")
      error.status = 400
      throw error
    }

    if (nickName.match(/[^a-zA-Z0-9]/) !== null) {
      const error = new Error(
        "Nickname only requires words and numbers, no white space"
      )
      error.status = 400
      throw error
    }

    if (!isEmailVerified) {
      const error = new Error("Email is not verified")
      error.status = 400
      throw error
    }

    // create user
    const result = await createUser({ client, userName, nickName })

    const user = await findUserWithEmail(client.email)

    if (!user) {
      const error = new Error("User not found")
      error.status = 404
      throw error
    }

    // create token
    const token = await generateToken(user._id)

    res.cookie("access_token", token.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.cookie("refresh_token", token.refresh_token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    req.session.destroy((err) => {
      if (err) {
        throw err
      }

      res.clearCookie("connect.sid")
      res
        .status(result.status)
        .json({ message: result.message, redirectTo: "/home" })
    })
  } catch (error) {
    next(error)
  }
}

async function generateNewToken(req, res, next) {
  const refreshToken = req.cookies.refresh_token

  if (!refreshToken) {
    return res.status(403).json({ redirectTo: "/" })
  }

  try {
    const decodedRefreshToken = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN,
      {
        algorithms: ["HS256"],
      }
    )

    if (decodedRefreshToken) {
      const token = await generateToken(decodedRefreshToken.sub)

      res.cookie("access_token", token.access_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      res.cookie("refresh_token", token.refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      await revokeRefreshToken(decodedRefreshToken.sub)

      return res.status(200).json({ redirectTo: "/home" })
    }
  } catch (error) {
    return res.status(403).json({ redirectTo: "/" })
  }
}

async function logout(req, res, next) {
  const accessToken = req.cookies.access_token
  const refreshToken = req.cookies.refresh_token

  if (!accessToken) {
    return res.status(403).json({ redirectTo: "/" })
  }

  if (!refreshToken) {
    return res.status(403).json({ redirectTo: "/" })
  }

  try {
    const refreshTokenDecoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN,
      {
        algorithms: ["HS256"],
      }
    )

    await revokeRefreshToken(refreshTokenDecoded.sub)

    res.clearCookie("access_token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    })

    return res.status(200).json({ redirectTo: "/" })
  } catch (error) {
    return res.status(403).json({ redirectTo: "/" })
  }
}

export { loginWithEmail, verifyEmail, registerUser, generateNewToken, logout }
