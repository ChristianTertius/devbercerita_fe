import { notFound } from "next/navigation";
import { getPostDetail } from "@/lib/api";
import { PostDetailView } from "@/components/PostDetailView";
import { BackButton } from "@/components/BackButton";

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  let post;
  try {
    post = await getPostDetail(postId);
  } catch {
    notFound();
  }
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 pb-16 pt-10">
      <BackButton />
      <PostDetailView key={post.updated_at} post={post} />
    </main>
  );
}
