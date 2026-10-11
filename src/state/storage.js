import { STORAGE_KEY } from '../constants.js';
import { initialState } from './initialState.js';
import { sanitizeState } from './validate.js';

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return sanitizeState(JSON.parse(raw));
  } catch (e) {
    // Broken saved data: start fresh instead of crashing.
  }
  return initialState;
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    // Saving can fail (private mode, full storage). The app still works.
  }
}
