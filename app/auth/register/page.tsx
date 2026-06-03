import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 pb-16 pt-16">
      <section className="space-y-3 rounded-3xl border border-sand/40 bg-paper/80 p-6 text-ink">
        <p className="text-xs uppercase tracking-[0.3em] text-sand">Daftar</p>
        <h1 className="text-3xl font-semibold">Mari mulai cerita pertamamu</h1>
        <p className="text-sm text-ink/70">Isi detailmu, lalu langsung bisa menyumbang pengalaman.</p>
        <RegisterForm />
        <p className="text-sm text-ink/70">
          Sudah punya akun? <Link href="/auth/login" className="font-semibold text-sand">Masuk</Link>
        </p>
      </section>
    </main>
  );
}
