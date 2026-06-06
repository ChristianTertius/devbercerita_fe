"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

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

  const currentSort = SORT_OPTIONS.find(
    (o) => o.sortBy === sortBy && o.order === order
  ) ?? SORT_OPTIONS[0];

  const apply = (overrides: Record<string, string> = {}) => {
    const params = new URLSearchParams({
      page: "1",
      search: q,
      sort_by: sortBy,
      order,
      ...overrides,
    });
    router.push(`/?${params}`);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply({ search: q })}
        placeholder="Cari cerita..."
        className="min-w-48 rounded-lg border border-sand/30 bg-paper px-3 py-1.5 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-sand"
      />

      {/* Sort — single dropdown */}
      <div className="relative">
        <select
          value={`${currentSort.sortBy}:${currentSort.order}`}
          onChange={(e) => {
            const [s, o] = e.target.value.split(":");
            apply({ sort_by: s, order: o });
          }}
          className="appearance-none cursor-pointer rounded-lg border border-sand/30 bg-paper py-1.5 pl-3 pr-8 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-sand"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={`${opt.sortBy}:${opt.order}`} value={`${opt.sortBy}:${opt.order}`}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* custom chevron */}
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-ink/40 text-xs">
          ▾
        </span>
      </div>
    </div>
  );
}
