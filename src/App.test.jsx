import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App.jsx';

async function addExpense(user, amount) {
  const region = screen.getByRole('region', { name: /add a transaction/i });
  await user.type(within(region).getByLabelText(/amount/i), String(amount));
  await user.click(within(region).getByRole('button', { name: /add expense/i }));
}

describe('App', () => {
  it('has a skip link and a main landmark', () => {
    render(<App />);
    expect(screen.getByRole('link', { name: /skip to main content/i })).toHaveAttribute('href', '#main');
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('starts with the full ₹10,000', () => {
    render(<App />);
    expect(screen.getByTestId('balance')).toHaveTextContent('₹10,000');
  });

  it('updates the balance when an expense is added', async () => {
    const user = userEvent.setup();
    render(<App />);
    await addExpense(user, 500);
    expect(screen.getByTestId('balance')).toHaveTextContent('₹9,500');
  });

  it('a surprise expense lowers the balance', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: /phone screen repair/i }));
    expect(screen.getByTestId('balance')).toHaveTextContent('₹8,500');
  });

  it('a future subscription lowers the safe daily amount but not the balance', async () => {
    const user = userEvent.setup();
    render(<App />);
    const region = screen.getByRole('region', { name: /subscriptions/i });
    await user.type(within(region).getByLabelText(/^name/i), 'Netflix');
    await user.type(within(region).getByLabelText(/amount/i), '300');
    await user.type(within(region).getByLabelText(/due day/i), '10');
    await user.click(within(region).getByRole('button', { name: /add to my bills/i }));

    expect(screen.getByTestId('balance')).toHaveTextContent('₹10,000');
    expect(screen.getByTestId('safe-daily')).toHaveTextContent('₹323');
  });

  it('keeps the data after the page is opened again', async () => {
    const user = userEvent.setup();
    const first = render(<App />);
    await addExpense(user, 500);
    first.unmount();

    render(<App />);
    expect(screen.getByTestId('balance')).toHaveTextContent('₹9,500');
  });
});
