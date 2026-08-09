import cron from "node-cron";
import Devotee from "../models/Devotee.js";
import { sendWhatsAppReceipt } from "./whatsapp.js";

const registrationReceipt = (devotee) => {
    const family = devotee.familyMembers?.length
        ? devotee.familyMembers
            .map(
                (m, i) =>
                    `${i + 1}. ${m.name}\n` +
                    `Age : ${m.age ?? "-"}\n` +
                    `Gender : ${m.gender}\n` +
                    `Phone : ${m.phone}\n` +
                    `Address : ${m.address}`
            )
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

let isRunning = false;

const processWhatsAppReceipts = async () => {
    if (isRunning) {
        console.log("WhatsApp cron is already running...");
        return;
    }

    isRunning = true;

    try {
        console.log("Checking pending WhatsApp receipts...");

        const devotees = await Devotee.find({
            paymentStatus: "verified",
            paymentVerified: true,

            $or: [
                {
                    whatsappStatus: {
                        $in: ["pending", "failed"],
                    },
                },
                {
                    whatsappStatus: { $exists: false },
                },
            ],

            $or: [
                {
                    whatsappAttempts: {
                        $lt: 10,
                    },
                },
                {
                    whatsappAttempts: {
                        $exists: false,
                    },
                },
            ],
        })
            .sort({ createdAt: 1 })
            .limit(10);

        if (!devotees.length) {
            console.log("No pending WhatsApp receipts.");
            return;
        }

        console.log(`Found ${devotees.length} pending WhatsApp receipts.`);

        for (const devotee of devotees) {
            try {
                await Devotee.findByIdAndUpdate(devotee._id, {
                    $inc: {
                        whatsappAttempts: 1,
                    },
                    $set: {
                        whatsappError: null,
                    },
                });

                const message = registrationReceipt(devotee);

                await sendWhatsAppReceipt({
                    phone: devotee.phone,
                    message,
                });

                await Devotee.findByIdAndUpdate(devotee._id, {
                    $set: {
                        whatsappStatus: "sent",
                        whatsappSentAt: new Date(),
                        whatsappError: null,
                    },
                });

                console.log(
                    `WhatsApp receipt sent successfully: ${devotee.fullName}`
                );
            } catch (error) {
                console.error(
                    `WhatsApp failed for ${devotee.fullName}:`,
                    error.message
                );

                await Devotee.findByIdAndUpdate(devotee._id, {
                    $set: {
                        whatsappStatus: "failed",
                        whatsappError: error.message || "WhatsApp sending failed",
                    },
                });
            }
        }
    } catch (error) {
        console.error("WhatsApp cron error:", error);
    } finally {
        isRunning = false;
    }
};

// Every 2 minutes
cron.schedule("*/2 * * * *", processWhatsAppReceipts);

console.log("WhatsApp receipt cron started - runs every 2 minutes");