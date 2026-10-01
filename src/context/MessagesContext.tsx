import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

type MessagesContextValue = {
  unreadCount: number;
};

const MessagesContext = createContext<MessagesContextValue | null>(null);

export function MessagesProvider({ children }: { children: React.ReactNode }) {
  const { driver } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!driver) {
      setUnreadCount(0);
      return;
    }

    let mounted = true;

    async function refreshCount() {
      const { count } = await supabase
        .from('messages')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', driver!.id)
        .is('read_at', null);
      if (mounted) setUnreadCount(count ?? 0);
    }
    refreshCount();

    // Any insert/update touching this driver's inbox (a new message, or a
    // read-receipt written from another device) can change the unread
    // total — just re-count rather than trying to track deltas locally.
    // Filtered client-side (not via a server-side `filter:`) to match the
    // per-thread listener in MessagesScreen, which is the one confirmed to
    // actually receive events reliably.
    const channel = supabase
      .channel(`unread-messages-${driver.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        payload => {
          const row = (payload.new ?? payload.old) as { recipient_id?: string } | null;
          if (row?.recipient_id === driver.id) refreshCount();
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [driver]);

  const value = useMemo<MessagesContextValue>(() => ({ unreadCount }), [unreadCount]);

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>;
}

export function useMessagesBadge() {
  const ctx = useContext(MessagesContext);
  if (!ctx) throw new Error('useMessagesBadge must be used within a MessagesProvider');
  return ctx;
}
