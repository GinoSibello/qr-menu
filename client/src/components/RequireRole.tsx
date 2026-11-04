import { useState, type ReactNode } from "react";
import { getAuth, type AuthState } from "../lib/auth";
import { LoginForm } from "./LoginForm";

export function RequireRole({
  role,
  children,
}: {
  role: string;
  children: ReactNode;
}) {
  const [auth, setAuth] = useState<AuthState | null>(() => getAuth());
  const allowed = role === "any" || auth?.user.role === role;

  if (!auth || !allowed) {
    return (
      <LoginForm
        role={role}
        onSuccess={() => setAuth(getAuth())}
      />
    );
  }

  return <>{children}</>;
}
