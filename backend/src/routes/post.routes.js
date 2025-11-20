import { createPost, 
        deletePost, 
        getAllPosts, 
        getPostById, 
        updatePost,
        getAdminPosts, 
        deactivateExpiredPosts} from "../controllers/post.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { trackPostVisit } from "../middlewares/trackPostViews.middleware.js";

const router = Router()

// routes for admin
router.route("/create-post").post(verifyJWT, createPost)
router.route("/update-post/:postId").patch(verifyJWT, updatePost)
router.route("/delete-post/:postId").delete(verifyJWT, deletePost)
router.route("/admin/get-all-posts").get(verifyJWT, getAdminPosts)

// routes for everyone
router.route("/get-post/:postId").get(trackPostVisit,getPostById)
router.route("/get-all-posts").get(getAllPosts)

// auto deactivate
router.route("/deactivateExpiredPosts").patch(deactivateExpiredPosts)


export default router