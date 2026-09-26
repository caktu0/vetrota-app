"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { MOCK_COUPONS } from "@/lib/mockData";
import { OrderItem } from "@/types";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Truck,
  Tag,
  CheckCircle2,
  MapPin,
  Clock,
  CreditCard,
  Banknote,
  ChevronRight,
  ShieldCheck,
  PackageCheck,
  Sparkles,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    addresses,
    addAddress,
    selectedRegion,
    selectedTimeSlot,
    createOrder,
    showToast,
  } = useApp();

  // Coupon state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; desc: string } | null>(null);

  // Checkout modal & state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || "");
  const [selectedPayment, setSelectedPayment] = useState<"Kredi Kartı (Kapıda)" | "Nakit (Kapıda)" | "Online Kredi Kartı">("Kredi Kartı (Kapıda)");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderItem | null>(null);

  // Quick new address form
  const [isNewAddressFormOpen, setIsNewAddressFormOpen] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState("Evim");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrBuilding, setNewAddrBuilding] = useState("");
  const [newAddrApartment, setNewAddrApartment] = useState("");

  // Calculations
  const FREE_SHIPPING_THRESHOLD = 500;
  const isFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD || cartTotal === 0;
  const deliveryFee = isFreeShipping ? 0 : 49.9;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - cartTotal);
  const freeShippingProgress = Math.min(100, Math.round((cartTotal / FREE_SHIPPING_THRESHOLD) * 100));

  const discountAmount = appliedCoupon ? appliedCoupon.discount : 0;
  const grandTotal = Math.max(0, cartTotal + deliveryFee - discountAmount);

  // Apply coupon handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const found = MOCK_COUPONS[code];
    if (found) {
      let discountVal = 0;
      if (found.discountPercent) {
        discountVal = Math.round((cartTotal * found.discountPercent) / 100);
      } else if (found.discountFixed) {
        discountVal = found.discountFixed;
      }
      setAppliedCoupon({ code, discount: discountVal, desc: found.desc });
      showToast(`Kupon uygulandı: ${found.desc}`, "success");
      setCouponInput("");
    } else {
      showToast("Geçersiz kupon kodu. Deneyebileceğiniz: VETROTA10, PATI20", "warning");
    }
  };

  // Save new address inside checkout
  const handleSaveQuickAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) {
      showToast("Lütfen cadde ve sokak bilginizi giriniz.", "warning");
      return;
    }

    addAddress({
      title: newAddrTitle,
      district: selectedRegion.district,
      neighborhood: selectedRegion.name,
      street: newAddrStreet,
      buildingNo: newAddrBuilding,
      apartmentNo: newAddrApartment,
      fullAddress: `${newAddrStreet} No:${newAddrBuilding || "-"} D:${newAddrApartment || "-"} ${selectedRegion.name} / ${selectedRegion.district}`,
      isDefault: addresses.length === 0,
    });

    setIsNewAddressFormOpen(false);
    showToast("Adres kaydedildi ve seçildi.", "success");
  };

  // Complete Order
  const handleCompleteOrder = () => {
    const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0] || {
      id: "quick-addr",
      userId: "user-1",
      title: "Kayıtlı Adres",
      district: selectedRegion.district,
      neighborhood: selectedRegion.name,
      street: "Atatürk Cad.",
      fullAddress: `${selectedRegion.name}, ${selectedRegion.district}`,
    };

    setIsSubmittingOrder(true);
    setTimeout(() => {
      const order = createOrder({
        address: activeAddress,
        deliveryTime: selectedTimeSlot || "Bugün 30-45 Dakika İçinde",
        paymentMethod: selectedPayment,
        orderNotes,
        couponCode: appliedCoupon?.code,
        discount: discountAmount,
      });

      setIsSubmittingOrder(false);
      setCompletedOrder(order);
    }, 700);
  };

  // If order was just placed, render Order Success Screen
  if (completedOrder) {
    return (
      <div className="w-full space-y-4 pb-24 pt-2 text-center animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-lg ring-8 ring-emerald-50">
          <PackageCheck className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div>
          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full border border-emerald-200">
            Siparişiniz Alındı & Hazırlanıyor
          </span>
          <h1 className="font-heading font-extrabold text-xl text-[#2D241E] mt-2">
            Harika! Siparişiniz Yola Çıkmaya Hazır 🐾
          </h1>
          <p className="text-xs text-[#5C5870] mt-1 max-w-xs mx-auto">
            Sipariş numaranız <strong className="text-[#2D241E]">{completedOrder.orderNumber}</strong> olarak oluşturuldu. Kuryemiz en kısa sürede kapınızda olacak.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl p-4 border border-[#E8DFD3] text-left space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <span className="text-xs text-slate-500 font-medium">Tahmini Teslimat:</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              ⏱️ {completedOrder.estimatedDeliveryTime}
            </span>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <MapPin className="w-4 h-4 text-[#CA8A04] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Teslimat Adresi:</span>
              <span className="text-slate-600 text-[11px]">{completedOrder.address.fullAddress}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs">
            <CreditCard className="w-4 h-4 text-[#3B82F6] flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800 block">Ödeme Şekli:</span>
              <span className="text-slate-600 text-[11px]">{completedOrder.paymentMethod}</span>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-xs font-extrabold">
            <span>Toplam Tutar:</span>
            <span className="text-sm text-[#2D241E]">{completedOrder.totalAmount.toLocaleString("tr-TR")} ₺</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-2">
          <Button
            onClick={() => router.push("/services")}
            className="w-full py-3 bg-[#C87D55] hover:bg-[#B86B43] text-white font-extrabold rounded-2xl text-xs shadow-md"
          >
            Hizmetlere ve Alışverişe Devam Et
          </Button>
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="w-full py-3 border-[#E8DFD3] text-[#2D241E] font-bold rounded-2xl text-xs hover:bg-[#FAF7F2]"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="w-full space-y-4 pb-24 pt-8 text-center animate-in fade-in duration-300">
        <div className="w-24 h-24 rounded-full bg-[#FAF7F2] border border-[#E8DFD3] flex items-center justify-center mx-auto text-[#C87D55] shadow-sm">
          <ShoppingCart className="w-12 h-12 stroke-[1.5]" />
        </div>

        <div className="space-y-1">
          <h2 className="font-heading font-extrabold text-base text-[#2D241E]">
            Sepetiniz Henüz Boş
          </h2>
          <p className="text-xs text-[#8B7355] max-w-xs mx-auto">
            Dostunuz için lezzetli mamalar, oyuncaklar, takviyeler veya evde sağlık hizmetleri ekleyebilirsiniz.
          </p>
        </div>

        <div className="pt-2">
          <Button
            onClick={() => router.push("/services")}
            className="px-6 py-3 bg-[#C87D55] hover:bg-[#B86B43] text-white font-extrabold rounded-2xl text-xs shadow-md transition-all active:scale-95"
          >
            Hemen Ürünleri Keşfet 🐾
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden space-y-3.5 pb-32 animate-in fade-in duration-300">
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
            Sepetim ({cartCount} Ürün)
          </h1>
          <p className="text-[10px] text-[#8B7355]">
            Sipariş özeti ve hızlı adrese teslimat
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-[10px] text-red-600 hover:text-red-700 font-bold px-2 py-1 bg-red-50 rounded-lg border border-red-100"
        >
          Temizle
        </button>
      </div>

      {/* 2. Free Delivery Progress Banner */}
      <div className="bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7] border border-[#BBF7D0] rounded-2xl p-3 space-y-1.5 shadow-xs">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-emerald-800">
            <Truck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            {isFreeShipping ? (
              <span>Tebrikler! Kargonuz Ücretsiz 🎉</span>
            ) : (
              <span>
                <strong>{remainingForFreeShipping} ₺</strong> daha ekleyin, Kargo Bedava!
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold text-emerald-700">
            %{freeShippingProgress}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 bg-emerald-200/80 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* 3. Cart Items List */}
      <div className="space-y-2.5">
        {cart.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-[#E8DFD3] rounded-2xl p-3 flex items-center gap-3 shadow-xs"
          >
            {/* Thumbnail */}
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-200/60">
              <img
                src={item.product.image || "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=300"}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product details */}
            <div className="flex-1 min-w-0">
              {item.product.brand && (
                <span className="text-[9px] font-extrabold text-[#8B7355] uppercase tracking-wider block">
                  {item.product.brand}
                </span>
              )}
              <h3 className="font-heading font-extrabold text-xs text-[#2D241E] leading-snug line-clamp-1">
                {item.product.name}
              </h3>
              <div className="text-[10px] text-[#8B7355] mt-0.5">
                {item.selectedWeight || item.product.unit}
              </div>
              <div className="font-extrabold text-xs text-[#C87D55] mt-1">
                {(item.unitPrice * item.quantity).toLocaleString("tr-TR")} ₺
              </div>
            </div>

            {/* Quantity Stepper & Delete */}
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                title="Ürünü Kaldır"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center bg-[#F4EFE6] rounded-xl p-0.5 border border-[#E8DFD3]">
                <button
                  onClick={() => updateCartQuantity(item.id, -1)}
                  className="w-6 h-6 rounded-lg bg-white flex items-center justify-center text-[#2D241E] font-bold shadow-xs active:scale-90"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-6 text-center text-xs font-extrabold text-[#2D241E]">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateCartQuantity(item.id, 1)}
                  className="w-6 h-6 rounded-lg bg-[#C87D55] text-white flex items-center justify-center font-bold shadow-xs active:scale-90"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 4. Promo Coupon Section */}
      <div className="bg-white border border-[#E8DFD3] rounded-2xl p-3 space-y-2 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2D241E]">
          <Tag className="w-4 h-4 text-[#C87D55]" />
          <span>İndirim Kuponu</span>
        </div>

        {appliedCoupon ? (
          <div className="bg-[#FAF7F2] border border-[#E8DFD3] rounded-xl p-2 flex items-center justify-between text-xs">
            <div>
              <span className="font-extrabold text-[#C87D55] block">{appliedCoupon.code}</span>
              <span className="text-[10px] text-[#8B7355]">{appliedCoupon.desc}</span>
            </div>
            <button
              onClick={() => setAppliedCoupon(null)}
              className="text-red-500 hover:text-red-700 text-xs font-bold"
            >
              Kaldır
            </button>
          </div>
        ) : (
          <form onSubmit={handleApplyCoupon} className="flex gap-2">
            <input
              type="text"
              placeholder="Kupon Kodu (Örn: VETROTA10)"
              value={couponInput}
              onChange={(e) => setCouponInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-slate-50 border border-[#E8DFD3] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30 uppercase"
            />
            <Button
              type="submit"
              className="px-4 py-2 bg-[#C87D55] hover:bg-[#B86B43] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Uygula
            </Button>
          </form>
        )}
      </div>

      {/* 5. Order Summary Card */}
      <div className="bg-white border border-[#E8DFD3] rounded-2xl p-3.5 space-y-2 text-xs shadow-xs">
        <h3 className="font-heading font-extrabold text-xs text-[#2D241E] border-b border-[#F4EFE6] pb-2">
          Sipariş Özeti
        </h3>

        <div className="flex justify-between text-[#8B7355]">
          <span>Ürünler Toplamı</span>
          <span className="font-bold text-[#2D241E]">{cartTotal.toLocaleString("tr-TR")} ₺</span>
        </div>

        <div className="flex justify-between text-[#8B7355]">
          <span>Teslimat Ücreti</span>
          <span className={isFreeShipping ? "font-bold text-emerald-600" : "font-bold text-[#2D241E]"}>
            {isFreeShipping ? "Ücretsiz" : `${deliveryFee} ₺`}
          </span>
        </div>

        {appliedCoupon && (
          <div className="flex justify-between text-emerald-600 font-bold">
            <span>Kupon İndirimi ({appliedCoupon.code})</span>
            <span>-{appliedCoupon.discount.toLocaleString("tr-TR")} ₺</span>
          </div>
        )}

        <div className="border-t border-[#E8DFD3] pt-2 flex justify-between items-center text-sm font-extrabold text-[#2D241E]">
          <span>Toplam Tutar</span>
          <span className="text-base text-[#C87D55]">
            {grandTotal.toLocaleString("tr-TR")} ₺
          </span>
        </div>
      </div>

      {/* 6. Sticky Checkout Bar (Tamamen Bottom Nav'ın Üstünde - bottom-20 / bottom-[72px] z-40) */}
      <div className="fixed bottom-20 left-0 right-0 z-40 max-w-md mx-auto px-4 pointer-events-none">
        <div className="bg-[#2D241E] text-white rounded-2xl p-3 shadow-[0_10px_25px_rgba(0,0,0,0.4)] border border-white/10 flex items-center justify-between gap-3 pointer-events-auto backdrop-blur-md">
          <div className="min-w-0">
            <div className="text-[10px] text-gray-300">Ödenecek Tutar</div>
            <div className="text-base sm:text-lg font-extrabold text-[#F5EFE6] leading-tight truncate">
              {grandTotal.toLocaleString("tr-TR")} ₺
            </div>
          </div>

          <Button
            onClick={() => setIsCheckoutOpen(true)}
            className="px-5 sm:px-6 py-3 bg-[#C87D55] hover:bg-[#B86B43] text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-lg active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>Sepeti Onayla</span>
            <ChevronRight className="w-4 h-4 stroke-[3]" />
          </Button>
        </div>
      </div>

      {/* 7. Checkout Step Modal (Adres & Sipariş Onayı) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-heading font-extrabold text-sm text-[#2D241E]">
                  Siparişi Onayla & Adres Seçimi
                </h2>
                <p className="text-[10px] text-[#8B7355]">
                  Teslimat detaylarınızı kontrol ediniz
                </p>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1. Delivery Address Selection */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[#2D241E] flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C87D55]" />
                  Teslimat Adresi
                </label>
                <button
                  type="button"
                  onClick={() => setIsNewAddressFormOpen(!isNewAddressFormOpen)}
                  className="text-[10px] font-bold text-[#C87D55] hover:underline"
                >
                  {isNewAddressFormOpen ? "Vazgeç" : "+ Yeni Adres"}
                </button>
              </div>

              {isNewAddressFormOpen ? (
                <form onSubmit={handleSaveQuickAddress} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <input
                    type="text"
                    placeholder="Adres Başlığı (Örn: Evim, Ofis)"
                    value={newAddrTitle}
                    onChange={(e) => setNewAddrTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Cadde / Sokak / No"
                    value={newAddrStreet}
                    onChange={(e) => setNewAddrStreet(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Bina No"
                      value={newAddrBuilding}
                      onChange={(e) => setNewAddrBuilding(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                    />
                    <input
                      type="text"
                      placeholder="Daire No"
                      value={newAddrApartment}
                      onChange={(e) => setNewAddrApartment(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl"
                    />
                  </div>
                  <Button type="submit" className="w-full py-2 bg-[#C87D55] text-white text-xs font-bold rounded-xl">
                    Adresi Kaydet & Kullan
                  </Button>
                </form>
              ) : (
                <div className="space-y-1.5">
                  {addresses.length > 0 ? (
                    addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-start gap-2 transition-all ${
                          selectedAddressId === addr.id
                            ? "bg-[#FAF7F2] border-[#C87D55] ring-2 ring-[#C87D55]/20 font-medium"
                            : "bg-white border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5 ${
                          selectedAddressId === addr.id ? "border-[#C87D55] bg-[#C87D55]" : "border-slate-300"
                        }`}>
                          {selectedAddressId === addr.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </div>
                        <div>
                          <span className="font-bold text-[#2D241E] block">{addr.title}</span>
                          <span className="text-[11px] text-slate-500">{addr.fullAddress}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                      <span>{selectedRegion.name}, {selectedRegion.district}</span>
                      <button
                        onClick={() => setIsNewAddressFormOpen(true)}
                        className="text-[10px] font-bold text-[#C87D55] underline ml-2"
                      >
                        Detay Ekle
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Payment Method */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#2D241E] flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[#C87D55]" />
                Ödeme Yöntemi
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "Kredi Kartı (Kapıda)", label: "Kapıda Kart", icon: CreditCard },
                  { id: "Nakit (Kapıda)", label: "Kapıda Nakit", icon: Banknote },
                  { id: "Online Kredi Kartı", label: "Online Ödeme", icon: ShieldCheck },
                ].map((pay) => {
                  const Icon = pay.icon;
                  const isSel = selectedPayment === pay.id;
                  return (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setSelectedPayment(pay.id as any)}
                      className={`p-2.5 rounded-xl border text-center text-[10px] font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                        isSel
                          ? "bg-[#FAF7F2] text-[#C87D55] border-[#C87D55] ring-2 ring-[#C87D55]/20 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{pay.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Order Notes */}
            <div className="space-y-1">
              <label className="text-xs font-extrabold text-[#2D241E]">
                Kurye & Sipariş Notu (Opsiyonel)
              </label>
              <input
                type="text"
                placeholder="Örn: Zili çalmayın, kapıya bırakın..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C87D55]/30"
              />
            </div>

            {/* 4. Total & Submit */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="text-slate-600 font-medium">Toplam Tutar:</span>
                <span className="text-base font-extrabold text-[#C87D55]">
                  {grandTotal.toLocaleString("tr-TR")} ₺
                </span>
              </div>

              <Button
                onClick={handleCompleteOrder}
                disabled={isSubmittingOrder}
                className="w-full py-3.5 bg-[#C87D55] hover:bg-[#B86B43] text-white font-extrabold rounded-2xl text-xs shadow-lg active:scale-95 transition-all"
              >
                {isSubmittingOrder ? "Siparişiniz Oluşturuluyor..." : "Siparişi Tamamla 📦"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
