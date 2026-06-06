"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CommentList } from "@/components/CommentList";
import { useAuth } from "@/contexts/AuthContext";
import { PostDetail, submitComment, togglePostLike, deletePost, getPostDetail } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { ConfirmDialog } from "./ui/ConfirmDialog";
import { useToast } from "@/contexts/ToastContext";

type PostDetailViewProps = {
  post: PostDetail;
};

function LoginAlert({ isOpen, onClose, message }: { isOpen: boolean; onClose: () => void; message: string }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-3xl border border-sand/40 bg-paper p-6 shadow-lg">
        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sand/20 text-lg">🔒</div>
        <h2 className="text-lg font-semibold text-ink">Belum login</h2>
        <p className="mt-2 text-sm text-ink/60">{message}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-full border border-sand/70 px-4 py-1.5 text-sm font-semibold text-ink transition hover:border-ink"
          >
            Nanti dulu
          </button>
          <Link
            href="/auth/login"
            className="rounded-full border border-ink/40 bg-ink px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-ink/90"
          >
            Login dulu
          </Link>
        </div>
      </div>
    </div>
  );
}

export function PostDetailView({ post }: PostDetailViewProps) {
  const router = useRouter();
  const { token, username, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [likeCount, setLikeCount] = useState(post.like_count);
  const [hasLiked, setHasLiked] = useState(post.is_liked);
  const [isLiking, setIsLiking] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [commentDraft, setCommentDraft] = useState("");
  const [commentError, setCommentError] = useState<string | null>(null);
  const [isSavingComment, setIsSavingComment] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showLikeAlert, setShowLikeAlert] = useState(false);
  const [showCommentAlert, setShowCommentAlert] = useState(false);
  const [isLikedReady, setIsLikedReady] = useState(false);

  const isAuthor = isAuthenticated && username === post.username;

  const formattedDate = useMemo(
    () => `${formatDate(post.created_at)} • diperbarui ${formatDate(post.updated_at)}`,
    [post.created_at, post.updated_at],
  );

  // re-fetch dengan token untuk dapat is_liked yang benar
  useEffect(() => {
    if (!token || isLikedReady) return;
    getPostDetail(String(post.id), token).then((freshPost) => {
      setHasLiked(freshPost.is_liked);
      setLikeCount(freshPost.like_count);
      setComments(freshPost.comments);
      setIsLikedReady(true);
    });
  }, [token, post.id, isLikedReady]);

  const handleLike = async () => {
    if (!token || !username) {
      setShowLikeAlert(true);
      return;
    }
    setIsLiking(true);
    try {
      await togglePostLike(post.id, token);
      const next = !hasLiked;
      setHasLiked(next);
      setLikeCount((current) => Math.max(0, current + (next ? 1 : -1)));
    } catch (error) {
      showToast((error as Error).message, "error");
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!token) return;
    setIsDeleting(true);
    try {
      await deletePost({ postId: String(post.id), token });
      showToast("Post berhasil dihapus");
      router.push("/");
    } catch (error) {
      showToast((error as Error).message, "error");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleComment = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isAuthenticated || !token) {
      setShowCommentAlert(true);
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
      showToast("Komentar berhasil dikirim!");

      const freshPost = await getPostDetail(String(post.id), token);
      setComments(freshPost.comments);
    } catch (error) {
      showToast((error as Error).message, "error");
    } finally {
      setIsSavingComment(false);
    }
  };

  return (
    <section className="space-y-8 rounded-3xl border border-sand/40 bg-paper/90 p-6 shadow-sm">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs uppercase tracking-[0.3em] text-sand">{post.username}</div>
          {isAuthor && (
            <div className="flex gap-2">
              <Button intent="subtle" size="sm" className="cursor-pointer" onClick={() => router.push(`/posts/${post.id}/edit`)}>
                Edit
              </Button>
              <Button intent="subtle" size="sm" onClick={() => setShowDeleteDialog(true)} className="cursor-pointer" disabled={isDeleting}>
                {isDeleting ? "Menghapus..." : "Hapus"}
              </Button>
              <ConfirmDialog
                isOpen={showDeleteDialog}
                title="Hapus cerita ini?"
                description="Tindakan ini tidak bisa dibatalkan."
                confirmLabel="Ya, hapus"
                onConfirm={handleDelete}
                onCancel={() => setShowDeleteDialog(false)}
                danger
              />
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
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium transition ${hasLiked
            ? "border-rose-300 bg-rose-50 text-rose-500"
            : "border-sand/40 bg-paper text-ink/60 hover:border-ink/40 hover:text-ink"
            }`}
        >
          <span className="text-base">{hasLiked ? "❤️" : "🤍"}</span>
          <span>{likeCount}</span>
        </button>
        <p className="text-sm text-ink/60">{comments.length} komentar</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold text-ink">Komentar</h2>
        <CommentList comments={comments} /> {/* ← pakai state comments */}
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

      <LoginAlert
        isOpen={showLikeAlert}
        onClose={() => setShowLikeAlert(false)}
        message="Kamu perlu masuk dulu untuk menyukai cerita ini."
      />
      <LoginAlert
        isOpen={showCommentAlert}
        onClose={() => setShowCommentAlert(false)}
        message="Kamu perlu masuk dulu untuk ikut berkomentar."
      />
    </section>
  );
}
