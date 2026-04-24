import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { AppHeader } from "@/components/AppHeader";
import { createClient } from "@/lib/supabase/server";
import { he } from "@/lib/he";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: he.appTitle,
  description: he.tagline,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full`}>
      <body
        className={`${heebo.className} flex min-h-full flex-col bg-[#061526] text-white antialiased`}
      >
        <AppHeader user={user ? { email: user.email } : null} />
        <main className="relative flex-1">{children}</main>
      </body>
    </html>
  );
}
