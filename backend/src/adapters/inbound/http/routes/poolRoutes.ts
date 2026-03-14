import { Router } from "express";
import { PoolController } from "../controllers/PoolController.js";

const router = Router();
const controller = new PoolController();

router.post("/", controller.createPool.bind(controller));

export default router;