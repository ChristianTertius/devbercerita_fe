"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CommentList } from "@/components/CommentList";
import { useAuth } from "@/contexts/AuthContext";
import {
  PostDetail,
  submitComment,
  togglePostLike,
  deletePost, // ← tambah ini (kita buat di api.ts)
} from "@/lib/api";
import { formatDate } from "@/lib/utils";

type PostDetailViewProps = {
  post: PostDetail;
};

export function PostDetailView({ post }: PostDetailViewProps) {
  const router = useRouter();
  const { token, username, isAuthenticated } = useAuth(); // ← tambah username
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeError, setLikeError] = useState<string | null>(null);
  const [isLiking, setIsLiking] = useState(false);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // ← tambah

  // ← tambah: cek apakah user yang login adalah author post ini
  const isAuthor = isAuthenticated && username === post.username;

  const formattedDate = useMemo(
    () => `${formatDate(post.created_at)} • diperbarui ${formatDate(post.updated_at)}`,
    [post.created_at, post.updated_at],
  );

  const handleLike = async () => {
    if (!token) {
      setLikeError("Masuk agar bisa menyukai cerita ini.");
      return;
    }
    setIsLiking(true);
    setLikeError(null);
    try {
      await togglePostLike(post.id, token);
      setHasLiked((current) => !current);
      setLikeCount((current) => Math.max(0, current + (hasLiked ? -1 : 1)));
    } catch (error) {
      setLikeError((error as Error).message);
    } finally {
      setIsLiking(false);
    }
  };

  // ← tambah handler delete
  const handleDelete = async () => {
    if (!token) return;
    if (!confirm("Yakin ingin menghapus cerita ini?")) return;
    setIsDeleting(true);
    try {
      await deletePost({ postId: String(post.id), token });
      router.push("/");
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthenticated || !token) {
      setCommentError("Silakan masuk agar bisa ikut komentar.");
      return;
    }
    if (!commentDraft.trim()) {
      setCommentError("Tulis komentar sebelum mengirim.");
      return;
    }
    setIsSavingComment(true);
    setCommentError(null);
    try {
      await submitComment({ postId: post.id, content: commentDraft, token });
      setCommentDraft("");
      router.refresh();
    } catch (error) {
      setCommentError((error as Error).message);
    } finally {
      setIsSavingComment(false);
    }
  };

  return (
    <section className="space-y-8 rounded-3xl border border-sand/40 bg-paper/90 p-6 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.3em] text-sand">{post.username}</div>
          {/* ← tombol edit & delete, hanya muncul untuk author */}
          {isAuthor && (
            <div className="flex gap-2">
              <Button
                intent="subtle"
                size="sm"
                onClick={() => router.push(`/posts/${post.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                intent="subtle"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Menghapus..." : "Hapus"}
              </Button>
            </div>
          )}
        </div>
        <h1 className="text-4xl font-semibold leading-tight text-ink">{post.title}</h1>
        <p className="text-sm text-ink/70">{formattedDate}</p>
      </div>
      <div className="space-y-4 rounded-2xl text-lg leading-relaxed text-ink/90">
        {post.content.split("\n").filter(Boolean).map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Button intent="subtle" size="sm" onClick={handleLike} disabled={isLiking}>
          {isLiking ? "Memproses..." : `Tunjukkan suka (${likeCount})`}
        </Button>
        <p className="text-sm text-ink/60">{post.comments.length} komentar</p>
      </div>
      {likeError && <p className="text-sm text-rose">{likeError}</p>}
      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-ink">Komentar</h2>
        <CommentList comments={post.comments} />
      </div>
      <form onSubmit={handleComment} className="space-y-3">
        <label className="text-sm font-semibold uppercase tracking-[0.3em] text-sand">
          Tinggalkan komentar
        </label>
        <textarea
          className="w-full rounded-2xl border border-sand/60 bg-paper/70 px-4 py-3 text-base focus:border-ink focus:outline-none"
          rows={4}
          placeholder="Bagikan feedback, apresiasi, atau pertanyaan"
          value={commentDraft}
          onChange={(event) => {
            setCommentError(null);
            setCommentDraft(event.target.value);
          }}
        />
        {commentError && <p className="text-sm text-rose">{commentError}</p>}
        <div className="flex justify-end">
          <Button type="submit" disabled={isSavingComment}>
            {isSavingComment ? "Mengirim..." : "Kirim komentar"}
          </Button>
        </div>
      </form>
    </section>
  );
}
