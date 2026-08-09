import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import devoteeRoutes from "./routes/devoteeRoutes.js";
import "./utils/whatsappCron.js";

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length ? allowedOrigins : true,
  credentials: true,
}));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ success: true, message: "Assam Nammhatta API is running" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "OK" });
});


// https://assam-nammhatta-node.vercel.app
app.use("/api/admin", authRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/devotees", devoteeRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "API route not found" });
});



app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Server error" });
});

export default app;
