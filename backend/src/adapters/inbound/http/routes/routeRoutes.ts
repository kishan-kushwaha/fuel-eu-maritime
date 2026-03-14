import { Router } from "express";
import { RouteController } from "../controllers/RouteController.js";

const router = Router();
const controller = new RouteController();

router.get("/", controller.getRoutes.bind(controller));
router.post("/:routeId/baseline", controller.setBaseline.bind(controller));
router.get("/comparison", controller.getComparisons.bind(controller));

export default router;
