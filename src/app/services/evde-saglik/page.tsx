"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { EVDE_SAGLIK_SERVICES } from "@/lib/mockData";
import { SubServiceItem } from "@/types";
import {
  ArrowLeft,
  Check,
  Plus,
  CalendarPlus,
  ShieldCheck,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EvdeSaglikPage() {
  const router = useRouter();
  const { showToast } = useApp();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [selectedDetailService, setSelectedDetailService] = useState<SubServiceItem | null>(null);

  // Filter list
  const filteredServices = EVDE_SAGLIK_SERVICES.filter((srv) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "kedi") return srv.name.toLowerCase().includes("kedi") || srv.description.toLowerCase().includes("kedi");
    if (activeFilter === "kopek") return srv.name.toLowerCase().includes("köpek") || srv.description.toLowerCase().includes("köpek");
    if (activeFilter === "asi") return srv.name.toLowerCase().includes("aşı");
    if (activeFilter === "parazit") return srv.name.toLowerCase().includes("parazit");
    if (activeFilter === "muayene") return srv.name.toLowerCase().includes("muayene") || srv.name.toLowerCase().includes("kan") || srv.name.toLowerCase().includes("serum");
    return true;
  });

  const toggleSelect = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedServices = EVDE_SAGLIK_SERVICES.filter((s) => selectedIds.includes(s.id));
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  const handleProceedBooking = () => {
    if (selectedIds.length === 0) {
      showToast("Lütfen en az bir evde sağlık hizmeti seçiniz.", "warning");
      return;
    }

    const idsParam = encodeURIComponent(selectedIds.join(","));
    const namesParam = encodeURIComponent(selectedServices.map((s) => s.name).join(" + "));
    const totalParam = encodeURIComponent(totalPrice.toString());

    router.push(`/randevu?serviceIds=${idsParam}&services=${namesParam}&total=${totalParam}&serviceId=evde-saglik`);
  };

  return (
    <div className="w-full space-y-3.5 pb-24 animate-in fade-in duration-300">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <Link
          href="/services"
          className="w-9 h-9 rounded-full bg-white border border-[#E8DFD3] flex items-center justify-center text-[#2D241E] shadow-sm hover:bg-[#F4EFE6] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="text-center">
          <h1 className="font-heading font-extrabold text-sm text-[#2D241E]">
            Evde Sağlık Hizmetleri
          </h1>
          <p className="text-[10px] text-[#8B7355]">
            İstediğiniz hizmetleri seçerek toplu randevu oluşturun
          </p>
        </div>
        <div className="w-9" /> {/* Spacer */}
      </div>

      {/* 2. Hero Info Banner */}
      <div className="bg-gradient-to-r from-[#FAF7F2] to-[#F5EFE6] border border-[#E8DFD3] rounded-2xl p-3 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-[#C87D55] text-white flex items-center justify-center flex-shrink-0 shadow-md">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xs font-extrabold text-[#2D241E]">
            Stressiz & Steril Kapıda Bakım
          </h2>
          <p className="text-[10px] text-[#8B7355] leading-tight mt-0.5">
            Uzman hekimlerimiz donanımlı mobil kit ile adresinize gelir. Çoklu hizmet seçiminde tek randevu oluşturulur.
          </p>
        </div>
      </div>

      {/* 3. Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: "all", label: "Tüm Hizmetler" },
          { id: "kedi", label: "🐱 Kediler İçin" },
          { id: "kopek", label: "🐶 Köpekler İçin" },
          { id: "asi", label: "💉 Aşılar" },
          { id: "parazit", label: "🛡️ Parazit Takibi" },
          { id: "muayene", label: "🩺 Muayene & Tahlil" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeFilter === f.id
                ? "bg-[#C87D55] text-white shadow-sm"
                : "bg-white text-[#5C3D2E] border border-[#E8DFD3] hover:bg-[#FAF7F2]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 4. Sub-Services List */}
      <div className="space-y-2.5">
        {filteredServices.map((service) => {
          const isSelected = selectedIds.includes(service.id);

          return (
            <div
              key={service.id}
              onClick={() => toggleSelect(service.id)}
              className={`rounded-2xl p-3.5 border transition-all cursor-pointer relative overflow-hidden ${
                isSelected
                  ? "bg-[#FAF7F2] border-[#C87D55] ring-2 ring-[#C87D55]/20 shadow-md"
                  : "bg-white border-[#E8DFD3] hover:border-[#C87D55]/40 shadow-xs"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Checkbox circle */}
                <div
                  onClick={(e) => toggleSelect(service.id, e)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${
                    isSelected
                      ? "bg-[#C87D55] text-white shadow-sm scale-105"
                      : "border-2 border-[#D1D5DB] bg-white text-transparent hover:border-[#C87D55]"
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>

                {/* Service image */}
                {service.image && (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60 shadow-xs">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-heading font-extrabold text-xs text-[#2D241E] leading-snug">
                      {service.name}
                    </h3>
                    <div className="text-right flex-shrink-0 ml-1">
                      <span className="font-extrabold text-xs text-[#C87D55] block">
                        {service.price} ₺
                      </span>
                      {service.unit && (
                        <span className="text-[9px] text-[#8B7355] block">
                          /{service.unit}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[10px] text-[#5C3D2E]/80 line-clamp-2 leading-tight mt-1">
                    {service.description}
                  </p>

                  {/* Weight options tag if applicable */}
                  {service.weightOptions && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {service.weightOptions.map((w, idx) => (
                        <span
                          key={idx}
                          className="bg-[#F5EFE6] text-[#5C3D2E] text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                        >
                          {w}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notice badge if required */}
                  {service.requiresNotice && (
                    <div className="mt-1.5 bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[9px] font-medium p-1.5 rounded-lg flex items-start gap-1">
                      <AlertCircle className="w-3 h-3 text-[#D97706] flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{service.noticeText}</span>
                    </div>
                  )}

                  {/* Features pills */}
                  {service.features && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {service.features.slice(0, 2).map((feat, idx) => (
                        <span
                          key={idx}
                          className="text-[9px] bg-[#F4EFE6] text-[#6B5A4E] font-medium px-1.5 py-0.5 rounded"
                        >
                          ✓ {feat}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Sticky Bottom Action Bar */}
      <div className="fixed bottom-14 left-0 right-0 z-40 max-w-md mx-auto px-4 pointer-events-none">
        <div className="bg-[#2D241E] text-white rounded-2xl p-3 shadow-2xl border border-white/10 flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-md">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#C87D55] text-white text-[10px] font-extrabold flex items-center justify-center">
                {selectedIds.length}
              </span>
              <span className="text-xs font-bold">Hizmet Seçildi</span>
            </div>
            <div className="text-[13px] font-extrabold text-[#F5EFE6] mt-0.5">
              Toplam: {totalPrice.toLocaleString("tr-TR")} ₺
            </div>
          </div>

          <Button
            onClick={handleProceedBooking}
            disabled={selectedIds.length === 0}
            className={`px-5 py-2.5 rounded-xl font-extrabold text-xs shadow-lg transition-all ${
              selectedIds.length > 0
                ? "bg-[#C87D55] hover:bg-[#B86B43] text-white cursor-pointer active:scale-95"
                : "bg-white/20 text-white/50 cursor-not-allowed"
            }`}
          >
            <CalendarPlus className="w-4 h-4 mr-1.5" />
            Randevuyu Oluştur
          </Button>
        </div>
      </div>
    </div>
  );
}
