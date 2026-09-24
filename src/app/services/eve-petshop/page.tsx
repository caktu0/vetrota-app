"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PETSHOP_PRODUCTS } from "@/lib/mockData";
import { ProductItem } from "@/types";
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Plus,
  Search,
  Check,
  X,
  Package,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function EvePetshopPage() {
  const router = useRouter();
  const { addToCart, cartCount } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<string>("");

  const filteredProducts = PETSHOP_PRODUCTS.filter((prod) => {
    if (activeCategory !== "all" && prod.subCategory !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        prod.name.toLowerCase().includes(q) ||
        prod.subCategory?.toLowerCase().includes(q) ||
        prod.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const openProductDetail = (prod: ProductItem) => {
    setSelectedProduct(prod);
    setSelectedWeight(prod.weightOptions ? prod.weightOptions[0] : prod.unit);
  };

  const handleAddToCart = (prod: ProductItem, weight?: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(prod, weight || prod.weightOptions?.[0] || prod.unit);
  };

  return (
    <div className="w-full space-y-3 pb-24 animate-in fade-in duration-300">
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
            Eve Petshop Ürünleri
          </h1>
          <p className="text-[10px] text-[#8B7355]">
            Kum, oyuncak, tasma, kıyafet ve hijyen ürünleri
          </p>
        </div>
        <Link
          href="/cart"
          className="w-9 h-9 rounded-full bg-[#10B981] text-white flex items-center justify-center shadow-md relative hover:bg-[#059669] transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[16px] h-4 flex items-center justify-center border border-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* 2. Search Box */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8B7355]" />
        <input
          type="text"
          placeholder="Petshop ürünü ara (Kedi kumu, göğüs tasması...)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9.5 pr-4 py-2 bg-white border border-[#E8DFD3] rounded-2xl text-xs placeholder:text-[#8B7355]/60 focus:outline-none focus:ring-2 focus:ring-[#10B981]/40 shadow-xs"
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

      {/* 3. Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {[
          { id: "all", label: "🐾 Tüm Ürünler" },
          { id: "Kedi Kumu", label: "🏜️ Kedi Kumları" },
          { id: "Hijyen & Tuvalet", label: "🧼 Hijyen & Tuvalet" },
          { id: "Tasma & Gezdirme", label: "🦮 Tasma & Gezdirme" },
          { id: "Tırmalama & Yatak", label: "🪑 Tırmalama & Yatak" },
          { id: "Oyuncaklar", label: "🧶 Oyuncaklar" },
          { id: "Bakım & Medikal", label: "✂️ Bakım & Medikal" },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap transition-all flex-shrink-0 ${
              activeCategory === cat.id
                ? "bg-[#10B981] text-white shadow-sm"
                : "bg-white text-[#047857] border border-[#A7F3D0] hover:bg-[#ECFDF5]"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 4. Products Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            onClick={() => openProductDetail(prod)}
            className="bg-white border border-[#E8DFD3] hover:border-[#10B981] rounded-2xl p-2.5 flex flex-col justify-between cursor-pointer shadow-xs hover:shadow-md transition-all group relative overflow-hidden"
          >
            {/* Top Badges & Image */}
            <div>
              <div className="relative w-full h-32 rounded-xl overflow-hidden bg-emerald-50/50 mb-2 border border-slate-100">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.badges && prod.badges[0] && (
                  <span className="absolute top-1.5 left-1.5 bg-[#10B981] text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-md shadow-xs">
                    {prod.badges[0]}
                  </span>
                )}
                <span className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">
                  {prod.subCategory}
                </span>
              </div>

              {/* Brand & Title */}
              <div className="text-[9px] font-bold text-[#059669] uppercase tracking-wide">
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
                onClick={(e) => handleAddToCart(prod, undefined, e)}
                className="w-8 h-8 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white flex items-center justify-center shadow-sm active:scale-90 transition-transform"
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
          <p className="text-sm font-bold text-[#2D241E]">Bu kategoride ürün bulunamadı</p>
          <Button
            onClick={() => {
              setActiveCategory("all");
              setSearchQuery("");
            }}
            variant="outline"
            className="text-xs mt-2"
          >
            Tüm Ürünleri Göster
          </Button>
        </div>
      )}

      {/* 5. Product Detail Modal */}
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
            <div className="relative w-full h-48 rounded-2xl overflow-hidden bg-emerald-50/50 border border-slate-100">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-[#10B981] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                  {selectedProduct.subCategory}
                </span>
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h2 className="font-heading font-extrabold text-base text-[#2D241E]">
                {selectedProduct.name}
              </h2>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xl font-extrabold text-[#059669]">
                  {selectedProduct.price} ₺
                </span>
                {selectedProduct.rating && (
                  <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                    <Star className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500" />
                    <span>{selectedProduct.rating}</span>
                    <span className="text-gray-400">({selectedProduct.ratingCount})</span>
                  </div>
                )}
              </div>
            </div>

            {/* Variant / Size selector if present */}
            {selectedProduct.weightOptions && selectedProduct.weightOptions.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#2D241E]">
                  Beden / Seçenek:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProduct.weightOptions.map((w, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedWeight(w)}
                      className={`p-2 rounded-xl text-center text-[10px] font-bold transition-all border ${
                        selectedWeight === w
                          ? "bg-[#D1FAE5] text-[#065F46] border-[#10B981] ring-2 ring-[#10B981]/20"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-[#2D241E]">Ürün Detayı</h4>
              <p className="text-xs text-[#5C5870] leading-relaxed">
                {selectedProduct.description}
              </p>
            </div>

            {/* Features */}
            {selectedProduct.features && (
              <div className="space-y-1 bg-[#F0FDF4] p-3 rounded-2xl border border-[#BBF7D0]">
                <h4 className="text-xs font-extrabold text-[#166534]">Ürün Avantajları</h4>
                <ul className="space-y-1 text-[11px] text-[#14532D]">
                  {selectedProduct.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
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
                  addToCart(selectedProduct, selectedWeight);
                  setSelectedProduct(null);
                }}
                className="flex-1 py-3 bg-[#10B981] hover:bg-[#059669] text-white font-extrabold rounded-2xl text-xs shadow-md active:scale-95 transition-all"
              >
                <ShoppingCart className="w-4 h-4 mr-1.5" />
                Sepete Ekle ({selectedWeight || selectedProduct.unit})
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
