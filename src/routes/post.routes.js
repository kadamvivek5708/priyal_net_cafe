import { createPost } from "../controllers/post.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create-post").post(verifyJWT, createPost)

export default router