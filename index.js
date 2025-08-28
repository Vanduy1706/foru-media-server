import express from "express"
import main from "./src/config/db.config.js"
import authRoutes from "./src/routes/auth.route.js"
import userRoutes from "./src/routes/user.route.js"
import speechRoutes from "./src/routes/speech.route.js"
import commentRoutes from "./src/routes/comment.route.js"
import replyRoutes from "./src/routes/reply.route.js"
import voteRoutes from "./src/routes/vote.route.js"
import markUpRoutes from "./src/routes/markup.route.js"
import shareRoutes from "./src/routes/share.route.js"
import notificationRoutes from "./src/routes/notification.route.js"
import searchRoutes from "./src/routes/search.route.js"
import errorHandler from "./src/middlewares/error/errorHandler.js"
import errorNotFound from "./src/middlewares/error/notFound.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import session from "express-session"
import MongoStore from "connect-mongo"
import { createServer } from "node:http"
import { init } from "./socket.js"

const app = express()
const server = createServer(app)
const io = init(server)
const port = process.env.PORT || 8080

// Connect to database
main().catch((err) => console.log(err))

app.set("trust proxy", 1)

app.use(
  cors({
    origin: process.env.DOMAINCLIENT,
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(
  session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 30 * 60,
    }),
    cookie: {
      maxAge: 30 * 60 * 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    },
  })
)

// websocket
io.on("connection", (socket) => {
  const userId = String(socket.handshake.query.userId)
  socket.join(userId)
})

// Routes
app.use("/auth", authRoutes)
app.use("/user", userRoutes)
app.use("/speech", speechRoutes)
app.use("/comment", commentRoutes)
app.use("/reply", replyRoutes)
app.use("/vote", voteRoutes)
app.use("/markup", markUpRoutes)
app.use("/share", shareRoutes)
app.use("/notification", notificationRoutes)
app.use("/search", searchRoutes)

// Error
app.use(errorNotFound)
app.use(errorHandler)

server.listen(port, () => console.log(`Server is running on port: ${port}`))
