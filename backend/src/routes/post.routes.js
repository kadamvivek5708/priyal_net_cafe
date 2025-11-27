import { createPost, 
        deletePost, 
        getAllPosts, 
        getPostById, 
        updatePost,
        getAdminPosts, 
        deactivateExpiredPosts,
        getExpiredPosts} from "../controllers/post.controller.js";
import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { trackPostVisit } from "../middlewares/trackPostViews.middleware.js";
import { trackVisitMiddleware } from "../middlewares/analytics.middleware.js";

const router = Router()

// routes for admin
router.route("/create-post").post(verifyJWT, createPost)
router.route("/update-post/:postId").patch(verifyJWT, updatePost)
router.route("/delete-post/:postId").delete(verifyJWT, deletePost)
router.route("/admin/get-all-posts").get(verifyJWT, getAdminPosts)
router.route("/admin/get-post/:postId").get(verifyJWT, getPostById)

// routes for everyone
// Public Post Detail (Counts per-post view + website visit)
router.route("/get-post/:postId").get(
  trackVisitMiddleware,
  trackPostVisit,
  getPostById
);

// Public Post List (Counts website visit only)
router.route("/get-all-posts").get(
  trackVisitMiddleware,
  getAllPosts
);

// Public Expired Post List (Counts website visit only)
router.route("/get-expired-posts").get(
  trackVisitMiddleware,
  getExpiredPosts
);


// auto deactivate
router.route("/deactivateExpiredPosts").patch(deactivateExpiredPosts)


export default router