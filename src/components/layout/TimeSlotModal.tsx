"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { TIME_SLOTS } from "@/lib/constants";
import { Calendar, Clock, Check, X } from "lucide-react";

export function TimeSlotModal() {
  const { isTimeSlotModalOpen, setIsTimeSlotModalOpen, selectedTimeSlot, setSelectedTimeSlot } = useApp();

  if (!isTimeSlotModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-0 sm:p-4">
      <div className="bg-[#FDFBF7] border border-[#E8DFD3] rounded-t-[28px] sm:rounded-[28px] w-full max-w-md p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E8DFD3] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#FFF5EB] text-[#C67B5C] flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#2D241E]">
                Teslimat & Randevu Zamanı
              </h3>
              <p className="text-[11px] text-[#8B7355]">Size en uygun zaman aralığını seçiniz</p>
            </div>
          </div>
          <button
            onClick={() => setIsTimeSlotModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#F4EFE6] text-[#2D241E] flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 pt-1">
          {TIME_SLOTS.map((slot) => {
            const isSelected = selectedTimeSlot === slot;
            return (
              <button
                key={slot}
                type="button"
                onClick={() => setSelectedTimeSlot(slot)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-[#FFF5EB] border-[#C67B5C] text-[#C67B5C] font-bold shadow-sm"
                    : "bg-white border-[#E8DFD3] text-[#2D241E] hover:border-[#C67B5C]/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Clock className={`w-4 h-4 ${isSelected ? "text-[#C67B5C]" : "text-[#8B7355]"}`} />
                  <span className="text-xs">{slot}</span>
                </div>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-[#C67B5C] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
