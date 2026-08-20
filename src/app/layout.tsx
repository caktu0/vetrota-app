import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { RegionModal } from "@/components/layout/RegionModal";
import { TimeSlotModal } from "@/components/layout/TimeSlotModal";
import { ToastBanner } from "@/components/ui/ToastBanner";

export const metadata: Metadata = {
  title: "VetRota — Kapınıza Gelen Uzman Veterinerlik & Pet Mobil Uygulaması",
  description:
    "Evde sağlık hizmetleri, mama, petshop ürünleri, gıda takviyeleri, online muayene ve veteriner davranış danışmanlığı.",
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="bg-[#EFE9DF] text-[#2D241E] font-body flex justify-center items-center min-h-screen antialiased selection:bg-[#C67B5C]/20 selection:text-[#C67B5C] py-0 sm:py-6">
        <AppProvider>
          {/* MOBILE APP FRAME CONTAINER (Centered on desktop, full-width on mobile) */}
          <div className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] sm:h-[90vh] bg-[#FDFBF7] sm:rounded-[44px] shadow-[0_25px_60px_-15px_rgba(45,36,30,0.25)] border-0 sm:border-[8px] sm:border-[#2D241E] flex flex-col relative overflow-hidden">
            
            {/* iOS Status Bar Simulation (Time 9:41, Network & Battery icons) */}
            <div className="w-full bg-[#FDFBF7] px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-[#2D241E] select-none z-50 flex-shrink-0">
              <span className="font-bold text-sm tracking-tight">9:41</span>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-xs tracking-tighter">📶 5G</span>
                <span>🔋</span>
              </div>
            </div>

            <ToastBanner />
            <RegionModal />
            <TimeSlotModal />
            <Header />
            
            {/* Scrollable Mobile App Body Canvas */}
            <main className="flex-1 overflow-y-auto pb-24 px-4 pt-2">
              {children}
            </main>

            <BottomNav />
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
