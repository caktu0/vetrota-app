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
    <html lang="tr" className="scroll-smooth h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Calistoga&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Caveat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
      </head>
      <body className="min-h-full bg-[#E8DFD3] text-[#2D241E] font-body flex items-center justify-center antialiased selection:bg-[#C67B5C]/20 selection:text-[#C67B5C] p-0 sm:py-4 overflow-x-hidden">
        <AppProvider>
          {/* MOBILE APP CONTAINER (Centered on desktop with phone shell, full-screen on mobile) */}
          <div className="w-full max-w-md min-h-screen sm:min-h-[850px] sm:max-h-[92vh] bg-[#FDFBF7] sm:rounded-[42px] sm:shadow-[0_25px_70px_rgba(0,0,0,0.30)] sm:border-[8px] sm:border-[#1E1713] flex flex-col relative overflow-hidden flex-shrink-0">
            
            {/* iOS Status Bar Simulation */}
            <div className="w-full bg-[#FDFBF7] px-6 pt-3 pb-1 flex items-center justify-between text-xs font-semibold text-[#2D241E] select-none z-50 flex-shrink-0">
              <span className="font-bold text-xs tracking-tight">09:41</span>
              
              {/* iPhone Dynamic Island Pill */}
              <div className="w-20 h-4 bg-[#1E1713] rounded-full flex items-center justify-end px-2 gap-1.5 shadow-inner hidden sm:flex">
                <div className="w-2 h-2 rounded-full bg-[#2D241E]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-[10px] font-bold tracking-tighter">5G</span>
                <span className="text-xs leading-none">🔋</span>
              </div>
            </div>

            <ToastBanner />
            <RegionModal />
            <TimeSlotModal />
            <Header />
            
            {/* Scrollable Mobile App Body Canvas */}
            <main className="flex-1 overflow-y-auto no-scrollbar pb-24 px-3.5 pt-2">
              {children}
            </main>

            {/* Fixed Mobile Bottom Navigation Bar */}
            <BottomNav />

            {/* iOS Home Indicator Bar at bottom (desktop preview) */}
            <div className="w-full bg-[#FDFBF7] pb-1.5 pt-0.5 flex justify-center items-center select-none z-50 flex-shrink-0 hidden sm:flex pointer-events-none">
              <div className="w-28 h-1 bg-[#2D241E]/25 rounded-full" />
            </div>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
