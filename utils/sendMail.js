import nodemailer from "nodemailer";


const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

export const registrationEmailHtml = (devotee) => {
  const transactionId =
    devotee.razorpayPaymentId ||
    devotee.transactionId ||
    "-";

  const familyMembers = devotee.familyMembers?.length
    ? devotee.familyMembers
        .map(
          (member, index) => `
            <tr>
              <td style="padding:10px;border-bottom:1px solid #eee;">
                ${index + 1}
              </td>
              <td style="padding:10px;border-bottom:1px solid #eee;">
                ${escapeHtml(member.name || "-")}
              </td>
              <td style="padding:10px;border-bottom:1px solid #eee;">
                ${escapeHtml(member.age ?? "-")}
              </td>
              <td style="padding:10px;border-bottom:1px solid #eee;">
                ${escapeHtml(member.gender || "-")}
              </td>
              <td style="padding:10px;border-bottom:1px solid #eee;">
                ${escapeHtml(member.phone || "-")}
              </td>
              <td style="padding:10px;border-bottom:1px solid #eee;">
                ${escapeHtml(member.address || "-")}
              </td>
            </tr>
          `
        )
        .join("")
    : `
        <tr>
          <td colspan="6" style="padding:15px;text-align:center;">
            No family members
          </td>
        </tr>
      `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Registration Confirmation</title>
</head>

<body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f7fb;padding:30px 10px;">
<tr>
<td align="center">

<table
  width="680"
  cellpadding="0"
  cellspacing="0"
  style="
    max-width:680px;
    width:100%;
    background:#ffffff;
    border-radius:14px;
    overflow:hidden;
    box-shadow:0 4px 18px rgba(0,0,0,0.08);
  "
>

<!-- HEADER -->
<tr>
<td style="background:#8b1e1e;padding:28px 25px;text-align:center;color:#ffffff;">

  <div style="font-size:26px;font-weight:bold;">
    🙏 HARE KRISHNA
  </div>

  <div style="font-size:18px;margin-top:8px;">
    ASSAM NAMHATTA SANGHA
  </div>

  <div style="
    display:inline-block;
    margin-top:18px;
    padding:8px 18px;
    background:#ffffff;
    color:#188038;
    border-radius:30px;
    font-size:14px;
    font-weight:bold;
  ">
    ✓ REGISTRATION SUCCESSFUL
  </div>

</td>
</tr>

<!-- INTRO -->
<tr>
<td style="padding:30px 28px 10px;">

  <h2 style="margin:0 0 10px;color:#222;">
    Hare Krishna ${escapeHtml(devotee.fullName)}
  </h2>

  <p style="margin:0;color:#666;line-height:1.6;">
    Thank you for registering with Assam Namhatta Sangha.
    Your registration and payment have been successfully confirmed.
  </p>

</td>
</tr>

<!-- AMOUNT -->
<tr>
<td style="padding:20px 28px;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="
  background:#fff8e8;
  border:1px solid #f2d58a;
  border-radius:10px;
  padding:20px;
">

  <div style="font-size:13px;color:#777;">
    REGISTRATION AMOUNT
  </div>

  <div style="
    font-size:30px;
    font-weight:bold;
    color:#8b1e1e;
    margin-top:5px;
  ">
    ₹${escapeHtml(devotee.paymentAmount)}
  </div>

  <div style="font-size:13px;color:#666;margin-top:8px;">
    Payment Status:
    <strong style="color:#188038;">Verified</strong>
  </div>

</td>
</tr>
</table>

</td>
</tr>

<!-- DEVOTEE DETAILS -->
<tr>
<td style="padding:10px 28px;">

<h3 style="color:#8b1e1e;margin-bottom:15px;">
  Registration Details
</h3>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">

<tr>
<td style="padding:9px 0;color:#777;width:40%;">Full Name</td>
<td style="padding:9px 0;font-weight:bold;">
  ${escapeHtml(devotee.fullName)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Spiritual Name</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.spiritualName || "-")}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Mobile</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.phone)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Email</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.email)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Age</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.age)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Gender</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.gender)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Village</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.village)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">City</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.city)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">State</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.state)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Pincode</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.pincode)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Center</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.center)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Total Persons</td>
<td style="padding:9px 0;font-weight:bold;">
  ${escapeHtml(devotee.attendees)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Food Preference</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.foodPreference)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Arrival Date</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.arrivalDate)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Departure Date</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.departureDate)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Accommodation</td>
<td style="padding:9px 0;">
  ${devotee.accommodation ? "YES" : "NO"}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">Seva Interest</td>
<td style="padding:9px 0;">
  ${escapeHtml(devotee.sevaInterest)}
</td>
</tr>

</table>

</td>
</tr>

<!-- FAMILY MEMBERS -->
<tr>
<td style="padding:20px 28px;">

<h3 style="color:#8b1e1e;margin-bottom:15px;">
  Family Members
</h3>

<table
  width="100%"
  cellpadding="0"
  cellspacing="0"
  style="border-collapse:collapse;font-size:13px;"
>

<tr style="background:#f5f5f5;">
  <th style="padding:10px;text-align:left;">#</th>
  <th style="padding:10px;text-align:left;">Name</th>
  <th style="padding:10px;text-align:left;">Age</th>
  <th style="padding:10px;text-align:left;">Gender</th>
  <th style="padding:10px;text-align:left;">Phone</th>
  <th style="padding:10px;text-align:left;">Address</th>
</tr>

${familyMembers}

</table>

</td>
</tr>

<!-- PAYMENT -->
<tr>
<td style="padding:10px 28px 20px;">

<h3 style="color:#8b1e1e;">
  Payment Details
</h3>

<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">

<tr>
<td style="padding:9px 0;color:#777;">
  Transaction ID
</td>
<td style="padding:9px 0;font-weight:bold;word-break:break-all;">
  ${escapeHtml(transactionId)}
</td>
</tr>

<tr>
<td style="padding:9px 0;color:#777;">
  Payment Status
</td>
<td style="padding:9px 0;color:#188038;font-weight:bold;">
  Verified
</td>
</tr>

</table>

</td>
</tr>

<!-- THANK YOU -->
<tr>
<td style="
  background:#faf6ed;
  padding:25px;
  text-align:center;
">

<div style="font-size:18px;font-weight:bold;color:#8b1e1e;">
  Thank You 🙏
</div>

<p style="margin:10px 0 0;color:#666;">
  We look forward to welcoming you.
</p>

<div style="margin-top:12px;font-weight:bold;">
  Hare Krishna
</div>

</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="
  padding:18px;
  text-align:center;
  font-size:12px;
  color:#999;
">
  Assam Namhatta Sangha<br/>
  This is an automated registration confirmation email.
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

export const sendRegistrationEmail = async (devotee) => {
  return transporter.sendMail({
    from: `"Assam Namhatta Sangha" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: devotee.email,
    subject: "🙏 Registration Successful - Assam Namhatta Sangha",
    html: registrationEmailHtml(devotee),
  });
};