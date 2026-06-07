import Link from "next/link";
import { getPosts } from "@/lib/api";
import { PostCard } from "@/components/PostCard";
import { HomeHeroCtas } from "@/components/HomeHeroCtas";
import { Pagination } from "@/components/ui/Pagination";
import { PostFilters } from "@/components/ui/PostFilters";

type Props = {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sort_by?: string;
    order?: string;
  }>;
};

export default async function HomePage({ searchParams }: Props) {
  const { page: pageParam, search = "", sort_by = "created_at", order = "desc" } = await searchParams;
  const page = Number(pageParam) || 1;
  const posts = await getPosts({ limit: 12, page, search, sortBy: sort_by, order });
  const data = posts.data ?? [];

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-10">
      <section className="space-y-4 rounded-3xl border border-sand/50 bg-paper/80 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-sand">DevBercerita</p>
        <h1 className="text-4xl font-semibold leading-tight text-ink">
          Curahan cerita developer dalam bahasa sehari-hari.
        </h1>
        <p className="text-lg text-ink/70">
          Ceritakan apapun terkait dengan pengalamanmu sebagai developer!
        </p>
        <HomeHeroCtas />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-ink">Kumpulan cerita terbaru</h2>
          <Link href="/posts/create" className="text-sm font-semibold text-sand">
            + Tambah posting
          </Link>
        </div>

        <PostFilters search={search} sortBy={sort_by} order={order} />

        {data.length ? (
          <div className="grid gap-6 md:grid-cols-2 [&>*]:h-full">
            {data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/70">
            Belum ada cerita yang terkumpul. Jadilah orang pertama yang bercerita.
          </p>
        )}

        <Pagination
          currentPage={page}
          totalPage={posts.total_page}
          search={search}
          sortBy={sort_by}
          order={order}
        />
      </section>
    </main>
  );
}
