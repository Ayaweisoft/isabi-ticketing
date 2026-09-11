// Buyer-facing service fee added on top of the ticket price at checkout —
// mirrors i-sabi-server's common/utils.js computeExternalServiceFee exactly
// (1.5% of the base ticket total, capped at ₦1,500). Must stay in sync with
// that server-side constant; nothing here is authoritative on its own since
// the amount actually charged is whatever this app tells Paystack to charge.
export const SERVICE_FEE_RATE = 0.015
export const SERVICE_FEE_CAP = 1500

export const computeServiceFee = (baseAmount) =>
  Math.round(Math.min((Number(baseAmount) || 0) * SERVICE_FEE_RATE, SERVICE_FEE_CAP) * 100) / 100

export default computeServiceFee
