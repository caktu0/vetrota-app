"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RootErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console or telemetry service
    console.error("VetRota App Root Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white border border-[#E8DFD3] rounded-3xl p-6 sm:p-8 shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#B91C1C] mx-auto flex items-center justify-center shadow-inner">
          <AlertCircle className="w-8 h-8 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-heading font-extrabold text-[#2D241E]">
            Bir şeyler ters gitti
          </h2>
          <p className="text-xs sm:text-sm text-[#5C3D2E]/80 leading-relaxed">
            Beklenmeyen bir durumla karşılaşıldı. Lütfen sayfayı tekrar deneyin veya ana sayfaya dönün.
          </p>
          {error.digest && (
            <p className="text-[10px] text-[#8B7355] font-mono bg-[#FDFBF7] px-2 py-1 rounded border border-[#E8DFD3] inline-block">
              Hata Kodu: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button
            onClick={() => reset()}
            className="flex-1 bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl text-xs h-10 gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Tekrar Dene
          </Button>

          <Button
            asChild
            variant="outline"
            className="flex-1 border-[#E8DFD3] text-[#2D241E] hover:bg-[#FDFBF7] font-semibold rounded-xl text-xs h-10 gap-1.5"
          >
            <Link href="/">
              <Home className="w-4 h-4" />
              Ana Sayfa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
