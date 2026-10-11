import { LIMITS, TOTAL_DAYS } from '../constants.js';

// Cleans free text: removes hidden control characters and angle brackets,
// squeezes extra spaces, and cuts the text to a maximum length.
export function sanitizeText(value, max = LIMITS.maxNote) {
  return String(value ?? '')
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

// Turns an input into a safe money amount, or null if it is not valid.
export function parseAmount(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return null;
  const rounded = Math.round(n * 100) / 100;
  if (rounded <= 0 || rounded > LIMITS.maxAmount) return null;
  return rounded;
}

// Turns an input into a day number from 1 to 30, or null if invalid.
export function parseDay(value) {
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > TOTAL_DAYS) return null;
  return n;
}

export function sanitizeId(value) {
  const clean = String(value ?? '').replace(/[^\w-]/g, '').slice(0, 40);
  return clean || null;
}
