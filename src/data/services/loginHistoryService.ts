import { LoginLog, type UserRole } from '../../types';

const STORAGE_KEY = 'app_login_history';

function getToday(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getLoginHistory(): LoginLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addLoginLog(
  name: string,
  role: UserRole,
  method: 'form' | 'google',
  email?: string
): void {
  const logs = getLoginHistory();
  const now = Date.now();
  const log: LoginLog = {
    id: `login_${now}`,
    name,
    role,
    timestamp: now,
    date: getToday(),
    method,
    email,
  };
  logs.push(log);
  // Keep last 1000 entries
  if (logs.length > 1000) {
    logs.splice(0, logs.length - 1000);
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch {
    // storage full — clear oldest entries
    logs.splice(0, Math.floor(logs.length / 2));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    } catch {
      // silently fail
    }
  }
}

export function getGuestCountToday(): number {
  const today = getToday();
  return getLoginHistory().filter((l) => l.role === 'guest' && l.date === today).length;
}

export function getLoginStats() {
  const logs = getLoginHistory();
  const today = getToday();

  const todayLogins = logs.filter((l) => l.date === today);
  const guestToday = todayLogins.filter((l) => l.role === 'guest').length;
  const registeredToday = todayLogins.filter((l) => l.role !== 'guest').length;

  // Group by role
  const byRole: Record<string, number> = {};
  for (const l of logs) {
    byRole[l.role] = (byRole[l.role] || 0) + 1;
  }

  // Last 7 days guest count
  const last7Days: { date: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;
    last7Days.push({
      date: dateStr,
      count: logs.filter((l) => l.role === 'guest' && l.date === dateStr).length,
    });
  }

  return {
    total: logs.length,
    today: todayLogins.length,
    guestToday,
    registeredToday,
    byRole,
    last7Days,
  };
}
