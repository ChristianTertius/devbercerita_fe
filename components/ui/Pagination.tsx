"use client";

import { useRouter } from "next/navigation";

type Props = {
  currentPage: number;
  totalPage: number;
};

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | "...")[] = [1];

  if (current > 3) pages.push("...");

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push("...");

  pages.push(total);

  return pages;
}

export function Pagination({ currentPage, totalPage }: Props) {
  const router = useRouter();

  if (totalPage <= 1) return null;

  const goTo = (page: number) => router.push(`/?page=${page}`);
  const pages = getPageNumbers(currentPage, totalPage);

  return (
    <div className="flex items-center justify-center gap-2 pt-4">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-lg border border-sand/30 cursor-pointer px-3 py-1.5 text-sm text-ink disabled:opacity-30 hover:bg-sand/10"
      >
        ← Prev
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-1 text-ink/40">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p)}
            className={`rounded-lg border cursor-pointer px-3 py-1.5 text-sm ${p === currentPage
              ? "border-sand bg-sand text-paper"
              : "border-sand/30 text-ink hover:bg-sand/10"
              }`}
          >
            {p}
          </button>
        )
      )}

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
