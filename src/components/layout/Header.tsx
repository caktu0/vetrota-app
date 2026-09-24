"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { MapPin, Calendar, Bell, ChevronDown } from "lucide-react";

export function Header() {
  const pathname = usePathname();
  const {
    selectedRegion,
    setIsRegionModalOpen,
    selectedTimeSlot,
    setIsTimeSlotModalOpen,
    role,
  } = useApp();

  // Hide top header on auth screens
  if (pathname === "/login" || pathname === "/verify" || pathname === "/auth" || pathname === "/register") {
    return null;
  }

  return (
    <header className="w-full bg-[#FDFBF7] border-b border-[#E8DFD3]/80 px-3.5 pt-1 pb-2.5 space-y-2 z-40 flex-shrink-0">
      {/* 1. App Logo & Notification Bell */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-[#C67B5C] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-base font-bold">🐾</span>
          </div>
          <div>
            <span className="text-xl font-heading font-extrabold text-[#C67B5C] tracking-tight">
              vetrota
            </span>
            <span className="ml-1 text-[9px] uppercase font-bold tracking-widest text-[#8B7355] bg-[#F4EFE6] px-1.5 py-0.5 rounded-full border border-[#E8DFD3]">
              {role === "VET" ? "Hekim" : "Mobil App"}
            </span>
          </div>
        </Link>

        {/* Bell Notification Icon */}
        <button
          onClick={() => alert("VetRota Bildirimleri: Yaklaşan randevunuz bulunmamaktadır.")}
          className="relative w-8 h-8 rounded-xl bg-[#F4EFE6] hover:bg-[#E8DFD3] text-[#2D241E] flex items-center justify-center transition-colors"
          title="Bildirimler"
        >
          <Bell className="w-4 h-4 text-[#2D241E]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C67B5C] ring-2 ring-white" />
        </button>
      </div>

      {/* 2. Address & Time Slot Selector Pills (Mobile View) */}
      {role === "USER" && (
        <div className="grid grid-cols-12 gap-1.5">
          {/* Location Picker Pill (7 cols) */}
          <button
            type="button"
            onClick={() => setIsRegionModalOpen(true)}
            className="col-span-7 flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-white border border-[#E8DFD3] hover:border-[#C67B5C] text-xs shadow-sm transition-all text-left"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-[#C67B5C]/15 text-[#C67B5C] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 leading-tight">
                <span className="text-[9px] text-[#8B7355] block font-medium">Bölge</span>
                <span className="font-bold text-[#2D241E] truncate block text-[10px]">
                  {selectedRegion.name}, {selectedRegion.district}
                </span>
              </div>
            </div>
            <ChevronDown className="w-3 h-3 text-[#8B7355] flex-shrink-0 ml-0.5" />
          </button>

          {/* Time Slot Picker Pill (5 cols) */}
          <button
            type="button"
            onClick={() => setIsTimeSlotModalOpen(true)}
            className="col-span-5 flex items-center justify-between px-2 py-1.5 rounded-xl bg-white border border-[#E8DFD3] hover:border-[#C67B5C] text-xs shadow-sm transition-all text-left"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-[#6B7B3C]/15 text-[#6B7B3C] flex items-center justify-center flex-shrink-0">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 leading-tight">
                <span className="text-[9px] text-[#8B7355] block font-medium">Zaman</span>
                <span className="font-bold text-[#6B7B3C] truncate block text-[10px]">
                  {selectedTimeSlot.split(" ")[0]} {selectedTimeSlot.split(" ")[1]}
                </span>
              </div>
            </div>
          </button>
        </div>
      )}
    </header>
  );
}
