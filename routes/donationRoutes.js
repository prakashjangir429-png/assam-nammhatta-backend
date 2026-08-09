import { Router } from "express";
import { protect } from "../middleware/auth.js";
import {
  createDonationOrder,
  createDonation,
  getDonations,
  getDonationById,
  updateDonation,
  verifyDonation,
  deleteDonation,
} from "../controllers/donationController.js";

const router = Router();

router.post("/create-order", createDonationOrder);
router.post("/", createDonation);

router.get("/", protect, getDonations);
router.get("/:id", protect, getDonationById);
router.put("/:id", protect, updateDonation);
router.patch("/verify/:id", protect, verifyDonation);
router.delete("/:id", protect, deleteDonation);

export default router;
