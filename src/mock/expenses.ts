import type { Expense } from '../types';

export const mockExpenses: Expense[] = [
  {
    id: 'EX-301',
    category: 'Fuel',
    amount: 3200,
    truck_number: 'MH-12-BX-7743',
    notes: 'Full tank before Pune → Mumbai trip',
    status: 'approved',
    created_at: '2026-09-19T08:30:00Z',
  },
  {
    id: 'EX-298',
    category: 'Tolls',
    amount: 450,
    truck_number: 'MH-12-BX-7743',
    notes: 'Mumbai-Pune expressway toll',
    status: 'pending',
    created_at: '2026-09-20T14:10:00Z',
  },
];

// Mutating this exported array (not reassigning it) lets an expense added
// from Load Detail show up on the Expenses screen too within the same
// session — both screens read this same module-level array.
export function addMockExpense(expense: Expense) {
  mockExpenses.unshift(expense);
}
