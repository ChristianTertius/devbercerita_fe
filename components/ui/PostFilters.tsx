"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

type Props = {
  search: string;
  sortBy: string;
  order: string;
};

const SORT_OPTIONS = [
  { label: "Terbaru", sortBy: "created_at", order: "desc" },
  { label: "Terlama", sortBy: "created_at", order: "asc" },
  { label: "Terpopuler", sortBy: "like_count", order: "desc" },
  { label: "Paling sedikit disukai", sortBy: "like_count", order: "asc" },
];

export function PostFilters({ search, sortBy, order }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(search);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentSort =
    SORT_OPTIONS.find((o) => o.sortBy === sortBy && o.order === order) ??
    SORT_OPTIONS[0];

  // realtime search dengan debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams({
        page: "1",
        search: q,
        sort_by: sortBy,
        order,
      });
      router.push(`/?${params}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  // close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const selectSort = (opt: (typeof SORT_OPTIONS)[0]) => {
    setOpen(false);
    const params = new URLSearchParams({
      page: "1",
      search: q,
      sort_by: opt.sortBy,
      order: opt.order,
    });
    router.push(`/?${params}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari cerita..."
        className="min-w-48 rounded-lg border border-sand/30 bg-paper px-3 py-1.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-sand"
      />

      {/* Custom dropdown */}
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex cursor-pointer items-center gap-2 rounded-lg border border-sand/30 bg-paper px-3 py-1.5 text-sm text-ink hover:bg-sand/5 focus:outline-none focus:ring-1 focus:ring-sand"
        >
          {currentSort.label}
          <svg
            className={`h-3.5 w-3.5 text-ink/40 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute left-0 top-full z-10 mt-1.5 min-w-full overflow-hidden rounded-lg border border-sand/20 bg-paper shadow-lg">
            {SORT_OPTIONS.map((opt) => {
              const isActive = opt.sortBy === sortBy && opt.order === order;
              return (
                <button
                  key={`${opt.sortBy}:${opt.order}`}
                  onClick={() => selectSort(opt)}
                  className={`flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors ${isActive
                    ? "bg-sand/10 font-medium text-ink"
                    : "text-ink/70 hover:bg-sand/5 hover:text-ink"
                    }`}
                >
                  {isActive && (
                    <svg
                      className="h-3.5 w-3.5 shrink-0 text-sand"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  <span className={isActive ? "" : "pl-[1.375rem]"}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
