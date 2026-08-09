import Devotee from "../models/Devotee.js";
import { createRazorpayOrder, verifyRazorpayPayment } from "../utils/razorpay.js";
import { sendWhatsAppReceipt } from "../utils/whatsapp.js";

export const createDevoteeOrder = async (req, res) => {
  try {
    const amount = Number(req.body.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ success: false, message: "Valid amount is required" });
    }

    const order = await createRazorpayOrder({ amount, receipt: `reg_${Date.now()}` });
    return res.json({ success: true, key: process.env.RAZORPAY_KEY_ID, order });
  } catch (error) {
    console.error("Create registration order error:", error);
    return res.status(error.statusCode || 500).json({ success: false, message: error.message || "Unable to create payment order" });
  }
};

const normalizeFamilyMembers = (members = []) =>
  Array.isArray(members)
    ? members.map((m) => ({
        name: String(m.name || "").trim(),
        age: m.age === "" || m.age == null ? null : Number(m.age),
        gender: String(m.gender || "").trim(),
        phone: String(m.phone || "").trim(),
        address: String(m.address || "").trim(),
      }))
    : [];

const registrationReceipt = (devotee) => {
  const family = devotee.familyMembers?.length
    ? devotee.familyMembers
        .map((m, i) => `${i + 1}. ${m.name}\nAge : ${m.age ?? "-"}\nGender : ${m.gender}\nPhone : ${m.phone}\nAddress : ${m.address}`)
        .join("\n")
    : "No Family Members";

  return `🙏 HARE KRISHNA

ASSAM NAMHATTA SANGHA

Registration Successful

Name : ${devotee.fullName}

Spiritual Name : ${devotee.spiritualName || "-"}

Mobile : ${devotee.phone}

Email : ${devotee.email || "-"}

Village : ${devotee.village}

City : ${devotee.city}

State : ${devotee.state}

Pincode : ${devotee.pincode}

Center : ${devotee.center}

Arrival : ${devotee.arrivalDate}

Departure : ${devotee.departureDate}

Accommodation : ${devotee.accommodation ? "YES" : "NO"}

Seva : ${devotee.sevaInterest}

Total Persons : ${devotee.attendees}

Registration Amount : ₹${devotee.paymentAmount}

Transaction ID : ${devotee.razorpayPaymentId}

Family Members

${family}

Thank You 🙏
Hare Krishna`;
};

export const registerDevotee = async (req, res) => {
  try {
    const {
      fullName,
      spiritualName = "",
      email,
      phone,
      age,
      gender,
      village,
      city,
      pincode,
      state = "Assam",
      country = "India",
      center,
      attendees,
      foodPreference = "Prasadam (Sattvic Vegetarian)",
      arrivalDate,
      departureDate,
      sevaInterest = "None / Just attending",
      accommodation = false,
      notes = "",
      familyMembers = [],
      paymentAmount,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const required = { fullName, email, phone, age, gender, village, city, pincode, state, country, center, attendees, arrivalDate, departureDate, sevaInterest };
    const missing = Object.entries(required).find(([, value]) => value === undefined || value === null || String(value).trim() === "");
    if (missing) return res.status(400).json({ success: false, message: `${missing[0]} is required` });

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Razorpay payment details are required" });
    }

    const normalizedFamily = normalizeFamilyMembers(familyMembers);
    const totalPersons = 1 + normalizedFamily.length;
    const amount = Number(paymentAmount);

    // if (!Number.isFinite(amount) || amount !== totalPersons * 100) {
    //   return res.status(400).json({ success: false, message: "Invalid registration payment amount" });
    // }

    const paymentCheck = await verifyRazorpayPayment({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      expectedAmount: amount,
    });
    if (!paymentCheck.valid) return res.status(400).json({ success: false, message: paymentCheck.reason || "Payment verification failed" });

    // const existing = await Devotee.findOne({ razorpayPaymentId: razorpay_payment_id });
    // if (existing) return res.json({ success: true, data: existing, message: "Registration already saved" });

    const devotee = await Devotee.create({
      fullName: fullName.trim(),
      spiritualName: spiritualName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      age: Number(age),
      gender: gender.trim(),
      village: village.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      state: state.trim(),
      country: country.trim(),
      center: center.trim(),
      attendees: totalPersons,
      foodPreference: foodPreference.trim(),
      arrivalDate: String(arrivalDate).trim(),
      departureDate: String(departureDate).trim(),
      sevaInterest: sevaInterest.trim(),
      accommodation: Boolean(accommodation),
      notes: String(notes || "").trim(),
      familyMembers: normalizedFamily,
      paymentAmount: amount,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentStatus: "verified",
      paymentVerified: true,
    });

    try {
      await sendWhatsAppReceipt({ phone: devotee.phone, message: registrationReceipt(devotee) });
    } catch (whatsappError) {
      console.error("Registration WhatsApp error:", whatsappError.message);
    }

    return res.status(201).json({ success: true, data: devotee, message: "Registration successful" });
  } catch (error) {
    console.error("Register devotee error:", error);
    return res.status(400).json({ success: false, message: error.message || "Registration failed" });
  }
};

export const getDevotees = async (req, res) => {
  try {
    const devotees = await Devotee.find().sort({ createdAt: -1 });
    return res.json({ success: true, data: devotees });
  } catch (error) {
    console.error("Get devotees error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch registrations" });
  }
};

export const getDevoteeById = async (req, res) => {
  try {
    const devotee = await Devotee.findById(req.params.id);
    if (!devotee) return res.status(404).json({ success: false, message: "Registration not found" });
    return res.json({ success: true, data: devotee });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Invalid registration id" });
  }
};

export const updateDevotee = async (req, res) => {
  try {
    const allowed = [
      "fullName", "spiritualName", "email", "phone", "age", "gender", "village", "city", "pincode", "state", "country", "center",
      "attendees", "foodPreference", "arrivalDate", "departureDate", "sevaInterest", "accommodation", "notes", "familyMembers", "paymentAmount",
      "paymentStatus", "paymentVerified"
    ];
    const update = {};
    for (const key of allowed) if (req.body[key] !== undefined) update[key] = req.body[key];
    if (update.age !== undefined) update.age = Number(update.age);
    if (update.attendees !== undefined) update.attendees = Number(update.attendees);
    if (update.paymentAmount !== undefined) update.paymentAmount = Number(update.paymentAmount);
    if (Array.isArray(update.familyMembers)) update.familyMembers = normalizeFamilyMembers(update.familyMembers);

    const devotee = await Devotee.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!devotee) return res.status(404).json({ success: false, message: "Registration not found" });
    return res.json({ success: true, data: devotee, message: "Registration updated successfully" });
  } catch (error) {
    console.error("Update devotee error:", error);
    return res.status(400).json({ success: false, message: error.message || "Update failed" });
  }
};

export const deleteDevotee = async (req, res) => {
  try {
    const devotee = await Devotee.findByIdAndDelete(req.params.id);
    if (!devotee) return res.status(404).json({ success: false, message: "Registration not found" });
    return res.json({ success: true, message: "Registration deleted successfully" });
  } catch (error) {
    return res.status(400).json({ success: false, message: "Delete failed" });
  }
};
