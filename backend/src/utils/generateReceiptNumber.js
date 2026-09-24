// ─────────────────────────────────────────────────────────
// Utility: Receipt Number Generator
// ─────────────────────────────────────────────────────────
import Payment from '../models/Payment.js';

/**
 * Generates a sequential receipt number like REC-1050.
 * Finds the highest existing receipt number and increments it.
 */
export const generateReceiptNumber = async () => {
  const lastPayment = await Payment.findOne({}, { receiptNo: 1 })
    .sort({ createdAt: -1 })
    .lean();

  if (!lastPayment || !lastPayment.receiptNo) {
    return 'REC-1001';
  }

  const parts  = lastPayment.receiptNo.split('-');
  const num    = parseInt(parts[1], 10);
  const next   = isNaN(num) ? 1001 : num + 1;
  return `REC-${next}`;
};
