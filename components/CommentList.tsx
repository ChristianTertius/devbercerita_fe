import type { PostComment } from "@/lib/api";
import { formatDate } from "@/lib/utils";

export function CommentList({ comments }: { comments: PostComment[] }) {
  if (!comments.length) {
    return <p className="text-sm text-ink/60">Belum ada komentar, jadilah yang pertama.</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="rounded-2xl border border-sand/40 bg-paper/80 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-sand">
            <span>{comment.username}</span>
            <span>{formatDate(comment.created_at)}</span>
          </div>
          <p className="mt-2 text-base text-ink/80">{comment.content}</p>
          <div className="mt-3 flex items-center text-sm text-ink/60">
            {comment.like_count} suka
          </div>
        </div>
      ))}
    </div>
  );
}
