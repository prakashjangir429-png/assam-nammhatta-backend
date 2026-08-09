import crypto from "crypto";
import { razorpay } from "../config/razorpay.js";

export const createRazorpayOrder = async ({ amount, receipt }) => {
  const amountInPaise = Math.round(Number(amount) * 100);

  if (!Number.isFinite(amountInPaise) || amountInPaise < 100) {
    const error = new Error("Invalid payment amount");
    error.statusCode = 400;
    throw error;
  }

  return razorpay.orders.create({
    amount: amountInPaise,
    currency: "INR",
    receipt,
  });
};

export const verifyRazorpaySignature = ({ orderId, paymentId, signature }) => {
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
};

export const verifyRazorpayPayment = async ({ orderId, paymentId, signature, expectedAmount }) => {
  const signatureValid = verifyRazorpaySignature({ orderId, paymentId, signature });
  if (!signatureValid) return { valid: false, reason: "Invalid Razorpay signature" };

  const [order, payment] = await Promise.all([
    razorpay.orders.fetch(orderId),
    razorpay.payments.fetch(paymentId),
  ]);

  const expectedPaise = Math.round(Number(expectedAmount) * 100);
  if (order.id !== orderId || Number(order.amount) !== expectedPaise) {
    return { valid: false, reason: "Payment amount does not match order" };
  }

  if (payment.order_id !== orderId) {
    return { valid: false, reason: "Payment does not belong to order" };
  }

  if (payment.status !== "captured") {
    return { valid: false, reason: `Payment status is ${payment.status}` };
  }

  return { valid: true, order, payment };
};
