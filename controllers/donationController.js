import Donation from "../models/Donation.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../utils/razorpay.js";
import { sendWhatsAppReceipt } from "../utils/whatsapp.js";

export const createDonationOrder = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const order = await createRazorpayOrder({
      amount,
      receipt: `don_${Date.now()}`,
    });

    return res.json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      order,
    });
  } catch (error) {
    console.error("Create donation order error:", error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Unable to create payment order",
    });
  }
};

const donationReceipt = (donation) => `🙏 HARE KRISHNA

ASSAM NAMHATTA SANGHA

Donate Successful

Name : ${donation.name}

Mobile : ${donation.phone}

Email : ${donation.email || "-"}

Donate Amount : ₹${donation.amount}

Transaction ID : ${donation.razorpayPaymentId || donation.transactionId}

Thank You 🙏
Hare Krishna`;

export const createDonation = async (req, res) => {
  try {
    const {
      name,
      phone,
      email = "",
      amount,
      message = "",
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!name?.trim() || !phone?.trim() || !Number(amount)) {
      return res.status(400).json({ success: false, message: "Name, phone and amount are required" });
    }

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Razorpay payment details are required" });
    }

    const paymentCheck = await verifyRazorpayPayment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      expectedAmount: Number(amount),
    });

    if (!paymentCheck.valid) {
      return res.status(400).json({ success: false, message: paymentCheck.reason || "Payment verification failed" });
    }

    const existing = await Donation.findOne({ razorpayPaymentId: razorpay_payment_id });
    if (existing) {
      return res.json({ success: true, data: existing, message: "Donation already saved" });
    }

    const donation = await Donation.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      amount: Number(amount),
      message: message.trim(),
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      transactionId: razorpay_payment_id,
      paymentMode: "UPI",
      paymentStatus: "verified",
      paymentVerified: true,
    });

    try {
      await sendWhatsAppReceipt({ phone: donation.phone, message: donationReceipt(donation) });
    } catch (whatsappError) {
      console.error("Donation WhatsApp error:", whatsappError.message);
    }

    return res.status(201).json({ success: true, data: donation, message: "Donation saved successfully" });
  } catch (error) {
    console.error("Create donation error:", error);
    return res.status(500).json({ success: false, message: "Unable to save donation" });
  }
};

export const getDonations = async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: donations });
  } catch (error) {
    console.error("Get donations error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch donations" });
  }
};

export const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: "Donation not found" });
    return res.json({ success: true, data: donation });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid donation id" });
  }
};

export const updateDonation = async (req, res) => {
  try {
    const allowed = ["name", "phone", "email", "amount", "message", "paymentMode", "transactionId", "paymentStatus"];
    const update = {};
    for (const key of allowed) if (req.body[key] !== undefined) update[key] = req.body[key];

    if (update.amount !== undefined) update.amount = Number(update.amount);
    if (update.paymentStatus === "verified") update.paymentVerified = true;
    if (update.paymentStatus === "pending") update.paymentVerified = false;
    if (update.paymentStatus === "failed") update.paymentVerified = false;

    const donation = await Donation.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!donation) return res.status(404).json({ success: false, message: "Donation not found" });

    return res.json({ success: true, data: donation, message: "Donation updated successfully" });
  } catch (error) {
    console.error("Update donation error:", error);
    return res.status(400).json({ success: false, message: error.message || "Update failed" });
  }
};

export const verifyDonation = async (req, res) => {
  try {
    const { paymentStatus = "verified", paymentMode = "UPI", transactionId } = req.body;
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        paymentStatus,
        paymentMode,
        transactionId: transactionId || undefined,
        paymentVerified: paymentStatus === "verified",
      },
      { new: true, runValidators: true }
    );

    if (!donation) return res.status(404).json({ success: false, message: "Donation not found" });
    return res.json({ success: true, data: donation, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Verify donation error:", error);
    return res.status(400).json({ success: false, message: error.message || "Verification failed" });
  }
};

export const deleteDonation = async (req, res) => {
  try {
    const donation = await Donation.findByIdAndDelete(req.params.id);
    if (!donation) return res.status(404).json({ success: false, message: "Donation not found" });
    return res.json({ success: true, message: "Donation deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Delete failed" });
  }
};
