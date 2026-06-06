"use client";

import { useRouter } from "next/navigation";

type Props = {
  currentPage: number;
  totalPage: number;
};

export function Pagination({ currentPage, totalPage }: Props) {
  const router = useRouter();

  if (totalPage <= 1) return null;

  const goTo = (page: number) => router.push(`/?page=${page}`);

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-sand/30 px-3 py-1.5 cursor-pointer text-sm text-ink disabled:opacity-30 hover:bg-sand/10"
      >
        ← Prev
      </button>

      {Array.from({ length: totalPage }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => goTo(p)}
          className={`rounded-lg cursor-pointer border px-3 py-1.5 text-sm ${p === currentPage
            ? "border-sand bg-sand text-paper"
            : "border-sand/30 text-ink hover:bg-sand/10"
            }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage === totalPage}
        className="rounded-lg cursor-pointer border border-sand/30 px-3 py-1.5 text-sm text-ink disabled:opacity-30 hover:bg-sand/10"
      >
        Next →
      </button>
    </div>
  );
}
