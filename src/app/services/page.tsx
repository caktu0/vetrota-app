"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  MapPin,
  Calendar,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CalendarPlus,
} from "lucide-react";

export interface GetirVetServiceCard {
  id: string;
  number: number;
  title: string;
  shortDesc: string;
  actionText: string;
  bgColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  badgeIcon: React.ReactNode;
  imageUrl: string;
  badgeTag?: string;
  isFullWidth?: boolean;
}

export const GETIRVET_SERVICES: GetirVetServiceCard[] = [
  {
    id: "evde-saglik",
    number: 1,
    title: "1. Evde Sağlık Hizmeti",
    shortDesc: "Aşılama, muayene, parazit uygulama ve daha fazlası",
    actionText: "Randevu Oluştur",
    bgColor: "bg-[#FAF7F2]",
    borderColor: "border-[#E8DFD3]",
    badgeBg: "bg-[#C87D55]",
    badgeText: "text-white",
    badgeIcon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        <path d="M11 11h2v-2h-2v2zm0 4h2v-2h-2v2zm-3-2h2v-2H8v2zm6 0h2v-2h-2v2z" fill="#C87D55" />
      </svg>
    ),
    imageUrl: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "eve-mama",
    number: 2,
    title: "2. Eve Mama Hizmeti",
    shortDesc: "Veteriner serisi dahil tüm mama markaları",
    actionText: "Mamaları İncele",
    bgColor: "bg-[#FEFCE8]",
    borderColor: "border-[#FEF08A]",
    badgeBg: "bg-[#D97706]",
    badgeText: "text-white",
    badgeIcon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z" />
      </svg>
    ),
    imageUrl: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "eve-petshop",
    number: 3,
    title: "3. Eve Petshop Ürünleri",
    shortDesc: "Oyuncak, kedi kumu, tasma, kıyafet ve daha fazlası",
    actionText: "Ürünleri Gör",
    bgColor: "bg-[#F4F7EE]",
    borderColor: "border-[#DCFCE7]",
    badgeBg: "bg-[#6B7B3C]",
    badgeText: "text-white",
    badgeIcon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
      </svg>
    ),
    imageUrl: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "eve-takviye",
    number: 4,
    title: "4. Eve Takviye Ürün Hizmeti",
    shortDesc: "Vitaminler, maltlar ve destekleyici ürünler",
    actionText: "Takviye Seç",
    bgColor: "bg-[#F5EFE6]",
    borderColor: "border-[#E8DFD3]",
    badgeBg: "bg-[#B86B43]",
    badgeText: "text-white",
    badgeIcon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v4h4v2h-4v4h-2v-4H7v-2h4V7z" />
      </svg>
    ),
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "evde-acil",
    number: 5,
    title: "5. Evde Acil Durum Hizmeti",
    shortDesc: "7/24 acil müdahale",
    actionText: "Acil Bilgi Al",
    bgColor: "bg-[#FFF1F2]",
    borderColor: "border-[#FDE2E4]",
    badgeBg: "bg-[#B91C1C]",
    badgeText: "text-white",
    badgeIcon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
    ),
    imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=80",
    badgeTag: "Yakında",
  },
  {
    id: "online-muayene",
    number: 6,
    title: "6. Online Muayene Hizmeti",
    shortDesc: "Uzman veterinerden online muayene",
    actionText: "Görüşme Başlat",
    bgColor: "bg-[#FAF7F2]",
    borderColor: "border-[#E8DFD3]",
    badgeBg: "bg-[#C87D55]",
    badgeText: "text-white",
    badgeIcon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 11H7V9h2v2zm4 0h-2V9h2v2zm4 0h-2V9h2v2z" />
      </svg>
    ),
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "online-davranis",
    number: 7,
    title: "7. Online Veteriner Davranış Danışmanlığı",
    shortDesc: "Davranış problemlerinde profesyonel destek ve danışmanlık",
    actionText: "Terapi Randevusu",
    bgColor: "bg-[#FDF6F0]",
    borderColor: "border-[#FED7AA]",
    badgeBg: "bg-[#C87D55]",
    badgeText: "text-white",
    badgeIcon: (
      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
    isFullWidth: true,
  },
];

export default function ServicesPage() {
  const router = useRouter();
  const { selectedRegion, setIsRegionModalOpen, selectedTimeSlot, setIsTimeSlotModalOpen } = useApp();

  const handleCardClick = (card: GetirVetServiceCard) => {
    if (card.id === "evde-saglik") {
      router.push("/services/evde-saglik");
    } else if (card.id === "eve-mama") {
      router.push("/services/eve-mama");
    } else if (card.id === "eve-petshop") {
      router.push("/services/eve-petshop");
    } else if (card.id === "eve-takviye") {
      router.push("/services/eve-takviye");
    } else {
      router.push(`/randevu?serviceId=${encodeURIComponent(card.id)}&service=${encodeURIComponent(card.id)}`);
    }
  };

  return (
    <div className="w-full space-y-3 pb-8 animate-in fade-in duration-300">
      {/* 2-COLUMN SERVICE CARDS GRID (GetirVet Tarzı 2 Sütunlu Kart Düzeni) */}
      <div className="grid grid-cols-2 gap-3 pt-0.5">
        {GETIRVET_SERVICES.slice(0, 6).map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className={`${card.bgColor} border ${card.borderColor} rounded-[24px] p-3.5 flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all group min-h-[195px]`}
          >
            {/* Top Row: Icon Badge & Cutout Image */}
            <div className="flex items-start justify-between z-10">
              <div
                className={`w-9 h-9 rounded-2xl ${card.badgeBg} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
              >
                {card.badgeIcon}
              </div>

              <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 -mr-1 -mt-1 bg-white/50 border border-white/60">
                <img
                  src={card.imageUrl}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Content: Title, Description & Action Button */}
            <div className="mt-2.5 space-y-2 z-10">
              <div>
                <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#2D241E] leading-snug group-hover:text-[#C87D55] transition-colors">
                  {card.title}
                </h3>
                <p className="text-[10px] text-[#5C3D2E]/80 line-clamp-2 leading-tight mt-0.5">
                  {card.shortDesc}
                </p>
              </div>

              {/* Action Button & Badges */}
              <div className="flex items-center justify-between pt-1">
                {card.badgeTag ? (
                  <span className="inline-block bg-[#FFF0F2] text-[#E11D48] text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-[#FDA4AF] shadow-xs">
                    {card.badgeTag}
                  </span>
                ) : (
                  <span className="text-[9px] font-bold text-[#C87D55] flex items-center gap-0.5 group-hover:underline">
                    {card.actionText} <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                )}
                
                <div className="w-6 h-6 rounded-full bg-white/90 group-hover:bg-white text-[#C87D55] flex items-center justify-center shadow-xs">
                  <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
              </div>
            </div>

            {/* Subtle glow */}
            <div className="absolute right-0 bottom-0 w-24 h-24 rounded-full bg-white/30 blur-xl pointer-events-none" />
          </div>
        ))}

        {/* 7th Card: Full-Width Card */}
        {GETIRVET_SERVICES[6] && (
          <div
            onClick={() => handleCardClick(GETIRVET_SERVICES[6])}
            className={`col-span-2 ${GETIRVET_SERVICES[6].bgColor} border ${GETIRVET_SERVICES[6].borderColor} rounded-[24px] p-3.5 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all group relative overflow-hidden`}
          >
            <div className="flex items-center gap-3 z-10 flex-1 min-w-0">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-white/50 border border-white/60">
                <img
                  src={GETIRVET_SERVICES[6].imageUrl}
                  alt={GETIRVET_SERVICES[6].title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="w-6 h-6 rounded-xl bg-[#EA580C] flex items-center justify-center text-white shadow-xs">
                    {GETIRVET_SERVICES[6].badgeIcon}
                  </div>
                  <span className="text-[10px] font-extrabold text-[#EA580C] uppercase tracking-wider">
                    Uzman Terapi
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#1E1B2E] leading-snug">
                  {GETIRVET_SERVICES[6].title}
                </h3>
                <p className="text-[10px] text-[#5C5870] line-clamp-2 leading-tight">
                  {GETIRVET_SERVICES[6].shortDesc}
                </p>
                <span className="text-[9px] font-bold text-[#EA580C] inline-flex items-center gap-0.5 pt-0.5">
                  Randevu Oluştur <ArrowRight className="w-2.5 h-2.5" />
                </span>
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-white text-[#EA580C] flex items-center justify-center shadow-sm flex-shrink-0 group-hover:translate-x-1 transition-transform ml-2">
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
