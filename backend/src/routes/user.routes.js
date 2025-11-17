import { Router } from "express";
import {registerAdmin, 
        loginAdmin, 
        logoutAdmin, 
        refreshAccessToken } from "../controllers/user.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register-admin").post(registerAdmin)
router.route("/login-admin").post(loginAdmin)

// secured routes
router.route("/logout").post(verifyJWT, logoutAdmin)
router.route("/refresh-access-token").post(verifyJWT, refreshAccessToken)

export default router
