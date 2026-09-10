import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { UserRole } from "@/lib/types/user";

/**
 * No real auth yet (see context/architecture.md Open Architecture Questions).
 * This just tracks the role picked at Onboarding for the session so navigation
 * can branch correctly, same mock-backed, navigation-only pattern as Laundria's
 * early scaffold.
 */
type AuthContextValue = {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<UserRole | null>(null);
  const value = useMemo(() => ({ role, setRole }), [role]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
