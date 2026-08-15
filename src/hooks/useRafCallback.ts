import { useCallback, useEffect, useRef } from 'react';

/**
 * Menjadwalkan callback maksimal satu kali per animation frame.
 *
 * Cocok untuk event berfrekuensi tinggi (scroll/resize). Semua pengukuran DOM
 * dilakukan oleh callback pada awal frame, lalu React/DOM write dijalankan
 * setelah seluruh nilai geometri sudah dibaca.
 */
export function useRafCallback<Args extends unknown[]>(callback: (...args: Args) => void) {
  const callbackRef = useRef(callback);
  const frameRef = useRef<number | null>(null);
  const latestArgsRef = useRef<Args | null>(null);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    },
    []
  );

  return useCallback((...args: Args) => {
    latestArgsRef.current = args;
    if (frameRef.current !== null) return;

    frameRef.current = window.requestAnimationFrame(() => {
      frameRef.current = null;
      const latestArgs = latestArgsRef.current;
      latestArgsRef.current = null;
      if (latestArgs) callbackRef.current(...latestArgs);
    });
  }, []);
}
