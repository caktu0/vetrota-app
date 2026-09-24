"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  EVDE_SAGLIK_SERVICES,
  MAMA_PRODUCTS,
  PETSHOP_PRODUCTS,
  TAKVIYE_PRODUCTS,
} from "@/lib/mockData";
import {
  Search,
  X,
  ArrowLeft,
  Sparkles,
  ChevronRight,
  Stethoscope,
  ShoppingBag,
  Scissors,
  ShieldCheck,
  Video,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const { addToCart } = useApp();

  const [query, setQuery] = useState("");

  useEffect(() => {
    // Focus search input on mount
    inputRef.current?.focus();
  }, []);

  const POPULAR_TAGS = [
    "Evde Aşı",
    "Kuduz Aşısı",
    "Royal Canin",
    "Kedi Kumu",
    "Malt Macun",
    "Genel Muayene",
    "İç Dış Parazit",
    "Pro Plan",
    "Somon Yağı",
    "Online Görüşme",
    "Mikroçip",
  ];

  const cleanQ = query.trim().toLowerCase();

  // Filter all datasets
  const matchedHealth = cleanQ
    ? EVDE_SAGLIK_SERVICES.filter(
        (s) =>
          s.name.toLowerCase().includes(cleanQ) ||
          s.description.toLowerCase().includes(cleanQ)
      )
    : [];

  const matchedMama = cleanQ
    ? MAMA_PRODUCTS.filter(
        (m) =>
          m.name.toLowerCase().includes(cleanQ) ||
          m.brand?.toLowerCase().includes(cleanQ) ||
          m.description.toLowerCase().includes(cleanQ) ||
          m.subCategory?.toLowerCase().includes(cleanQ)
      )
    : [];

  const matchedPetshop = cleanQ
    ? PETSHOP_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(cleanQ) ||
          p.brand?.toLowerCase().includes(cleanQ) ||
          p.subCategory?.toLowerCase().includes(cleanQ) ||
          p.description.toLowerCase().includes(cleanQ)
      )
    : [];

  const matchedTakviye = cleanQ
    ? TAKVIYE_PRODUCTS.filter(
        (t) =>
          t.name.toLowerCase().includes(cleanQ) ||
          t.brand?.toLowerCase().includes(cleanQ) ||
          t.subCategory?.toLowerCase().includes(cleanQ) ||
          t.description.toLowerCase().includes(cleanQ)
      )
    : [];

  const totalResults =
    matchedHealth.length +
    matchedMama.length +
    matchedPetshop.length +
    matchedTakviye.length;

  return (
    <div className="w-full space-y-3.5 pb-24 animate-in fade-in duration-300">
      {/* 1. Top Bar & Big Search Input */}
      <div className="flex items-center gap-2 pt-1">
        <Link
          href="/services"
          className="w-9 h-9 rounded-full bg-white border border-[#E8DFD3] flex items-center justify-center text-[#2D241E] shadow-sm hover:bg-[#F4EFE6] transition-colors flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#C87D55]" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Hizmet, aşı, mama, kum veya takviye ara..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9.5 pr-8 py-2.5 bg-white border border-[#E8DFD3] focus:border-[#C87D55] rounded-2xl text-xs placeholder:text-[#8B7355]/60 focus:outline-none focus:ring-2 focus:ring-[#C87D55]/20 shadow-xs transition-all"
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Popular Search Chips */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-1 text-[11px] font-extrabold text-[#8B7355]">
          <TrendingUp className="w-3.5 h-3.5 text-[#C87D55]" />
          <span>Popüler Aramalar</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {POPULAR_TAGS.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => setQuery(tag)}
              className={`px-3 py-1.5 rounded-xl text-[10.5px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
                query.toLowerCase() === tag.toLowerCase()
                  ? "bg-[#C87D55] text-white shadow-xs"
                  : "bg-white text-[#5C3D2E] border border-[#E8DFD3] hover:border-[#C87D55] hover:bg-[#FAF7F2]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Search Results or Initial Discovery View */}
      {cleanQ ? (
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between text-xs text-[#8B7355] border-b border-[#E8DFD3] pb-1.5">
            <span>
              <strong>&quot;{query}&quot;</strong> için sonuçlar:
            </span>
            <span className="font-bold text-[#C87D55]">
              {totalResults} Sonuç Bulundu
            </span>
          </div>

          {/* Section: Evde Sağlık */}
          {matchedHealth.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-xs text-[#2D241E] flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-[#C87D55]/15 text-[#C87D55] flex items-center justify-center">
                    <Stethoscope className="w-3 h-3" />
                  </div>
                  <span>Evde Sağlık Hizmetleri ({matchedHealth.length})</span>
                </h3>
                <Link
                  href="/services/evde-saglik"
                  className="text-[10px] font-bold text-[#C87D55] flex items-center gap-0.5 hover:underline"
                >
                  Tümünü Gör <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-1.5">
                {matchedHealth.map((s) => (
                  <div
                    key={s.id}
                    onClick={() =>
                      router.push(
                        `/services/evde-saglik`
                      )
                    }
                    className="p-2.5 rounded-xl bg-white border border-[#E8DFD3] hover:border-[#C87D55] flex items-center justify-between gap-2.5 cursor-pointer transition-all shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {s.image && (
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/50">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-heading font-bold text-xs text-[#2D241E] truncate group-hover:text-[#C87D55] transition-colors">
                          {s.name}
                        </h4>
                        <p className="text-[10px] text-[#8B7355] truncate mt-0.5">
                          {s.description}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-extrabold text-xs text-[#C87D55] block">
                        {s.price} ₺
                      </span>
                      <span className="text-[9px] text-[#8B7355]">Randevu Al</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Eve Mama */}
          {matchedMama.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-xs text-[#2D241E] flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-[#D97706]/15 text-[#D97706] flex items-center justify-center">
                    <ShoppingBag className="w-3 h-3" />
                  </div>
                  <span>Eve Mama Ürünleri ({matchedMama.length})</span>
                </h3>
                <Link
                  href="/services/eve-mama"
                  className="text-[10px] font-bold text-[#D97706] flex items-center gap-0.5 hover:underline"
                >
                  Tümünü Gör <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-1.5">
                {matchedMama.map((m) => (
                  <div
                    key={m.id}
                    onClick={() => router.push("/services/eve-mama")}
                    className="p-2.5 rounded-xl bg-white border border-[#E8DFD3] hover:border-[#D97706] flex items-center justify-between gap-2.5 cursor-pointer transition-all shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0 border border-slate-200/50">
                        <img
                          src={m.image}
                          alt={m.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-extrabold text-[#D97706] uppercase">
                          {m.brand}
                        </span>
                        <h4 className="font-heading font-bold text-xs text-[#2D241E] truncate group-hover:text-[#D97706] transition-colors">
                          {m.name}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-extrabold text-xs text-[#2D241E] block">
                        {m.price} ₺
                      </span>
                      <span className="text-[9px] text-[#8B7355]">{m.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Petshop */}
          {matchedPetshop.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-xs text-[#2D241E] flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-[#6B7B3C]/15 text-[#6B7B3C] flex items-center justify-center">
                    <Scissors className="w-3 h-3" />
                  </div>
                  <span>Eve Petshop Ürünleri ({matchedPetshop.length})</span>
                </h3>
                <Link
                  href="/services/eve-petshop"
                  className="text-[10px] font-bold text-[#6B7B3C] flex items-center gap-0.5 hover:underline"
                >
                  Tümünü Gör <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-1.5">
                {matchedPetshop.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => router.push("/services/eve-petshop")}
                    className="p-2.5 rounded-xl bg-white border border-[#E8DFD3] hover:border-[#6B7B3C] flex items-center justify-between gap-2.5 cursor-pointer transition-all shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-emerald-50 flex-shrink-0 border border-slate-200/50">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-[#6B7B3C]">
                          {p.subCategory}
                        </span>
                        <h4 className="font-heading font-bold text-xs text-[#2D241E] truncate group-hover:text-[#6B7B3C] transition-colors">
                          {p.name}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-extrabold text-xs text-[#2D241E] block">
                        {p.price} ₺
                      </span>
                      <span className="text-[9px] text-[#8B7355]">{p.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Takviye */}
          {matchedTakviye.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-xs text-[#2D241E] flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-md bg-[#B86B43]/15 text-[#B86B43] flex items-center justify-center">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <span>Eve Takviye & Maltlar ({matchedTakviye.length})</span>
                </h3>
                <Link
                  href="/services/eve-takviye"
                  className="text-[10px] font-bold text-[#B86B43] flex items-center gap-0.5 hover:underline"
                >
                  Tümünü Gör <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="space-y-1.5">
                {matchedTakviye.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => router.push("/services/eve-takviye")}
                    className="p-2.5 rounded-xl bg-white border border-[#E8DFD3] hover:border-[#B86B43] flex items-center justify-between gap-2.5 cursor-pointer transition-all shadow-xs group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden bg-amber-50 flex-shrink-0 border border-slate-200/50">
                        <img
                          src={t.image}
                          alt={t.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold text-[#B86B43]">
                          {t.brand} • {t.subCategory}
                        </span>
                        <h4 className="font-heading font-bold text-xs text-[#2D241E] truncate group-hover:text-[#B86B43] transition-colors">
                          {t.name}
                        </h4>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-extrabold text-xs text-[#2D241E] block">
                        {t.price} ₺
                      </span>
                      <span className="text-[9px] text-[#8B7355]">{t.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No results state */}
          {totalResults === 0 && (
            <div className="text-center py-10 bg-white rounded-2xl border border-[#E8DFD3] p-6 space-y-2 shadow-xs">
              <p className="text-sm font-bold text-[#2D241E]">
                &quot;{query}&quot; ile eşleşen sonuç bulunamadı
              </p>
              <p className="text-xs text-[#8B7355]">
                Farklı bir kelime deneyebilir veya kategorilerden arama yapabilirsiniz.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* 4. Quick Category Shortcuts when nothing is typed yet */
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-extrabold text-[#2D241E]">
            Hızlı Hizmet Kategorileri
          </h3>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                title: "Evde Sağlık",
                desc: "Aşı, muayene, tahlil",
                href: "/services/evde-saglik",
                icon: Stethoscope,
                color: "text-[#C87D55]",
                bg: "bg-[#FAF7F2]",
                border: "border-[#E8DFD3]",
              },
              {
                title: "Eve Mama",
                desc: "Kedi & köpek mamaları",
                href: "/services/eve-mama",
                icon: ShoppingBag,
                color: "text-[#D97706]",
                bg: "bg-[#FEFCE8]",
                border: "border-[#FEF08A]",
              },
              {
                title: "Eve Petshop",
                desc: "Kum, oyuncak, tasma",
                href: "/services/eve-petshop",
                icon: Scissors,
                color: "text-[#6B7B3C]",
                bg: "bg-[#F4F7EE]",
                border: "border-[#DCFCE7]",
              },
              {
                title: "Eve Takviye",
                desc: "Malt, vitamin, destekler",
                href: "/services/eve-takviye",
                icon: ShieldCheck,
                color: "text-[#B86B43]",
                bg: "bg-[#F5EFE6]",
                border: "border-[#E8DFD3]",
              },
            ].map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={i}
                  href={cat.href}
                  className={`${cat.bg} border ${cat.border} rounded-2xl p-3 flex items-center justify-between shadow-xs hover:shadow-md transition-all group`}
                >
                  <div className="space-y-0.5 min-w-0">
                    <h4 className="font-heading font-extrabold text-xs text-[#2D241E] group-hover:text-[#C87D55] transition-colors">
                      {cat.title}
                    </h4>
                    <p className="text-[10px] text-[#8B7355] truncate">
                      {cat.desc}
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-xl bg-white flex items-center justify-center ${cat.color} shadow-xs flex-shrink-0 ml-1.5`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
