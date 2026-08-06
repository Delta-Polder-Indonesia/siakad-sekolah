import { useMemo, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useStoreVersion } from '../../hooks/useStoreVersion';
import { useNotifications } from './NotificationProvider';
import { getNotificationItems, isItemRead, type NotifItem } from './notificationItems';
import { Mail, FileText, Megaphone, MessageSquare, Users, CheckCheck } from 'lucide-react';

interface NotificationDropdownProps {
  onNavigate: (page: string) => void;
  onClose: () => void;
}

const TYPE_ICONS = {
  message: Mail,
  suratIzin: FileText,
  announcement: Megaphone,
  discussion: MessageSquare,
  groupMessage: Users,
} as const;

export default function NotificationDropdown({ onNavigate, onClose }: NotificationDropdownProps) {
  const { user } = useAuth();
  const storeVersion = useStoreVersion();
  const { counts, markItemKeysRead, markAllRead } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);
  const [newKeys, setNewKeys] = useState<string[]>([]);
  const markedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const items = useMemo<NotifItem[]>(() => {
    if (!user) return [];
    return getNotificationItems(user).slice(0, 10);
  }, [user, storeVersion]);

  // D4: saat dropdown dibuka, tandai semua item yang tampil sebagai dibaca → badge hilang.
  // Snapshot kunci yang tadinya belum dibaca agar titik biru (D3) tetap terlihat selama sesi buka.
  useEffect(() => {
    if (!user) return;
    const unreadItems = items.filter(
      (i) => !isItemRead(user.id, i) && !markedKeysRef.current.has(i.itemKey)
    );
    if (unreadItems.length === 0) return;
    unreadItems.forEach((i) => markedKeysRef.current.add(i.itemKey));
    setNewKeys((prev) => Array.from(new Set([...prev, ...unreadItems.map((i) => i.itemKey)])));
    markItemKeysRead(unreadItems);
  }, [user, items, counts.total]);

  const handleClickItem = (item: NotifItem) => {
    onNavigate(item.navigateTo);
    onClose();
  };

  const handleMarkAllRead = () => {
    markAllRead();
    onClose();
  };

  return (
    <div
      ref={ref}
      className="absolute top-full right-0 z-50 mt-2 w-80 overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5">
        <h3 className="text-xs font-bold tracking-wider text-slate-700 uppercase">Notifikasi</h3>
        <button
          onClick={handleMarkAllRead}
          className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800"
        >
          <CheckCheck className="h-3.5 w-3.5" /> Tandai Dibaca
        </button>
      </div>

      <div className="max-h-[320px] overflow-y-auto">
        {items.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-slate-500">
            Tidak ada notifikasi baru.
          </div>
        ) : (
          items.map((item) => {
            const Icon = TYPE_ICONS[item.type];
            const isNew = newKeys.includes(item.itemKey);
            return (
              <button
                key={item.id}
                onClick={() => handleClickItem(item)}
                className={`flex w-full items-start gap-3 border-b border-slate-100 px-4 py-2.5 text-left transition-colors hover:bg-slate-50 ${
                  isNew ? 'bg-blue-50/60' : 'opacity-70'
                }`}
              >
                <div className="mt-0.5 shrink-0 rounded-full bg-slate-100 p-1.5">
                  <Icon className="h-3.5 w-3.5 text-slate-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">{item.title}</p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">{item.description}</p>
                </div>
                <span className="shrink-0 text-[10px] text-slate-400">{item.time}</span>
                {isNew && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
              </button>
            );
          })
        )}
      </div>

      <div className="border-t border-slate-200 px-4 py-2 text-center">
        <button
          onClick={() => {
            onNavigate('school-announcements');
            onClose();
          }}
          className="text-[11px] text-blue-600 hover:text-blue-800"
        >
          Lihat Semua Pengumuman
        </button>
      </div>
    </div>
  );
}
