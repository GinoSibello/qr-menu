import type { AuthUser } from "../types";

const TOKEN_KEY = "menu_token";
const USER_KEY = "menu_user";

export interface AuthState {
  token: string;
  user: AuthUser;
}

export function saveAuth(auth: AuthState): void {
  localStorage.setItem(TOKEN_KEY, auth.token);
  localStorage.setItem(USER_KEY, JSON.stringify(auth.user));
}

export function getAuth(): AuthState | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const rawUser = localStorage.getItem(USER_KEY);
  if (!token || !rawUser) return null;
  try {
    return { token, user: JSON.parse(rawUser) as AuthUser };
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
