"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { createPost, updatePost } from "@/lib/api";
import Link from "next/link";
import { useToast } from "@/contexts/ToastContext";

type PostFormProps = {
  mode: "create" | "edit";
  postId?: string;
  initialValues?: {
    title: string;
    content: string;
  };
};

export function PostForm({ mode, postId, initialValues }: PostFormProps) {
  const router = useRouter();
  const { token, isAuthenticated, isReady } = useAuth(); // ← tambah isReady
  const [formState, setFormState] = useState({
    title: initialValues?.title || "",
    content: initialValues?.content || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    console.log("isReady", isReady)
    console.log("isAuthenticated", isAuthenticated)
    console.log("token: ", token)

    event.preventDefault();
    if (!isReady) return; // ← tunggu localStorage selesai dibaca
    if (!isAuthenticated || !token) {
      setError("Masuk dulu agar bisa mengirim cerita.");
      return;
    }
    if (!formState.title.trim() || !formState.content.trim()) {
      setError("Judul dan cerita tidak boleh kosong.");
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      if (mode === "create") {
        await createPost({ ...formState, token });
        router.push("/");
      } else if (postId) {
        await updatePost({ postId, ...formState, token });
        router.push(`/posts/${postId}`);
        router.refresh();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
      if (mode == 'create') {
        showToast('berhasil menambahkan cerita!')
      } else if (postId) {
        showToast('berhasil update cerita!')
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Judul"
        placeholder="Contoh: Catatan Refleksi Pascakode"
        value={formState.title}
        onChange={(event) => {
          setError(null);
          setFormState((prev) => ({ ...prev, title: event.target.value }));
        }}
        required
      />
      <Textarea
        label="Cerita"
        placeholder="Ceritakan proses, perasaan, dan insight-mu"
        value={formState.content}
        onChange={(event) => {
          setError(null);
          setFormState((prev) => ({ ...prev, content: event.target.value }));
        }}
        required
      />
      {error && isAuthenticated && (
        <p className="text-sm text-ink/70">{error}</p>
      )}
      <Button type="submit" disabled={isSaving || !isReady}> {/* ← disable juga kalau belum ready */}
        {isSaving
          ? mode === "create" ? "Menyimpan..." : "Memperbarui..."
          : mode === "create" ? "Kirim Cerita" : "Perbarui Cerita"}
      </Button>
      {!isAuthenticated && error && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-ink/20 backdrop-blur-sm" />
          {/* Alert */}
          <div className="relative z-10 w-full max-w-sm rounded-3xl border border-sand/40 bg-paper p-6 shadow-lg">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-sand/20 text-lg">
              🔒
            </div>
            <h2 className="text-lg font-semibold text-ink">Belum login</h2>
            <p className="mt-2 text-sm text-ink/60">
              Kamu perlu masuk dulu untuk bisa mengirim cerita.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setError(null)}
                className="rounded-full border border-sand/70 px-4 py-1.5 text-sm font-semibold text-ink transition hover:border-ink"
              >
                Nanti dulu
              </button>
              <Link
                href="/auth/login"
                className="rounded-full border border-ink/40 bg-ink px-4 py-1.5 text-sm font-semibold text-white! transition hover:bg-ink/90"
              >
                Login dulu
              </Link>
            </div>
          </div>
        </div>
      )}
    </form>

  );
}
