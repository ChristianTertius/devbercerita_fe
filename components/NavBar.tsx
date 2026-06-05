// navbar.tsx
"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export function NavBar() {
  const { isAuthenticated, username, logout } = useAuth();
  return (
    <header className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 border-b border-sand/40 pb-4">
      <Link href="/" className="text-2xl font-semibold tracking-wide text-ink">
        DevBercerita
      </Link>
      {/* <div className="flex items-center gap-3"> */}
      {/*   {isAuthenticated ? ( */}
      {/*     <> */}
      {/*       <span className="text-sm text-ink/60">{username}</span> */}
      {/*       <Button intent="ghost" size="sm" onClick={logout}> */}
      {/*         Logout */}
      {/*       </Button> */}
      {/*     </> */}
      {/*   ) : ( */}
      {/*     <> */}
      {/*       <Link href="/auth/login"> */}
      {/*         <Button intent="ghost" size="sm">Masuk</Button> */}
      {/*       </Link> */}
      {/*       <Link href="/auth/register"> */}
      {/*         <Button size="sm">Daftar</Button> */}
      {/*       </Link> */}
      {/*     </> */}
      {/*   )} */}
      {/* </div> */}
    </header>
  );
}
