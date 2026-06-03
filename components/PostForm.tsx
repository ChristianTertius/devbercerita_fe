"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { createPost, updatePost } from "@/lib/api";

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
  const { token, isAuthenticated } = useAuth();
  const [formState, setFormState] = useState({
    title: initialValues?.title || "",
    content: initialValues?.content || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
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
        router.back();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSaving(false);
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
      {error && <p className="text-sm text-rose">{error}</p>}
      <Button type="submit" disabled={isSaving}>
        {isSaving ? (mode === "create" ? "Menyimpan..." : "Memperbarui...") : mode === "create" ? "Kirim Cerita" : "Perbarui Cerita"}
      </Button>
    </form>
  );
}
