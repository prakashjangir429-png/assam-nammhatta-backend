import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const signToken = (admin) =>
  jwt.sign(
    { id: admin._id.toString(), role: admin.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!admin || !admin.active) {
      return res.status(401).json({ success: false, message: "Invalid login details" });
    }

    const valid = await admin.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ success: false, message: "Invalid login details" });
    }

    const token = signToken(admin);
    const safeAdmin = {
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    };

    return res.json({ success: true, token, admin: safeAdmin });
  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
