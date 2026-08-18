"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { PetItem, AddressItem } from "@/types";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function AccountPage() {
  const {
    currentUser,
    setCurrentUser,
    role,
    setRole,
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
  const [activeTab, setActiveTab] = useState<"appointments" | "pets" | "addresses" | "settings">("appointments");

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
  const [profPhone, setProfPhone] = useState(currentUser.phone || "");

  // Filter appointments for current user
  const userAppointments = appointments.filter((a) => a.userId === currentUser.id);

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
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* 1. User Profile Header Card */}
      <section className="bg-white border border-[#E8DFD3] rounded-[24px] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2D241E]">
              {currentUser.name} {currentUser.surname}
            </h1>
            <Badge variant={role === "VET" ? "success" : "default"} className="text-xs px-2.5 py-0.5">
              {role === "VET" ? "Veteriner Hekim" : "Hasta Sahibi"}
            </Badge>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#8B7355]">
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#C67B5C]" /> {currentUser.email}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-[#6B7B3C]" /> {currentUser.phone || "0532 555 0123"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsEditingProfile(!isEditingProfile)}
            className="text-xs rounded-xl border-[#E8DFD3] gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Profili Düzenle
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            className="text-xs rounded-xl border-[#B91C1C]/20 text-[#B91C1C] hover:bg-[#FEF2F2] gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Çıkış Yap
          </Button>
        </div>
      </section>

      {/* Edit Profile Form Modal */}
      {isEditingProfile && (
        <form
          onSubmit={handleSaveProfile}
          className="p-5 rounded-[20px] bg-[#FFF8F0] border border-[#C67B5C]/30 space-y-3 animate-in fade-in duration-200"
        >
          <h3 className="font-heading font-bold text-base text-[#2D241E]">
            Profil Bilgilerini Güncelle
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-[#2D241E] block mb-1">Adınız:</label>
              <Input
                value={profName}
                onChange={(e) => setProfName(e.target.value)}
                className="bg-white rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D241E] block mb-1">Soyadınız:</label>
              <Input
                value={profSurname}
                onChange={(e) => setProfSurname(e.target.value)}
                className="bg-white rounded-xl"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-[#2D241E] block mb-1">Telefon:</label>
              <Input
                value={profPhone}
                onChange={(e) => setProfPhone(e.target.value)}
                className="bg-white rounded-xl"
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
              className="rounded-xl text-xs"
            >
              İptal
            </Button>
            <Button
              type="submit"
              size="sm"
              className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs"
            >
              Kaydet
            </Button>
          </div>
        </form>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 bg-[#F4EFE6] p-1.5 rounded-[18px] border border-[#E8DFD3] overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("appointments")}
          className={`flex-1 py-2.5 px-3 rounded-[12px] text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "appointments"
              ? "bg-white text-[#C67B5C] shadow-sm"
              : "text-[#8B7355] hover:text-[#2D241E]"
          }`}
        >
          <Calendar className="w-4 h-4" />
          Randevularım ({userAppointments.length})
        </button>

        <button
          onClick={() => setActiveTab("pets")}
          className={`flex-1 py-2.5 px-3 rounded-[12px] text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "pets"
              ? "bg-white text-[#C67B5C] shadow-sm"
              : "text-[#8B7355] hover:text-[#2D241E]"
          }`}
        >
          <span>🐾</span>
          Patili Dostlarım ({pets.length})
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`flex-1 py-2.5 px-3 rounded-[12px] text-xs font-bold transition-all whitespace-nowrap flex items-center justify-center gap-1.5 ${
            activeTab === "addresses"
              ? "bg-white text-[#C67B5C] shadow-sm"
              : "text-[#8B7355] hover:text-[#2D241E]"
          }`}
        >
          <MapPin className="w-4 h-4" />
          Adreslerim ({addresses.length})
        </button>
      </div>

      {/* TAB 1: Appointments List */}
      {activeTab === "appointments" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-[#2D241E]">
              Geçmiş & Gelecek Randevularım
            </h2>
            <Button
              size="sm"
              onClick={() => (window.location.href = "/booking")}
              className="bg-[#C67B5C] hover:bg-[#B5651D] text-white text-xs font-bold rounded-xl gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Randevu Al
            </Button>
          </div>

          {userAppointments.length === 0 ? (
            <div className="bg-white border border-[#E8DFD3] rounded-[22px] p-8 text-center space-y-3 shadow-sm">
              <div className="w-14 h-14 rounded-full bg-[#FFF5EB] text-[#C67B5C] flex items-center justify-center mx-auto text-2xl">
                📅
              </div>
              <h3 className="font-heading font-bold text-lg text-[#2D241E]">
                Henüz Kayıtlı Randevunuz Yok
              </h3>
              <p className="text-xs text-[#8B7355] max-w-sm mx-auto">
                Dostunuzun aşı, bakım veya muayene ihtiyacı için dilediğiniz gün ve saate randevu alabilirsiniz.
              </p>
              <Button
                onClick={() => (window.location.href = "/booking")}
                className="bg-[#C67B5C] text-white font-bold rounded-xl text-xs"
              >
                Hemen Randevu Al
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {userAppointments.map((appt) => {
                const isHome = appt.type === "home";
                return (
                  <div
                    key={appt.id}
                    className="bg-white border border-[#E8DFD3] rounded-[20px] p-5 shadow-sm space-y-3 hover:border-[#C67B5C]/40 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFE6] pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#FFF5EB] text-[#C67B5C] flex items-center justify-center font-bold">
                          <Stethoscope className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-base text-[#2D241E]">
                            {appt.serviceName}
                          </h3>
                          <span className="text-xs text-[#8B7355]">
                            {appt.petName ? `Hasta: ${appt.petName} (${appt.petSpecies})` : "Genel Muayene"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            appt.status === "COMPLETED"
                              ? "success"
                              : appt.status === "CONFIRMED"
                              ? "default"
                              : appt.status === "IN_PROGRESS"
                              ? "warning"
                              : "outline"
                          }
                          className="text-xs font-bold px-3 py-1"
                        >
                          {appt.status === "COMPLETED"
                            ? "Tamamlandı ✓"
                            : appt.status === "CONFIRMED"
                            ? "Onaylandı"
                            : appt.status === "IN_PROGRESS"
                            ? "Devam Ediyor"
                            : appt.status === "CANCELLED"
                            ? "İptal Edildi"
                            : appt.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-[#5C3D2E]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#C67B5C]" />
                        <span>Tarih: <strong>{appt.date}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#C67B5C]" />
                        <span>Saat: <strong>{appt.time}</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#C67B5C]" />
                        <span className="truncate">{appt.addressSummary || "Kadıköy / Online"}</span>
                      </div>
                    </div>

                    {appt.userNotes && (
                      <div className="p-2.5 rounded-xl bg-[#FDFBF7] border border-[#E8DFD3] text-xs text-[#5C3D2E]">
                        <strong>Notunuz:</strong> {appt.userNotes}
                      </div>
                    )}

                    {appt.vetNotes && (
                      <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534]">
                        <strong>Hekim Raporu:</strong> {appt.vetNotes}
                      </div>
                    )}

                    {appt.status !== "CANCELLED" && appt.status !== "COMPLETED" && (
                      <div className="flex justify-end pt-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => cancelAppointment(appt.id)}
                          className="text-xs text-[#B91C1C] hover:bg-[#FEF2F2] h-8 rounded-lg"
                        >
                          Randevuyu İptal Et
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* TAB 2: Pets Management */}
      {activeTab === "pets" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-[#2D241E]">
                Patili Dostlarım
              </h2>
              <p className="text-xs text-[#8B7355]">
                Dostlarınızın aşı ve sağlık geçmişini takip etmek için bilgileri güncel tutun
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
              className="bg-[#C67B5C] hover:bg-[#B5651D] text-white text-xs font-bold rounded-xl gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Dost Ekle
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="bg-white border border-[#E8DFD3] rounded-[22px] p-5 shadow-sm flex flex-col justify-between space-y-4 hover:border-[#C67B5C]/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-[#FFF8F0] border border-[#E8DFD3] flex items-center justify-center text-3xl shadow-inner">
                      {pet.species === "Köpek" ? "🐶" : "🐱"}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-[#2D241E]">
                        {pet.name}
                      </h3>
                      <p className="text-xs text-[#8B7355]">
                        {pet.species} • {pet.breed || "Kırma"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-[#5C3D2E]">
                        <span>{pet.age ? `${pet.age} Yaşında` : "Yaş Belirtilmedi"}</span>
                        <span>•</span>
                        <span>{pet.weight ? `${pet.weight} kg` : "Kilo Belirtilmedi"}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
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
                  <p className="text-xs text-[#5C3D2E] bg-[#FDFBF7] p-2.5 rounded-xl border border-[#E8DFD3] italic">
                    &ldquo;{pet.notes}&rdquo;
                  </p>
                )}

                <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#6B7B3C] flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Dijital Aşı Karnesi Aktif
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => (window.location.href = `/booking?service=evde-asi-uygulamasi`)}
                    className="text-xs rounded-xl h-8 text-[#C67B5C] border-[#C67B5C]/30"
                  >
                    Aşı Randevusu Al
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 3: Addresses Management */}
      {activeTab === "addresses" && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-heading font-bold text-[#2D241E]">
                Kayıtlı Adreslerim
              </h2>
              <p className="text-xs text-[#8B7355]">
                Evde veterinerlik ziyaretlerinde kullanılacak açık adresleriniz
              </p>
            </div>

            <Button
              size="sm"
              onClick={() => setIsAddAddressOpen(true)}
              className="bg-[#C67B5C] hover:bg-[#B5651D] text-white text-xs font-bold rounded-xl gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" /> Yeni Adres Ekle
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white border border-[#E8DFD3] rounded-[22px] p-5 shadow-sm flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#FFF5EB] text-[#C67B5C] flex items-center justify-center">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-base text-[#2D241E]">
                        {addr.title}
                      </h3>
                      <span className="text-xs text-[#8B7355]">
                        {addr.neighborhood} • {addr.district}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeAddress(addr.id)}
                    className="w-8 h-8 rounded-lg bg-[#FEF2F2] hover:bg-[#FEE2E2] flex items-center justify-center text-[#B91C1C] transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-[#5C3D2E] leading-relaxed bg-[#FDFBF7] p-3 rounded-xl border border-[#E8DFD3]">
                  {addr.fullAddress}
                </p>

                {addr.isDefault && (
                  <span className="text-[11px] font-bold text-[#6B7B3C] flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Varsayılan Adres
                  </span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pet Add/Edit Modal */}
      {(isAddPetOpen || editingPet) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-[24px] w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-heading font-bold text-[#2D241E]">
              {editingPet ? "Patili Dostu Düzenle" : "Yeni Patili Dost Ekle 🐾"}
            </h3>

            <form onSubmit={handleSavePet} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">Dostunuzun Adı:</label>
                <Input
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Örn: Pamuk, Şila"
                  className="rounded-xl border-[#E8DFD3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">Tür:</label>
                  <select
                    value={petSpecies}
                    onChange={(e) => setPetSpecies(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E]"
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
                    className="rounded-xl border-[#E8DFD3]"
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
                    className="rounded-xl border-[#E8DFD3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">Kilo (kg):</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={petWeight}
                    onChange={(e) => setPetWeight(Number(e.target.value))}
                    className="rounded-xl border-[#E8DFD3]"
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
                  className="w-full p-2.5 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E] resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddPetOpen(false);
                    setEditingPet(null);
                  }}
                  className="rounded-xl text-xs"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-[24px] w-full max-w-md p-6 shadow-2xl space-y-4">
            <h3 className="text-xl font-heading font-bold text-[#2D241E] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#C67B5C]" />
              Yeni Adres Ekle
            </h3>

            <form onSubmit={handleSaveAddress} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#2D241E] block mb-1">Adres Başlığı:</label>
                <Input
                  value={addrTitle}
                  onChange={(e) => setAddrTitle(e.target.value)}
                  placeholder="Örn: Evim, Yazlık"
                  className="rounded-xl border-[#E8DFD3]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">İlçe:</label>
                  <select
                    value={addrDistrict}
                    onChange={(e) => setAddrDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E]"
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
                    className="rounded-xl border-[#E8DFD3]"
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
                  className="rounded-xl border-[#E8DFD3]"
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
                    className="rounded-xl border-[#E8DFD3]"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-[#2D241E] block mb-1">Daire No:</label>
                  <Input
                    value={addrApartment}
                    onChange={(e) => setAddrApartment(e.target.value)}
                    placeholder="Örn: 4"
                    className="rounded-xl border-[#E8DFD3]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddAddressOpen(false)}
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
    </div>
  );
}
