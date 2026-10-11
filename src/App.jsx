import { useReducer, useEffect } from 'react';
import { reducer, loadState, saveState, compute } from './store.js';
import Header from './components/Header.jsx';
import Summary from './components/Summary.jsx';
import AddTransaction from './components/AddTransaction.jsx';
import CategoryBreakdown from './components/CategoryBreakdown.jsx';
import TransactionList from './components/TransactionList.jsx';

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, loadState);

  // Save to the browser every time something changes.
  useEffect(() => {
    saveState(state);
  }, [state]);

  const m = compute(state);

  return (
    <div className="app">
      <Header state={state} dispatch={dispatch} />
      <main className="container">
        <Summary state={state} m={m} />
        <div className="two-col">
          <div className="stack">
            <AddTransaction dispatch={dispatch} balance={m.balance} />
            <CategoryBreakdown m={m} />
          </div>
          <TransactionList state={state} dispatch={dispatch} />
        </div>
      </main>
      <footer className="footer">Broke But Functional - every rupee counts.</footer>
    </div>
  );
}
