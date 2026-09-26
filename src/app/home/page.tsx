"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import {
  TIP_OF_THE_DAY,
  HOME_BLOG_POSTS,
  BlogPostItemData,
} from "@/lib/blog-data";
import {
  Sparkles,
  BookOpen,
  Clock,
  ArrowRight,
  Lightbulb,
  Heart,
  Share2,
  CheckCircle2,
  Compass,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { useRouter } from "next/navigation";

export default function UserHomeBlogPage() {
  const router = useRouter();
  const { pets, activePet, activePetId } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [activeArticle, setActiveArticle] = useState<BlogPostItemData | null>(null);

  const categories = ["Tümü", "Aşı & Sağlık", "Beslenme", "Davranış", "Bakım & Hijyen", "İlk Yardım"];

  const currentPet = activePet || pets[0] || null;

  // Filter posts based on category
  const filteredPosts =
    selectedCategory === "Tümü"
      ? HOME_BLOG_POSTS
      : HOME_BLOG_POSTS.filter((p) => p.category === selectedCategory);

  const handleBookVaccine = () => {
    if (!currentPet) {
      router.push("/services/evde-saglik");
      return;
    }

    const serviceId = currentPet.upcomingVaccine?.serviceId || (currentPet.species === "Köpek" ? "sag-kopek-karma-asi" : "sag-kedi-karma-asi");
    const serviceName = `${currentPet.name} - ${currentPet.upcomingVaccine?.name || "Evde Aşı Uygulaması"}`;

    router.push(`/randevu?serviceId=${encodeURIComponent(serviceId)}&petId=${encodeURIComponent(currentPet.id)}&service=${encodeURIComponent(serviceName)}`);
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-3.5 pb-8 animate-in fade-in duration-300">
      {/* 1. DYNAMIC HEALTH & VACCINE TRACKER CARD (Seçili Petin Sağlık & Aşı Takvimi) */}
      {currentPet ? (
        <div className="w-full max-w-full overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#FFFDF9] to-[#F5EFE6] border border-[#E8DFD3] rounded-[24px] p-3.5 sm:p-4 shadow-sm space-y-3 relative">
          {/* Top Label & Pet Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-6 h-6 rounded-lg bg-[#C87D55]/15 text-[#C87D55] flex items-center justify-center shrink-0">
                <Stethoscope className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-extrabold text-[#2D241E] uppercase tracking-wider">
                Sağlık & Aşı Takvimi
              </span>
            </div>

            <span className="text-[10px] font-bold text-[#6B7B3C] bg-[#6B7B3C]/10 border border-[#6B7B3C]/20 px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0">
              <CheckCircle2 className="w-3 h-3" /> Dijital Karne Aktif
            </span>
          </div>

          {/* Active Pet & Upcoming Vaccine Details (Ferah Sağ Alan & Dairesel Avatar) */}
          <div className="flex items-center gap-3.5 bg-white/95 p-3.5 rounded-2xl border border-[#E8DFD3]/80 shadow-2xs w-full max-w-full overflow-hidden">
            {/* Dairesel Pet Avatarı: w-20 h-20 rounded-full object-cover shrink-0 */}
            <div className="w-20 h-20 rounded-full overflow-hidden bg-[#F5EFE6] shrink-0 border-2 border-[#C87D55]/30 relative shadow-sm">
              {currentPet.image ? (
                <img
                  src={currentPet.image}
                  alt={currentPet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl">
                  {currentPet.species === "Köpek" ? "🐶" : "🐱"}
                </div>
              )}
            </div>

            {/* Genişletilmiş Sağ Alan & Bilgi Hiyerarşisi */}
            <div className="flex-1 min-w-0 space-y-1">
              <div>
                <h3 className="text-lg font-heading font-bold text-[#2D241E] leading-snug break-words">
                  {currentPet.name}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 font-medium break-words">
                  {currentPet.breed || currentPet.species} {currentPet.age ? `• ${currentPet.age} Yaşında` : ""}
                </p>
              </div>

              {/* Aşı Adı & Tarih Rozetleri (Esnek Flex Badge Düzeni) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="inline-flex items-center gap-1 bg-[#FFF5EB] text-[#C87D55] text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-lg border border-[#C87D55]/20">
                  💉 {currentPet.upcomingVaccine?.name || "Yıllık Karma Aşısı"}
                </span>
                <span className="inline-flex items-center gap-1 bg-[#FFFBEB] text-[#D97706] text-[10px] sm:text-xs font-extrabold px-2 py-0.5 rounded-lg border border-[#FDE68A]">
                  📅 {currentPet.upcomingVaccine?.dueDate || "12 Ekim 2026"}
                </span>
                {currentPet.upcomingVaccine?.dueDaysText && (
                  <span className="text-[10px] font-bold text-[#6B7B3C] bg-[#6B7B3C]/10 px-2 py-0.5 rounded-lg">
                    ⏱️ {currentPet.upcomingVaccine.dueDaysText}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Direct CTA Button: Evde Aşı Randevusu Al */}
          <button
            type="button"
            onClick={handleBookVaccine}
            className="w-full py-3 px-4 bg-[#C87D55] hover:bg-[#B86B43] active:scale-[0.98] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>💉</span>
            <span>Evde Aşı Randevusu Al ({currentPet.name})</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#FAF7F2] to-[#F5EFE6] border border-[#E8DFD3] rounded-2xl p-3.5 flex items-center justify-between shadow-sm w-full max-w-full overflow-hidden">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-[#C87D55] text-white flex items-center justify-center text-xl shadow-md shrink-0">
              🐾
            </div>
            <div className="min-w-0">
              <span className="font-heading font-bold text-xs sm:text-sm text-[#2D241E] block truncate">
                VetRota Sağlık Rehberi
              </span>
              <span className="text-xs text-slate-600 truncate block">
                Dostunuzun sağlığı için hekim önerileri
              </span>
            </div>
          </div>
          <Link
            href="/account?tab=pets"
            className="text-xs font-bold text-white bg-[#C87D55] hover:bg-[#B86B43] px-3 py-1.5 rounded-xl shadow-sm shrink-0"
          >
            + Dost Ekle
          </Link>
        </div>
      )}

      {/* 2. Tip of the Day Banner (Günün Veteriner Tavsiyesi) */}
      <div className="bg-gradient-to-br from-[#FFF9F2] to-[#FFF1E6] border border-[#C67B5C]/30 rounded-2xl p-3.5 shadow-sm space-y-2 relative overflow-hidden w-full max-w-full">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 bg-[#C67B5C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Lightbulb className="w-3 h-3" />
            {TIP_OF_THE_DAY.badge}
          </span>
          <span className="text-xs text-[#8B7355] font-semibold">
            {TIP_OF_THE_DAY.author}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-heading font-bold text-sm sm:text-base text-[#2D241E] break-words">
            {TIP_OF_THE_DAY.title}
          </h3>
          <p className="text-xs md:text-sm text-slate-600 leading-relaxed break-words">
            {TIP_OF_THE_DAY.text}
          </p>
        </div>

        {/* Quick link to services */}
        <div className="pt-1 flex justify-end">
          <Link
            href="/services"
            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#C67B5C] hover:underline"
          >
            Tüm Hizmetleri İncele
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* 3. Category Filter Chips (Keşif Başlıkları) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2D241E]">
            <Compass className="w-4 h-4 text-[#C67B5C]" />
            <span>Sağlık Rehberi & Keşfet</span>
          </div>
          <span className="text-[10px] font-semibold text-[#8B7355]">
            {filteredPosts.length} Makale
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all flex-shrink-0 border ${
                  isSelected
                    ? "bg-[#C67B5C] text-white border-[#C67B5C] shadow-sm"
                    : "bg-white border-[#E8DFD3] text-[#2D241E] hover:border-[#C67B5C]/50"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Blog Posts Feed (Şık Kapak Fotoğraflı Rehber Kartları) */}
      <div className="space-y-3.5">
        {filteredPosts.map((post) => (
          <article
            key={post.id}
            onClick={() => setActiveArticle(post)}
            className="bg-white border border-[#E8DFD3] hover:border-[#C67B5C] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group cursor-pointer w-full max-w-full"
          >
            {/* Cover Image */}
            <div className="relative w-full h-44 overflow-hidden bg-[#F4EFE6]">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-44 object-cover rounded-t-xl group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

              {/* Category Badge */}
              <span className={`absolute top-2.5 left-2.5 font-bold text-[9px] sm:text-[10px] px-2.5 py-0.5 rounded-full shadow-sm border ${post.categoryColor}`}>
                {post.category}
              </span>

              {/* Read Time Pill */}
              <span className="absolute bottom-2.5 right-2.5 text-[10px] font-semibold bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#FFF8F0]" />
                {post.readTime}
              </span>
            </div>

            {/* Article Content */}
            <div className="p-3.5 space-y-2">
              <div className="space-y-1">
                <h3 className="font-heading font-semibold text-sm sm:text-base text-[#2D241E] group-hover:text-[#C67B5C] transition-colors leading-snug break-words">
                  {post.title}
                </h3>
                <p className="text-xs md:text-sm text-slate-600 line-clamp-2 leading-relaxed break-words">
                  {post.summary}
                </p>
              </div>

              {/* Author & Footer */}
              <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between text-xs text-[#8B7355]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-5 h-5 rounded-full bg-[#FFF5EB] border border-[#C67B5C]/30 text-[#C67B5C] flex items-center justify-center font-bold text-[9px] shrink-0">
                    🩺
                  </div>
                  <span className="font-semibold text-[#2D241E] truncate">{post.author}</span>
                  <span className="shrink-0">• {post.date}</span>
                </div>

                <span className="font-bold text-[#C67B5C] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
                  Oku <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 5. Quick Health Banner (Hizmetler Sayfasına Yönlendirme) */}
      <div className="bg-gradient-to-r from-[#C67B5C] to-[#B5651D] text-white rounded-2xl p-4 shadow-md space-y-2 text-center w-full max-w-full overflow-hidden">
        <div className="w-10 h-10 rounded-2xl bg-white/20 mx-auto flex items-center justify-center text-xl">
          🩺
        </div>
        <h3 className="font-heading font-extrabold text-sm sm:text-base">
          Dostunuz İçin Randevu Almak İster misiniz?
        </h3>
        <p className="text-xs md:text-sm text-white/90 leading-relaxed max-w-xs mx-auto break-words">
          Evde muayene, karma aşılar, parazit bakımı ve klinik randevuları için hizmetlerimizi inceleyin.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 bg-white text-[#C67B5C] font-extrabold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-sm hover:bg-[#FFF8F0] transition-colors"
        >
          Hizmetleri Görüntüle & Randevu Al
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Article Detail Reading Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-t-[28px] sm:rounded-[28px] w-full max-w-md p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${activeArticle.categoryColor}`}>
                {activeArticle.category}
              </span>
              <button
                onClick={() => setActiveArticle(null)}
                className="w-7 h-7 rounded-full bg-[#F4EFE6] text-[#2D241E] flex items-center justify-center font-bold text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <h2 className="text-base font-heading font-extrabold text-[#2D241E] leading-snug">
                {activeArticle.title}
              </h2>
              <div className="flex items-center gap-2 text-[10px] text-[#8B7355]">
                <span>✍️ {activeArticle.author} ({activeArticle.authorTitle})</span>
                <span>• ⏱️ {activeArticle.readTime}</span>
              </div>
            </div>

            <div className="w-full h-44 rounded-xl overflow-hidden shadow-sm">
              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs text-[#5C3D2E] space-y-2.5 leading-relaxed">
              <p className="font-semibold text-[#2D241E]">
                {activeArticle.summary}
              </p>
              <p>
                Evcil hayvanlarımızın sağlığını korumanın en etkili yolu koruyucu veteriner hekimlik uygulamalarıdır. Düzenli aşı takibi, mevsimsel paraziter koruma ve kaliteli beslenme programları dostlarımızın yaşam kalitesini ve ömrünü belirgin şekilde artırır.
              </p>
              <p>
                Dostunuzda halsizlik, iştahsızlık veya davranış değişiklikleri gözlemlediğinizde vakit kaybetmeden hekim kontrolü talep ediniz.
              </p>
            </div>

            <div className="pt-2 border-t border-[#E8DFD3] flex gap-2">
              <Button
                variant="outline"
                onClick={() => setActiveArticle(null)}
                className="flex-1 text-xs h-9 rounded-xl border-[#E8DFD3]"
              >
                Kapat
              </Button>
              <Button
                asChild
                className="flex-1 bg-[#C67B5C] hover:bg-[#B5651D] text-white text-xs h-9 rounded-xl font-bold gap-1"
              >
                <Link href="/services">
                  <Stethoscope className="w-3.5 h-3.5" />
                  Randevu Al
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
