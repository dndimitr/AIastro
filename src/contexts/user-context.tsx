"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

import type { UserTier } from "@/lib/user-tier";

export type { UserTier } from "@/lib/user-tier";

type UserContextValue = {
  tier: UserTier;
  setTier: (tier: UserTier) => void;
};

const STORAGE_KEY = "astroai:user-tier";
const TIER_EVENT = "astroai:user-tier-change";

const UserContext = createContext<UserContextValue | null>(null);

function readTier(): UserTier {
  if (typeof window === "undefined") return "guest";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "free" || raw === "premium" || raw === "guest") return raw;
  return "guest";
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY || e.key === null) onStoreChange();
  };
  const onLocal = () => onStoreChange();
  window.addEventListener("storage", onStorage);
  window.addEventListener(TIER_EVENT, onLocal);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(TIER_EVENT, onLocal);
  };
}

function getServerTier(): UserTier {
  return "guest";
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const tier = useSyncExternalStore(subscribe, readTier, getServerTier);

  const setTier = useCallback((next: UserTier) => {
    if (typeof window === "undefined") return;
    if (next === "guest") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new Event(TIER_EVENT));
  }, []);

  const value = useMemo(() => ({ tier, setTier }), [tier, setTier]);

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within UserProvider");
  }
  return ctx;
}
