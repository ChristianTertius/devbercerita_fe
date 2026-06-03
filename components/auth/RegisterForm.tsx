"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { register } from "@/lib/api";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", username: "", password: "", passwordConfirm: "" });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await register({
        email: form.email,
        username: form.username,
        password: form.password,
        password_confirm: form.passwordConfirm,
      });
      router.push("/auth/login");
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
        label="Username"
        placeholder="@username"
        value={form.username}
        onChange={(event) => {
          setError(null);
          setForm((prev) => ({ ...prev, username: event.target.value }));
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
      <Input
        label="Konfirmasi kata sandi"
        type="password"
        placeholder="Ketik ulang kata sandi"
        value={form.passwordConfirm}
        onChange={(event) => {
          setError(null);
          setForm((prev) => ({ ...prev, passwordConfirm: event.target.value }));
        }}
        required
      />
      {error && <p className="text-sm text-rose">{error}</p>}
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Membuat akun..." : "Daftar"}
      </Button>
    </form>
  );
}
