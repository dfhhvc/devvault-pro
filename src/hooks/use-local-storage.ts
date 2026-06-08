"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";

function getLocalStorageItem(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Hook for persisting state to localStorage.
 * Only user settings (sidebar state, favorites, theme) are stored.
 * User input data is NEVER persisted to localStorage for privacy.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const isLoaded = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Load from localStorage after hydration
  useEffect(() => {
    if (!isLoaded) return;
    const timer = setTimeout(() => {
      const item = getLocalStorageItem(key);
      if (item) {
        try {
          setStoredValue(JSON.parse(item) as T);
        } catch {
          // Silently ignore parse errors to prevent crashes
        }
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [key, isLoaded]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch {
        // Silently ignore quota errors
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue, isLoaded] as const;
}
