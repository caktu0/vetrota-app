"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SERVICES_LIST, VET_DOCTORS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import {
  Stethoscope,
  Scissors,
  ShieldCheck,
  Syringe,
  Droplets,
  Video,
  MessagesSquare,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  ArrowRight,
  HeartHandshake,
  CheckCircle2,
  Star,
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

export default function UserHomePage() {
  const { selectedRegion, setIsRegionModalOpen, pets } = useApp();
  const router = useRouter();
  const [serviceCategory, setServiceCategory] = useState<"home" | "online">("home");

  const homeServices = SERVICES_LIST.filter((s) => s.category === "home");
  const onlineServices = SERVICES_LIST.filter((s) => s.category === "online");
  const displayedServices = serviceCategory === "home" ? homeServices : onlineServices;

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* 1. Hero Banner Card */}
      <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#FFF5EB] via-[#FFFDF9] to-[#F5ECE1] border border-[#E8DFD3] p-6 sm:p-8 shadow-[0_10px_30px_rgba(198,123,92,0.08)]">
        <div className="relative z-10 max-w-xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C67B5C]/15 border border-[#C67B5C]/20 text-[#C67B5C] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ev Konforunda Veterinerlik Deneyimi</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#2D241E] leading-tight">
            Can dostunuzun sağlığı, <br className="hidden sm:inline" />
            <span className="text-[#C67B5C] underline decoration-[#C67B5C]/30 decoration-wavy">
              kendi evinde
            </span>{" "}
            güvende.
          </h1>

          <p className="text-sm sm:text-base text-[#5C3D2E]/90 font-normal leading-relaxed">
            Kliniğe gitme stresine ve taşıma çantası korkusuna son!{" "}
            <strong className="text-[#2D241E]">{selectedRegion.name}, {selectedRegion.district}</strong>{" "}
            bölgesinde uzman veteriner hekimlerimiz evinize geliyor.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Button
              onClick={() => router.push("/booking")}
              className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl shadow-md gap-2"
            >
              <Calendar className="w-4 h-4" />
              Hemen Randevu Al
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/messages")}
              className="border-[#E8DFD3] bg-white/80 hover:bg-white text-[#2D241E] rounded-xl font-semibold gap-2"
            >
              <MessagesSquare className="w-4 h-4 text-[#6B7B3C]" />
              AI Asistana Sor
            </Button>
          </div>

          {/* Trust badges */}
          <div className="pt-3 flex items-center gap-4 text-xs font-medium text-[#8B7355]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#6B7B3C]" />
              Soğuk Zincir Garantisi
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-[#6B7B3C]" />
              Ruhsatlı Uzman Hekimler
            </span>
          </div>
        </div>

        {/* Ambient decorative elements */}
        <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full bg-[#C67B5C]/10 blur-3xl pointer-events-none" />
        <div className="absolute right-4 bottom-4 hidden md:block text-8xl opacity-20 select-none pointer-events-none font-heading">
          🐾
        </div>
      </section>

      {/* 2. Registered Pet Bar OR First-Time Onboarding Prompt */}
      {pets.length > 0 ? (
        <section className="bg-white border border-[#E8DFD3] rounded-[20px] p-4 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#E8DFD3] flex items-center justify-center text-2xl shadow-inner">
              {pets[0].species === "Köpek" ? "🐶" : "🐱"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-base text-[#2D241E]">
                  {pets[0].name}
                </span>
                <span className="text-xs text-[#8B7355] bg-[#F4EFE6] px-2 py-0.5 rounded-full font-medium">
                  {pets[0].species} • {pets[0].breed || "Kırma"}
                </span>
              </div>
              <span className="text-xs text-[#6B7B3C] flex items-center gap-1 mt-0.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Dijital karne ve hekim takibi aktif
              </span>
            </div>
          </div>

          <Link
            href="/account"
            className="text-xs font-bold text-[#C67B5C] hover:text-[#B5651D] bg-[#C67B5C]/10 hover:bg-[#C67B5C]/20 px-3.5 py-2 rounded-xl transition-all"
          >
            Dostlarımı Yönet ({pets.length})
          </Link>
        </section>
      ) : (
        <section className="bg-[#FFF8F0] border-2 border-dashed border-[#C67B5C]/40 rounded-[22px] p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#C67B5C] text-white flex items-center justify-center text-2xl shadow-md flex-shrink-0">
              🐾
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#2D241E]">
                İlk Patili Dostunuzu Kaydedin
              </h3>
              <p className="text-xs text-[#5C3D2E]">
                Randevu oluşturabilmek ve aşı takvimini başlatabilmek için önce can dostunuzu ekleyin.
              </p>
            </div>
          </div>

          <Button
            onClick={() => router.push("/account")}
            className="w-full sm:w-auto bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs h-11 px-5 gap-1.5 shadow-sm flex-shrink-0"
          >
            Dostumu Ekle 🐾
          </Button>
        </section>
      )}

      {/* 3. Services Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-heading font-bold text-[#2D241E]">
              Veterinerlik Hizmetlerimiz
            </h2>
            <p className="text-xs text-[#8B7355]">
              İhtiyacınız olan hizmeti seçip takvimden size uygun saati ayırtın
            </p>
          </div>

          {/* Home vs Online Category Tabs */}
          <div className="flex items-center bg-[#F4EFE6] p-1 rounded-xl border border-[#E8DFD3]">
            <button
              onClick={() => setServiceCategory("home")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                serviceCategory === "home"
                  ? "bg-white text-[#C67B5C] shadow-sm"
                  : "text-[#8B7355] hover:text-[#2D241E]"
              }`}
            >
              <span>🏡</span>
              <span>Evde Hizmet</span>
            </button>
            <button
              onClick={() => setServiceCategory("online")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                serviceCategory === "online"
                  ? "bg-[#C67B5C] text-white shadow-sm"
                  : "text-[#8B7355] hover:text-[#2D241E]"
              }`}
            >
              <span>💻</span>
              <span>Online</span>
            </button>
          </div>
        </div>

        {/* Region Notice for Home visits */}
        {serviceCategory === "home" ? (
          <div className="p-3.5 rounded-[16px] bg-[#FFF8F0] border border-[#C67B5C]/20 flex items-center justify-between text-xs text-[#2D241E]">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C67B5C] flex-shrink-0" />
              <span>
                Şu anki konum: <strong>{selectedRegion.name}, {selectedRegion.district}</strong> (Evde hekim ziyareti aktif)
              </span>
            </div>
            <button
              onClick={() => setIsRegionModalOpen(true)}
              className="text-[#C67B5C] font-bold hover:underline flex-shrink-0 ml-2"
            >
              Değiştir
            </button>
          </div>
        ) : (
          <div className="p-3.5 rounded-[16px] bg-[#6B7B3C]/10 border border-[#6B7B3C]/20 flex items-center gap-2 text-xs text-[#2D241E]">
            <Video className="w-4 h-4 text-[#6B7B3C] flex-shrink-0" />
            <span>
              Online muayene ve danışmanlık hizmetimiz <strong>tüm Türkiye genelinde</strong> görüntülü bağlantıyla aktiftir.
            </span>
          </div>
        )}

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedServices.map((service) => {
            const Icon = ICON_MAP[service.iconName] || Stethoscope;
            return (
              <div
                key={service.id}
                className="bg-white border border-[#E8DFD3] hover:border-[#C67B5C]/60 rounded-[20px] p-5 shadow-[0_4px_16px_-2px_rgba(198,123,92,0.06)] hover:shadow-[0_8px_24px_-4px_rgba(198,123,92,0.12)] transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF5EB] border border-[#C67B5C]/20 flex items-center justify-center text-[#C67B5C] group-hover:scale-105 group-hover:bg-[#C67B5C] group-hover:text-white transition-all shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="text-right">
                      <span className="text-lg font-heading font-extrabold text-[#C67B5C] block">
                        {formatPrice(service.price)}
                      </span>
                      <span className="text-[11px] text-[#8B7355] flex items-center justify-end gap-1">
                        <Clock className="w-3 h-3" />
                        {service.durationMin} dk seans
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-heading font-bold text-lg text-[#2D241E] group-hover:text-[#C67B5C] transition-colors">
                        {service.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#5C3D2E]/80 line-clamp-2 leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  {/* Feature Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {service.features.slice(0, 3).map((feat, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-medium bg-[#FDFBF7] border border-[#E8DFD3] text-[#5C3D2E] px-2 py-0.5 rounded-full"
                      >
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button - directly leads to booking */}
                <div className="pt-4 mt-2 border-t border-[#F4EFE6] flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#8B7355]">
                    {service.category === "home" ? "🏡 Kapınızda Uygulama" : "💻 Canlı Video Bağlantısı"}
                  </span>

                  <Button
                    onClick={() => router.push(`/booking?service=${service.id}`)}
                    className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs h-10 px-4 gap-1.5 shadow-sm"
                  >
                    Randevu Al
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Vet Doctor Team Highlight */}
      <section className="bg-white border border-[#E8DFD3] rounded-[24px] p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-heading font-bold text-[#2D241E]">
              Uzman Veteriner Kadromuz
            </h3>
            <p className="text-xs text-[#8B7355]">
              Evinize gelen tüm hekimlerimiz alanında tecrübeli ve resmi kayıtlıdır
            </p>
          </div>
          <span className="text-xs font-bold text-[#6B7B3C] bg-[#6B7B3C]/10 px-3 py-1 rounded-full">
            ★ 4.9/5 Puan (240+ Yorum)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VET_DOCTORS.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-[18px] bg-[#FDFBF7] border border-[#E8DFD3] flex items-center gap-3.5"
            >
              <img
                src={doc.avatar}
                alt={doc.name}
                className="w-14 h-14 rounded-2xl object-cover border border-[#C67B5C]/30"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-heading font-bold text-sm text-[#2D241E] truncate">
                  {doc.name}
                </h4>
                <p className="text-xs text-[#8B7355] truncate">{doc.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-[#5C3D2E]">
                  <span className="flex items-center gap-0.5 text-[#D97706] font-bold">
                    <Star className="w-3 h-3 fill-current" /> {doc.rating}
                  </span>
                  <span>•</span>
                  <span>{doc.experienceYears} Yıl Deneyim</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Emergency / Live Assistant Quick Banner */}
      <section className="rounded-[20px] bg-[#6B7B3C]/15 border border-[#6B7B3C]/30 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#6B7B3C] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-[#2D241E]">
              Acil bir durum veya sorunuz mu var?
            </h4>
            <p className="text-xs text-[#5C3D2E]">
              Yapay zeka asistanımızla anında sohbet edin veya canlı hekim desteğine bağlanın.
            </p>
          </div>
        </div>

        <Button
          onClick={() => router.push("/messages")}
          className="w-full sm:w-auto bg-[#6B7B3C] hover:bg-[#586630] text-white font-bold rounded-xl text-xs gap-2"
        >
          <MessagesSquare className="w-4 h-4" />
          Mesaj Gönder
        </Button>
      </section>
    </div>
  );
}
