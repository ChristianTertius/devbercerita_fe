"use client";
import { useState } from "react";
import type { PostComment } from "@/lib/api";
import { toggleCommentLike } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

export function CommentList({ comments }: { comments: PostComment[] }) {
  if (!comments.length) {
    return <p className="text-sm text-ink/60">Belum ada komentar, jadilah yang pertama.</p>;
  }
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </div>
  );
}

function CommentItem({ comment }: { comment: PostComment }) {
  const { token } = useAuth();
  const [likeCount, setLikeCount] = useState(comment.like_count);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (!token) return;
    setIsLiking(true);
    try {
      await toggleCommentLike(comment.id, token);
      setHasLiked((prev) => !prev);
      setLikeCount((prev) => Math.max(0, prev + (hasLiked ? -1 : 1)));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <div className="rounded-2xl border border-sand/40 bg-paper/80 p-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-sand">
        <span>{comment.username}</span>
        <span>{formatDate(comment.created_at)}</span>
      </div>
      <p className="mt-2 text-base text-ink/80">{comment.content}</p>
      <div className="mt-3 flex items-center text-sm text-ink/60">
        <button
          onClick={handleLike}
          disabled={isLiking || !token}
          className={`transition hover:text-ink cursor-pointer disabled:cursor-default ${hasLiked ? "text-ink" : ""}`}
        >
          {likeCount} suka
        </button>
      </div>
    </div>
  );
}
