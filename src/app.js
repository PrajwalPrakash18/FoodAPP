import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true
}))

app.use(express.json())
app.use(express.urlencoded())
app.use(express.static("public"))
app.use(cookieParser())

import userRouter from "./routes/allroutes.routes.js"

app.use("/users" , userRouter)

export { app }

