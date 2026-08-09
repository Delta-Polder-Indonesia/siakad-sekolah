import {
  readDB,
  writeDB,
  readLocalKey,
  saveLocalKey,
  createId,
  hashPassword,
  appendPPDBAuditLog,
  getPPDBAuditLogsRaw,
  savePPDBAuditLogs,
  PPDB_AUDIT_KEY,
  PPDB_ADMIN_SESSION_KEY,
  PPDB_ADMIN_LOCK_KEY,
  ADMIN_MAX_ATTEMPTS,
  ADMIN_LOCK_MINUTES,
  ADMIN_SESSION_MINUTES,
} from './db';
import { addStudent, generateStudentNis } from './students';
import type {
  PPDBApplication,
  PPDBApplicationStatus,
  PPDBAuditAction,
  PPDBAuditLog,
  PPDBNotification,
  GuestConfig,
} from '../../../types';
const createRegistrationNo = (): string => {
  const year = new Date().getFullYear();
  const yearCode = String(year).slice(-2);
  const regionCode = (import.meta.env.VITE_REGION_CODE || 'NAS').toUpperCase();
  const applications = getPPDBApplications();
  const maxSeq = applications.reduce((acc, item) => {
    const matched = item.registrationNo.match(/PPDB-\d{2}-[A-Z]+-(\d{6})/);
    const value = matched ? Number(matched[1]) : 0;
    return value > acc ? value : acc;
  }, 0);
  return `PPDB-${yearCode}-${regionCode}-${String(maxSeq + 1).padStart(6, '0')}`;
};

// ==================== PPDB (ENHANCED) ====================

export const getPPDBApplications = (): PPDBApplication[] => readDB().ppdbApplications;

const savePPDBApplications = (applications: PPDBApplication[]): void => {
  const db = readDB();
  db.ppdbApplications = applications;
  writeDB(db);
};

export const submitPPDBApplication = (
  data: Omit<PPDBApplication, 'id' | 'registrationNo' | 'submittedAt' | 'status'>
): PPDBApplication => {
  const applications = getPPDBApplications();
  const documentValidation = (data.dokumen || []).reduce<Record<string, 'PENDING'>>((acc, item) => {
    const key = item.split(':')[0];
    if (key) acc[key] = 'PENDING';
    return acc;
  }, {});

  const created: PPDBApplication = {
    ...data,
    id: createId(),
    registrationNo: createRegistrationNo(),
    submittedAt: new Date().toISOString(),
    status: 'PENDING',
    documentValidation,
  };

  applications.push(created);
  savePPDBApplications(applications);

  // Add Notification
  addPPDBNotification(
    created.id,
    created.registrationNo,
    created.namaLengkap,
    'NEW_REGISTRATION',
    `Pendaftar baru: ${created.namaLengkap} (${created.registrationNo})`
  );

  appendPPDBAuditLog('SUBMIT_APPLICATION', 'PUBLIC_FORM', {
    registrationNo: created.registrationNo,
    namaLengkap: created.namaLengkap,
  });
  return created;
};

export const updateApplicationStatus = async (
  id: string,
  status: PPDBApplicationStatus,
  adminNotes?: string,
  verifiedBy?: string
): Promise<PPDBApplication | null> => {
  const applications = getPPDBApplications();
  const index = applications.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const updated: PPDBApplication = {
    ...applications[index],
    status,
    adminNotes: adminNotes || applications[index].adminNotes,
    verifiedBy: verifiedBy || applications[index].verifiedBy,
    verifiedAt: new Date().toISOString(),
  };

  applications[index] = updated;
  savePPDBApplications(applications);

  // Add Notification
  addPPDBNotification(
    updated.id,
    updated.registrationNo,
    updated.namaLengkap,
    'STATUS_CHANGED',
    `Status pendaftaran ${updated.namaLengkap} diubah menjadi ${status}`
  );

  appendPPDBAuditLog('UPDATE_STATUS', verifiedBy || getAdminProfileName(), {
    registrationNo: updated.registrationNo,
    status,
  });

  // If accepted, add to students
  if (status === 'ACCEPTED') {
    const db = readDB();
    const newNis = updated.nisn.trim() || generateStudentNis(db.students);
    if (!db.students.some((s) => s.nis === newNis)) {
      addStudent({
        id: `s-${Date.now()}`,
        name: updated.namaLengkap,
        nis: newNis,
        password: await hashPassword('siswa123'),
        classId: db.classes[0]?.id || '',
        gender: updated.jenisKelamin.toLowerCase().startsWith('p') ? 'P' : 'L',
        status: 'aktif',
      });
    }
  }

  return updated;
};

export const updateDocumentValidation = (
  id: string,
  documentKey: string,
  status: 'PENDING' | 'VALID' | 'INVALID'
): PPDBApplication | null => {
  const applications = getPPDBApplications();
  const index = applications.findIndex((item) => item.id === id);
  if (index === -1) return null;

  const app = applications[index];
  const nextValidation = {
    ...(app.documentValidation || {}),
    [documentKey]: status,
  };

  const updated: PPDBApplication = {
    ...app,
    documentValidation: nextValidation,
    verifiedAt: new Date().toISOString(),
  };

  applications[index] = updated;
  savePPDBApplications(applications);
  appendPPDBAuditLog('UPDATE_DOCUMENT_VALIDATION', getAdminProfileName(), {
    registrationNo: updated.registrationNo,
    documentKey,
    status,
  });
  return updated;
};

export const getPPDBApplicationById = (id: string): PPDBApplication | null => {
  return getPPDBApplications().find((item) => item.id === id) || null;
};

export const getPPDBApplicationByRegNo = (regNo: string): PPDBApplication | null => {
  return getPPDBApplications().find((item) => item.registrationNo === regNo) || null;
};

// ==================== PPDB NOTIFICATIONS ====================

export const getPPDBNotifications = (): PPDBNotification[] => readDB().ppdbNotifications;

export const addPPDBNotification = (
  applicationId: string,
  registrationNo: string,
  namaLengkap: string,
  type: 'NEW_REGISTRATION' | 'STATUS_CHANGED',
  message: string
) => {
  const db = readDB();
  const newNotif: PPDBNotification = {
    id: createId(),
    applicationId,
    registrationNo,
    namaLengkap,
    type,
    message,
    isRead: false,
    createdAt: new Date().toISOString(),
  };
  db.ppdbNotifications.unshift(newNotif);
  writeDB(db);
};

export const markNotificationAsRead = (id: string) => {
  const db = readDB();
  const idx = db.ppdbNotifications.findIndex((n) => n.id === id);
  if (idx >= 0) {
    db.ppdbNotifications[idx].isRead = true;
    writeDB(db);
  }
};

export const getUnreadNotificationCount = () => {
  return getPPDBNotifications().filter((n) => !n.isRead).length;
};

// ==================== ADMIN SETTINGS ====================

export const getAdminSettings = () => readDB().adminSettings;

export const updateAdminSettings = (settings: { email: string }) => {
  const db = readDB();
  db.adminSettings = settings;
  writeDB(db);
};

export const getGuestConfig = (): GuestConfig => readDB().guestConfig;

export const updateGuestConfig = (config: GuestConfig) => {
  const db = readDB();
  db.guestConfig = config;
  writeDB(db);
};

export const deletePPDBApplication = (id: string): boolean => {
  const applications = getPPDBApplications();
  const target = applications.find((item) => item.id === id);
  const filtered = applications.filter((item) => item.id !== id);
  if (filtered.length === applications.length) return false;
  savePPDBApplications(filtered);
  appendPPDBAuditLog('DELETE_APPLICATION', getAdminProfileName(), {
    registrationNo: target?.registrationNo || '-',
  });
  return true;
};

export const getPPDBStatistics = () => {
  const applications = getPPDBApplications();
  return {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'PENDING').length,
    verified: applications.filter((a) => a.status === 'VERIFIED').length,
    accepted: applications.filter((a) => a.status === 'ACCEPTED').length,
    rejected: applications.filter((a) => a.status === 'REJECTED').length,
    byJenjang: {
      SD: applications.filter((a) => a.jenjangTujuan === 'SD').length,
      SMP: applications.filter((a) => a.jenjangTujuan === 'SMP').length,
      SMA: applications.filter((a) => a.jenjangTujuan === 'SMA').length,
      SMK: applications.filter((a) => a.jenjangTujuan === 'SMK').length,
    },
    byJalur: {
      REGULER: applications.filter((a) => a.jalurPendaftaran === 'REGULER').length,
      ZONASI: applications.filter((a) => a.jalurPendaftaran === 'ZONASI').length,
      PRESTASI: applications.filter((a) => a.jalurPendaftaran === 'PRESTASI').length,
      AFIRMASI: applications.filter((a) => a.jalurPendaftaran === 'AFIRMASI').length,
      PINDAHAN: applications.filter((a) => a.jalurPendaftaran === 'PINDAHAN').length,
    },
  };
};

export const getPPDBAuditLogs = (): PPDBAuditLog[] => getPPDBAuditLogsRaw();

export const exportPPDBBackupJson = (): string => {
  return JSON.stringify(
    {
      exportedAt: new Date().toISOString(),
      applications: getPPDBApplications(),
      auditLogs: getPPDBAuditLogs(),
    },
    null,
    2
  );
};

export const importPPDBBackupJson = (rawJson: string): { ok: boolean; message: string } => {
  try {
    const parsed = JSON.parse(rawJson) as {
      applications?: PPDBApplication[];
      auditLogs?: PPDBAuditLog[];
    };
    if (!Array.isArray(parsed.applications)) {
      return { ok: false, message: 'Format backup tidak valid.' };
    }
    const db = readDB();
    db.ppdbApplications = parsed.applications;
    writeDB(db);
    if (Array.isArray(parsed.auditLogs)) {
      savePPDBAuditLogs(parsed.auditLogs);
    }
    appendPPDBAuditLog('IMPORT_BACKUP', 'admin');
    return { ok: true, message: 'Backup berhasil diimpor.' };
  } catch {
    return { ok: false, message: 'File backup tidak dapat dibaca.' };
  }
};

// PPDB Admin Session & Security
type AdminSession = {
  username: string;
  issuedAt: string;
  expiresAt: string;
};

type AdminLockState = {
  failedCount: number;
  lockedUntil: string | null;
};

const getAdminLockState = (): AdminLockState =>
  readLocalKey<AdminLockState>(PPDB_ADMIN_LOCK_KEY, {
    failedCount: 0,
    lockedUntil: null,
  });

const setAdminLockState = (state: AdminLockState) => {
  saveLocalKey(PPDB_ADMIN_LOCK_KEY, state);
};

const isLockActive = (lockedUntil: string | null) => {
  if (!lockedUntil) return false;
  return new Date(lockedUntil).getTime() > Date.now();
};

export const getAdminSecurityState = () => {
  const lock = getAdminLockState();
  return {
    isLocked: isLockActive(lock.lockedUntil),
    failedCount: lock.failedCount,
    lockedUntil: lock.lockedUntil,
  };
};

// PIN dibaca saat login (lazy), bukan saat modul dimuat — agar deployment
// tanpa env VITE_ADMIN_PIN otomatis menonaktifkan gerbang admin lokal.
const readAdminPin = (): string => (import.meta.env.VITE_ADMIN_PIN || '').trim();

export const adminLogin = (username: string, pin: string): boolean => {
  const configuredPin = readAdminPin();
  if (!configuredPin) {
    appendPPDBAuditLog('ADMIN_LOGIN_FAILED', username || 'UNKNOWN', { reason: 'NOT_CONFIGURED' });
    return false;
  }

  const lock = getAdminLockState();
  if (isLockActive(lock.lockedUntil)) {
    appendPPDBAuditLog('ADMIN_LOGIN_FAILED', username || 'UNKNOWN', { reason: 'LOCKED' });
    return false;
  }

  const normalized = username.trim();
  if (!normalized || pin !== configuredPin) {
    const nextFailed = lock.failedCount + 1;
    const shouldLock = nextFailed >= ADMIN_MAX_ATTEMPTS;
    const lockedUntil = shouldLock
      ? new Date(Date.now() + ADMIN_LOCK_MINUTES * 60 * 1000).toISOString()
      : null;
    setAdminLockState({
      failedCount: shouldLock ? 0 : nextFailed,
      lockedUntil,
    });
    appendPPDBAuditLog('ADMIN_LOGIN_FAILED', normalized || 'UNKNOWN', {
      reason: shouldLock ? 'MAX_ATTEMPTS' : 'INVALID_CREDENTIALS',
    });
    return false;
  }

  const session: AdminSession = {
    username: normalized,
    issuedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + ADMIN_SESSION_MINUTES * 60 * 1000).toISOString(),
  };
  saveLocalKey(PPDB_ADMIN_SESSION_KEY, session);
  setAdminLockState({ failedCount: 0, lockedUntil: null });
  appendPPDBAuditLog('ADMIN_LOGIN_SUCCESS', normalized);
  return true;
};

export const adminLogout = (): void => {
  const actor = getAdminProfileName();
  localStorage.removeItem(PPDB_ADMIN_SESSION_KEY);
  appendPPDBAuditLog('ADMIN_LOGOUT', actor);
};

export const isAdminAuthenticated = (): boolean => {
  const session = readLocalKey<AdminSession | null>(PPDB_ADMIN_SESSION_KEY, null);
  if (!session) return false;
  const isValid = new Date(session.expiresAt).getTime() > Date.now();
  if (!isValid) {
    localStorage.removeItem(PPDB_ADMIN_SESSION_KEY);
    return false;
  }
  return true;
};

export const getAdminProfileName = (): string => {
  const session = readLocalKey<AdminSession | null>(PPDB_ADMIN_SESSION_KEY, null);
  return session?.username || 'Admin PPDB';
};
