# Broke But Functional - Survive the Month

A personal finance app for Gen Z. You get Rs 10,000 for 30 days. Every decision you make changes your balance, daily allowance, savings goals, month forecast, risk level and health score.

Built with **React 18 + Vite**. Tests use **Vitest + React Testing Library**. No backend: data is saved in the browser and validated every time it is loaded.

## Run it

```
npm install
npm run dev
```

## Run the tests

```
npm test
```

## What the app does

| Requirement | Where it lives |
| --- | --- |
| Rs 10,000 budget over 30 days | `src/constants.js`, header day tracker |
| Income and balance | Add a transaction panel, "Money left" card |
| Spending tracking | Transactions list, "Where your money goes" |
| Daily allowance | "Safe to spend per day" card (already removes upcoming bills) |
| Commitments and subscriptions | Subscriptions & commitments panel |
| Savings goals | Savings goals panel (money moved into goals leaves your spendable balance) |
| Unexpected expenses | "Life happens" quick buttons |
| Monthly forecast | Forecast chart and "Forecast for day 30" card |
| Financial risk | Risk badge (Low, Medium, High, Critical) |
| Financial health | Health score out of 100 |
| Simulate before deciding | "What if?" simulator with before/after comparison |

## Project structure

```
src/
  constants.js        fixed values (budget, days, limits, categories)
  logic/              pure calculations, no React (finance, simulator, insights)
  state/              reducer, saved-data validation, starting state
  utils/              formatting, text and number cleaning
  hooks/              useFinance: connects state to the screens
  components/         one file per part of the screen
  test/               test setup
```

## Security and data safety
- All user text and numbers are cleaned by `utils/sanitize.js` before being stored.
- Data loaded from the browser is validated item by item (`state/validate.js`). Broken or tampered data is dropped.
- The app never uses `dangerouslySetInnerHTML`. React escapes all displayed text.
- Amounts, names, notes and list sizes have strict limits.

## Accessibility
- Skip link, landmarks, and a proper heading order
- Every input has a label; errors are announced with `role="alert"`
- Full keyboard use, visible focus outlines, large click targets
- Progress bars and the chart have text descriptions
- Money changes are announced to screen readers
- Respects "reduce motion" settings

## Performance
- Calculations run once per change (`useMemo`) and components skip needless re-renders (`React.memo`)
- The simulator is loaded only when needed (code splitting)
- No images, no external fonts, no extra libraries


## Pre-submission verification

Before deploying a new version, run:

```
npm install
npm test
npm run build
npm run dev
```

Then check the production build in a browser and manually verify: adding/deleting income and expenses, advancing/resetting the day, adding/deleting bills, creating/contributing to/deleting goals, simulator previews, refresh persistence, keyboard-only navigation, and a narrow mobile viewport. Use a fresh browser profile or clear this app's local storage to verify the initial state.

The app stores data locally in the current browser. It does not provide accounts or synchronize transactions between devices.
