import jwt from "jsonwebtoken"

async function authHandler(req, res, next) {
  const accessToken = req.cookies.access_token

  if (!accessToken) {
    return res.status(403).json({ redirectTo: "/" })
  }

  try {
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN,
      {
        algorithms: ["HS256"],
      }
    )

    if (decodedAccessToken) {
      req.user = decodedAccessToken
      return next()
    }
  } catch (error) {
    return res.status(403).json({ redirectTo: "/" })
  }
}

async function loginHandler(req, res, next) {
  const accessToken = req.cookies.access_token

  if (!accessToken) {
    return res.status(403).json({ redirectTo: "/" })
  }

  try {
    const decodedAccessToken = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN,
      {
        algorithms: ["HS256"],
      }
    )

    if (decodedAccessToken) {
      req.user = decodedAccessToken
      return res.status(200).json({ redirectTo: "/home" })
    }
  } catch (error) {
    return res.status(401).json({ redirectTo: "/auth/refresh-token" })
  }
}

export { authHandler, loginHandler }
