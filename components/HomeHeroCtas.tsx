"use client";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/contexts/ToastContext";

export function HomeHeroCtas() {
  const { isAuthenticated, username, logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const { showToast } = useToast()

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
            onClick={() => setShowLogoutDialog(true)}
            className="rounded-full cursor-pointer border border-sand/70 px-5 py-2 text-sm font-semibold text-ink transition hover:border-ink"
          >
            Logout
          </button>
        </>
      )}

      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Yakin mau logout?"
        description="Kamu perlu login lagi untuk menulis cerita."
        confirmLabel="Ya, logout"
        cancelLabel="Batal"
        onConfirm={() => {
          logout();
          setShowLogoutDialog(false);
          showToast("Berhasil logout!")
        }}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </div>
  );
}
