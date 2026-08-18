"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import {
  MailCheck,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailParam = searchParams.get("email") || "yasin@vetrota.com";
  const roleParam = (searchParams.get("role") as UserRole) || "USER";
  const nameParam = searchParams.get("name") || "Yasin Demir";

  const { login, showToast } = useApp();

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      setIsSuccess(true);

      const [firstName, ...rest] = nameParam.trim().split(" ");
      const lastName = rest.join(" ");

      // Complete login with new registration flag (clean slate)
      login(
        {
          name: firstName || "Kullanıcı",
          surname: lastName || "",
          email: emailParam,
          role: roleParam,
          emailVerified: true,
        },
        roleParam,
        true
      );

      showToast("E-posta adresiniz doğrulandı! Şimdi patili dostunuzu kaydedin 🐾", "success");

      setTimeout(() => {
        window.location.href = roleParam === "VET" ? "/dashboard" : "/account";
      }, 1000);
    }, 600);
  };

  const handleResend = () => {
    showToast("Doğrulama kodu e-postanıza tekrar gönderildi. (Demo: 123456)", "info");
  };

  return (
    <div className="max-w-md mx-auto py-8 space-y-6 animate-in fade-in duration-300">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-[#FFF5EB] border border-[#C67B5C]/30 text-[#C67B5C] flex items-center justify-center mx-auto shadow-sm">
          <MailCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#2D241E]">
          E-posta Doğrulama
        </h1>
        <p className="text-xs text-[#8B7355] max-w-xs mx-auto">
          Güvenliğiniz için <strong>{emailParam}</strong> adresine 6 haneli bir onay kodu gönderdik.
        </p>
      </div>

      <div className="bg-white border border-[#E8DFD3] rounded-[24px] p-6 sm:p-8 shadow-[0_10px_30px_rgba(198,123,92,0.08)] space-y-5 text-center">
        {isSuccess ? (
          <div className="py-6 space-y-3 animate-in zoom-in-95">
            <CheckCircle2 className="w-14 h-14 text-[#6B7B3C] mx-auto" />
            <h3 className="text-xl font-heading font-bold text-[#2D241E]">
              Hesabınız Doğrulandı!
            </h3>
            <p className="text-xs text-[#8B7355]">
              Yönlendiriliyorsunuz, lütfen bekleyiniz...
            </p>
          </div>
        ) : (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="flex justify-center gap-2 sm:gap-3">
              {code.map((digit, idx) => (
                <Input
                  key={idx}
                  id={`code-input-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  className="w-11 sm:w-12 h-14 text-center text-xl font-bold rounded-xl border-[#E8DFD3] bg-[#FDFBF7] focus:ring-2 focus:ring-[#C67B5C]"
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={isVerifying}
              className="w-full bg-[#C67B5C] hover:bg-[#B5651D] text-white font-bold rounded-xl h-12 text-sm shadow-md gap-2"
            >
              {isVerifying ? "Kontrol Ediliyor..." : "Hesabı Doğrula ve Başla"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        )}

        <div className="pt-2 border-t border-[#F4EFE6] flex items-center justify-between text-xs">
          <span className="text-[#8B7355]">Kod gelmedi mi?</span>
          <button
            type="button"
            onClick={handleResend}
            className="font-bold text-[#C67B5C] hover:underline flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Kodu Tekrar Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#8B7355]">Yükleniyor...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
