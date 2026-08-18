"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { AppointmentItem, AppointmentStatus } from "@/types";
import { formatPrice } from "@/lib/utils";
import {
  Stethoscope,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Phone,
  Edit2,
  CalendarDays,
  Check,
  RotateCcw,
  Sparkles,
  User,
  AlertCircle,
  Video,
  Home,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function VetDashboard() {
  const {
    currentUser,
    appointments,
    updateAppointmentStatus,
    rescheduleAppointment,
    showToast,
  } = useApp();

  // Active tab: 'home' (Yerinde) or 'online' (Online)
  const [activeTab, setActiveTab] = useState<"home" | "online">("home");

  // Selected date filter (default today)
  const todayIso = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayIso);

  // Selected Appointment for detail / action modal
  const [selectedAppt, setSelectedAppt] = useState<AppointmentItem | null>(null);
  const [vetNotesInput, setVetNotesInput] = useState("");
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [newRescheduleDate, setNewRescheduleDate] = useState("");
  const [newRescheduleTime, setNewRescheduleTime] = useState("14:00");

  // Generate 7-day strip
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i - 1); // Yesterday + 5 upcoming days
    const iso = d.toISOString().split("T")[0];
    const dayName = d.toLocaleDateString("tr-TR", { weekday: "short" });
    const dayNum = d.getDate();
    const monthName = d.toLocaleDateString("tr-TR", { month: "short" });
    // Count appointments on this day
    const count = appointments.filter((a) => a.date === iso && a.status !== "CANCELLED").length;
    return { iso, dayName, dayNum, monthName, count };
  });

  // Filter appointments for the selected tab and selected date
  const filteredAppointments = appointments.filter((a) => {
    const matchesTab = a.type === activeTab;
    const matchesDate = a.date === selectedDate;
    return matchesTab && matchesDate;
  });

  const allTabAppointments = appointments.filter((a) => a.type === activeTab);

  const handleOpenActionModal = (appt: AppointmentItem) => {
    setSelectedAppt(appt);
    setVetNotesInput(appt.vetNotes || "");
    setNewRescheduleDate(appt.date);
    setNewRescheduleTime(appt.time);
  };

  const handleCompleteAppointment = () => {
    if (!selectedAppt) return;
    updateAppointmentStatus(selectedAppt.id, "COMPLETED", vetNotesInput);
    setSelectedAppt(null);
  };

  const handleStartAppointment = () => {
    if (!selectedAppt) return;
    updateAppointmentStatus(selectedAppt.id, "IN_PROGRESS", vetNotesInput);
    setSelectedAppt(null);
  };

  const handleSaveReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt || !newRescheduleDate || !newRescheduleTime) return;
    rescheduleAppointment(selectedAppt.id, newRescheduleDate, newRescheduleTime);
    setIsRescheduleOpen(false);
    setSelectedAppt(null);
  };

  return (
    <div className="space-y-6 pb-8 animate-in fade-in duration-300">
      {/* 1. Top Greeting (As requested: 'Hoşgeldiniz, İsim Soyisim' without top map) */}
      <section className="bg-white border border-[#E8DFD3] rounded-[24px] p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#6B7B3C] text-white flex items-center justify-center shadow-md">
            <Stethoscope className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-bold text-[#6B7B3C] uppercase tracking-wider">
              Nöbetçi Hekim Portalı
            </div>
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2D241E]">
              Hoşgeldiniz, {currentUser.title || "Dr."} {currentUser.name} {currentUser.surname || "Aydın"}
            </h1>
            <p className="text-xs text-[#8B7355] mt-0.5">
              Bugün için planlanan randevularınızı inceleyin, güncelleyin veya yeni tarihe taşıyın.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <Badge variant="success" className="px-3 py-1 text-xs font-bold">
            ● Mobil Hizmete Hazır
          </Badge>
        </div>
      </section>

      {/* 2. Date Selection Strip (User requested: click date to view appointments by hour) */}
      <section className="bg-white border border-[#E8DFD3] rounded-[22px] p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#8B7355]">
            <CalendarDays className="w-4 h-4 text-[#C67B5C]" />
            Tarih Seçimi & Randevu Takvimi
          </div>
          <span className="text-xs font-bold text-[#C67B5C]">
            Seçili: {selectedDate}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {weekDays.map((day) => {
            const isSelected = selectedDate === day.iso;
            return (
              <button
                key={day.iso}
                onClick={() => setSelectedDate(day.iso)}
                className={`py-3 px-1 rounded-[16px] text-center border transition-all flex flex-col items-center justify-center relative ${
                  isSelected
                    ? "bg-[#6B7B3C] text-white border-[#6B7B3C] shadow-md scale-105"
                    : "bg-[#FDFBF7] border-[#E8DFD3] text-[#2D241E] hover:border-[#6B7B3C]/50"
                }`}
              >
                <span className="text-[10px] uppercase font-bold tracking-wider opacity-85">
                  {day.dayName}
                </span>
                <span className="text-base sm:text-lg font-heading font-extrabold my-0.5">
                  {day.dayNum}
                </span>
                <span className="text-[9px] opacity-80">{day.monthName}</span>

                {day.count > 0 && (
                  <span
                    className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white ${
                      isSelected ? "bg-[#D97706] text-white" : "bg-[#C67B5C] text-white"
                    }`}
                  >
                    {day.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Main Appointments Container with Tabs (Yerinde vs Online) */}
      <section className="space-y-4">
        {/* Tab Buttons (As requested: "yerinde randevular" and "online randevular") */}
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-[#F4EFE6] p-1.5 rounded-[18px] border border-[#E8DFD3] w-full sm:w-auto">
            <button
              onClick={() => setActiveTab("home")}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-[12px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "home"
                  ? "bg-white text-[#C67B5C] shadow-sm"
                  : "text-[#8B7355] hover:text-[#2D241E]"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Yerinde Randevular</span>
              <Badge variant="outline" className="text-[10px] ml-1 bg-[#FDFBF7]">
                {allTabAppointments.length}
              </Badge>
            </button>

            <button
              onClick={() => setActiveTab("online")}
              className={`flex-1 sm:flex-initial px-5 py-2.5 rounded-[12px] text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeTab === "online"
                  ? "bg-[#6B7B3C] text-white shadow-sm"
                  : "text-[#8B7355] hover:text-[#2D241E]"
              }`}
            >
              <Video className="w-4 h-4" />
              <span>Online Randevular</span>
              <Badge variant="outline" className="text-[10px] ml-1 bg-[#FDFBF7]">
                {appointments.filter((a) => a.type === "online").length}
              </Badge>
            </button>
          </div>
        </div>

        {/* Appointment Cards List by Hour */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white border border-[#E8DFD3] rounded-[22px] p-8 text-center space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#F4EFE6] text-[#8B7355] flex items-center justify-center mx-auto text-2xl">
              🕒
            </div>
            <h3 className="font-heading font-bold text-lg text-[#2D241E]">
              Bu Tarihte {activeTab === "home" ? "Yerinde" : "Online"} Randevu Bulunmuyor
            </h3>
            <p className="text-xs text-[#8B7355]">
              {selectedDate} tarihinde kayıtlı randevu yok veya tüm randevular tamamlandı.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAppointments.map((appt) => {
              return (
                <div
                  key={appt.id}
                  onClick={() => handleOpenActionModal(appt)}
                  className="bg-white border border-[#E8DFD3] hover:border-[#6B7B3C]/50 rounded-[22px] p-5 shadow-sm hover:shadow-md transition-all cursor-pointer space-y-3 group"
                >
                  {/* Top Bar: Time slot, Patient Name, Status */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F4EFE6] pb-3">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1.5 rounded-xl bg-[#6B7B3C]/10 border border-[#6B7B3C]/20 text-[#6B7B3C] font-bold text-sm flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {appt.time}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-heading font-bold text-base text-[#2D241E] group-hover:text-[#6B7B3C] transition-colors">
                            {appt.userName}
                          </h3>
                          <span className="text-xs text-[#8B7355]">
                            ({appt.petName ? `${appt.petName} - ${appt.petSpecies}` : "Kedi"})
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-[#C67B5C]">
                          {appt.serviceName} ({formatPrice(appt.servicePrice)})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          appt.status === "COMPLETED"
                            ? "success"
                            : appt.status === "IN_PROGRESS"
                            ? "warning"
                            : appt.status === "CONFIRMED"
                            ? "default"
                            : "outline"
                        }
                        className="text-xs font-bold px-3 py-1"
                      >
                        {appt.status === "COMPLETED"
                          ? "Başarıyla Tamamlandı ✓"
                          : appt.status === "IN_PROGRESS"
                          ? "Muayene Başladı"
                          : appt.status === "CONFIRMED"
                          ? "Onaylandı / Bekliyor"
                          : appt.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Middle details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#5C3D2E]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#C67B5C] flex-shrink-0" />
                      <span className="truncate">
                        <strong>Adres / Konum:</strong> {appt.addressSummary || "Kadıköy"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#6B7B3C] flex-shrink-0" />
                      <span>
                        <strong>İletişim:</strong> {appt.userPhone || "0532 555 0123"}
                      </span>
                    </div>
                  </div>

                  {appt.userNotes && (
                    <div className="p-2.5 rounded-xl bg-[#FDFBF7] border border-[#E8DFD3] text-xs text-[#5C3D2E]">
                      <strong>Hasta Sahibi Notu:</strong> {appt.userNotes}
                    </div>
                  )}

                  {appt.vetNotes && (
                    <div className="p-2.5 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-xs text-[#166534]">
                      <strong>Klinik Notunuz:</strong> {appt.vetNotes}
                    </div>
                  )}

                  {/* Action prompt */}
                  <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between text-xs text-[#8B7355]">
                    <span className="text-[11px] italic">
                      İşlem yapmak için karta tıklayın (Tamamla / Ertele / Düzenle)
                    </span>
                    <span className="text-xs font-bold text-[#6B7B3C] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      İncele & İşlem Yap →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Appointment Action Modal (Tamamla, Ertele, Düzenle) */}
      {selectedAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-[24px] w-full max-w-lg p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E8DFD3] pb-3">
              <div>
                <span className="text-xs font-bold text-[#6B7B3C] uppercase tracking-wider">
                  Randevu Yönetimi & Hekim İşlemleri
                </span>
                <h3 className="text-2xl font-heading font-bold text-[#2D241E]">
                  {selectedAppt.serviceName}
                </h3>
                <p className="text-xs text-[#8B7355]">
                  Hasta Sahibi: {selectedAppt.userName} • Dostu: {selectedAppt.petName || "Kedi"}
                </p>
              </div>
              <button
                onClick={() => setSelectedAppt(null)}
                className="w-8 h-8 rounded-full bg-[#F4EFE6] text-[#2D241E] flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Info summary */}
            <div className="p-3.5 rounded-2xl bg-white border border-[#E8DFD3] space-y-2 text-xs text-[#2D241E]">
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Tarih & Saat:</span>
                <strong>{selectedAppt.date} • {selectedAppt.time}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Hizmet Türü:</span>
                <strong>{selectedAppt.type === "home" ? "🏡 Yerinde (Evde)" : "💻 Online Görüşme"}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Adres / Bölge:</span>
                <strong>{selectedAppt.addressSummary}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8B7355]">Telefon:</span>
                <strong>{selectedAppt.userPhone || "0532 555 0123"}</strong>
              </div>
            </div>

            {/* Vet Notes Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#2D241E] flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#6B7B3C]" />
                Hekim Teşhis & Uygulama Notu:
              </label>
              <textarea
                rows={3}
                value={vetNotesInput}
                onChange={(e) => setVetNotesInput(e.target.value)}
                placeholder="Örn: Karma aşı uygulandı. Aşı karnesi güncellendi. 2 gün banyo yaptırılmaması tavsiye edildi."
                className="w-full p-3 rounded-xl border border-[#E8DFD3] bg-white text-xs text-[#2D241E] focus:outline-none focus:ring-2 focus:ring-[#6B7B3C]/30 resize-none"
              />
            </div>

            {/* Reschedule Subsection */}
            {isRescheduleOpen ? (
              <form
                onSubmit={handleSaveReschedule}
                className="p-4 rounded-2xl bg-[#FFF8F0] border border-[#C67B5C]/30 space-y-3"
              >
                <div className="font-bold text-xs text-[#2D241E] flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-[#C67B5C]" />
                  Randevuyu Başka Bir Tarihe Ertele / Taşı
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-[#5C3D2E] block mb-1">
                      Yeni Tarih:
                    </label>
                    <Input
                      type="date"
                      value={newRescheduleDate}
                      onChange={(e) => setNewRescheduleDate(e.target.value)}
                      className="bg-white rounded-xl text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#5C3D2E] block mb-1">
                      Yeni Saat:
                    </label>
                    <Input
                      type="time"
                      value={newRescheduleTime}
                      onChange={(e) => setNewRescheduleTime(e.target.value)}
                      className="bg-white rounded-xl text-xs"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsRescheduleOpen(false)}
                    className="rounded-xl text-xs"
                  >
                    Vazgeç
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs"
                  >
                    Yeni Tarihi Kaydet
                  </Button>
                </div>
              </form>
            ) : null}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-[#E8DFD3] flex flex-wrap items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsRescheduleOpen(!isRescheduleOpen)}
                className="rounded-xl text-xs border-[#E8DFD3] text-[#5C3D2E] gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#C67B5C]" />
                Tarihi Değiştir
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleStartAppointment}
                  className="rounded-xl text-xs border-[#6B7B3C]/30 text-[#6B7B3C] hover:bg-[#6B7B3C]/10"
                >
                  Muayeneyi Başlat
                </Button>

                <Button
                  size="sm"
                  onClick={handleCompleteAppointment}
                  className="bg-[#6B7B3C] hover:bg-[#586630] text-white font-bold rounded-xl text-xs gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  Başarıyla Tamamla
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
