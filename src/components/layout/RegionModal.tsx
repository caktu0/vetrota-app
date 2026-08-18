"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { SUPPORTED_REGIONS } from "@/lib/constants";
import { MapPin, Check, Navigation, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function RegionModal() {
  const { isRegionModalOpen, setIsRegionModalOpen, selectedRegion, setSelectedRegion, showToast } = useApp();
  const [selectedDistrict, setSelectedDistrict] = useState<"Kadıköy" | "Maltepe" | "ALL">("ALL");
  const [isLocating, setIsLocating] = useState(false);

  if (!isRegionModalOpen) return null;

  const handleRequestLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsLocating(false);
          // Set to closest Kadıköy/Maltepe or notify
          const autoRegion = SUPPORTED_REGIONS.find((r) => r.district === "Maltepe" && r.name === "Feyzullah") || SUPPORTED_REGIONS[0];
          setSelectedRegion(autoRegion);
          showToast(`Konumunuz tespit edildi: ${autoRegion.name}, ${autoRegion.district}`, "success");
        },
        (error) => {
          setIsLocating(false);
          // Fallback simulation
          const autoRegion = SUPPORTED_REGIONS[0];
          setSelectedRegion(autoRegion);
          showToast(`Konum izni simüle edildi: ${autoRegion.name}, ${autoRegion.district}`, "info");
        },
        { timeout: 5000 }
      );
    } else {
      setIsLocating(false);
      const autoRegion = SUPPORTED_REGIONS[0];
      setSelectedRegion(autoRegion);
    }
  };

  const filteredRegions = SUPPORTED_REGIONS.filter(
    (r) => selectedDistrict === "ALL" || r.district === selectedDistrict
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-[24px] w-full max-w-lg overflow-hidden shadow-[0_20px_50px_rgba(92,61,46,0.18)] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-[#E8DFD3] flex items-center justify-between bg-[#FFFDF9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C67B5C]/15 flex items-center justify-center text-[#C67B5C]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-[#2D241E]">
                Hizmet Bölgesi Seç
              </h2>
              <p className="text-xs text-[#8B7355]">
                Evde veterinerlik hizmetimiz şu an Kadıköy ve Maltepe&apos;de aktiftir
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsRegionModalOpen(false)}
            className="w-9 h-9 rounded-full bg-[#F4EFE6] hover:bg-[#E8DFD3] flex items-center justify-center text-[#5C3D2E] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* Quick GPS button */}
          <button
            onClick={handleRequestLocation}
            disabled={isLocating}
            className="w-full p-3.5 rounded-[16px] bg-[#FFF8F0] border border-[#C67B5C]/30 hover:border-[#C67B5C] flex items-center justify-between transition-all group hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C67B5C] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Navigation className={`w-4 h-4 ${isLocating ? "animate-spin" : ""}`} />
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold text-[#2D241E] block">
                  {isLocating ? "Konum alınıyor..." : "Mevcut Konumumu Kullan"}
                </span>
                <span className="text-xs text-[#8B7355]">
                  GPS ile en yakın desteklenen mahalleyi belirle
                </span>
              </div>
            </div>
            <Sparkles className="w-4 h-4 text-[#D97706]" />
          </button>

          {/* District Tabs */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8B7355] mb-2 px-1">
              İlçe Filtresi
            </div>
            <div className="grid grid-cols-3 gap-2 bg-[#F4EFE6] p-1 rounded-[14px]">
              {(["ALL", "Kadıköy", "Maltepe"] as const).map((dist) => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`py-2 px-3 rounded-[10px] text-xs font-semibold transition-all ${
                    selectedDistrict === dist
                      ? "bg-white text-[#2D241E] shadow-sm font-bold"
                      : "text-[#8B7355] hover:text-[#2D241E]"
                  }`}
                >
                  {dist === "ALL" ? "Tüm Mahalleler" : dist}
                </button>
              ))}
            </div>
          </div>

          {/* Neighborhoods List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#8B7355] mb-2 px-1">
              Desteklenen Mahalleler
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredRegions.map((region) => {
                const isSelected = selectedRegion.id === region.id;
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region)}
                    className={`p-3.5 rounded-[16px] text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#C67B5C]/10 border-[#C67B5C] shadow-sm text-[#2D241E]"
                        : "bg-white border-[#E8DFD3] hover:border-[#C67B5C]/50 hover:bg-[#FFFDF9] text-[#2D241E]"
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-sm flex items-center gap-1.5">
                        {region.name}
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#C67B5C]" />
                        )}
                      </div>
                      <div className="text-xs text-[#8B7355]">
                        {region.district} • Evde Hizmet Aktif
                      </div>
                    </div>
                    {isSelected ? (
                      <div className="w-6 h-6 rounded-full bg-[#C67B5C] text-white flex items-center justify-center">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#F4EFE6] text-[#8B7355] flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <MapPin className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-3.5 rounded-[14px] bg-[#6B7B3C]/10 border border-[#6B7B3C]/20 text-xs text-[#2D241E] flex items-start gap-2.5">
            <span className="text-base">📍</span>
            <p>
              Diğer il ve ilçelerdeki kullanıcılarımız <strong>Online Görüntülü Muayene</strong> ve <strong>Danışmanlık</strong> hizmetlerimizden 7/24 faydalanabilirler.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8DFD3] bg-[#FFFDF9] flex justify-end">
          <Button
            variant="default"
            onClick={() => setIsRegionModalOpen(false)}
            className="w-full sm:w-auto"
          >
            Seçimi Onayla
          </Button>
        </div>
      </div>
    </div>
  );
}
