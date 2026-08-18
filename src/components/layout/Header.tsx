"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { MapPin, ChevronDown } from "lucide-react";

export function Header() {
  const { isAuthenticated, selectedRegion, setIsRegionModalOpen, role } = useApp();

  // Hide top header completely when not authenticated
  if (!isAuthenticated) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FDFBF7]/90 backdrop-blur-md border-b border-[#E8DFD3]">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-2xl bg-[#C67B5C] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <span className="text-xl font-bold">🐾</span>
          </div>
          <div>
            <span className="text-2xl font-heading font-extrabold text-[#C67B5C] tracking-tight">
              VetRota
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest text-[#8B7355] bg-[#F4EFE6] px-2 py-0.5 rounded-full">
              {role === "VET" ? "Hekim Portalı" : "Mobil Veterinerlik"}
            </span>
          </div>
        </Link>

        {/* Right: Region Selector (Only for User role when authenticated) */}
        {role === "USER" && (
          <button
            onClick={() => setIsRegionModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8DFD3] hover:border-[#C67B5C] hover:bg-[#FFFDF9] text-xs font-semibold text-[#2D241E] shadow-sm transition-all group"
          >
            <MapPin className="w-3.5 h-3.5 text-[#C67B5C] group-hover:animate-bounce" />
            <div className="text-left leading-tight max-w-[120px] sm:max-w-[160px] truncate">
              <span className="text-[10px] text-[#8B7355] block">Bölge Seç</span>
              <span className="font-bold text-[#2D241E] truncate">
                {selectedRegion.name}, {selectedRegion.district}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#8B7355] ml-0.5" />
          </button>
        )}
      </div>
    </header>
  );
}
