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

export default function UserHomeBlogPage() {
  const { pets } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>("Tümü");
  const [activeArticle, setActiveArticle] = useState<BlogPostItemData | null>(null);

  const categories = ["Tümü", "Aşı & Sağlık", "Beslenme", "Davranış", "Bakım & Hijyen", "İlk Yardım"];

  const filteredPosts =
    selectedCategory === "Tümü"
      ? HOME_BLOG_POSTS
      : HOME_BLOG_POSTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full space-y-4 pb-8 animate-in fade-in duration-300">
      {/* 1. Welcome & Pet Status Bar */}
      {pets.length > 0 ? (
        <div className="bg-white border border-[#E8DFD3] rounded-2xl p-3 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#FFF8F0] border border-[#E8DFD3] flex items-center justify-center text-2xl shadow-inner">
              {pets[0].species === "Köpek" ? "🐶" : "🐱"}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-sm text-[#2D241E]">
                  {pets[0].name}
                </span>
                <span className="text-[10px] text-[#8B7355] bg-[#F4EFE6] px-2 py-0.5 rounded-full font-medium">
                  {pets[0].breed || pets[0].species}
                </span>
              </div>
              <span className="text-[10px] text-[#6B7B3C] font-semibold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> Dijital Sağlık Karnesi Aktif
              </span>
            </div>
          </div>
          <Link
            href="/account"
            className="text-[11px] font-bold text-[#C67B5C] bg-[#C67B5C]/10 hover:bg-[#C67B5C]/20 px-2.5 py-1.5 rounded-xl transition-colors"
          >
            Profil 🐾
          </Link>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#FFF8F0] to-[#FFF5EB] border border-[#C67B5C]/30 rounded-2xl p-3.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C67B5C] text-white flex items-center justify-center text-xl shadow-md">
              🐾
            </div>
            <div>
              <span className="font-heading font-bold text-xs text-[#2D241E] block">
                VetRota Sağlık Rehberi
              </span>
              <span className="text-[10px] text-[#8B7355]">
                Dostunuzun sağlığı için hekim önerileri
              </span>
            </div>
          </div>
          <Link
            href="/account"
            className="text-[10px] font-bold text-white bg-[#C67B5C] hover:bg-[#B5651D] px-3 py-1.5 rounded-xl shadow-sm"
          >
            + Dost Ekle
          </Link>
        </div>
      )}

      {/* 2. Tip of the Day Banner (Günün Veteriner Tavsiyesi) */}
      <div className="bg-gradient-to-br from-[#FFF9F2] to-[#FFF1E6] border border-[#C67B5C]/30 rounded-2xl p-3.5 shadow-sm space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 bg-[#C67B5C] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            <Lightbulb className="w-3 h-3" />
            {TIP_OF_THE_DAY.badge}
          </span>
          <span className="text-[10px] text-[#8B7355] font-semibold">
            {TIP_OF_THE_DAY.author}
          </span>
        </div>

        <div className="space-y-1">
          <h3 className="font-heading font-bold text-xs sm:text-sm text-[#2D241E]">
            {TIP_OF_THE_DAY.title}
          </h3>
          <p className="text-[11px] text-[#5C3D2E]/90 leading-relaxed">
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
            className="bg-white border border-[#E8DFD3] hover:border-[#C67B5C] rounded-2xl shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group cursor-pointer"
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
              <span className={`absolute top-2.5 left-2.5 font-bold text-[9px] px-2.5 py-0.5 rounded-full shadow-sm border ${post.categoryColor}`}>
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
                <h3 className="font-heading font-bold text-sm text-[#2D241E] group-hover:text-[#C67B5C] transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-[11px] text-[#5C3D2E]/80 line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
              </div>

              {/* Author & Footer */}
              <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between text-[10px] text-[#8B7355]">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-[#FFF5EB] border border-[#C67B5C]/30 text-[#C67B5C] flex items-center justify-center font-bold text-[9px]">
                    🩺
                  </div>
                  <span className="font-semibold text-[#2D241E]">{post.author}</span>
                  <span>• {post.date}</span>
                </div>

                <span className="font-bold text-[#C67B5C] flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                  Oku <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* 5. Quick Health Banner (Hizmetler Sayfasına Yönlendirme) */}
      <div className="bg-gradient-to-r from-[#C67B5C] to-[#B5651D] text-white rounded-2xl p-4 shadow-md space-y-2 text-center">
        <div className="w-10 h-10 rounded-2xl bg-white/20 mx-auto flex items-center justify-center text-xl">
          🩺
        </div>
        <h3 className="font-heading font-extrabold text-sm">
          Dostunuz İçin Randevu Almak İster misiniz?
        </h3>
        <p className="text-[11px] text-white/90 leading-relaxed max-w-xs mx-auto">
          Evde muayene, karma aşılar, parazit bakımı ve klinik randevuları için hizmetlerimizi inceleyin.
        </p>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 bg-white text-[#C67B5C] font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm hover:bg-[#FFF8F0] transition-colors"
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
