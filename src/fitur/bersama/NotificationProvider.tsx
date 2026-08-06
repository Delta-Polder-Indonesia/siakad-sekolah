import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { subscribeStore, getUnreadNotificationCount } from '../../data/services';
import { useAuth } from '../../context/AuthContext';
import {
  getNotificationItems,
  markAllItemsRead,
  markItemsRead,
  isItemRead,
  migrateLegacyReadState,
  type NotifItem,
} from './notificationItems';

interface NotificationCounts {
  /** Unread personal messages (inbox) */
  messages: number;
  /** New/ pending surat izin (for teachers) */
  suratIzin: number;
  /** New school announcements */
  announcements: number;
  /** Unread PPDB notifications (for admin) */
  ppdbNotifications: number;
  /** New assignment discussions (teacher: siswa bertanya; student: guru menjawab) */
  discussions: number;
  /** New group chat messages (teacher: grup kelasnya; student: grup yang diikuti) */
  groupMessages: number;
  /** Total combined count for bell icon */
  total: number;
}

interface NotificationContextValue {
  counts: NotificationCounts;
  refreshNotifications: () => void;
  /** Mark all items of a given type as "read" */
  markRead: (type: keyof NotificationCounts) => void;
  /** Mark specific items as read (ex: buka dropdown) */
  markItemKeysRead: (items: NotifItem[]) => void;
  /** Mark every notification item as read */
  markAllRead: () => void;
}

const defaultCounts: NotificationCounts = {
  messages: 0,
  suratIzin: 0,
  announcements: 0,
  ppdbNotifications: 0,
  discussions: 0,
  groupMessages: 0,
  total: 0,
};

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [counts, setCounts] = useState<NotificationCounts>(defaultCounts);
  const [readVersion, setReadVersion] = useState(0);

  const calculateCounts = useCallback(() => {
    if (!user) {
      setCounts(defaultCounts);
      return;
    }

    const items = getNotificationItems(user);
    migrateLegacyReadState(user.id, items);

    let messages = 0;
    let suratIzin = 0;
    let announcements = 0;
    let discussions = 0;
    let groupMessages = 0;

    for (const item of items) {
      if (isItemRead(user.id, item)) continue;
      if (item.type === 'message') messages += 1;
      else if (item.type === 'suratIzin') suratIzin += 1;
      else if (item.type === 'announcement') announcements += 1;
      else if (item.type === 'discussion') discussions += 1;
      else if (item.type === 'groupMessage') groupMessages += 1;
    }

    const ppdbNotifications = user.role === 'admin' ? getUnreadNotificationCount() : 0;
    const total =
      messages + suratIzin + announcements + ppdbNotifications + discussions + groupMessages;
    setCounts({
      messages,
      suratIzin,
      announcements,
      ppdbNotifications,
      discussions,
      groupMessages,
      total,
    });
  }, [user, readVersion]);

  // Recalculate whenever store changes or read state version bumps
  useEffect(() => {
    calculateCounts();
    return subscribeStore(() => {
      calculateCounts();
    });
  }, [calculateCounts]);

  const refreshNotifications = useCallback(() => {
    calculateCounts();
  }, [calculateCounts]);

  const markRead = useCallback(
    (type: keyof NotificationCounts) => {
      if (!user) return;
      const prefixByType: Record<string, string> = {
        messages: 'message:',
        suratIzin: 'surat:',
        announcements: 'announcement:',
        discussions: 'discussion:',
        groupMessages: 'groupmessage:',
        ppdbNotifications: '',
      };
      const prefix = prefixByType[type];
      if (prefix === '') return;
      const items = getNotificationItems(user).filter((i) => i.itemKey.startsWith(prefix));
      markItemsRead(user.id, items);
      setReadVersion((v) => v + 1);
    },
    [user]
  );

  const markItemKeysRead = useCallback(
    (items: NotifItem[]) => {
      if (!user) return;
      markItemsRead(user.id, items);
      setReadVersion((v) => v + 1);
    },
    [user]
  );

  const markAllRead = useCallback(() => {
    if (!user) return;
    markAllItemsRead(user.id, getNotificationItems(user));
    setReadVersion((v) => v + 1);
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{ counts, refreshNotifications, markRead, markItemKeysRead, markAllRead }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}
