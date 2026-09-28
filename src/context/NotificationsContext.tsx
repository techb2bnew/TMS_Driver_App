import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { NotificationItem } from '../types';

type NotificationsContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { driver } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!driver) {
      setNotifications([]);
      return;
    }

    let mounted = true;

    supabase
      .from('notifications')
      .select('id, title, message, is_read, created_at')
      .eq('user_id', driver.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (mounted) setNotifications(data ?? []);
      });

    // Admin's dispatch/team actions insert rows here directly (e.g. on load
    // assignment) — subscribe so a new one shows up without a manual refresh.
    const channel = supabase
      .channel(`notifications-${driver.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${driver.id}` },
        payload => {
          if (mounted) setNotifications(prev => [payload.new as NotificationItem, ...prev]);
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [driver]);

  const value = useMemo<NotificationsContextValue>(
    () => ({
      notifications,
      unreadCount: notifications.filter(n => !n.is_read).length,
      markRead: (id: string) => {
        setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
        supabase.from('notifications').update({ is_read: true }).eq('id', id).then();
      },
      markAllRead: () => {
        if (!driver) return;
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        supabase.from('notifications').update({ is_read: true }).eq('user_id', driver.id).eq('is_read', false).then();
      },
    }),
    [notifications, driver],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
