"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";

export function LoginForm() {
  const router = useRouter();
  const { showToast } = useToast();
  const { login: saveToken } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const { token } = await login(form);
      saveToken(token);
      showToast("Berhasil masuk, selamat datang kembali!");
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="email@contoh.com"
        value={form.email}
        onChange={(event) => {
          setError(null);
          setForm((prev) => ({ ...prev, email: event.target.value }));
        }}
        required
      />
      <Input
        label="Kata Sandi"
        type="password"
        placeholder="Minimal 8 karakter"
        value={form.password}
        onChange={(event) => {
          setError(null);
          setForm((prev) => ({ ...prev, password: event.target.value }));
        }}
        required
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Memeriksa..." : "Masuk"}
      </Button>
    </form>
  );
}
