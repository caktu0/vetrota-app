"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { TAKVIYE_PRODUCTS } from "@/lib/mockData";
import { ProductItem } from "@/types";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Plus,
  Search,
  Check,
  X,
  ShieldCheck,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EveTakviyePage() {
  const router = useRouter();
  const { addToCart, cartCount } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  const filteredProducts = TAKVIYE_PRODUCTS.filter((prod) => {
    if (activeCategory !== "all" && prod.subCategory !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        prod.name.toLowerCase().includes(q) ||
        prod.brand?.toLowerCase().includes(q) ||
        prod.subCategory?.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openProductDetail = (prod: ProductItem) => {
    setSelectedProduct(prod);
  };

  const handleAddToCart = (prod: ProductItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(prod, prod.unit);
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-3 pb-28 animate-in fade-in duration-300">
      {/* 1. Header Bar */}
      <div className="flex items-center justify-between pt-1">
        <Link
          href="/services"
          className="w-9 h-9 rounded-full bg-white border border-[#E8DFD3] flex items-center justify-center text-[#2D241E] shadow-sm hover:bg-[#F4EFE6] transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="text-center px-2 min-w-0">
          <h1 className="font-heading font-extrabold text-base md:text-lg text-[#2D241E] truncate">
            Eve Takviye Ürün Hizmeti
          </h1>
          <p className="text-xs md:text-sm text-slate-600 truncate">
            Maltlar, vitaminler, eklem & bağışıklık destekleri
          </p>
        </div>
        <Link
          href="/cart"
          className="w-9 h-9 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-md relative hover:bg-[#2563EB] transition-colors shrink-0"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[16px] h-4 flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* 2. Hero Notice Banner */}
      <div className="bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] rounded-2xl p-3 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center flex-shrink-0 shadow-md">
          <HeartPulse className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-xs font-extrabold text-[#1E40AF]">
            Orijinal & Veteriner Onaylı Takviyeler
          </h2>
          <p className="text-[10px] text-[#2563EB] leading-tight mt-0.5">
            VetExpert, GimCat, Vetqom ve Veda markalı orijinal destek ürünleri reçetesiz hızlı teslimatla kapınızda.
          </p>
        </div>
      </div>

      {/* 3. Search Box */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7355]" />
        <input
          type="text"
          placeholder="Takviye ürünü veya marka ara (Malt macun, Vetomune...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9.5 pr-4 py-2 bg-white border border-[#E8DFD3] rounded-2xl text-xs placeholder:text-[#8B7355]/60 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/40 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* 4. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: "all", label: "💊 Tüm Takviyeler" },
          { id: "Malt & Tüy Sağlığı", label: "🌿 Malt Macunları" },
          { id: "Bağışıklık", label: "🛡️ Bağışıklık (İmmün)" },
          { id: "Eklem & Kemik", label: "🦴 Eklem & Glukozamin" },
          { id: "Multivitamin", label: "⚡ Multivitamin & Biyotin" },
          { id: "Sakinleştirici", label: "🧘 Sakinleştirici & Stres" },
          { id: "Sindirim & Probiyotik", label: "🧪 Sindirim & Probiyotik" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeCategory === cat.id
                ? "bg-[#2563EB] text-white shadow-sm"
                : "bg-white text-[#1D4ED8] border border-[#BFDBFE] hover:bg-[#EFF6FF]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 5. Products Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={() => openProductDetail(prod)}
            className="bg-white border border-[#E8DFD3] hover:border-[#3B82F6] rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md transition-all group relative overflow-hidden"
          >
            {/* Top Badges & Image */}
            <div>
              <div className="relative w-full h-32 rounded-xl overflow-hidden bg-blue-50/50 mb-2 border border-slate-100">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.badges && prod.badges[0] && (
                  <span className="absolute top-1.5 left-1.5 bg-[#2563EB] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                    {prod.badges[0]}
                  </span>
                )}
                <span className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                  {prod.subCategory}
                </span>
              </div>

              {/* Brand & Title */}
              <div className="text-[9px] font-bold text-[#1D4ED8] uppercase tracking-wide">
                {prod.brand}
              </div>
              <h3 className="font-heading font-extrabold text-[11px] text-[#2D241E] leading-snug line-clamp-2 mt-0.5">
                {prod.name}
              </h3>
            </div>

            {/* Price & Add to Cart Button */}
            <div className="mt-2.5 pt-2 border-t border-[#F4EFE6] flex items-center justify-between gap-1">
              <div>
                <span className="text-[12px] font-extrabold text-[#2D241E] block leading-none">
                  {prod.price} ₺
                </span>
                <span className="text-[9px] text-[#8B7355] block mt-0.5">
                  {prod.unit}
                </span>
              </div>

              <button
                type="button"
                onClick={(e) => handleAddToCart(prod, e)}
                className="w-8 h-8 rounded-xl bg-[#3B82F6] hover:bg-[#2563EB] text-white flex items-center justify-center shadow-sm active:scale-90 transition-transform"
                title="Sepete Ekle"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-10 bg-white rounded-2xl border border-[#E8DFD3] p-6 space-y-2">
          <p className="text-sm font-bold text-[#2D241E]">Bu kategoride takviye ürünü bulunamadı</p>
          <Button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            variant="outline"
            className="text-xs mt-2"
          >
            Tüm Takviyeleri Göster
          </Button>
        </div>
      )}

      {/* 6. Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[85vh] overflow-y-auto p-5 space-y-4 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
            {/* Close button */}
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Product Image */}
            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-blue-50/50 border border-slate-100">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-[#2563EB] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                  {selectedProduct.brand} • {selectedProduct.subCategory}
                </span>
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h2 className="font-heading font-extrabold text-base text-[#2D241E]">
                {selectedProduct.name}
              </h2>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-extrabold text-[#1D4ED8]">
                  {selectedProduct.price} ₺
                </span>
                {selectedProduct.rating && (
                  <div className="flex items-center gap-1 text-blue-600 text-xs font-bold bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                    <Star className="w-3.5 h-3.5 fill-blue-500 text-blue-500" />
                    <span>{selectedProduct.rating}</span>
                    <span className="text-gray-400">({selectedProduct.ratingCount})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-[#2D241E]">Takviye Bilgisi</h4>
              <p className="text-xs text-[#5C5870] leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Features */}
            {selectedProduct.features && (
              <div className="space-y-1 bg-[#EFF6FF] p-3 rounded-2xl border border-[#BFDBFE]">
                <h4 className="text-xs font-extrabold text-[#1E40AF]">Kullanım ve Etkiler</h4>
                <ul className="space-y-1 text-[11px] text-[#1D4ED8]">
                  {selectedProduct.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 flex gap-2">
              <Button
                onClick={() => {
                  addToCart(selectedProduct, selectedProduct.unit);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-extrabold rounded-2xl text-xs shadow-md active:scale-95 transition-all"
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                Sepete Ekle ({selectedProduct.unit})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
