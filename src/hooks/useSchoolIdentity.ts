/**
 * Hook reaktif untuk identitas sekolah.
 * Komponen yang memakai hook ini otomatis re-render saat identitas diubah
 * lewat Panel Setup Sekolah (via store version).
 */
import { useSyncExternalStore } from 'react';
import { store } from '../data/store/core/db';
import { getSchoolIdentity, type SchoolIdentity } from '../config/school';

export function useSchoolIdentity(): SchoolIdentity {
  useSyncExternalStore(store.subscribe, store.getSnapshot);
  return getSchoolIdentity();
}
