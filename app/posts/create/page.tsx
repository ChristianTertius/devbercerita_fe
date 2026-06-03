import { PostForm } from "@/components/PostForm";

export default function CreatePostPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-16 pt-10">
      <section className="space-y-3 rounded-3xl border border-sand/40 bg-paper/80 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-sand">Tulis cerita</p>
        <h1 className="text-3xl font-semibold text-ink">Curhat anyar kapan pun kamu siap</h1>
        <p className="text-sm text-ink/70">
          Ceritakan proses-proses kecil, kebingungan, atau kemenangan harian. Cerita ini bisa jadi rujukan ke depannya.
        </p>
      </section>
      <div className="rounded-3xl border border-sand/40 bg-paper/80 p-6">
        <PostForm mode="create" />
      </div>
    </main>
  );
}
