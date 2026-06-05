import type { Metadata } from "next";
import { Playfair_Display, Source_Sans_3 } from "next/font/google";
import { AuthProvider } from "@/contexts/AuthContext";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const heading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600"],
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "DevBercerita",
  description:
    "Platform blogging dan forum yang membantu developer berbagi cerita, pengalaman, dan insight fresh.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${heading.variable} ${body.variable}`}>
      <body className="flex min-h-screen flex-col bg-cloud text-ink antialiased">
        <AuthProvider>
          <div className="page-shell flex w-full flex-1 flex-col gap-8 px-4 py-6 lg:px-0">
            <NavBar />
            <div className="flex-1">{children}</div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
