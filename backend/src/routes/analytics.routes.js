import { Router } from "express";
import { getAnalyticsSummary } from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router()

// router.route("/trackPostViews/:postId").post(verifyJWT,trackPostView)
router.route("/getAnalyticalSummary").get(verifyJWT,getAnalyticsSummary)

export default router