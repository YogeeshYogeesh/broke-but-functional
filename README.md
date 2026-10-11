# Broke But Functional: Survive the Month

A responsive, browser-based personal-finance challenge. Start with ₹10,000 for 30 days and see how each decision affects your available balance, safe daily spending, bills, savings goals, risk level, financial-health score, and end-of-month forecast.

## Run locally

Requirements: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Test and production build

```bash
npm test
npm run build
npm run preview
```

The project uses React 18, Vite, Vitest, and React Testing Library. The simulator is lazy-loaded to keep the initial application bundle lean.

## Features

- A 30-day challenge with a ₹10,000 starting balance and a day-progress indicator.
- Income and expense transactions, category breakdown, and transaction removal.
- Upcoming subscriptions and commitments that inform the safe-to-spend calculation.
- Savings goals with guarded contributions and progress indicators.
- Quick unexpected-expense actions.
- A month-end balance forecast and contextual financial tips.
- A what-if simulator to preview the effect of a purchase or decision before applying it.
- Risk level and a financial-health score.
- Browser-local persistence, with stored data validated when it is loaded.

## Project structure

```text
src/
  components/   Small, focused interface components
  hooks/        React hook that connects application state to the UI
  logic/        Pure financial calculations, insights, and simulation logic
  state/        Initial state, reducer, validation, and browser storage
  utils/        Amount/text sanitization, IDs, and formatting
  test/         Shared test setup
```

The reducer is the single state-update path. Incoming transactions, obligations, goals, and savings contributions are checked before they can change state. Financial calculations are kept outside presentation components so they can be tested independently.

## Responsive design and accessibility

- Fluid container widths and responsive grid breakpoints for desktop, tablet, mobile, and narrow phones.
- Form rows, summary cards, transaction rows, and comparison tables adapt to small screens.
- Semantic landmarks and labelled regions, a keyboard skip link, visible focus indicators, and labelled form controls.
- Accessible progress-bar values and descriptive text for the forecast chart.
- Status/error announcements where appropriate and reduced-motion support.
- Touch-friendly control sizes and clear focus/hover states.

## Data and privacy

This is a frontend-only project. User data is stored in the current browser and is not synchronized across devices or accounts. User-provided text and numeric values are sanitized, and persisted data is validated before it is used. React renders user text normally; the app does not use `dangerouslySetInnerHTML`.

## Pre-deployment checklist

1. Run `npm test` and `npm run build`.
2. Test adding/deleting income and expenses.
3. Advance and reset the challenge day.
4. Add/delete bills and verify the safe daily allowance.
5. Create, contribute to, and delete savings goals.
6. Preview simulator decisions and verify that applying a decision updates the figures.
7. Refresh the page and verify local persistence.
8. Use the app with keyboard navigation and inspect at narrow mobile widths.
9. Verify the deployed URL after deployment.

The application is a budgeting exercise and educational tool, not professional financial advice.
