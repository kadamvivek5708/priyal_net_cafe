import { createPost, 
        deletePost, 
        getAllPosts, 
        getPostById, 
        updatePost } from "../controllers/post.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/create-post").post(verifyJWT, createPost)
router.route("/update-post/:postId").patch(verifyJWT, updatePost)
router.route("/delete-post/:postId").delete(verifyJWT, deletePost)
router.route("/get-post/:postId").get(verifyJWT, getPostById)

router.route("/get-all-posts").get(getAllPosts)

export default router