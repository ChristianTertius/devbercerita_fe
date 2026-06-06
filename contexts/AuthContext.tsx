"use client";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AuthContextValue = {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function decodeUsernameFromToken(token: string | null): string | null {
  if (!token) return null;
  const [, payload] = token.split(".");
  if (!payload) return null;
  const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(
    normalized.length + (4 - (normalized.length % 4)) % 4,
    "=",
  );
  let decoded: string | null = null;
  if (typeof window !== "undefined" && typeof window.atob === "function") {
    decoded = window.atob(padded);
  } else if (typeof globalThis.Buffer !== "undefined") {
    decoded = globalThis.Buffer.from(padded, "base64").toString("utf-8");
  }
  if (!decoded) return null;
  try {
    const parsed = JSON.parse(decoded);
    return typeof parsed.username === "string" ? parsed.username : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (typeof window === "undefined") return;
    if (token) {
      window.localStorage.setItem("devb_token", token);
    } else {
      window.localStorage.removeItem("devb_token");
    }
  }, [token]);

  const setAuthToken = useCallback((nextToken: string | null) => {
    setToken(nextToken);
    setUsername(nextToken ? decodeUsernameFromToken(nextToken) : null);
  }, []);

  // Baca token dari localStorage saat pertama kali mount
  useEffect(() => {
    queueMicrotask(() => {
      const savedToken = window.localStorage.getItem("devb_token");
      if (savedToken) {
        setAuthToken(savedToken);
      }
      setIsReady(true);
    });
  }, [setAuthToken]);

  const value = useMemo(
    () => ({
      token,
      username,
      isAuthenticated: Boolean(token),
      isReady,
      login: (nextToken: string) => setAuthToken(nextToken),
      logout: () => setAuthToken(null),
    }),
    [token, username, isReady, setAuthToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
