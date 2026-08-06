import { afterEach, vi } from 'vitest';

// Provide a tiny in-memory Storage polyfill for Node environments where
// `localStorage`/`sessionStorage` are not available. This ensures tests
// that call `localStorage.clear()` (or other methods) don't throw.
function createMemoryStorage() {
  const map = new Map<string, string>();
  return {
    getItem(key: string) {
      return map.has(key) ? map.get(key) as string : null;
    },
    setItem(key: string, value: string) {
      map.set(key, String(value));
    },
    removeItem(key: string) {
      map.delete(key);
    },
    clear() {
      map.clear();
    },
    key(index: number) {
      return Array.from(map.keys())[index] ?? null;
    },
    get length() {
      return map.size;
    },
  } as Storage;
}

if (typeof (globalThis as any).localStorage === 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: createMemoryStorage(),
    configurable: true,
    writable: true,
  });
}
if (typeof (globalThis as any).sessionStorage === 'undefined') {
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: createMemoryStorage(),
    configurable: true,
    writable: true,
  });
}

// Provide a minimal `window` + event API for Node environment tests that
// expect `window.dispatchEvent(new CustomEvent(...))` or listeners.
if (typeof (globalThis as any).window === 'undefined') {
  const listeners: Record<string, Set<EventListenerOrEventListenerObject>> = {};

  const addEventListener = (type: string, fn: EventListenerOrEventListenerObject) => {
    listeners[type] ??= new Set();
    listeners[type].add(fn);
  };
  const removeEventListener = (type: string, fn: EventListenerOrEventListenerObject) => {
    listeners[type]?.delete(fn);
  };
  const dispatchEvent = (event: any) => {
    const set = listeners[event?.type];
    if (!set) return true;
    for (const fn of Array.from(set)) {
      try {
        if (typeof fn === 'function') fn.call(globalThis, event);
        else fn.handleEvent?.(event as Event);
      } catch (err) {
        // swallow to mimic browser behavior during tests
        void err;
      }
    }
    return true;
  };

  // Minimal CustomEvent shim
  class SimpleCustomEvent {
    type: string;
    detail: any;
    constructor(type: string, init?: { detail?: any }) {
      this.type = type;
      this.detail = init?.detail;
    }
  }

  Object.defineProperty(globalThis, 'window', {
    value: {
      addEventListener,
      removeEventListener,
      dispatchEvent,
      CustomEvent: SimpleCustomEvent,
    },
    configurable: true,
    writable: true,
  });
}

// Provide a no-op global `fetch` fallback so module initialization that
// performs network checks does not consume per-test mocks. Individual
// tests will replace this via `vi.stubGlobal('fetch', ...)` as needed.
if (typeof (globalThis as any).fetch === 'undefined') {
  Object.defineProperty(globalThis, 'fetch', {
    value: async () => ({ ok: true, status: 200, json: async () => ({}) }),
    configurable: true,
    writable: true,
  });
}

// Ensure `navigator.onLine` exists and defaults to true in Node tests.
if (typeof (globalThis as any).navigator === 'undefined') {
  Object.defineProperty(globalThis, 'navigator', {
    value: {
      onLine: true,
    },
    configurable: true,
    writable: true,
  });
}
else {
  try {
    if (typeof (globalThis as any).navigator.onLine === 'undefined') {
      (globalThis as any).navigator.onLine = true;
    }
  } catch (err) {
    void err;
  }
}

// Ensure every test starts from a clean browser-storage state so localStorage
// backed modules (e.g. src/data/store.ts) do not leak state between tests.
afterEach(() => {
  try {
    if (typeof globalThis.localStorage !== 'undefined' && globalThis.localStorage?.clear) globalThis.localStorage.clear();
  } catch (err) {
    void err;
  }
  try {
    if (typeof globalThis.sessionStorage !== 'undefined' && globalThis.sessionStorage?.clear) globalThis.sessionStorage.clear();
  } catch (err) {
    void err;
  }
  vi.restoreAllMocks();
  vi.useRealTimers();
});
