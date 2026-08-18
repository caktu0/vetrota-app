import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { RegionModal } from "@/components/layout/RegionModal";
import { ToastBanner } from "@/components/ui/ToastBanner";

export const metadata: Metadata = {
  title: "VetRota — Kapınıza Gelen Uzman Veterinerlik Hizmeti",
  description:
    "Kadıköy ve Maltepe mahallelerinde evde muayene, aşı, tırnak kesimi, parazit bakımı ve tüm Türkiye'ye online veterinerlik randevusu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Calistoga&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Caveat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#FDFBF7] text-[#2D241E] font-body flex flex-col antialiased selection:bg-[#C67B5C]/20 selection:text-[#C67B5C]">
        <AppProvider>
          <ToastBanner />
          <RegionModal />
          <Header />
          <main className="flex-1 pb-24 md:pb-20 max-w-4xl mx-auto w-full px-4 pt-4">
            {children}
          </main>
          <BottomNav />
        </AppProvider>
      </body>
    </html>
  );
}
