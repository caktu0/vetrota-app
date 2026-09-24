import React from "react";
import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E8DFD3] rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF5EB] border border-[#C67B5C]/30 text-[#C67B5C] mx-auto flex items-center justify-center text-3xl shadow-inner">
          🐾
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C67B5C]">
            404 — Sayfa Bulunamadı
          </span>
          <h1 className="text-2xl font-heading font-extrabold text-[#2D241E]">
            Aradığınız Sayfa Mevcut Değil
          </h1>
          <p className="text-xs sm:text-sm text-[#5C3D2E]/80 leading-relaxed">
            Ulaşmak istediğiniz sayfa taşınmış veya kaldırılmış olabilir. Ana sayfaya dönerek evde veterinerlik hizmetlerimizi inceleyebilirsiniz.
          </p>
        </div>

        <div className="pt-2">
          <Button
            asChild
            className="w-full bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs h-11 gap-2 shadow-sm"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
