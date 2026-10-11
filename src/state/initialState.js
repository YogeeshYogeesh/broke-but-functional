import { START_BALANCE } from '../constants.js';

export const initialState = {
  startingBalance: START_BALANCE,
  currentDay: 1,
  transactions: [],
  obligations: [],
  goals: [],
};
