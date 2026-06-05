"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function HomeHeroCtas() {
  const { isAuthenticated, username, logout } = useAuth();

  return (
    <div className="flex flex-wrap gap-3">
      {!isAuthenticated ? (
        <Link
          href="/auth/login"
          className="rounded-full border border-sand/70 px-5 py-2 text-sm font-semibold text-ink transition hover:border-ink"
        >
          Login dulu
        </Link>
      ) : (

        <>
          <Link
            href="/posts/create"
            className="rounded-full border border-ink/40 bg-ink px-5 py-2 text-sm font-semibold text-white! transition hover:bg-ink/90"
          >
            Tulis ceritamu {username}!
          </Link>
          <button
            onClick={logout}
            className="rounded-full border border-sand/70 px-5 py-2 text-sm font-semibold text-ink transition hover:border-ink"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}
