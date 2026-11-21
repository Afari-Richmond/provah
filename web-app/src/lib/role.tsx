"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

export type ViewRole = "student" | "professional";

const STORAGE_KEY = "provah:demo-role";

const RoleContext = createContext<{
  role: ViewRole;
  setRole: (r: ViewRole) => void;
} | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<ViewRole>("student");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "student" || stored === "professional") {
      // syncing from an external store (localStorage) on mount — not
      // available during SSR, so this can't be a lazy useState initializer
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRoleState(stored);
    }
  }, []);

  function setRole(r: ViewRole) {
    setRoleState(r);
    window.localStorage.setItem(STORAGE_KEY, r);
  }

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
