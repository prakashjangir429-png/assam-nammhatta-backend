import mongoose from "mongoose";

const donationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true, default: "" },
    amount: { type: Number, required: true, min: 1 },
    message: { type: String, trim: true, default: "" },

    razorpayOrderId: { type: String, default: "", index: true },
    razorpayPaymentId: { type: String, default: "", index: true },
    razorpaySignature: { type: String, default: "" },

    transactionId: { type: String, default: "" },
    paymentMode: { type: String, default: "UPI" },
    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },
    paymentVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Donation", donationSchema);
