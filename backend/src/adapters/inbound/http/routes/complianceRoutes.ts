import { Router } from "express";
import { ComplianceController } from "../controllers/ComplianceController.js";

const router = Router();
const controller = new ComplianceController();

router.get("/cb", controller.getComplianceBalance.bind(controller));
router.get("/pools", controller.getPools.bind(controller));
router.get("/adjusted-cb", controller.getPools.bind(controller));

export default router;