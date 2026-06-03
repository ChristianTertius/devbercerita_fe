import Link from "next/link";
import { getPosts } from "@/lib/api";
import { PostCard } from "@/components/PostCard";

export default async function HomePage() {
  const posts = await getPosts({ limit: 12, page: 1 });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 pb-16 pt-10">
      <section className="space-y-4 rounded-3xl border border-sand/50 bg-paper/80 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-sand">DevBercerita</p>
        <h1 className="text-4xl font-semibold leading-tight text-ink">
          Curahan cerita developer dalam bahasa sehari-hari.
        </h1>
        <p className="text-lg text-ink/70">
          Ceritakan push-mu, rintangan produksi, dan insight belajar terbaru. Medium-style, tapi dibuat khusus buat
          yang kerja koding.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/posts/create"
            className="rounded-full border border-ink/40 bg-ink px-5 py-2 text-sm font-semibold text-paper transition hover:bg-ink/90"
          >
            Tulis cerita
          </Link>
          <Link
            href="/auth/login"
            className="rounded-full border border-sand/70 px-5 py-2 text-sm font-semibold text-ink transition hover:border-ink"
          >
            Masuk dulu
          </Link>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-ink">Kumpulan cerita terbaru</h2>
          <Link href="/posts/create" className="text-sm font-semibold text-sand">
            + Tambah posting
          </Link>
        </div>
        {posts.data.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {posts.data.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/70">Belum ada cerita yang terkumpul. Jadilah orang pertama yang bercerita.</p>
        )}
      </section>
    </main>
  );
}
