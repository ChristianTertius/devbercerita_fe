"use client";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export function NavBar() {
  return (
    <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 border-b border-sand/40 pb-4">
      <Link href="/" className="text-2xl font-semibold tracking-wide text-ink">
        DevBercerita
      </Link>
    </header>
  );
}
