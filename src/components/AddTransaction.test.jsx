import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AddTransaction from './AddTransaction.jsx';

describe('AddTransaction', () => {
  it('shows an accessible error when the amount is empty', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(<AddTransaction dispatch={dispatch} balance={10000} />);

    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(screen.getByRole('alert')).toHaveTextContent(/amount/i);
    expect(dispatch).not.toHaveBeenCalled();
  });

  it('sends a valid expense to the store', async () => {
    const user = userEvent.setup();
    const dispatch = vi.fn();
    render(<AddTransaction dispatch={dispatch} balance={10000} />);

    await user.type(screen.getByLabelText(/amount/i), '250');
    await user.click(screen.getByRole('button', { name: /add expense/i }));

    expect(dispatch).toHaveBeenCalledWith({
      type: 'ADD_TRANSACTION',
      payload: expect.objectContaining({ type: 'expense', amount: 250, category: 'Food' }),
    });
  });

  it('switches to income and reports the pressed state', async () => {
    const user = userEvent.setup();
    render(<AddTransaction dispatch={vi.fn()} balance={10000} />);

    await user.click(screen.getByRole('button', { name: 'Income' }));

    expect(screen.getByRole('button', { name: 'Income' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: /add income/i })).toBeInTheDocument();
  });

  it('warns when the expense is bigger than the balance', async () => {
    const user = userEvent.setup();
    render(<AddTransaction dispatch={vi.fn()} balance={100} />);

    await user.type(screen.getByLabelText(/amount/i), '500');

    expect(screen.getByRole('status')).toHaveTextContent(/more than/i);
  });
});
