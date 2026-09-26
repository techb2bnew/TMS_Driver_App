import type { LoadDocument } from '../types';

// Keyed by load_id — documents a dispatcher attaches to a load (rate
// confirmation, BOL). Separate from POD, which the driver uploads.
export const mockLoadDocuments: Record<string, LoadDocument[]> = {
  'LD-1042': [
    { id: 'DOC-201', load_id: 'LD-1042', type: 'rate_confirmation', file_name: 'Rate_Confirmation_LD-1042.pdf', uploaded_at: '2026-09-20T08:00:00Z' },
    { id: 'DOC-202', load_id: 'LD-1042', type: 'bol', file_name: 'BOL_LD-1042.pdf', uploaded_at: '2026-09-20T08:05:00Z' },
  ],
  'LD-1039': [
    { id: 'DOC-203', load_id: 'LD-1039', type: 'rate_confirmation', file_name: 'Rate_Confirmation_LD-1039.pdf', uploaded_at: '2026-09-21T06:50:00Z' },
  ],
};
