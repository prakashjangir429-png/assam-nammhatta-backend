import "dotenv/config";
import { connectDB } from "../config/db.js";
import { processWhatsAppReceipts } from "../utils/whatsappCron.js";

export default async function handler(req, res) {

    try {

        if (req.method !== "GET") {
            return res.status(405).json({
                success: false,
                message: "Method not allowed",
            });
        }


        await connectDB();


        const result =
            await processWhatsAppReceipts();


        return res.status(200).json({
            success: true,
            message: "WhatsApp cron executed",
            data: result,
        });


    } catch (error) {

        console.error(
            "WhatsApp cron error:",
            error
        );


        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "WhatsApp cron failed",
        });
    }
}