"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { MAIN_CATEGORIES } from "@/lib/constants";
import { MainCategoryItem, SubServiceItem } from "@/types";
import {
  Home,
  Stethoscope,
  ShoppingBag,
  ShoppingCart,
  ShieldAlert,
  ShieldCheck,
  Video,
  MessageCircle,
  Brain,
  Siren,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  X,
  Info,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Map badge icon names to Lucide icons
const BADGE_ICON_MAP: Record<string, React.ElementType> = {
  HomeMedical: Home,
  ShoppingBag: ShoppingBag,
  ShoppingCart: ShoppingCart,
  ShieldMedical: ShieldCheck,
  SirenAlert: Siren,
  MessageCircle: Video,
  BrainHeart: Brain,
};

export default function UserMobileHomePage() {
  const {
    pets,
    activeMobileCategory,
    setActiveMobileCategory,
    bookSubService,
    showToast,
    selectedTimeSlot,
    selectedRegion,
  } = useApp();

  const [selectedSubService, setSelectedSubService] = useState<SubServiceItem | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<string>("");
  const [userNote, setUserNote] = useState<string>("");

  const handleOpenCategory = (cat: MainCategoryItem) => {
    setActiveMobileCategory(cat);
    setSelectedSubService(null);
  };

  const handleSelectSubService = (item: SubServiceItem) => {
    setSelectedSubService(item);
    if (item.weightOptions && item.weightOptions.length > 0) {
      setSelectedWeight(item.weightOptions[0]);
    } else {
      setSelectedWeight("");
    }
  };

  const handleConfirmOrderOrBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubService) return;

    bookSubService({
      subService: selectedSubService,
      categoryTitle: activeMobileCategory?.title,
      selectedWeight: selectedWeight,
      userNotes: userNote,
    });

    setSelectedSubService(null);
    setUserNote("");
  };

  return (
    <div className="space-y-4 pb-6 animate-in fade-in duration-300">
      {/* Registered Pet Bar / Quick Status */}
      {pets.length > 0 ? (
        <div className="bg-white border border-[#E8DFD3] rounded-2xl p-3 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFF8F0] border border-[#E8DFD3] flex items-center justify-center text-xl shadow-inner">
              {pets[0].species === "Köpek" ? "🐶" : "🐱"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-bold text-xs text-[#2D241E]">
                  {pets[0].name}
                </span>
                <span className="text-[10px] text-[#8B7355] bg-[#F4EFE6] px-1.5 py-0.2 rounded-full font-medium">
                  {pets[0].species}
                </span>
              </div>
              <span className="text-[10px] text-[#6B7B3C] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Dijital Takip Aktif
              </span>
            </div>
          </div>
          <span className="text-[10px] font-bold text-[#C67B5C] bg-[#C67B5C]/10 px-2.5 py-1 rounded-xl">
            {pets.length} Dost Kayıtlı
          </span>
        </div>
      ) : (
        <div className="bg-[#FFF8F0] border border-dashed border-[#C67B5C]/40 rounded-2xl p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-xl">🐾</span>
            <div>
              <span className="font-bold text-[#2D241E] block text-xs">Dostunuzu Kaydedin</span>
              <span className="text-[10px] text-[#8B7355]">Aşı & karne takibini başlatın</span>
            </div>
          </div>
          <Button
            onClick={() => (window.location.href = "/account")}
            size="sm"
            className="bg-[#C67B5C] text-white text-[11px] font-bold rounded-xl h-8 px-3"
          >
            + Dost Ekle
          </Button>
        </div>
      )}

      {/* 2X2 MOBILE SERVICE CARDS GRID MATCHING GETIRVET REFERENCE SCREENSHOT */}
      <div className="grid grid-cols-2 gap-3">
        {MAIN_CATEGORIES.slice(0, 6).map((cat) => {
          const BadgeIcon = BADGE_ICON_MAP[cat.badgeIconName] || Home;

          return (
            <div
              key={cat.id}
              onClick={() => handleOpenCategory(cat)}
              className={`${cat.bgColor} border ${cat.borderColor} rounded-[24px] p-3.5 flex flex-col justify-between relative overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-all group min-h-[175px]`}
            >
              {/* Top Row: Badge Icon & Category Image */}
              <div className="flex items-start justify-between z-10">
                {/* Badge Icon Pill */}
                <div
                  className={`w-9 h-9 rounded-2xl ${cat.badgeBgColor} ${cat.badgeTextColor} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                >
                  <BadgeIcon className="w-5 h-5" />
                </div>

                {/* Image Illustration */}
                <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 -mr-1 -mt-1 bg-white/40">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Bottom Info: Title & Subtitle */}
              <div className="mt-3 space-y-1 z-10">
                {cat.badgeTag && (
                  <span className="inline-block bg-[#E11D48]/10 text-[#E11D48] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#E11D48]/20">
                    {cat.badgeTag}
                  </span>
                )}
                <h3 className="font-heading font-extrabold text-xs sm:text-sm text-[#2D241E] leading-snug group-hover:text-[#C67B5C] transition-colors">
                  {cat.title}
                </h3>
                <p className="text-[10px] text-[#5C3D2E]/80 line-clamp-2 leading-tight">
                  {cat.shortDesc}
                </p>
              </div>

              {/* Gentle background accent */}
              <div className="absolute right-0 bottom-0 w-24 h-24 rounded-full bg-white/20 blur-xl pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* 7th Category Card (Full Width Orange Card from Reference Screenshot) */}
      {MAIN_CATEGORIES[6] && (
        <div
          onClick={() => handleOpenCategory(MAIN_CATEGORIES[6])}
          className={`${MAIN_CATEGORIES[6].bgColor} border ${MAIN_CATEGORIES[6].borderColor} rounded-[24px] p-4 flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all group relative overflow-hidden`}
        >
          <div className="flex items-center gap-3.5 z-10 flex-1">
            <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm flex-shrink-0 bg-white/40">
              <img
                src={MAIN_CATEGORIES[6].image}
                alt={MAIN_CATEGORIES[6].title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#EA580C] text-white flex items-center justify-center">
                  <Brain className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-[#EA580C] uppercase tracking-wider">
                  Uzman Terapi
                </span>
              </div>
              <h3 className="font-heading font-extrabold text-sm text-[#2D241E]">
                {MAIN_CATEGORIES[6].title}
              </h3>
              <p className="text-[11px] text-[#5C3D2E]/80 leading-tight">
                {MAIN_CATEGORIES[6].shortDesc}
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-white text-[#EA580C] flex items-center justify-center shadow-sm flex-shrink-0 group-hover:translate-x-1 transition-transform ml-2">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      )}

      {/* CATEGORY DETAILS SLIDE-OVER SHEET / MODAL */}
      {activeMobileCategory && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-0 sm:p-4">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-t-[32px] sm:rounded-[32px] w-full max-w-md p-5 shadow-2xl space-y-4 max-h-[88vh] overflow-y-auto">
            {/* Sheet Header */}
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C67B5C]">
                  VetRota Hizmet Kataloğu
                </span>
                <h2 className="text-lg font-heading font-extrabold text-[#2D241E]">
                  {activeMobileCategory.title}
                </h2>
              </div>
              <button
                onClick={() => {
                  setActiveMobileCategory(null);
                  setSelectedSubService(null);
                }}
                className="w-8 h-8 rounded-full bg-[#F4EFE6] text-[#2D241E] flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sub-Services / Options List */}
            <div className="space-y-3">
              {activeMobileCategory.subServices.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectSubService(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedSubService?.id === item.id
                      ? "bg-[#FFF5EB] border-[#C67B5C] shadow-md ring-2 ring-[#C67B5C]/20"
                      : "bg-white border-[#E8DFD3] hover:border-[#C67B5C]/50 shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      {item.brand && (
                        <span className="text-[9px] font-bold bg-[#F4EFE6] text-[#8B7355] px-2 py-0.5 rounded-full uppercase tracking-wider block w-max mb-1">
                          {item.brand}
                        </span>
                      )}
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-[#2D241E]">
                        {item.name}
                      </h4>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <span className="text-sm font-heading font-extrabold text-[#C67B5C] block">
                        {item.price} ₺
                      </span>
                      {item.unit && (
                        <span className="text-[10px] text-[#8B7355] font-medium block">
                          / {item.unit}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-[#5C3D2E]/80 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Mandatory Notice Box (e.g. Lösemi aşısı için test şartı) */}
                  {item.requiresNotice && (
                    <div className="p-2.5 rounded-xl bg-[#FFF1F2] border border-[#E11D48]/30 flex items-start gap-2 text-[10px] text-[#BE123C] font-semibold">
                      <Info className="w-4 h-4 text-[#E11D48] flex-shrink-0 mt-0.5" />
                      <span>{item.noticeText}</span>
                    </div>
                  )}

                  {/* Weight / Size Selection Pills */}
                  {item.weightOptions && item.weightOptions.length > 0 && (
                    <div className="pt-1">
                      <span className="text-[10px] font-bold text-[#8B7355] block mb-1">
                        Kilo / Beden Seçiniz:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {item.weightOptions.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSubService(item);
                              setSelectedWeight(opt);
                            }}
                            className={`text-[10px] px-2.5 py-1 rounded-xl border font-bold transition-all ${
                              selectedSubService?.id === item.id && selectedWeight === opt
                                ? "bg-[#C67B5C] text-white border-[#C67B5C]"
                                : "bg-[#FDFBF7] text-[#2D241E] border-[#E8DFD3]"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Features list */}
                  {item.features && (
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] text-[#6B7B3C] font-semibold">
                      {item.features.map((f) => (
                        <span key={f} className="flex items-center gap-1 bg-[#6B7B3C]/10 px-2 py-0.5 rounded-lg">
                          <Check className="w-3 h-3 text-[#6B7B3C]" /> {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Selected Item Confirmation Form */}
            {selectedSubService && (
              <form
                onSubmit={handleConfirmOrderOrBooking}
                className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#C67B5C]/30 space-y-3 animate-in fade-in duration-200"
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#2D241E]">
                  <span>Seçilen Hizmet:</span>
                  <span className="text-[#C67B5C] font-extrabold text-sm">
                    {selectedSubService.name}
                  </span>
                </div>

                <div className="text-[11px] text-[#8B7355] space-y-1">
                  <p>📍 <strong>Adres:</strong> {selectedRegion.name}, {selectedRegion.district}</p>
                  <p>⏰ <strong>Zaman:</strong> {selectedTimeSlot}</p>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-[#2D241E] block mb-1">
                    Hekim için Not veya Açıklama (Opsiyonel):
                  </label>
                  <input
                    type="text"
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    placeholder="Örn: Dostum biraz huysuzlanabilir, zil çalmayın..."
                    className="w-full text-xs p-2.5 rounded-xl border border-[#E8DFD3] bg-white outline-none focus:border-[#C67B5C]"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs h-11 shadow-md gap-2"
                >
                  Siparişi / Randevuyu Onayla ({selectedSubService.price} ₺)
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
