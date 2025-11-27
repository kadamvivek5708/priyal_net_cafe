import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createService,
         updateService,
         deleteService,
         getAllServices,
         getService, 
         getAdminServices} from "../controllers/services.controller.js";
import { trackVisitMiddleware } from "../middlewares/analytics.middleware.js";

const router = Router()

router.route("/create-service").post(verifyJWT, createService)
router.route("/update-service/:serviceId").patch(verifyJWT, updateService)
router.route("/delete-service/:serviceId").delete(verifyJWT, deleteService)
router.route("/admin/get-all-services").get(verifyJWT,getAdminServices)

router.route("/get-service/:serviceId").get(trackVisitMiddleware, getService)
router.route("/get-all-services").get(trackVisitMiddleware, getAllServices)

export default router