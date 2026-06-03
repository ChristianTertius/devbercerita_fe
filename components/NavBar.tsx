"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function NavBar() {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 border-b border-sand/40 pb-4">
      <Link href="/" className="text-2xl font-semibold tracking-wide text-ink">
        DevBercerita
      </Link>
      <div className="flex flex-1 items-center justify-end gap-3 text-sm font-medium text-ink">
        <Link href="/" className="transition hover:text-sand">
          Home
        </Link>
        <Link href="/posts/create" className="transition hover:text-sand">
          Tulis Cerita
        </Link>
        {isAuthenticated ? (
          <Button intent="ghost" size="sm" onClick={logout}>
            Logout
          </Button>
        ) : (
          <div className="flex gap-2">
            <Link href="/auth/login">
              <Button intent="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Daftar</Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
