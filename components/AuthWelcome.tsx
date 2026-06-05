"use client";

import { useAuth } from "@/contexts/AuthContext";

export function AuthWelcome() {
  const { username, isAuthenticated } = useAuth();

  if (!isAuthenticated || !username) {
    return null;
  }

  return (
    <section className="mx-auto flex w-full max-w-5xl rounded-3xl border border-sand/30 bg-gradient-to-r from-sand/10 via-cloud/80 to-sand/10 px-6 py-4 text-sm font-medium text-ink shadow-sm">
      <p>
        Welcome back, <span className="font-semibold text-ink">{username}</span> 👋
      </p>
    </section>
  );
}
