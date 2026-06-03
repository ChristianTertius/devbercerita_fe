import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-16 pt-16">
      <section className="space-y-3 rounded-3xl border border-sand/40 bg-paper/80 p-6 text-ink">
        <p className="text-xs uppercase tracking-[0.3em] text-sand">Masuk</p>
        <h1 className="text-3xl font-semibold">Selamat datang kembali di DevBercerita</h1>
        <p className="text-sm text-ink/70">Gunakan akunmu untuk mengelola cerita dan komentar.</p>
        <LoginForm />
        <p className="text-sm text-ink/70">
          Belum punya akun? <Link href="/auth/register" className="font-semibold text-sand">Daftar dulu</Link>
        </p>
      </section>
    </main>
  );
}
