import type { NotificationItem } from '../types';

export const mockNotifications: NotificationItem[] = [
  {
    id: 'NOT-1',
    title: 'New load assigned',
    message: 'LD-1039 (Gurugram → Chandigarh) has been assigned to you.',
    is_read: false,
    created_at: '2026-09-21T07:05:00Z',
  },
  {
    id: 'NOT-2',
    title: 'Settlement paid',
    message: 'Your settlement ST-501 of ₹2,200 has been paid.',
    is_read: false,
    created_at: '2026-09-19T16:10:00Z',
  },
];
