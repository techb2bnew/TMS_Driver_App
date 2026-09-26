import React, { createContext, useContext, useMemo, useState } from 'react';
import { mockLoads } from '../mock/loads';
import type { Load, LoadStatus } from '../types';

type LoadsContextValue = {
  loads: Load[];
  getLoad: (id: string) => Load | undefined;
  updateLoadStatus: (id: string, status: LoadStatus, podPhotoUri?: string) => void;
};

const LoadsContext = createContext<LoadsContextValue | null>(null);

export function LoadsProvider({ children }: { children: React.ReactNode }) {
  const [loads, setLoads] = useState<Load[]>(mockLoads);

  const value = useMemo<LoadsContextValue>(
    () => ({
      loads,
      getLoad: id => loads.find(l => l.id === id),
      updateLoadStatus: (id, status, podPhotoUri) => {
        setLoads(prev =>
          prev.map(l =>
            l.id === id
              ? {
                  ...l,
                  status,
                  delivered_at: status === 'delivered' ? new Date().toISOString() : l.delivered_at,
                  pod_photo_uri: podPhotoUri ?? l.pod_photo_uri,
                }
              : l,
          ),
        );
      },
    }),
    [loads],
  );

  return <LoadsContext.Provider value={value}>{children}</LoadsContext.Provider>;
}

export function useLoads() {
  const ctx = useContext(LoadsContext);
  if (!ctx) throw new Error('useLoads must be used within LoadsProvider');
  return ctx;
}
