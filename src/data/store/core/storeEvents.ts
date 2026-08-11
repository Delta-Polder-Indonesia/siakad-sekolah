// Event bus store — modul kecil tanpa seed/DB.
// Dipakai hook identitas & notify agar first-load landing tidak menarik seedData.

const STORE_UPDATED_EVENT = 'absensi_store_updated';

let storeVersion = 0;
let notifyScheduled = false;

function dispatchStoreEvent() {
  notifyScheduled = false;
  window.dispatchEvent(new CustomEvent(STORE_UPDATED_EVENT));
}

export function notifyStoreUpdated() {
  storeVersion += 1;
  if (notifyScheduled) return;
  notifyScheduled = true;
  if (typeof requestAnimationFrame === 'function') {
    requestAnimationFrame(dispatchStoreEvent);
  } else {
    queueMicrotask(dispatchStoreEvent);
  }
}

export function subscribeStore(listener: () => void) {
  window.addEventListener(STORE_UPDATED_EVENT, listener);
  window.addEventListener('storage', listener);
  return () => {
    window.removeEventListener(STORE_UPDATED_EVENT, listener);
    window.removeEventListener('storage', listener);
  };
}

export const store = {
  getSnapshot: () => storeVersion,
  subscribe: (listener: () => void) => subscribeStore(listener),
};
