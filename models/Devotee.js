import mongoose from "mongoose";

const familyMemberSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, default: "" },
    age: { type: Number, min: 0, default: null },
    gender: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
  },
  { _id: false }
);

const devoteeSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    spiritualName: { type: String, trim: true, default: "" },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    age: { type: Number, required: true, min: 0 },
    gender: { type: String, required: true, trim: true },

    village: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, default: "Assam" },
    country: { type: String, required: true, trim: true, default: "India" },
    center: { type: String, required: true, trim: true },

    attendees: { type: Number, required: true, min: 1, default: 1 },
    foodPreference: {
      type: String,
      required: true,
      default: "Prasadam (Sattvic Vegetarian)",
    },
    arrivalDate: { type: String, required: true, trim: true },
    departureDate: { type: String, required: true, trim: true },
    sevaInterest: { type: String, required: true, default: "None / Just attending" },
    accommodation: { type: Boolean, default: false },
    notes: { type: String, trim: true, default: "" },

    familyMembers: { type: [familyMemberSchema], default: [] },
    paymentAmount: { type: Number, required: true, min: 0 },
    razorpayOrderId: { type: String, default: "", index: true },
    razorpayPaymentId: { type: String, default: "", index: true, unique: true },
    razorpaySignature: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },
    paymentVerified: { type: Boolean, default: false },
    whatsappStatus: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    whatsappSentAt: {
      type: Date,
      default: null,
    },
    whatsappAttempts: {
      type: Number,
      default: 0,
    },
    whatsappError: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Devotee", devoteeSchema);
