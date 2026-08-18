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
  Home,
  Video,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselectedServiceId = searchParams.get("service") || "evde-muayene";

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
  const [selectedServiceId, setSelectedServiceId] = useState(preselectedServiceId);
  const [selectedPetId, setSelectedPetId] = useState<string>(pets[0]?.id || "");
  const [selectedAddressId, setSelectedAddressId] = useState<string>(addresses[0]?.id || "");
  
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

  const currentService = SERVICES_LIST.find((s) => s.id === selectedServiceId) || SERVICES_LIST[0];
  const isHomeService = currentService.category === "home";

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
    // Set selected to newly added address
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
    // Validation: Home service requires address
    if (isHomeService && addresses.length === 0) {
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
      addressId: isHomeService ? selectedAddressId || addresses[0]?.id : undefined,
      type: currentService.category,
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
      <div className="max-w-lg mx-auto py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
        <div className="w-20 h-20 rounded-full bg-[#6B7B3C]/15 border border-[#6B7B3C]/30 text-[#6B7B3C] mx-auto flex items-center justify-center shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-heading font-extrabold text-[#2D241E]">
            Randevunuz Onaylandı! 🎉
          </h2>
          <p className="text-sm text-[#5C3D2E]">
            Hekimimiz randevu saatinizde belirtilen adreste hazır olacaktır.
          </p>
        </div>

        <div className="bg-white border border-[#E8DFD3] rounded-[22px] p-6 text-left space-y-3 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3">
            <span className="text-xs text-[#8B7355]">Hizmet:</span>
            <span className="font-heading font-bold text-[#2D241E]">
              {currentService.name}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3">
            <span className="text-xs text-[#8B7355]">Tarih & Saat:</span>
            <span className="font-bold text-[#C67B5C]">
              {selectedDate} • {selectedTime}
            </span>
          </div>
          <div className="flex items-center justify-between border-b border-[#F4EFE6] pb-3">
            <span className="text-xs text-[#8B7355]">Tür:</span>
            <span className="text-xs font-semibold text-[#2D241E]">
              {isHomeService ? "🏡 Evde Ziyaret" : "💻 Online Görüşme"}
            </span>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-[#8B7355]">Ücret:</span>
            <span className="text-lg font-heading font-extrabold text-[#2D241E]">
              {formatPrice(currentService.price)}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => router.push("/account")}
            className="flex-1 bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl"
          >
            Randevularımı Görüntüle
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/")}
            className="flex-1 border-[#E8DFD3] text-[#2D241E] rounded-xl font-semibold"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B7355] hover:text-[#C67B5C] mb-1"
          >
            <ChevronLeft className="w-4 h-4" />
            Geri Dön
          </button>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2D241E]">
            Randevu Oluştur
          </h1>
        </div>
        <div className="text-right">
          <span className="text-xs text-[#8B7355] block">Toplam Tutar:</span>
          <span className="text-2xl font-heading font-extrabold text-[#C67B5C]">
            {formatPrice(currentService.price)}
          </span>
        </div>
      </div>

      {/* 1. Service Selection */}
      <section className="bg-white border border-[#E8DFD3] rounded-[22px] p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#8B7355] flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-[#C67B5C]" />
          1. Hizmet Seçimi
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {SERVICES_LIST.map((srv) => {
            const isSelected = srv.id === selectedServiceId;
            return (
              <button
                key={srv.id}
                onClick={() => setSelectedServiceId(srv.id)}
                className={`p-3 rounded-[16px] text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-[#C67B5C]/10 border-[#C67B5C] shadow-sm"
                    : "bg-[#FDFBF7] border-[#E8DFD3] hover:border-[#C67B5C]/50"
                }`}
              >
                <div>
                  <span className="text-xs font-bold text-[#2D241E] block line-clamp-1">
                    {srv.name}
                  </span>
                  <span className="text-[10px] text-[#8B7355]">
                    {srv.category === "home" ? "🏡 Evde" : "💻 Online"} • {srv.durationMin} dk
                  </span>
                </div>
                <span className="text-xs font-heading font-extrabold text-[#C67B5C] mt-2">
                  {formatPrice(srv.price)}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 2. Address Check & Notice (Crucial requirement) */}
      {isHomeService && (
        <section className="bg-white border border-[#E8DFD3] rounded-[22px] p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#8B7355] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C67B5C]" />
              2. Evde Hizmet Adresi
            </h2>

            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="text-xs font-bold text-[#C67B5C] hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Adres Ekle
            </button>
          </div>

          {addresses.length === 0 ? (
            /* User prompt requirement: "sisteme kayıtlı herhangi bir adresiniz bulunmamaktadır. lütfen adresinizi kaydediniz." */
            <div className="p-4 rounded-[16px] bg-[#FEF2F2] border border-[#FCA5A5] text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-[#B91C1C] font-semibold text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>
                  Sisteme kayıtlı herhangi bir adresiniz bulunmamaktadır. Lütfen adresinizi kaydediniz.
                </span>
              </div>
              <p className="text-xs text-[#7F1D1D]">
                Evde veteriner hekim ziyareti gerçekleştirebilmemiz için açık adres bilgisi gereklidir.
              </p>
              <Button
                onClick={() => setIsAddressModalOpen(true)}
                className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs"
              >
                <Plus className="w-4 h-4 mr-1" />
                Adres Ekle
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {addresses.map((addr) => {
                const isSelected = selectedAddressId === addr.id;
                return (
                  <button
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3.5 rounded-[16px] text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#C67B5C]/10 border-[#C67B5C] shadow-sm"
                        : "bg-[#FDFBF7] border-[#E8DFD3] hover:border-[#C67B5C]/50"
                    }`}
                  >
                    <div>
                      <div className="font-bold text-sm text-[#2D241E] flex items-center gap-1.5">
                        <Home className="w-3.5 h-3.5 text-[#C67B5C]" />
                        {addr.title}
                      </div>
                      <div className="text-xs text-[#8B7355] mt-0.5 line-clamp-1">
                        {addr.fullAddress}
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#C67B5C] text-white flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* 3. Pet Selection */}
      <section className="bg-white border border-[#E8DFD3] rounded-[22px] p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#8B7355] flex items-center gap-2">
            <span>🐾</span>
            {isHomeService ? "3." : "2."} Patili Dostunuz
          </h2>
          <button
            onClick={() => setIsPetModalOpen(true)}
            className="text-xs font-bold text-[#C67B5C] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            Dost Ekle
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {pets.map((pet) => {
            const isSelected = selectedPetId === pet.id;
            return (
              <button
                key={pet.id}
                onClick={() => setSelectedPetId(pet.id)}
                className={`p-3 rounded-[16px] text-left border transition-all flex items-center gap-3 ${
                  isSelected
                    ? "bg-[#C67B5C]/10 border-[#C67B5C] shadow-sm"
                    : "bg-[#FDFBF7] border-[#E8DFD3] hover:border-[#C67B5C]/50"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8DFD3] flex items-center justify-center text-xl shadow-inner">
                  {pet.species === "Köpek" ? "🐶" : "🐱"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-[#2D241E] truncate">
                    {pet.name}
                  </div>
                  <div className="text-[11px] text-[#8B7355] truncate">
                    {pet.species} • {pet.breed || "Kırma"}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Calendar & Time Slot Picker */}
      <section className="bg-white border border-[#E8DFD3] rounded-[22px] p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#8B7355] flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#C67B5C]" />
          {isHomeService ? "4." : "3."} Tarih ve Saat Seçimi
        </h2>

        {/* 7-Day Quick Strip */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-[#5C3D2E] block">
            Randevu Günü:
          </span>
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {upcomingDays.map((day) => {
              const isSelected = selectedDate === day.iso;
              return (
                <button
                  key={day.iso}
                  onClick={() => setSelectedDate(day.iso)}
                  className={`py-3 px-1 rounded-[16px] text-center border transition-all flex flex-col items-center justify-center ${
                    isSelected
                      ? "bg-[#C67B5C] text-white border-[#C67B5C] shadow-md scale-105"
                      : "bg-[#FDFBF7] border-[#E8DFD3] text-[#2D241E] hover:border-[#C67B5C]/50"
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                    {day.dayName}
                  </span>
                  <span className="text-base sm:text-lg font-heading font-extrabold my-0.5">
                    {day.dayNum}
                  </span>
                  <span className="text-[9px] opacity-75">{day.monthName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slot Grid */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#5C3D2E]">
              Müsait Saat Dilimleri:
            </span>
            <div className="flex items-center gap-3 text-[11px] text-[#8B7355]">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#6B7B3C]" /> Müsait
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#E8DFD3]" /> Dolu (Erişilemez)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {TIME_SLOTS.map((time) => {
              const occupied = isSlotOccupied(selectedDate, time);
              const isSelected = selectedTime === time && !occupied;

              return (
                <button
                  key={time}
                  disabled={occupied}
                  onClick={() => setSelectedTime(time)}
                  className={`py-2.5 px-2 rounded-[12px] text-xs font-bold transition-all ${
                    occupied
                      ? "bg-[#F4EFE6] text-[#A89F91] border border-dashed border-[#E8DFD3] cursor-not-allowed line-through"
                      : isSelected
                      ? "bg-[#C67B5C] text-white shadow-sm scale-105 border border-[#C67B5C]"
                      : "bg-[#FDFBF7] text-[#2D241E] border border-[#E8DFD3] hover:border-[#C67B5C] hover:bg-white"
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. User Notes (Optional) */}
      <section className="bg-white border border-[#E8DFD3] rounded-[22px] p-5 shadow-sm space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-[#8B7355] block">
          Hekime İletmek İstediğiniz Notlar (Opsiyonel):
        </label>
        <textarea
          rows={2}
          value={userNotes}
          onChange={(e) => setUserNotes(e.target.value)}
          placeholder="Dostunuzun şikayetleri, geçmiş ameliyatları veya hekime özel notunuz..."
          className="w-full p-3 rounded-[14px] bg-[#FDFBF7] border border-[#E8DFD3] text-sm text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#C67B5C]/30 resize-none"
        />
      </section>

      {/* Bottom Booking Summary & Trigger */}
      <div className="bg-[#FFFDF9] border border-[#E8DFD3] rounded-[22px] p-5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-[#8B7355]">Randevu Özeti:</div>
          <div className="font-heading font-bold text-base text-[#2D241E]">
            {currentService.name} • {selectedDate} ({selectedTime})
          </div>
          <div className="text-xs text-[#6B7B3C] flex items-center gap-1 mt-0.5 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Randevu sonrasında saat dilimi kilitlenecektir.
          </div>
        </div>

        <Button
          onClick={handleConfirmBooking}
          disabled={isSubmitting}
          className="w-full sm:w-auto bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl h-12 px-8 text-sm gap-2 shadow-md hover:scale-[0.98]"
        >
          {isSubmitting ? "Kaydediliyor..." : "Randevuyu Onayla"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Address Add Modal */}
      {isAddressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-[24px] w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-heading font-bold text-[#2D241E] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C67B5C]" />
              Yeni Adres Kaydet
            </h3>
            <p className="text-xs text-[#8B7355]">
              Bu adres profilinizdeki adreslerime kaydedilecek ve hekime iletilecektir.
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">
                  Adres Başlığı:
                </label>
                <Input
                  value={newAddrTitle}
                  onChange={(e) => setNewAddrTitle(e.target.value)}
                  placeholder="Örn: Evim, Yazlık, Annemin Evi"
                  className="rounded-xl border-[#E8DFD3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">
                    İlçe:
                  </label>
                  <select
                    value={newAddrDistrict}
                    onChange={(e) => setNewAddrDistrict(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E]"
                  >
                    <option value="Kadıköy">Kadıköy</option>
                    <option value="Maltepe">Maltepe</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">
                    Mahalle:
                  </label>
                  <select
                    value={newAddrNeighborhood}
                    onChange={(e) => setNewAddrNeighborhood(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E]"
                  >
                    {SUPPORTED_REGIONS.filter((r) => r.district === newAddrDistrict).map(
                      (r) => (
                        <option key={r.id} value={r.name}>
                          {r.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">
                  Cadde / Sokak / Açık Adres:
                </label>
                <Input
                  value={newAddrStreet}
                  onChange={(e) => setNewAddrStreet(e.target.value)}
                  placeholder="Örn: Fener Kalamış Cad. Çınar Apt."
                  className="rounded-xl border-[#E8DFD3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">
                    Bina No:
                  </label>
                  <Input
                    value={newAddrBuilding}
                    onChange={(e) => setNewAddrBuilding(e.target.value)}
                    placeholder="Örn: 42"
                    className="rounded-xl border-[#E8DFD3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">
                    Daire No:
                  </label>
                  <Input
                    value={newAddrApartment}
                    onChange={(e) => setNewAddrApartment(e.target.value)}
                    placeholder="Örn: 5"
                    className="rounded-xl border-[#E8DFD3]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddressModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs"
                >
                  Adresi Kaydet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pet Add Modal */}
      {isPetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-[24px] w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-heading font-bold text-[#2D241E]">
              Yeni Patili Dost Ekle 🐾
            </h3>

            <form onSubmit={handleSavePet} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">
                  Dostunuzun Adı:
                </label>
                <Input
                  value={newPetName}
                  onChange={(e) => setNewPetName(e.target.value)}
                  placeholder="Örn: Pamuk, Şila, Karamel"
                  className="rounded-xl border-[#E8DFD3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">
                    Tür:
                  </label>
                  <select
                    value={newPetSpecies}
                    onChange={(e) => setNewPetSpecies(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E]"
                  >
                    <option value="Kedi">🐱 Kedi</option>
                    <option value="Köpek">🐶 Köpek</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">
                    Irk (Opsiyonel):
                  </label>
                  <Input
                    value={newPetBreed}
                    onChange={(e) => setNewPetBreed(e.target.value)}
                    placeholder="Örn: Tekir, Golden"
                    className="rounded-xl border-[#E8DFD3]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsPetModalOpen(false)}
                  className="rounded-xl text-xs"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs"
                >
                  Dostumu Kaydet
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
    <Suspense fallback={<div className="p-8 text-center text-[#8B7355]">Yükleniyor...</div>}>
      <BookingContent />
    </Suspense>
  );
}
