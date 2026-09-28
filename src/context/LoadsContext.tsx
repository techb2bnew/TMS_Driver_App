import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Load, LoadStatus } from '../types';

type LoadsContextValue = {
  loads: Load[];
  loading: boolean;
  getLoad: (id: string) => Load | undefined;
  updateLoadStatus: (id: string, status: LoadStatus) => Promise<void>;
};

const LoadsContext = createContext<LoadsContextValue | null>(null);

const SELECT_COLUMNS =
  'id, load_number, customer_name, customer_contact, pickup_location, drop_location, weight_kg, rate, status, created_at, delivered_at';

export function LoadsProvider({ children }: { children: React.ReactNode }) {
  const { driver } = useAuth();
  const [loads, setLoads] = useState<Load[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!driver) {
      setLoads([]);
      setLoading(false);
      return;
    }

    let mounted = true;

    async function loadLoads() {
      const { data } = await supabase
        .from('loads')
        .select(SELECT_COLUMNS)
        .eq('assigned_driver_id', driver!.id)
        .order('created_at', { ascending: false });
      if (mounted) {
        setLoads(data ?? []);
        setLoading(false);
      }
    }
    loadLoads();

    // Admin can reassign/cancel a load from the dispatch side — subscribe so
    // this list stays current without a manual pull-to-refresh.
    const channel = supabase
      .channel(`loads-${driver.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'loads', filter: `assigned_driver_id=eq.${driver.id}` },
        () => loadLoads(),
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [driver]);

  const value = useMemo<LoadsContextValue>(
    () => ({
      loads,
      loading,
      getLoad: id => loads.find(l => l.id === id),
      updateLoadStatus: async (id, status) => {
        const delivered_at = status === 'delivered' ? new Date().toISOString() : null;
        setLoads(prev => prev.map(l => (l.id === id ? { ...l, status, delivered_at: delivered_at ?? l.delivered_at } : l)));

        await supabase
          .from('loads')
          .update(delivered_at ? { status, delivered_at } : { status })
          .eq('id', id);

        await supabase.from('load_status_history').insert({ load_id: id, status });
      },
    }),
    [loads, loading],
  );

  return <LoadsContext.Provider value={value}>{children}</LoadsContext.Provider>;
}

export function useLoads() {
  const ctx = useContext(LoadsContext);
  if (!ctx) throw new Error('useLoads must be used within LoadsProvider');
  return ctx;
}
