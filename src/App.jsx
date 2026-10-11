import { lazy, Suspense } from 'react';
import { useFinance } from './hooks/useFinance.js';
import Header from './components/Header.jsx';
import Summary from './components/Summary.jsx';
import ForecastChart from './components/ForecastChart.jsx';
import Insights from './components/Insights.jsx';
import AddTransaction from './components/AddTransaction.jsx';
import SurpriseExpenses from './components/SurpriseExpenses.jsx';
import Obligations from './components/Obligations.jsx';
import Goals from './components/Goals.jsx';
import CategoryBreakdown from './components/CategoryBreakdown.jsx';
import TransactionList from './components/TransactionList.jsx';

// The simulator is loaded only when the page needs it.
const Simulator = lazy(() => import('./components/Simulator.jsx'));

export default function App() {
  const { state, dispatch, metrics: m } = useFinance();

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to main content
      </a>
      <Header currentDay={state.currentDay} dispatch={dispatch} />
      <main id="main" className="container" tabIndex={-1}>
        <Summary m={m} />

        <div className="grid-2">
          <ForecastChart m={m} />
          <Insights m={m} />
        </div>

        <div className="grid-2">
          <div className="stack">
            <AddTransaction dispatch={dispatch} balance={m.balance} />
            <SurpriseExpenses dispatch={dispatch} />
            <Suspense fallback={<p className="empty" role="status">Loading simulator...</p>}>
              <Simulator state={state} dispatch={dispatch} />
            </Suspense>
          </div>
          <div className="stack">
            <Obligations
              obligations={state.obligations}
              currentDay={state.currentDay}
              dispatch={dispatch}
            />
            <Goals goals={m.goalProgress} balance={m.balance} dispatch={dispatch} />
            <CategoryBreakdown m={m} />
            <TransactionList
              transactions={state.transactions}
              goals={state.goals}
              dispatch={dispatch}
            />
          </div>
        </div>
      </main>
      <footer className="footer">Broke But Functional. Every rupee counts.</footer>
    </div>
  );
}
