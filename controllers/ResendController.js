import nodemailer from "nodemailer";
import Donation from "../models/Donation.js";
import { sendWhatsAppReceipt } from "../utils/whatsapp.js";
import Devotee from "../models/Devotee.js";

const donationEmailHtml = (donation) => {
    const transactionId =
        donation.razorpayPaymentId ||
        donation.transactionId ||
        "-";

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Donation Successful</title>
</head>

<body style="
  margin: 0;
  padding: 0;
  background-color: #f5f3ef;
  font-family: Arial, Helvetica, sans-serif;
  color: #333333;
">

  <table
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color: #f5f3ef; padding: 35px 15px;"
  >
    <tr>
      <td align="center">

        <!-- Main Container -->
        <table
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width: 600px;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 18px rgba(0,0,0,0.08);
          "
        >

          <!-- Header -->
          <tr>
            <td
              align="center"
              style="
                padding: 32px 25px;
                background: linear-gradient(135deg, #fff4dc, #fffaf0);
                border-bottom: 1px solid #eee3ce;
              "
            >

              <div style="
                font-size: 28px;
                margin-bottom: 8px;
              ">
                🙏
              </div>

              <h1 style="
                margin: 0;
                font-size: 24px;
                color: #7a4b18;
                font-weight: 700;
              ">
                HARE KRISHNA
              </h1>

              <p style="
                margin: 8px 0 0;
                font-size: 14px;
                color: #8b7355;
                letter-spacing: 0.5px;
              ">
                ASSAM NAMHATTA SANGHA
              </p>

            </td>
          </tr>


          <!-- Success Section -->
          <tr>
            <td align="center" style="padding: 30px 25px 15px;">

              <div style="
                display: inline-block;
                background-color: #eaf8ef;
                color: #218739;
                padding: 8px 18px;
                border-radius: 30px;
                font-size: 13px;
                font-weight: 600;
              ">
                ✓ PAYMENT SUCCESSFUL
              </div>

              <h2 style="
                margin: 18px 0 8px;
                font-size: 25px;
                color: #333333;
              ">
                Thank You for Your Donation
              </h2>

              <p style="
                margin: 0;
                color: #777777;
                font-size: 14px;
                line-height: 1.6;
              ">
                Your generous contribution has been successfully received.
              </p>

            </td>
          </tr>


          <!-- Amount -->
          <tr>
            <td align="center" style="padding: 20px 25px;">

              <div style="
                background-color: #fff8e9;
                border: 1px solid #f1dfb8;
                border-radius: 12px;
                padding: 20px;
              ">

                <p style="
                  margin: 0 0 6px;
                  font-size: 12px;
                  color: #96784f;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                ">
                  Donation Amount
                </p>

                <div style="
                  font-size: 32px;
                  font-weight: 700;
                  color: #8a4f16;
                ">
                  ₹${donation.amount}
                </div>

              </div>

            </td>
          </tr>


          <!-- Donor Details -->
          <tr>
            <td style="padding: 10px 25px 25px;">

              <h3 style="
                margin: 0 0 15px;
                font-size: 17px;
                color: #333333;
              ">
                Donation Details
              </h3>

              <table
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  border: 1px solid #eeeeee;
                  border-radius: 10px;
                  overflow: hidden;
                "
              >

                <tr>
                  <td style="
                    padding: 13px 15px;
                    background-color: #fafafa;
                    color: #777777;
                    font-size: 13px;
                    width: 40%;
                  ">
                    Donor Name
                  </td>

                  <td style="
                    padding: 13px 15px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #333333;
                  ">
                    ${donation.name}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 13px 15px;
                    background-color: #fafafa;
                    color: #777777;
                    font-size: 13px;
                  ">
                    Mobile
                  </td>

                  <td style="
                    padding: 13px 15px;
                    font-size: 14px;
                    color: #333333;
                  ">
                    ${donation.phone}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 13px 15px;
                    background-color: #fafafa;
                    color: #777777;
                    font-size: 13px;
                  ">
                    Email
                  </td>

                  <td style="
                    padding: 13px 15px;
                    font-size: 14px;
                    color: #333333;
                    word-break: break-word;
                  ">
                    ${donation.email || "-"}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 13px 15px;
                    background-color: #fafafa;
                    color: #777777;
                    font-size: 13px;
                  ">
                    Payment Mode
                  </td>

                  <td style="
                    padding: 13px 15px;
                    font-size: 14px;
                    color: #333333;
                  ">
                    ${donation.paymentMode || "UPI"}
                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 13px 15px;
                    background-color: #fafafa;
                    color: #777777;
                    font-size: 13px;
                  ">
                    Payment Status
                  </td>

                  <td style="
                    padding: 13px 15px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #218739;
                  ">
                    Verified
                  </td>
                </tr>

              </table>

            </td>
          </tr>


          <!-- Transaction ID -->
          <tr>
            <td style="padding: 0 25px 25px;">

              <div style="
                background-color: #f8f8f8;
                border-radius: 10px;
                padding: 15px;
                text-align: center;
              ">

                <p style="
                  margin: 0 0 6px;
                  font-size: 11px;
                  color: #888888;
                  text-transform: uppercase;
                  letter-spacing: 0.8px;
                ">
                  Transaction ID
                </p>

                <p style="
                  margin: 0;
                  font-size: 13px;
                  font-weight: 600;
                  color: #444444;
                  word-break: break-all;
                ">
                  ${transactionId}
                </p>

              </div>

            </td>
          </tr>


          <!-- Thank You -->
          <tr>
            <td
              align="center"
              style="
                padding: 25px;
                background-color: #fffaf2;
                border-top: 1px solid #eee6d8;
              "
            >

              <p style="
                margin: 0 0 8px;
                font-size: 18px;
                color: #7a4b18;
                font-weight: 600;
              ">
                Thank You for Your Seva 🙏
              </p>

              <p style="
                margin: 0;
                font-size: 13px;
                line-height: 1.7;
                color: #777777;
                max-width: 450px;
              ">
                Your support helps us continue our spiritual and
                community service initiatives.
              </p>

              <p style="
                margin: 18px 0 0;
                font-size: 14px;
                font-weight: 600;
                color: #7a4b18;
              ">
                Hare Krishna 🙏
              </p>

            </td>
          </tr>


          <!-- Footer -->
          <tr>
            <td
              align="center"
              style="
                padding: 18px 25px;
                background-color: #ffffff;
              "
            >

              <p style="
                margin: 0;
                font-size: 11px;
                color: #aaaaaa;
                line-height: 1.6;
              ">
                This is an automated confirmation email.
                Please keep this email for your records.
              </p>

              <p style="
                margin: 8px 0 0;
                font-size: 11px;
                color: #aaaaaa;
              ">
                © ${new Date().getFullYear()} Assam Namhatta Sangha
              </p>

            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
    },
});

const sendDonationEmail = async (donation) => {
    if (!donation.email) {
        throw new Error("Donor email is not available");
    }

    await transporter.sendMail({
        from: `"Assam Namhatta Sangha" <${process.env.MAIL_USER}>`,
        to: donation.email,
        subject: "🙏 Donation Successful - Assam Namhatta Sangha",
        html: donationEmailHtml(donation),
    });
};

export const resendDonationConfirmation = async (req, res) => {
    try {
        const { id } = req.params;
        const { type = "both" } = req.body;

        // type:
        // whatsapp
        // email
        // both

        if (!["whatsapp", "email", "both"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "Invalid notification type",
            });
        }

        const donation = await Donation.findById(id);

        if (!donation) {
            return res.status(404).json({
                success: false,
                message: "Donation not found",
            });
        }

        // Only send confirmation for verified payment
        if (
            donation.paymentStatus !== "verified" ||
            !donation.paymentVerified
        ) {
            return res.status(400).json({
                success: false,
                message: "Confirmation can only be sent for a verified donation",
            });
        }

        const result = {
            whatsapp: {
                attempted: false,
                success: false,
                message: "",
            },
            email: {
                attempted: false,
                success: false,
                message: "",
            },
        };

        // --------------------------------
        // WhatsApp
        // --------------------------------
        if (type === "whatsapp" || type === "both") {
            result.whatsapp.attempted = true;

            if (!donation.phone) {
                result.whatsapp.message = "Phone number is not available";
            } else {
                try {
                    await sendWhatsAppReceipt({
                        phone: donation.phone,
                        message: donationReceipt(donation),
                    });

                    result.whatsapp.success = true;
                    result.whatsapp.message = "WhatsApp sent successfully";
                } catch (error) {
                    console.error(
                        "Resend donation WhatsApp error:",
                        error.message
                    );

                    result.whatsapp.message =
                        error.message || "Failed to send WhatsApp";
                }
            }
        }
        if (type === "email" || type === "both") {
            result.email.attempted = true;

            if (!donation.email) {
                result.email.message = "Email address is not available";
            } else {
                try {
                    await sendDonationEmail(donation);

                    result.email.success = true;
                    result.email.message = "Email sent successfully";
                } catch (error) {
                    console.error(
                        "Resend donation email error:",
                        error.message
                    );

                    result.email.message =
                        error.message || "Failed to send email";
                }
            }
        }

        const whatsappSuccess = result.whatsapp.success;
        const emailSuccess = result.email.success;

        const overallSuccess =
            type === "whatsapp"
                ? whatsappSuccess
                : type === "email"
                    ? emailSuccess
                    : whatsappSuccess || emailSuccess;

        return res.status(overallSuccess ? 200 : 500).json({
            success: overallSuccess,
            message: overallSuccess
                ? "Confirmation notification sent successfully"
                : "Failed to send confirmation notification",
            data: {
                donationId: donation._id,
                result,
            },
        });
    } catch (error) {
        console.error(
            "Resend donation confirmation error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to resend confirmation",
        });
    }
};


export const resendDevoteeConfirmation = async (req, res) => {
  try {
    const { id } = req.params;
    const { type = "both" } = req.body;

    // Allowed:
    // whatsapp
    // email
    // both
    if (!["whatsapp", "email", "both"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be whatsapp, email or both",
      });
    }

    const devotee = await Devotee.findById(id);

    if (!devotee) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Only verified registrations
    if (
      devotee.paymentStatus !== "verified" ||
      !devotee.paymentVerified
    ) {
      return res.status(400).json({
        success: false,
        message: "Payment is not verified",
      });
    }

    const result = {
      whatsapp: null,
      email: null,
    };

    // ======================================================
    // WHATSAPP
    // ======================================================

    if (type === "whatsapp" || type === "both") {
      try {
        if (!devotee.phone) {
          throw new Error("Phone number is not available");
        }

        await sendWhatsAppReceipt({
          phone: devotee.phone,
          message: registrationReceipt(devotee),
        });

        devotee.whatsappStatus = "sent";
        devotee.whatsappSentAt = new Date();
        devotee.whatsappAttempts =
          (devotee.whatsappAttempts || 0) + 1;
        devotee.whatsappError = null;

        result.whatsapp = {
          success: true,
          message: "WhatsApp sent successfully",
        };
      } catch (error) {
        console.error(
          "Resend devotee WhatsApp error:",
          error
        );

        devotee.whatsappStatus = "failed";
        devotee.whatsappAttempts =
          (devotee.whatsappAttempts || 0) + 1;
        devotee.whatsappError = error.message;

        result.whatsapp = {
          success: false,
          message:
            error.message || "WhatsApp sending failed",
        };
      }
    }

    // ======================================================
    // EMAIL
    // ======================================================

    if (type === "email" || type === "both") {
      try {
        if (!devotee.email) {
          throw new Error("Email address is not available");
        }

        await sendRegistrationEmail(devotee);

        devotee.emailStatus = "sent";
        devotee.emailSentAt = new Date();
        devotee.emailAttempts =
          (devotee.emailAttempts || 0) + 1;
        devotee.emailError = null;

        result.email = {
          success: true,
          message: "Email sent successfully",
        };
      } catch (error) {
        console.error(
          "Resend devotee email error:",
          error
        );

        devotee.emailStatus = "failed";
        devotee.emailAttempts =
          (devotee.emailAttempts || 0) + 1;
        devotee.emailError = error.message;

        result.email = {
          success: false,
          message:
            error.message || "Email sending failed",
        };
      }
    }

    await devotee.save();

    const requestedResults = [];

    if (type === "whatsapp" || type === "both") {
      requestedResults.push(result.whatsapp?.success);
    }

    if (type === "email" || type === "both") {
      requestedResults.push(result.email?.success);
    }

    const allSuccessful =
      requestedResults.every(Boolean);

    return res.json({
      success: allSuccessful,
      message: allSuccessful
        ? "Confirmation sent successfully"
        : "Some confirmations could not be sent",
      data: {
        whatsapp: result.whatsapp,
        email: result.email,
      },
    });
  } catch (error) {
    console.error(
      "Resend devotee confirmation error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Unable to resend confirmation",
    });
  }
};