import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { trackVisitMiddleware } from "./middlewares/analytics.middleware.js";

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit : "16kb"}))
app.use(express.urlencoded({extended:true, limit : "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// Router routes

import healthcheckRouter from "./routes/healthcheck.routes.js"
app.use("/api/v1/", healthcheckRouter)

import userRouter from "./routes/user.routes.js"
app.use("/api/v1/admin", userRouter)

import postRouter from "./routes/post.routes.js"
app.use("/api/v1/post",trackVisitMiddleware, postRouter)

import servicesRouter from "./routes/services.routes.js"
app.use("/api/v1/services", servicesRouter)

import analyticsRouter from "./routes/analytics.routes.js"
app.use("/api/v1/analytics", analyticsRouter)

export {app} 