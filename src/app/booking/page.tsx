"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { SERVICES_LIST, TIME_SLOTS, SUPPORTED_REGIONS } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Check,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ALL_SERVICES } from "@/lib/services-data";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const paramFromUrl =
    searchParams.get("serviceId") ||
    searchParams.get("service") ||
    searchParams.get("hizmetId") ||
    "evde-genel-muayene";

  const {
    addresses,
    addAddress,
    pets,
    addPet,
    selectedRegion,
    bookAppointment,
    appointments,
    showToast,
  } = useApp();

  // Selected state
  const [selectedServiceId, setSelectedServiceId] = useState<string>(paramFromUrl);
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || "");
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || "");
  
  // Synchronize state dynamically whenever URL searchParams change
  useEffect(() => {
    const activeParam =
      searchParams.get("serviceId") ||
      searchParams.get("service") ||
      searchParams.get("hizmetId");
    if (activeParam) {
      setSelectedServiceId(activeParam);
    }
  }, [searchParams]);

  // Date & Time
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [selectedDate, setSelectedDate] = useState<string>(
    tomorrow.toISOString().split("T")[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>("11:00");
  const [userNotes, setUserNotes] = useState("");

  // Modals & States
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);
  const [bookedApptId, setBookedApptId] = useState<string>("");

  // New address form state
  const [newAddrTitle, setNewAddrTitle] = useState("Evim");
  const [newAddrStreet, setNewAddrStreet] = useState("");
  const [newAddrBuilding, setNewAddrBuilding] = useState("");
  const [newAddrApartment, setNewAddrApartment] = useState("");
  const [newAddrDistrict, setNewAddrDistrict] = useState(selectedRegion.district);
  const [newAddrNeighborhood, setNewAddrNeighborhood] = useState(selectedRegion.name);

  // New pet form state
  const [newPetName, setNewPetName] = useState("");
  const [newPetSpecies, setNewPetSpecies] = useState<"Kedi" | "Köpek">("Kedi");
  const [newPetBreed, setNewPetBreed] = useState("");

  // Match selected service from ALL_SERVICES or fallback to SERVICES_LIST
  const matchedService = ALL_SERVICES.find(
    (s) => s.id === selectedServiceId || s.id.includes(selectedServiceId) || selectedServiceId.includes(s.id)
  );

  const fallbackService = SERVICES_LIST.find(
    (s) => s.id === selectedServiceId || s.id.includes(selectedServiceId)
  ) || SERVICES_LIST[0];

  const customServicesParam = searchParams.get("services");
  const customTotalParam = searchParams.get("total");

  const currentService = {
    id: matchedService?.id || fallbackService.id,
    name: customServicesParam || matchedService?.title || fallbackService.name,
    price: customTotalParam ? parseFloat(customTotalParam) : (matchedService?.price || fallbackService.price),
    duration: customServicesParam ? "60 dk (Çoklu Hizmet)" : (matchedService?.duration || `${fallbackService.durationMin} dk`),
    description: customServicesParam ? "Seçilen evde sağlık hizmetleri kombini kapınızda uygulanacaktır." : (matchedService?.shortDesc || fallbackService.description),
    image: matchedService?.image,
    badge: customServicesParam ? "Kombin Hizmet" : matchedService?.badge,
    categoryName: matchedService?.categoryName || "Evde Sağlık Hizmeti",
  };

  // Check if date & time is occupied
  const isSlotOccupied = (date: string, time: string) => {
    return appointments.some(
      (a) => a.date === date && a.time === time && a.status !== "CANCELLED"
    );
  };

  // Generate 7 upcoming days for calendar picker
  const upcomingDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    const iso = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("tr-TR", { weekday: "short" });
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString("tr-TR", { month: "short" });
    return { iso, dayName, dayNum, monthName };
  });

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrStreet.trim()) {
      showToast("Lütfen cadde/sokak adresinizi giriniz.", "warning");
      return;
    }

    addAddress({
      title: newAddrTitle,
      district: newAddrDistrict,
      neighborhood: newAddrNeighborhood,
      street: newAddrStreet,
      buildingNo: newAddrBuilding,
      apartmentNo: newAddrApartment,
      fullAddress: `${newAddrStreet} No:${newAddrBuilding || "-"} D:${newAddrApartment || "-"} ${newAddrNeighborhood} / ${newAddrDistrict}`,
      isDefault: addresses.length === 0,
    });

    setIsAddressModalOpen(false);
    setTimeout(() => {
      if (addresses.length > 0) setSelectedAddressId(addresses[0].id);
    }, 100);
  };

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPetName.trim()) {
      showToast("Lütfen evcil hayvanınızın adını giriniz.", "warning");
      return;
    }

    addPet({
      name: newPetName,
      species: newPetSpecies,
      breed: newPetBreed || "Bilinmiyor",
      age: 2,
    });

    setIsPetModalOpen(false);
    setNewPetName("");
  };

  const handleConfirmBooking = () => {
    if (addresses.length === 0) {
      showToast("Lütfen devam etmeden önce bir adres kaydediniz.", "warning");
      setIsAddressModalOpen(true);
      return;
    }

    if (!selectedTime) {
      showToast("Lütfen bir randevu saati seçiniz.", "warning");
      return;
    }

    if (isSlotOccupied(selectedDate, selectedTime)) {
      showToast("Bu saat için randevu daha önce alınmıştır. Lütfen başka bir saat seçin.", "warning");
      return;
    }

    setIsSubmitting(true);

    const result = bookAppointment({
      serviceId: currentService.id,
      date: selectedDate,
      time: selectedTime,
      petId: selectedPetId || undefined,
      addressId: selectedAddressId || addresses[0]?.id,
      type: "home",
      userNotes,
    });

    setIsSubmitting(false);

    if (result.success && result.appointment) {
      setBookedApptId(result.appointment.id);
      setIsBookedSuccess(true);
    }
  };

  if (isBookedSuccess) {
    return (
      <div className="py-6 text-center space-y-5 animate-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-full bg-[#6B7B3C]/15 border border-[#6B7B3C]/30 text-[#6B7B3C] mx-auto flex items-center justify-center shadow-md">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1.5">
          <h2 className="text-2xl font-heading font-extrabold text-[#2D241E]">
            Randevunuz Onaylandı! 🎉
          </h2>
          <p className="text-xs text-[#5C3D2E]">
            Hekimimiz randevu saatinizde kapınızda olacaktır.
          </p>
        </div>

        <div className="bg-white border border-[#E8DFD3] rounded-2xl p-4 text-left space-y-2.5 shadow-sm text-xs">
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-2">
            <span className="text-[#8B7355]">Hizmet:</span>
            <span className="font-heading font-bold text-[#2D241E]">
              {currentService.name}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-2">
            <span className="text-[#8B7355]">Tarih & Saat:</span>
            <span className="font-bold text-[#C67B5C]">
              {selectedDate} • {selectedTime}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-2">
            <span className="text-[#8B7355]">Hizmet Türü:</span>
            <span className="font-semibold text-[#2D241E]">
              🏡 Evde Ziyaret
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[#8B7355]">Toplam Tutar:</span>
            <span className="text-base font-heading font-extrabold text-[#C67B5C]">
              {formatPrice(currentService.price)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            onClick={() => router.push("/account?tab=appointments")}
            className="w-full bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs h-10 shadow-sm"
          >
            Randevularımı Görüntüle
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="w-full border-[#E8DFD3] text-[#2D241E] rounded-xl font-semibold text-xs h-10"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-2.5">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8B7355] hover:text-[#C67B5C]"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Geri Dön
          </button>
          <h1 className="text-lg font-heading font-extrabold text-[#2D241E]">
            Randevu Oluştur
          </h1>
        </div>
        <div className="text-right">
          <span className="text-[10px] text-[#8B7355] block">Toplam:</span>
          <span className="text-lg font-heading font-extrabold text-[#C67B5C]">
            {formatPrice(currentService.price)}
          </span>
        </div>
      </div>

      {/* 1. Selected Service Highlight Banner */}
      <section className="bg-white border-2 border-[#C67B5C]/40 rounded-2xl p-3 shadow-sm space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#C67B5C] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            1. Seçili Hizmet
          </span>
          <span className="text-xs font-heading font-extrabold text-[#C67B5C]">
            {formatPrice(currentService.price)}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {currentService.image && (
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#F4EFE6] flex-shrink-0 shadow-sm border border-[#E8DFD3]">
              <img
                src={currentService.image}
                alt={currentService.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-heading font-bold text-xs sm:text-sm text-[#2D241E] truncate">
                {currentService.name}
              </h3>
              {currentService.badge && (
                <span className="text-[9px] font-bold bg-[#E11D48]/10 text-[#E11D48] px-1.5 py-0.2 rounded-full flex-shrink-0">
                  {currentService.badge}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#5C3D2E]/80 line-clamp-1 mt-0.5">
              {currentService.description}
            </p>
            <span className="text-[9px] font-semibold text-[#6B7B3C] block mt-0.5">
              🏡 Evde Ziyaret • ⏱️ {currentService.duration}
            </span>
          </div>
        </div>

        {/* Change Service Horizontal Slider */}
        <div className="pt-2 border-t border-[#F4EFE6]">
          <span className="text-[10px] text-[#8B7355] font-semibold block mb-1.5">
            Diğer Hizmetler:
          </span>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {ALL_SERVICES.map((srv) => {
              const isSelected = srv.id === currentService.id;
              return (
                <button
                  key={srv.id}
                  type="button"
                  onClick={() => setSelectedServiceId(srv.id)}
                  className={`px-2.5 py-1.5 rounded-xl text-left border transition-all flex-shrink-0 text-xs flex items-center gap-2 ${
                    isSelected
                      ? "bg-[#C67B5C] text-white border-[#C67B5C] shadow-sm font-bold"
                      : "bg-[#FDFBF7] border-[#E8DFD3] text-[#2D241E] hover:border-[#C67B5C]"
                  }`}
                >
                  <span className="text-[11px] truncate max-w-[130px]">{srv.title}</span>
                  <span className={`text-[10px] font-extrabold ${isSelected ? "text-white" : "text-[#C67B5C]"}`}>
                    {srv.price} ₺
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Address Check & Select */}
      <section className="bg-white border border-[#E8DFD3] rounded-2xl p-3 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B7355] flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#C67B5C]" />
            2. Evde Hizmet Adresi
          </h2>

          <button
            onClick={() => setIsAddressModalOpen(true)}
            className="text-[10px] font-bold text-[#C67B5C] hover:underline flex items-center gap-0.5"
          >
            <Plus className="w-3 h-3" />
            Yeni Adres
          </button>
        </div>

        {addresses.length === 0 ? (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-[#B91C1C] font-semibold text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Sisteme kayıtlı adresiniz bulunmamaktadır.</span>
            </div>
            <Button
              onClick={() => setIsAddressModalOpen(true)}
              className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-[11px] h-8 px-3"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Adres Ekle
            </Button>
          </div>
        ) : (
          <div className="space-y-1.5">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr.id || (selectedAddressId === "" && addr.id === addresses[0]?.id);
              return (
                <div
                  key={addr.id}
                  onClick={() => setSelectedAddressId(addr.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-[#FFF5EB] border-[#C67B5C] shadow-sm font-semibold"
                      : "bg-[#FDFBF7] border-[#E8DFD3] text-[#2D241E]"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isSelected ? "bg-[#C67B5C] text-white" : "bg-[#F4EFE6] text-[#8B7355]"}`}>
                      <MapPin className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <span className="font-bold block truncate text-[11px]">{addr.title}</span>
                      <span className="text-[10px] text-[#8B7355] block truncate">{addr.fullAddress}</span>
                    </div>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#C67B5C] flex-shrink-0 ml-1" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 3. Pet Selection */}
      <section className="bg-white border border-[#E8DFD3] rounded-2xl p-3 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B7355] flex items-center gap-1.5">
            <span>🐾</span>
            3. Patili Dostunuz
          </h2>

          <button
            onClick={() => setIsPetModalOpen(true)}
            className="text-[10px] font-bold text-[#C67B5C] hover:underline flex items-center gap-0.5"
          >
            <Plus className="w-3 h-3" />
            Dost Ekle
          </button>
        </div>

        {pets.length === 0 ? (
          <div className="p-3 rounded-xl bg-[#FFF8F0] border border-dashed border-[#C67B5C]/40 flex items-center justify-between">
            <span className="text-[11px] text-[#8B7355]">Kayıtlı patili dostunuz yok.</span>
            <Button
              onClick={() => setIsPetModalOpen(true)}
              size="sm"
              className="bg-[#C67B5C] text-white text-[10px] font-bold rounded-xl h-7 px-2.5"
            >
              + Ekle
            </Button>
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {pets.map((p) => {
              const isSelected = selectedPetId === p.id || (selectedPetId === "" && p.id === pets[0]?.id);
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPetId(p.id)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all flex items-center gap-2 flex-shrink-0 ${
                    isSelected
                      ? "bg-[#FFF5EB] border-[#C67B5C] shadow-sm font-semibold"
                      : "bg-[#FDFBF7] border-[#E8DFD3] text-[#2D241E]"
                  }`}
                >
                  <span className="text-lg">{p.species === "Köpek" ? "🐶" : "🐱"}</span>
                  <div>
                    <span className="font-bold block text-[11px]">{p.name}</span>
                    <span className="text-[9px] text-[#8B7355] block">{p.breed || p.species}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Date & Time Selection */}
      <section className="bg-white border border-[#E8DFD3] rounded-2xl p-3 shadow-sm space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#8B7355] flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#C67B5C]" />
          4. Tarih ve Saat Seçimi
        </h2>

        {/* Date Selector Pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {upcomingDays.map((d) => {
            const isSelected = selectedDate === d.iso;
            return (
              <button
                key={d.iso}
                type="button"
                onClick={() => setSelectedDate(d.iso)}
                className={`flex-1 min-w-[58px] py-2 rounded-xl text-center border transition-all ${
                  isSelected
                    ? "bg-[#C67B5C] text-white border-[#C67B5C] shadow-sm font-bold"
                    : "bg-[#FDFBF7] border-[#E8DFD3] text-[#2D241E] hover:border-[#C67B5C]/50"
                }`}
              >
                <span className="text-[9px] block uppercase font-medium opacity-90">{d.dayName}</span>
                <span className="text-sm font-heading font-extrabold block my-0.5">{d.dayNum}</span>
                <span className="text-[9px] block opacity-80">{d.monthName}</span>
              </button>
            );
          })}
        </div>

        {/* Time Slot Chips */}
        <div>
          <span className="text-[10px] font-bold text-[#8B7355] block mb-1.5">
            Müsait Saat Dilimi:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {TIME_SLOTS.slice(0, 6).map((slot) => {
              const isSelected = selectedTime === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 rounded-xl text-center text-xs border transition-all ${
                    isSelected
                      ? "bg-[#6B7B3C] text-white border-[#6B7B3C] shadow-sm font-bold"
                      : "bg-[#FDFBF7] border-[#E8DFD3] text-[#2D241E] hover:border-[#6B7B3C]/50"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Notes & Confirmation */}
      <section className="bg-white border border-[#E8DFD3] rounded-2xl p-3 shadow-sm space-y-3">
        <div>
          <label className="text-[10px] font-bold text-[#2D241E] block mb-1">
            Hekime Notunuz (Opsiyonel):
          </label>
          <input
            type="text"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
            placeholder="Örn: Dostum aşıdan korkabilir, zil çalmayın..."
            className="w-full text-xs p-2.5 rounded-xl border border-[#E8DFD3] bg-[#FDFBF7] outline-none focus:border-[#C67B5C]"
          />
        </div>

        <Button
          onClick={handleConfirmBooking}
          disabled={isSubmitting}
          className="w-full bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs h-11 shadow-md gap-2 active:scale-98 transition-transform"
        >
          {isSubmitting ? "Randevu Oluşturuluyor..." : `Randevuyu Onayla (${formatPrice(currentService.price)})`}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </section>

      {/* Add Address Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-heading font-extrabold text-[#2D241E]">
              Yeni Adres Ekle
            </h3>
            <form onSubmit={handleSaveAddress} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] font-bold block mb-1">Adres Başlığı</label>
                <input
                  type="text"
                  value={newAddrTitle}
                  onChange={(e) => setNewAddrTitle(e.target.value)}
                  placeholder="Ev, İş, Yazlık vb."
                  className="w-full p-2 rounded-lg border border-[#E8DFD3] bg-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1">Cadde / Sokak / Açık Adres</label>
                <input
                  type="text"
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  placeholder="Bağdat Cad. No:12 D:4"
                  className="w-full p-2 rounded-lg border border-[#E8DFD3] bg-white outline-none"
                  required
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="flex-1 text-xs h-8 rounded-lg"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#C67B5C] text-white text-xs h-8 rounded-lg font-bold"
                >
                  Kaydet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Pet Modal */}
      {isPetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-2xl w-full max-w-sm p-5 shadow-2xl space-y-3">
            <h3 className="text-sm font-heading font-extrabold text-[#2D241E]">
              Patili Dost Ekle
            </h3>
            <form onSubmit={handleSavePet} className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10px] font-bold block mb-1">Dostunuzun Adı</label>
                <input
                  type="text"
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  placeholder="Pamuk, Karabaş vb."
                  className="w-full p-2 rounded-lg border border-[#E8DFD3] bg-white outline-none"
                  required
                />
              </div>
              <div>
                <label className="text-[10px] font-bold block mb-1">Türü</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNewPetSpecies("Kedi")}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                      newPetSpecies === "Kedi" ? "bg-[#C67B5C] text-white border-[#C67B5C]" : "bg-white border-[#E8DFD3]"
                    }`}
                  >
                    🐱 Kedi
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewPetSpecies("Köpek")}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-bold ${
                      newPetSpecies === "Köpek" ? "bg-[#C67B5C] text-white border-[#C67B5C]" : "bg-white border-[#E8DFD3]"
                    }`}
                  >
                    🐶 Köpek
                  </button>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPetModalOpen(false)}
                  className="flex-1 text-xs h-8 rounded-lg"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#C67B5C] text-white text-xs h-8 rounded-lg font-bold"
                >
                  Kaydet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-[#8B7355]">
          Randevu ekranı yükleniyor...
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  );
}
