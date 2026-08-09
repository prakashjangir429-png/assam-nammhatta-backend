import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  createDevoteeOrder,
  registerDevotee,
  getDevotees,
  getDevoteeById,
  updateDevotee,
  deleteDevotee,
} from "../controllers/devoteeController.js";

const router = Router();

router.post("/create-order", createDevoteeOrder);
router.post("/register", registerDevotee);

router.get("/", protect, getDevotees);
router.get("/:id", protect, getDevoteeById);
router.put("/:id", protect, updateDevotee);
router.delete("/:id", protect, deleteDevotee);

export default router;
