"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PostComment } from "@/lib/api";
import { toggleCommentLike } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

function LoginAlert({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-sand/40 bg-paper p-6 shadow-lg">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sand/20 text-lg">🔒</div>
        <h2 className="text-lg font-semibold text-ink">Belum login</h2>
        <p className="mt-2 text-sm text-ink/60">Kamu perlu masuk dulu untuk menyukai komentar ini.</p>
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-full border border-sand/70 px-4 py-1.5 text-sm font-semibold text-ink transition hover:border-ink">
            Nanti dulu
          </button>
          <Link href="/auth/login" className="rounded-full border border-ink/40 bg-ink px-4 py-1.5 text-sm font-semibold text-white! transition hover:bg-ink/90">
            Login dulu
          </Link>
        </div>
      </div>
    </div>
  );
}

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
  console.log("comment.is_liked:", comment.id, comment.is_liked);
  const [hasLiked, setHasLiked] = useState(comment.is_liked);
  const [isLiking, setIsLiking] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setHasLiked(comment.is_liked);
    setLikeCount(comment.like_count);
  }, [comment.is_liked, comment.like_count]);

  const handleLike = async () => {
    if (!token) {
      setShowAlert(true);
      return;
    }
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
    <>
      <div className="rounded-2xl border border-sand/40 bg-paper/80 p-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-sand">
          <span>{comment.username}</span>
          <span>{formatDate(comment.created_at)}</span>
        </div>
        <p className="mt-2 text-base text-ink/80">{comment.content}</p>
        <div className="mt-3 flex items-center text-sm text-ink/60">
          <button
            onClick={handleLike}
            disabled={isLiking}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${hasLiked
              ? "border-rose-300 bg-rose-50 text-rose-500"
              : "border-sand/40 bg-paper text-ink/60 hover:border-ink/40 hover:text-ink"
              }`}
          >
            <span>{hasLiked ? "❤️" : "🤍"}</span>
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
      <LoginAlert isOpen={showAlert} onClose={() => setShowAlert(false)} />
    </>
  );
}
