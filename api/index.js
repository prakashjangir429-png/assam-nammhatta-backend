import "dotenv/config";
import app from "../app.js";
import { connectDB } from "../config/db.js";

let dbPromise;

export default async function handler(req, res) {
  if (!dbPromise) dbPromise = connectDB();
  await dbPromise;
  return app(req, res);
}
