"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

export function ToastBanner() {
  const { toast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-300 max-w-[90vw] md:max-w-md w-full px-4">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-[16px] shadow-[0_10px_25px_-5px_rgba(198,123,92,0.25),0_8px_10px_-6px_rgba(45,36,30,0.1)] border ${
          toast.type === "warning"
            ? "bg-[#FEF3C7] border-[#F59E0B] text-[#92400E]"
            : toast.type === "info"
            ? "bg-[#E0F2FE] border-[#38BDF8] text-[#0369A1]"
            : "bg-[#FDFBF7] border-[#C67B5C]/30 text-[#2D241E]"
        }`}
      >
        <div className="flex-shrink-0">
          {toast.type === "warning" ? (
            <AlertTriangle className="w-5 h-5 text-[#D97706]" />
          ) : toast.type === "info" ? (
            <Info className="w-5 h-5 text-[#0284C7]" />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#C67B5C]/15 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-[#C67B5C]" />
            </div>
          )}
        </div>
        <div className="flex-1 text-sm font-medium leading-snug">
          {toast.message}
        </div>
      </div>
    </div>
  );
}
