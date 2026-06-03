import Link from "next/link";
import { formatDate } from "@/lib/utils";
import type { PostDetail } from "@/lib/api";

export function PostCard({ post }: { post: PostDetail }) {
  return (
    <article className="group relative rounded-3xl border border-sand/40 bg-paper shadow-sm transition hover:border-ink/50">
      <div className="flex flex-col gap-3 p-6">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-sand">
          <span>{post.username}</span>
          <span>{formatDate(post.created_at)}</span>
        </div>
        <div className="space-y-4">
          <h3 className="text-2xl font-semibold text-ink group-hover:text-sand">
            {post.title}
          </h3>
          <p className="text-base leading-relaxed text-ink/70">
            {post.content.slice(0, 160)}{post.content.length > 160 ? "..." : ""}
          </p>
        </div>
        <div className="flex items-center justify-between text-sm text-ink/70">
          <div className="flex items-center gap-4">
            <span>{post.like_count} likes</span>
            <span>{post.comments.length} komentar</span>
          </div>
          <Link
            href={`/posts/${post.id}`}
            className="text-sand transition hover:underline"
          >
            Baca cerita
          </Link>
        </div>
      </div>
    </article>
  );
}
