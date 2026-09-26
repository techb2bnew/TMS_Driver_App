import type { Settlement } from '../types';

export const mockSettlements: Settlement[] = [
  { id: 'ST-501', load_id: 'LD-1041', amount: 2200, status: 'paid', created_at: '2026-09-19T16:00:00Z' },
  { id: 'ST-498', load_id: 'LD-1028', amount: 4300, status: 'unpaid', created_at: '2026-09-14T11:00:00Z' },
];
