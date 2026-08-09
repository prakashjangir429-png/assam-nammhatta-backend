export const sendWhatsAppReceipt = async ({ phone, message }) => {
  const senderId = process.env.WHATSAPP_SENDER_ID;
  const authToken = process.env.WHATSAPP_AUTH_TOKEN;
  const apiUrl = process.env.WHATSAPP_API_URL || "https://waapi.waclub.in/api/v1/";

  if (!senderId || !authToken) {
    console.warn("WhatsApp credentials are not configured; receipt was not sent.");
    return { skipped: true };
  }

  const receiverId = String(phone || "").replace(/\D/g, "").slice(-10);
  if (receiverId.length !== 10) {
    throw new Error("Invalid WhatsApp receiver phone number");
  }

  const url = new URL(apiUrl);
  url.searchParams.set("action", "send");
  url.searchParams.set("senderId", senderId);
  url.searchParams.set("receiverId", receiverId);
  url.searchParams.set("messageText", message);
  url.searchParams.set("authToken", authToken);

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(`WhatsApp API failed with status ${response.status}`);
  }

  return data;
};
