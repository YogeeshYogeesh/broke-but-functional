import { CATEGORY_ICONS, LIMITS, START_BALANCE, TOTAL_DAYS } from '../constants.js';
import { initialState } from './initialState.js';
import { makeId } from '../utils/id.js';
import { parseAmount, parseDay, sanitizeId, sanitizeText } from '../utils/sanitize.js';

const TYPES = ['income', 'expense', 'saving'];
const OBLIGATION_KINDS = ['subscription', 'commitment'];
const KNOWN_CATEGORIES = Object.keys(CATEGORY_ICONS);

const isObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Every cleaner returns a safe object, or null if the item is not usable.
export function cleanTransaction(raw) {
  if (!isObject(raw)) return null;
  const type = TYPES.includes(raw.type) ? raw.type : null;
  const amount = parseAmount(raw.amount);
  const day = parseDay(raw.day);
  if (!type || amount === null || day === null) return null;

  const clean = {
    id: sanitizeId(raw.id) || makeId(),
    type,
    amount,
    day,
    category: KNOWN_CATEGORIES.includes(raw.category) ? raw.category : 'Other',
    note: sanitizeText(raw.note, LIMITS.maxNote),
    kind: raw.kind === 'oneoff' ? 'oneoff' : 'regular',
  };
  if (type === 'saving') {
    clean.goalId = sanitizeId(raw.goalId);
    if (!clean.goalId) return null;
  }
  return clean;
}

export function cleanObligation(raw) {
  if (!isObject(raw)) return null;
  const kind = OBLIGATION_KINDS.includes(raw.kind) ? raw.kind : null;
  const name = sanitizeText(raw.name, LIMITS.maxName);
  const amount = parseAmount(raw.amount);
  const day = parseDay(raw.day);
  if (!kind || !name || amount === null || day === null) return null;
  return { id: sanitizeId(raw.id) || makeId(), kind, name, amount, day };
}

export function cleanGoal(raw) {
  if (!isObject(raw)) return null;
  const name = sanitizeText(raw.name, LIMITS.maxName);
  const target = parseAmount(raw.target);
  if (!name || target === null) return null;
  return { id: sanitizeId(raw.id) || makeId(), name, target };
}

// Rebuilds a whole saved state from untrusted data (the browser storage).
export function sanitizeState(raw) {
  if (!isObject(raw)) return initialState;

  const list = (v) => (Array.isArray(v) ? v.slice(0, LIMITS.maxItems) : []);
  const day = Number(raw.currentDay);
  const currentDay = Number.isInteger(day) ? Math.min(TOTAL_DAYS, Math.max(1, day)) : 1;

  const goals = list(raw.goals).map(cleanGoal).filter(Boolean);
  const goalIds = new Set(goals.map((g) => g.id));

  const transactions = list(raw.transactions)
    .map(cleanTransaction)
    .filter(Boolean)
    .filter((t) => t.type !== 'saving' || goalIds.has(t.goalId))
    .map((t) => (t.day > currentDay ? { ...t, day: currentDay } : t));

  const obligations = list(raw.obligations).map(cleanObligation).filter(Boolean);

  return { startingBalance: START_BALANCE, currentDay, transactions, obligations, goals };
}
