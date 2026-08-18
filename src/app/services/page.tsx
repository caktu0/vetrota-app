"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SERVICES_LIST } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import {
  Stethoscope,
  Scissors,
  ShieldCheck,
  Syringe,
  Droplets,
  Video,
  MessagesSquare,
  Clock,
  ArrowRight,
  Sparkles,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ICON_MAP: Record<string, React.ElementType> = {
  Stethoscope,
  Scissors,
  ShieldCheck,
  Syringe,
  Droplets,
  Video,
  MessagesSquare,
};

export default function ServicesPage() {
  const router = useRouter();
  const { selectedRegion, setIsRegionModalOpen } = useApp();
  const [activeTab, setActiveTab] = useState<"all" | "home" | "online">("all");

  const filteredServices =
    activeTab === "all"
      ? SERVICES_LIST
      : SERVICES_LIST.filter((s) => s.category === activeTab);

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-[#C67B5C] uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          Hizmet Kataloğu
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-[#2D241E]">
          Klinik Standartlarında Bakım
        </h1>
        <p className="text-sm text-[#5C3D2E]/80">
          Tüm hekim uygulamalarımız orijinal aşı ve resmi protokollerle gerçekleştirilir.
        </p>
      </div>

      {/* Region Status Banner */}
      <div className="bg-[#FFF8F0] border border-[#C67B5C]/20 rounded-[20px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#C67B5C] text-white flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-[#8B7355] block">Seçili Hizmet Bölgesi:</span>
            <span className="text-sm font-bold text-[#2D241E]">
              {selectedRegion.name} Mahallesi, {selectedRegion.district} / İstanbul
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsRegionModalOpen(true)}
          className="border-[#C67B5C]/30 text-[#C67B5C] hover:bg-[#C67B5C]/10 text-xs rounded-xl"
        >
          Bölgeyi Değiştir
        </Button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 bg-[#F4EFE6] p-1.5 rounded-[16px] border border-[#E8DFD3] max-w-md">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 py-2 rounded-[12px] text-xs font-bold transition-all ${
            activeTab === "all"
              ? "bg-white text-[#2D241E] shadow-sm"
              : "text-[#8B7355] hover:text-[#2D241E]"
          }`}
        >
          Tüm Hizmetler ({SERVICES_LIST.length})
        </button>
        <button
          onClick={() => setActiveTab("home")}
          className={`flex-1 py-2 rounded-[12px] text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === "home"
              ? "bg-[#C67B5C] text-white shadow-sm"
              : "text-[#8B7355] hover:text-[#2D241E]"
          }`}
        >
          🏡 Evde (5)
        </button>
        <button
          onClick={() => setActiveTab("online")}
          className={`flex-1 py-2 rounded-[12px] text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            activeTab === "online"
              ? "bg-[#6B7B3C] text-white shadow-sm"
              : "text-[#8B7355] hover:text-[#2D241E]"
          }`}
        >
          💻 Online (2)
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {filteredServices.map((service) => {
          const Icon = ICON_MAP[service.iconName] || Stethoscope;
          const isHome = service.category === "home";

          return (
            <div
              key={service.id}
              className="bg-white border border-[#E8DFD3] hover:border-[#C67B5C]/50 rounded-[22px] p-5 sm:p-6 shadow-[0_4px_16px_-2px_rgba(198,123,92,0.06)] transition-all flex flex-col md:flex-row md:items-center justify-between gap-5 group"
            >
              <div className="flex items-start gap-4 flex-1">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                    isHome
                      ? "bg-[#FFF5EB] text-[#C67B5C] border border-[#C67B5C]/20"
                      : "bg-[#F0FDF4] text-[#6B7B3C] border border-[#6B7B3C]/20"
                  }`}
                >
                  <Icon className="w-7 h-7" />
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-heading font-bold text-[#2D241E] group-hover:text-[#C67B5C] transition-colors">
                      {service.name}
                    </h2>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        isHome
                          ? "bg-[#C67B5C]/10 text-[#C67B5C]"
                          : "bg-[#6B7B3C]/10 text-[#6B7B3C]"
                      }`}
                    >
                      {isHome ? "🏡 Evde Ziyaret" : "💻 Online Görüşme"}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-[#5C3D2E]/85 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {service.features.map((feature, i) => (
                      <span
                        key={i}
                        className="text-[11px] text-[#5C3D2E] bg-[#FDFBF7] border border-[#E8DFD3] px-2.5 py-1 rounded-lg flex items-center gap-1"
                      >
                        <CheckCircle className="w-3 h-3 text-[#6B7B3C]" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex md:flex-col items-center md:items-end justify-between pt-3 md:pt-0 border-t md:border-t-0 border-[#F4EFE6] gap-3">
                <div className="text-left md:text-right">
                  <div className="text-2xl font-heading font-extrabold text-[#C67B5C]">
                    {formatPrice(service.price)}
                  </div>
                  <div className="text-xs text-[#8B7355] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {service.durationMin} dakika
                  </div>
                </div>

                <Button
                  onClick={() => router.push(`/booking?service=${service.id}`)}
                  className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs sm:text-sm h-11 px-5 gap-2 shadow-sm"
                >
                  <span>Randevu Seç</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
