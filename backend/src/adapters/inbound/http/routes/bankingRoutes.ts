import { Router } from "express";
import { BankingController } from "../controllers/BankingController.js";

const router = Router();
const controller = new BankingController();

router.get("/records", controller.getBankingRecords.bind(controller));
router.post("/bank", controller.bankSurplus.bind(controller));

router.post("/apply", controller.applyBankedCredits.bind(controller));

export default router;