import { useSyncExternalStore } from 'react';
import { store } from '../data/store/core';

export function useStoreVersion() {
  return useSyncExternalStore(store.subscribe, store.getSnapshot);
}
