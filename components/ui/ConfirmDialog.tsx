// components/ui/ConfirmDialog.tsx
"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
};

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Ya, lanjutkan",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
  danger = false,
}: ConfirmDialogProps) {
  const [visible, setVisible] = useState(false);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRendered(true);
      // delay sedikit agar transisi CSS terpicu
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      // tunggu animasi selesai baru unmount
      const timer = setTimeout(() => setRendered(false), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!rendered) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/20 backdrop-blur-sm transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"
          }`}
        onClick={onCancel}
      />
      {/* Dialog */}
      <div
        className={`relative z-10 w-full max-w-sm rounded-3xl border border-sand/40 bg-paper p-6 shadow-lg transition-all duration-200 ${visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
      >
        <h2 className="text-lg font-semibold text-ink">{title}</h2>
        {description && (
          <p className="mt-2 text-sm text-ink/60">{description}</p>
        )}
        <div className="mt-6 flex justify-end gap-2">
          <Button intent="ghost" size="sm" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button
            size="sm"
            className={danger ? "border-transparent bg-rose-500 text-white hover:bg-rose-600 cursor-pointer" : ""}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
