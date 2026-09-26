"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { PetItem, AddressItem, AppointmentItem } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  User,
  Calendar,
  Plus,
  Trash2,
  Edit2,
  MapPin,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Phone,
  Mail,
  Shield,
  LogOut,
  Home,
  Check,
  Stethoscope,
  Syringe,
  Package,
  Activity,
  Navigation,
  RefreshCw,
  PhoneCall,
  X,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Helper to convert raw service IDs or names to human-readable Turkish strings
function formatServiceName(rawIdOrName?: string): string {
  if (!rawIdOrName) return "Evde Genel Muayene";
  const str = rawIdOrName.toLowerCase();

  if (str.includes("acil") || str === "evde-acil") return "Evde Acil Durum Hizmeti";
  if (str.includes("muayene") || str === "evde-genel-muayene") return "Evde Genel Muayene";
  if (str.includes("aşı") || str.includes("asi") || str.includes("karma")) return "Evde Karma Aşı Uygulaması";
  if (str.includes("parazit")) return "Evde İç/Dış Parazit Uygulaması";
  if (str.includes("kan") || str.includes("tahlil")) return "Evde Kan Alımı & Tahlil";
  if (str.includes("serum")) return "Evde Serum & Sıvı Tedavisi";
  if (str.includes("tırnak")) return "Evde Tırnak Kesimi & Bakım";
  if (str.includes("mama") || str === "eve-mama") return "Eve Mama Hizmeti";
  if (str.includes("petshop") || str === "eve-petshop") return "Eve Petshop Ürünleri";
  if (str.includes("takviye") || str === "eve-takviye") return "Eve Takviye Ürün Hizmeti";
  if (str.includes("online") || str.includes("davranis")) return "Online Veteriner Danışmanlığı";
  if (str === "evde-saglik") return "Evde Sağlık Hizmetleri";

  return rawIdOrName;
}

// Helper for clean pet info formatting (e.g. "Hasta: Pamuk (Kedi)")
function formatPatientInfo(petName?: string, petSpecies?: string): string {
  const cleanName =
    petName && !petName.toLowerCase().includes("sıkısken") && !petName.toLowerCase().includes("undefined")
      ? petName
      : "Pamuk";
  const cleanSpecies = petSpecies || "Kedi";
  return `Hasta: ${cleanName} (${cleanSpecies})`;
}

// Helper to format Turkish Date and Time (e.g. "2026-09-25", "11:00" -> "Tarih: 25 Eylül 2026 • Saat: 11:00")
function formatTurkishDate(dateStr?: string, timeStr?: string): string {
  let displayDate = dateStr || "25 Eylül 2026";
  if (dateStr && dateStr.includes("-")) {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const months = [
        "Ocak",
        "Şubat",
        "Mart",
        "Nisan",
        "Mayıs",
        "Haziran",
        "Temmuz",
        "Ağustos",
        "Eylül",
        "Ekim",
        "Kasım",
        "Aralık",
      ];
      const day = parseInt(parts[2], 10);
      const monthIdx = parseInt(parts[1], 10) - 1;
      const year = parts[0];
      if (monthIdx >= 0 && monthIdx < 12) {
        displayDate = `${day} ${months[monthIdx]} ${year}`;
      }
    }
  }
  const displayTime = timeStr || "11:00";
  return `Tarih: ${displayDate} • Saat: ${displayTime}`;
}

export default function AccountPage() {
  const router = useRouter();
  const {
    currentUser,
    setCurrentUser,
    role,
    appointments,
    cancelAppointment,
    pets,
    addPet,
    updatePet,
    removePet,
    addresses,
    addAddress,
    removeAddress,
    logout,
    showToast,
  } = useApp();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<"appointments" | "pets" | "addresses">("appointments");

  // Randevularım Filter Tab ("active" | "history")
  const [apptFilter, setApptFilter] = useState<"active" | "history">("active");

  // Doctor Detail Modal state
  const [activeDocModalAppt, setActiveDocModalAppt] = useState<AppointmentItem | null>(null);

  // Pet Modals
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<PetItem | null>(null);
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState<"Kedi" | "Köpek" | "Kuş" | "Tavşan">("Kedi");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState<number>(2);
  const [petWeight, setPetWeight] = useState<number>(4);
  const [petNotes, setPetNotes] = useState("");

  // Address Modals
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [addrTitle, setAddrTitle] = useState("Evim");
  const [addrDistrict, setAddrDistrict] = useState("Kadıköy");
  const [addrNeighborhood, setAddrNeighborhood] = useState("Fenerbahçe");
  const [addrStreet, setAddrStreet] = useState("");
  const [addrBuilding, setAddrBuilding] = useState("");
  const [addrApartment, setAddrApartment] = useState("");

  // Profile Edit
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profName, setProfName] = useState(currentUser.name);
  const [profSurname, setProfSurname] = useState(currentUser.surname || "");
  const [profPhone, setProfPhone] = useState(currentUser.phone || "0532 555 0123");

  // Filter appointments for current user
  const userAppointments = appointments.filter((a) => a.userId === currentUser.id || !a.userId || a.userId === "user-default");

  const activeAppointments = userAppointments.filter(
    (a) => a.status === "CONFIRMED" || a.status === "IN_PROGRESS" || a.status === "PENDING"
  );

  const historyAppointments = userAppointments.filter(
    (a) => a.status === "COMPLETED" || a.status === "CANCELLED"
  );

  const filteredAppointments = apptFilter === "active" ? activeAppointments : historyAppointments;

  const handleSavePet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!petName.trim()) {
      showToast("Lütfen isim giriniz", "warning");
      return;
    }

    if (editingPet) {
      updatePet(editingPet.id, {
        name: petName,
        species: petSpecies,
        breed: petBreed,
        age: Number(petAge),
        weight: Number(petWeight),
        notes: petNotes,
      });
      setEditingPet(null);
    } else {
      addPet({
        name: petName,
        species: petSpecies,
        breed: petBreed || "Kırma",
        age: Number(petAge),
        weight: Number(petWeight),
        notes: petNotes,
      });
      setIsAddPetOpen(false);
    }

    setPetName("");
    setPetBreed("");
    setPetNotes("");
  };

  const handleOpenEditPet = (pet: PetItem) => {
    setEditingPet(pet);
    setPetName(pet.name);
    setPetSpecies(pet.species as any);
    setPetBreed(pet.breed || "");
    setPetAge(pet.age || 1);
    setPetWeight(pet.weight || 3);
    setPetNotes(pet.notes || "");
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet.trim()) {
      showToast("Lütfen cadde/sokak giriniz", "warning");
      return;
    }

    addAddress({
      title: addrTitle,
      district: addrDistrict,
      neighborhood: addrNeighborhood,
      street: addrStreet,
      buildingNo: addrBuilding,
      apartmentNo: addrApartment,
      fullAddress: `${addrStreet} No:${addrBuilding} D:${addrApartment} ${addrNeighborhood} / ${addrDistrict}`,
      isDefault: addresses.length === 0,
    });

    setIsAddAddressOpen(false);
    setAddrStreet("");
    setAddrBuilding("");
    setAddrApartment("");
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name: profName,
      surname: profSurname,
      phone: profPhone,
    }));
    setIsEditingProfile(false);
    showToast("Profil bilgileriniz güncellendi.", "success");
  };

  return (
    <div className="w-full max-w-full overflow-hidden space-y-4 pb-8 animate-in fade-in duration-300">
      {/* 1. USER PROFILE HEADER CARD (Dikey Hiyerarşi & Taşmasız Tam Ekran E-Posta / Telefon & Altta 2 Sütunlu Butonlar) */}
      <section className="flex flex-col p-4 bg-white border border-[#E8DFD3] rounded-2xl shadow-sm w-full max-w-full overflow-hidden gap-3">
        {/* Üst Blok (Profil & İletişim Bilgileri) */}
        <div className="flex flex-col gap-2 w-full">
          {/* İsim Başlığı ve Rozet */}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold text-[#2D241E] whitespace-normal break-words">
              {currentUser.name} {currentUser.surname || "Demir"}
            </h1>
            <Badge variant={role === "VET" ? "success" : "default"} className="text-xs px-2.5 py-0.5 shrink-0">
              {role === "VET" ? "Veteriner Hekim" : "Hasta Sahibi"}
            </Badge>
          </div>

          {/* İletişim Bilgileri Alanı */}
          <div className="flex flex-col gap-1.5 w-full pt-1">
            {/* E-Posta Satırı */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 w-full whitespace-nowrap">
              <Mail className="w-4 h-4 text-[#C87D55] shrink-0" />
              <span className="whitespace-nowrap">{currentUser.email || "kklmqegmk@dumen.com"}</span>
            </div>

            {/* Telefon Satırı */}
            <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600 w-full whitespace-nowrap">
              <Phone className="w-4 h-4 text-[#6B7B3C] shrink-0" />
              <span>{currentUser.phone || "0532 555 0123"}</span>
            </div>
          </div>
        </div>

        {/* Alt Blok (Aksiyon Butonları: 2 Eşit Sütun / Full Width) */}
        <div className="grid grid-cols-2 gap-2 w-full pt-3 border-t border-slate-100">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="w-full text-xs md:text-sm rounded-xl border-[#E8DFD3] text-[#2D241E] hover:bg-[#FAF7F2] gap-1.5 h-9 px-2 sm:px-3"
          >
            <Edit2 className="w-3.5 h-3.5 text-[#C87D55] shrink-0" />
            <span className="truncate">Profili Düzenle</span>
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="w-full text-xs md:text-sm rounded-xl border-[#B91C1C]/20 text-[#B91C1C] hover:bg-[#FEF2F2] gap-1.5 h-9 px-2 sm:px-3"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Çıkış Yap</span>
          </Button>
        </div>
      </section>

      {/* Edit Profile Form Modal */}
      {isEditingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="p-4 sm:p-5 rounded-[20px] bg-[#FFF8F0] border border-[#C87D55]/30 space-y-3 animate-in fade-in duration-200 w-full max-w-full overflow-hidden"
        >
          <h3 className="font-heading font-bold text-sm sm:text-base text-[#2D241E]">
            Profil Bilgilerini Güncelle
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2D241E] block mb-1">Adınız:</label>
              <Input
                value={profName}
                onChange={(e) => setProfName(e.target.value)}
                className="bg-white rounded-xl text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D241E] block mb-1">Soyadınız:</label>
              <Input
                value={profSurname}
                onChange={(e) => setProfSurname(e.target.value)}
                className="bg-white rounded-xl text-xs"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D241E] block mb-1">Telefon:</label>
              <Input
                value={profPhone}
                onChange={(e) => setProfPhone(e.target.value)}
                className="bg-white rounded-xl text-xs"
                required
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditingProfile(false)}
              className="rounded-xl text-xs h-8"
            >
              İptal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#C87D55] hover:bg-[#B86B43] text-white font-bold rounded-xl text-xs h-8"
            >
              Kaydet
            </Button>
          </div>
        </form>
      )}

      {/* 2. MAIN SUB-TABS (Randevularım, Patili Dostlarım, Adreslerim) */}
      <div className="flex items-center gap-1.5 bg-[#F4EFE6] p-1.5 rounded-[18px] border border-[#E8DFD3] overflow-x-auto no-scrollbar w-full max-w-full">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`flex-1 py-2 px-3 rounded-[12px] text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "appointments"
              ? "bg-white text-[#C87D55] shadow-xs"
              : "text-[#8B7355] hover:text-[#2D241E]"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Randevularım ({userAppointments.length})
        </button>

        <button
          onClick={() => setActiveTab("pets")}
          className={`flex-1 py-2 px-3 rounded-[12px] text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "pets"
              ? "bg-white text-[#C87D55] shadow-xs"
              : "text-[#8B7355] hover:text-[#2D241E]"
          }`}
        >
          <span>🐾</span>
          Patili Dostlarım ({pets.length})
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex-1 py-2 px-3 rounded-[12px] text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "addresses"
              ? "bg-white text-[#C87D55] shadow-xs"
              : "text-[#8B7355] hover:text-[#2D241E]"
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          Adreslerim ({addresses.length})
        </button>
      </div>

      {/* TAB 1: APPOINTMENTS REFACTOR */}
      {activeTab === "appointments" && (
        <section className="space-y-3.5 w-full max-w-full overflow-hidden">
          {/* Header & New Appointment Button */}
          <div className="flex items-center justify-between">
            <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#2D241E]">
              Geçmiş & Gelecek Randevularım
            </h2>
            <Button
              size="sm"
              onClick={() => router.push("/services/evde-saglik")}
              className="bg-[#C87D55] hover:bg-[#B86B43] text-white text-xs font-extrabold rounded-xl gap-1 h-8 px-3"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Randevu Al
            </Button>
          </div>

          {/* Sub Filter Switcher: Aktif/Yaklaşan vs Geçmiş & İptaller */}
          <div className="grid grid-cols-2 gap-2 bg-white p-1 rounded-2xl border border-[#E8DFD3] shadow-2xs">
            <button
              onClick={() => setApptFilter("active")}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                apptFilter === "active"
                  ? "bg-[#C87D55] text-white shadow-xs"
                  : "text-[#8B7355] hover:text-[#2D241E]"
              }`}
            >
              <span>🚀 Aktif / Yaklaşan</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                apptFilter === "active" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
              }`}>
                {activeAppointments.length}
              </span>
            </button>

            <button
              onClick={() => setApptFilter("history")}
              className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                apptFilter === "history"
                  ? "bg-[#2D241E] text-white shadow-xs"
                  : "text-[#8B7355] hover:text-[#2D241E]"
              }`}
            >
              <span>📜 Geçmiş & İptaller</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                apptFilter === "history" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-700"
              }`}>
                {historyAppointments.length}
              </span>
            </button>
          </div>

          {/* Filtered Appointments List */}
          {filteredAppointments.length === 0 ? (
            <div className="bg-white border border-[#E8DFD3] rounded-[22px] p-6 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF5EB] text-[#C87D55] flex items-center justify-center mx-auto text-2xl">
                📅
              </div>
              <h3 className="font-heading font-extrabold text-sm text-[#2D241E]">
                {apptFilter === "active"
                  ? "Aktif veya Yaklaşan Randevunuz Bulunmuyor"
                  : "Geçmiş veya İptal Edilen Randevunuz Yok"}
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Evde veteriner muayenesi, aşı takibi veya tahlil randevularınızı hemen oluşturabilirsiniz.
              </p>
              <Button
                onClick={() => router.push("/services/evde-saglik")}
                className="bg-[#C87D55] text-white font-extrabold rounded-xl text-xs h-9 px-4 shadow-sm"
              >
                Hemen Randevu Al 🐾
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appt) => {
                const serviceTitle = formatServiceName(appt.serviceName || appt.serviceId);
                const patientText = formatPatientInfo(appt.petName, appt.petSpecies);
                const dateText = formatTurkishDate(appt.date, appt.time);

                const isCancelled = appt.status === "CANCELLED";
                const isCompleted = appt.status === "COMPLETED";
                const isEmergency = appt.serviceId?.includes("acil") || serviceTitle.includes("Acil");
                const isVaccine = appt.serviceId?.includes("asi") || serviceTitle.includes("Aşı");

                return (
                  <div
                    key={appt.id}
                    className="bg-white border border-[#E8DFD3] hover:border-[#C87D55]/50 rounded-[22px] p-4 shadow-xs space-y-3 transition-all relative overflow-hidden w-full max-w-full"
                  >
                    {/* Top Row: Left Icon Container, Titles & Status Badge */}
                    <div className="flex items-start justify-between gap-2 border-b border-[#F4EFE6] pb-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Soft pastel circular icon box */}
                        <div
                          className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                            isCancelled
                              ? "bg-red-50 text-red-600 border-red-200"
                              : isCompleted
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : isEmergency
                              ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse"
                              : isVaccine
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-[#FFF5EB] text-[#C87D55] border-[#C87D55]/30"
                          }`}
                        >
                          {isEmergency ? (
                            <Activity className="w-5 h-5" />
                          ) : isVaccine ? (
                            <Syringe className="w-5 h-5" />
                          ) : (
                            <Stethoscope className="w-5 h-5" />
                          )}
                        </div>

                        {/* Title & Patient formatting */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading font-extrabold text-sm sm:text-base text-[#2D241E] leading-snug break-words">
                            {serviceTitle}
                          </h3>
                          <p className="text-xs font-semibold text-[#8B7355] mt-0.5 truncate">
                            {patientText}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="shrink-0 ml-1">
                        {isCancelled ? (
                          <span className="bg-red-50 text-red-600 border border-red-200 rounded-full px-3 py-1 text-[11px] font-bold inline-block">
                            İptal Edildi
                          </span>
                        ) : isCompleted ? (
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-1 text-[11px] font-bold inline-block">
                            Tamamlandı ✓
                          </span>
                        ) : (
                          <span className="bg-[#FFF5EB] text-[#C87D55] border border-[#C87D55]/30 rounded-full px-3 py-1 text-[11px] font-extrabold inline-block">
                            {appt.status === "IN_PROGRESS" ? "Hekim Yolda 🚗" : "Onaylandı ✓"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Middle Info: Date & Address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5 truncate">
                        <Calendar className="w-3.5 h-3.5 text-[#C87D55] shrink-0" />
                        <span className="truncate">{dateText}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#6B7B3C] shrink-0" />
                        <span className="truncate">{appt.addressSummary || "Fenerbahçe, Kadıköy (Evde Ziyaret)"}</span>
                      </div>
                    </div>

                    {/* Notes if any */}
                    {appt.userNotes && (
                      <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8DFD3] text-xs text-slate-600 leading-relaxed break-words">
                        <strong className="text-[#2D241E]">Notunuz:</strong> {appt.userNotes}
                      </div>
                    )}

                    {appt.vetNotes && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 leading-relaxed break-words">
                        <strong className="text-emerald-950">Hekim Raporu:</strong> {appt.vetNotes}
                      </div>
                    )}

                    {/* Bottom Action Buttons */}
                    <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-[#C87D55]">
                        {appt.servicePrice ? `${appt.servicePrice} ₺` : "750 ₺"}
                      </span>

                      <div className="flex items-center gap-2">
                        {isCompleted || isCancelled ? (
                          /* Completed/Cancelled -> "Tekrar Randevu Al" */
                          <Button
                            size="sm"
                            onClick={() =>
                              router.push(
                                `/randevu?serviceId=${encodeURIComponent(
                                  appt.serviceId || "evde-saglik"
                                )}&service=${encodeURIComponent(serviceTitle)}`
                              )
                            }
                            className="bg-[#C87D55] hover:bg-[#B86B43] text-white text-xs font-extrabold rounded-xl h-8 px-3 gap-1 shadow-xs"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Tekrar Randevu Al</span>
                          </Button>
                        ) : (
                          /* Active -> "Hekim Konumu / Detay" & "İptal Et" */
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => cancelAppointment(appt.id)}
                              className="text-xs text-red-600 border-red-200 hover:bg-red-50 h-8 rounded-xl px-2.5"
                            >
                              İptal Et
                            </Button>

                            <Button
                              size="sm"
                              onClick={() => setActiveDocModalAppt(appt)}
                              className="bg-[#2D241E] hover:bg-black text-white text-xs font-extrabold rounded-xl h-8 px-3 gap-1 shadow-xs"
                            >
                              <Navigation className="w-3 h-3 text-[#C87D55]" />
                              <span>Hekim Konumu / Detay</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: PETS MANAGEMENT (Tek Sütun Tam Genişlik Mimarisi - Pamuk, Duman, Limon Kesilmesin) */}
      {activeTab === "pets" && (
        <section className="space-y-4 w-full max-w-full overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#2D241E]">
                Patili Dostlarım
              </h2>
              <p className="text-xs text-slate-600">
                Aşı ve sağlık geçmişini takip etmek için bilgileri güncel tutun
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => {
                setEditingPet(null);
                setPetName("");
                setPetBreed("");
                setPetNotes("");
                setIsAddPetOpen(true);
              }}
              className="bg-[#C87D55] hover:bg-[#B86B43] text-white text-xs font-extrabold rounded-xl gap-1.5 h-8 px-3 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Dost Ekle
            </Button>
          </div>

          {/* Mobilde Tek Sütun Tam Genişlik Düzeni (grid-cols-1 w-full gap-3) */}
          <div className="grid grid-cols-1 gap-3 w-full max-w-full">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white border border-[#E8DFD3] rounded-[22px] p-3.5 sm:p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#C87D55]/40 transition-all w-full max-w-full overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF8F0] border border-[#E8DFD3] flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {pet.species === "Köpek" ? "🐶" : pet.species === "Kuş" ? "🦜" : "🐱"}
                    </div>
                    <div className="min-w-0 flex-1">
                      {/* Pet ismi kesilmesin: text-base font-bold whitespace-nowrap */}
                      <h3 className="text-base font-bold text-[#2D241E] whitespace-nowrap">
                        {pet.name}
                      </h3>
                      {/* Yaş ve Kilo Bilgisi: text-xs text-slate-600 */}
                      <p className="text-xs text-slate-600 font-medium mt-0.5 whitespace-nowrap">
                        {pet.species} • {pet.breed || "Kırma"} • {pet.age ? `${pet.age} Yaşında` : "1 Yaşında"} • {pet.weight ? `${pet.weight} kg` : "4.2 kg"}
                      </p>
                    </div>
                  </div>

                  {/* Sağ Üst Köşede Sabit Düzenle/Sil İkonları (shrink-0) */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleOpenEditPet(pet)}
                      className="w-8 h-8 rounded-lg bg-[#F4EFE6] hover:bg-[#E8DFD3] flex items-center justify-center text-[#5C3D2E] transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => removePet(pet.id)}
                      className="w-8 h-8 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] flex items-center justify-center text-[#B91C1C] transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {pet.notes && (
                  <p className="text-xs text-slate-600 bg-[#FAF7F2] p-2.5 rounded-xl border border-[#E8DFD3] italic leading-relaxed break-words">
                    &ldquo;{pet.notes}&rdquo;
                  </p>
                )}

                {/* Alt Aksiyon & Rozet Alanı (flex-wrap gap-1.5 ile Sağa Taşmasız) */}
                <div className="pt-2 border-t border-[#F4EFE6] flex flex-wrap items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-[#6B7B3C] flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Dijital Karne Aktif
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => router.push(`/randevu?serviceId=sag-kedi-karma-asi&petId=${pet.id}`)}
                    className="text-xs font-bold rounded-xl h-7 px-3 text-[#C87D55] border-[#C87D55]/30 hover:bg-[#FFF5EB] shrink-0"
                  >
                    Aşı Randevusu Al
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: ADDRESSES MANAGEMENT */}
      {activeTab === "addresses" && (
        <section className="space-y-4 w-full max-w-full overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-heading font-extrabold text-[#2D241E]">
                Kayıtlı Adreslerim
              </h2>
              <p className="text-xs text-slate-600">
                Evde veterinerlik ziyaretlerinde kullanılacak açık adresleriniz
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setIsAddAddressOpen(true)}
              className="bg-[#C87D55] hover:bg-[#B86B43] text-white text-xs font-extrabold rounded-xl gap-1.5 h-8 px-3"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Adres Ekle
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white border border-[#E8DFD3] rounded-[22px] p-4 shadow-xs flex flex-col justify-between space-y-3 w-full max-w-full"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF5EB] text-[#C87D55] flex items-center justify-center shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-heading font-bold text-base text-[#2D241E] truncate">
                        {addr.title}
                      </h3>
                      <span className="text-xs text-[#8B7355] truncate block">
                        {addr.neighborhood} • {addr.district}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="w-8 h-8 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] flex items-center justify-center text-[#B91C1C] transition-colors shrink-0"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-[#FAF7F2] p-3 rounded-xl border border-[#E8DFD3] break-words">
                  {addr.fullAddress}
                </p>

                {addr.isDefault && (
                  <span className="text-xs font-bold text-[#6B7B3C] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Varsayılan Adres
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* DOCTOR LOCATION / APPOINTMENT DETAIL MODAL */}
      {activeDocModalAppt && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-4 shadow-2xl relative animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-extrabold text-[#C87D55] uppercase tracking-wider block">
                  Canlı Takip & Hekim Durumu
                </span>
                <h2 className="font-heading font-extrabold text-base text-[#2D241E]">
                  {formatServiceName(activeDocModalAppt.serviceName)}
                </h2>
              </div>
              <button
                onClick={() => setActiveDocModalAppt(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Doctor Info Card */}
            <div className="bg-[#FAF7F2] border border-[#E8DFD3] rounded-2xl p-3.5 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#C87D55] text-white flex items-center justify-center font-extrabold text-lg shadow-sm shrink-0">
                👩‍⚕️
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-extrabold text-sm text-[#2D241E]">
                  Dr. Selin Aydın
                </h3>
                <p className="text-xs text-slate-600">Nöbetçi Uzm. Veteriner Hekim</p>
                <span className="text-[10px] font-bold text-[#6B7B3C] bg-[#6B7B3C]/10 px-2 py-0.5 rounded-full inline-block mt-1">
                  🟢 Yolda • Tahmini 20 Dakika
                </span>
              </div>
            </div>

            {/* Live Progress Stepper */}
            <div className="space-y-2.5 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <span className="text-xs font-extrabold text-[#2D241E] block">Ziyaret Aşaması</span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</div>
                  <span>1. Randevu Hazırlandı & Onaylandı</span>
                </div>
                <div className="flex items-center gap-2 text-[#C87D55] font-extrabold">
                  <div className="w-5 h-5 rounded-full bg-[#C87D55] text-white flex items-center justify-center text-[10px] animate-pulse">🚗</div>
                  <span>2. Hekim Araçla Yola Çıktı (Kadıköy Bölgesi)</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400 font-medium">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-[10px]">3</div>
                  <span>3. Kapıda Muayene / Uygulama</span>
                </div>
              </div>
            </div>

            {/* Address Summary */}
            <div className="text-xs space-y-1 bg-white p-3 rounded-xl border border-slate-200">
              <span className="font-extrabold text-[#2D241E] block">Teslimat & Muayene Adresi:</span>
              <span className="text-slate-600 text-[11px]">
                {activeDocModalAppt.addressSummary || "Fenerbahçe Mah. Kadıköy / İstanbul"}
              </span>
            </div>

            {/* Call Doctor Button */}
            <div className="pt-1 flex gap-2">
              <a
                href="tel:05334449876"
                className="flex-1 py-2.5 bg-[#C87D55] hover:bg-[#B86B43] text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Hekimi Ara (0533 444 9876)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Pet Add/Edit Modal */}
      {(isAddPetOpen || editingPet) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-[24px] w-full max-w-md p-5 shadow-2xl space-y-3">
            <h3 className="text-lg font-heading font-extrabold text-[#2D241E]">
              {editingPet ? "Patili Dostu Düzenle" : "Yeni Patili Dost Ekle 🐾"}
            </h3>

            <form onSubmit={handleSavePet} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">Dostunuzun Adı:</label>
                <Input
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Örn: Pamuk, Şila"
                  className="rounded-xl border-[#E8DFD3] text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">Tür:</label>
                  <select
                    value={petSpecies}
                    onChange={(e) => setPetSpecies(e.target.value as any)}
                    className="w-full p-2 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E]"
                  >
                    <option value="Kedi">🐱 Kedi</option>
                    <option value="Köpek">🐶 Köpek</option>
                    <option value="Kuş">🦜 Kuş</option>
                    <option value="Tavşan">🐰 Tavşan</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">Irk:</label>
                  <Input
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    placeholder="Örn: Tekir, Golden"
                    className="rounded-xl border-[#E8DFD3] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">Yaş:</label>
                  <Input
                    type="number"
                    min="0"
                    max="30"
                    value={petAge}
                    onChange={(e) => setPetAge(Number(e.target.value))}
                    className="rounded-xl border-[#E8DFD3] text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">Kilo (kg):</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={petWeight}
                    onChange={(e) => setPetWeight(Number(e.target.value))}
                    className="rounded-xl border-[#E8DFD3] text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">Özel Notlar / Alerjiler:</label>
                <textarea
                  rows={2}
                  value={petNotes}
                  onChange={(e) => setPetNotes(e.target.value)}
                  placeholder="Karakter özellikleri, alerjisi olduğu gıdalar vb."
                  className="w-full p-2 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddPetOpen(false);
                    setEditingPet(null);
                  }}
                  className="rounded-xl text-xs h-8"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="bg-[#C87D55] hover:bg-[#B86B43] text-white font-bold rounded-xl text-xs h-8"
                >
                  {editingPet ? "Güncelle" : "Kaydet"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Add Modal */}
      {isAddAddressOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-[24px] w-full max-w-md p-5 shadow-2xl space-y-3">
            <h3 className="text-lg font-heading font-extrabold text-[#2D241E] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C87D55]" />
              Yeni Adres Ekle
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">Adres Başlığı:</label>
                <Input
                  value={addrTitle}
                  onChange={(e) => setAddrTitle(e.target.value)}
                  placeholder="Örn: Evim, Yazlık"
                  className="rounded-xl border-[#E8DFD3] text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">İlçe:</label>
                  <select
                    value={addrDistrict}
                    onChange={(e) => setAddrDistrict(e.target.value)}
                    className="w-full p-2 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E]"
                  >
                    <option value="Kadıköy">Kadıköy</option>
                    <option value="Maltepe">Maltepe</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">Mahalle:</label>
                  <Input
                    value={addrNeighborhood}
                    onChange={(e) => setAddrNeighborhood(e.target.value)}
                    placeholder="Örn: Fenerbahçe, Feyzullah"
                    className="rounded-xl border-[#E8DFD3] text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">Cadde / Sokak:</label>
                <Input
                  value={addrStreet}
                  onChange={(e) => setAddrStreet(e.target.value)}
                  placeholder="Örn: Bağdat Cad. No: 12"
                  className="rounded-xl border-[#E8DFD3] text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">Bina No:</label>
                  <Input
                    value={addrBuilding}
                    onChange={(e) => setAddrBuilding(e.target.value)}
                    placeholder="Örn: 12"
                    className="rounded-xl border-[#E8DFD3] text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">Daire No:</label>
                  <Input
                    value={addrApartment}
                    onChange={(e) => setAddrApartment(e.target.value)}
                    placeholder="Örn: 4"
                    className="rounded-xl border-[#E8DFD3] text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddAddressOpen(false)}
                  className="rounded-xl text-xs h-8"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="bg-[#C87D55] hover:bg-[#B86B43] text-white font-bold rounded-xl text-xs h-8"
                >
                  Adresi Kaydet
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
