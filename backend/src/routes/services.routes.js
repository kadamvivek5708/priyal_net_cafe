import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createService,
         updateService,
         deleteService,
         getAllServices,
         getService } from "../controllers/services.controller.js";

const router = Router()

router.route("/create-service").post(verifyJWT, createService)
router.route("/update-service/:serviceId").patch(verifyJWT, updateService)
router.route("/delete-service/:serviceId").delete(verifyJWT, deleteService)

router.route("/get-service/:serviceId").get(getService)
router.route("/get-all-services").get(getAllServices)

export default router