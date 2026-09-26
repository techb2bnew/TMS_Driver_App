import type { Load } from '../types';

export const mockLoads: Load[] = [
  {
    id: 'LD-1042',
    customer_name: 'Bansal Traders',
    customer_contact: '+91 98111 22334',
    pickup_location: 'Delhi',
    drop_location: 'Jaipur',
    weight_kg: 8200,
    rate: 24500,
    status: 'in_transit',
    created_at: '2026-09-21T06:00:00Z',
  },
  {
    id: 'LD-1039',
    customer_name: 'Sharma Textiles',
    customer_contact: '+91 98222 33445',
    pickup_location: 'Gurugram',
    drop_location: 'Chandigarh',
    weight_kg: 3100,
    rate: 11400,
    status: 'assigned',
    created_at: '2026-09-21T07:00:00Z',
  },
  {
    id: 'LD-1041',
    customer_name: 'Om Sai Logistics',
    customer_contact: '+91 98333 44556',
    pickup_location: 'Pune',
    drop_location: 'Mumbai',
    weight_kg: 4300,
    rate: 9800,
    status: 'delivered',
    created_at: '2026-09-19T15:00:00Z',
    delivered_at: '2026-09-19T21:00:00Z',
  },
];
