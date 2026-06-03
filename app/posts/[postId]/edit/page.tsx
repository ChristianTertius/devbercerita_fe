import { notFound } from "next/navigation";
import { getPostDetail } from "@/lib/api";
import { PostForm } from "@/components/PostForm";

export default async function EditPostPage({
  params,
}: {
  params: { postId: string };
}) {
  let post;

  try {
    post = await getPostDetail(params.postId);
  } catch {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-16 pt-10">
      <section className="space-y-3 rounded-3xl border border-sand/40 bg-paper/80 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-sand">Perbarui cerita</p>
        <h1 className="text-3xl font-semibold text-ink">Sempurnakan tulisanmu</h1>
      </section>
      <div className="rounded-3xl border border-sand/40 bg-paper/80 p-6">
        <PostForm
          mode="edit"
          postId={params.postId}
          initialValues={{ title: post.title, content: post.content }}
        />
      </div>
    </main>
  );
}
