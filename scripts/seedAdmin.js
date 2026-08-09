import "dotenv/config";
import { connectDB } from "../config/db.js";
import Admin from "../models/Admin.js";

await connectDB();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME || "Admin";

if (!email || !password) {
  console.error("ADMIN_EMAIL and ADMIN_PASSWORD are required in .env");
  process.exit(1);
}

const existing = await Admin.findOne({ email: email.toLowerCase() });

if (existing) {
  existing.name = name;
  existing.password = password;
  existing.active = true;
  await existing.save();
  console.log(`Admin updated: ${email}`);
} else {
  await Admin.create({ name, email: email.toLowerCase(), password });
  console.log(`Admin created: ${email}`);
}

process.exit(0);
