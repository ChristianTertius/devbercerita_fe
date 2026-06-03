"use client";

import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-semibold uppercase tracking-[0.3em] text-sand">{label}</label>}
      <input
        className={cn(
          "w-full rounded-2xl border border-sand/80 bg-paper/70 px-4 py-3 text-base focus:border-ink focus:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export function Textarea({ label, className, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-2">
      {label && <label className="text-sm font-semibold uppercase tracking-[0.3em] text-sand">{label}</label>}
      <textarea
        className={cn(
          "min-h-[140px] w-full rounded-2xl border border-sand/70 bg-paper/70 px-4 py-3 text-base focus:border-ink focus:outline-none",
          className,
        )}
        {...props}
      />
    </div>
  );
}
