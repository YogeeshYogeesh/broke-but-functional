import { useEffect, useMemo, useReducer } from 'react';
import { computeFinance } from '../logic/finance.js';
import { reducer } from '../state/reducer.js';
import { loadState, saveState } from '../state/storage.js';

// Connects the data, the calculations and the browser storage in one place.
export function useFinance() {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const metrics = useMemo(() => computeFinance(state), [state]);
  return { state, dispatch, metrics };
}
