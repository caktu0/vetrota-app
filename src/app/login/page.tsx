"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import { UserRole } from "@/types";
import { PawPrint, User, Stethoscope, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuthPage() {
  const router = useRouter();
  const { login, setRole, setCurrentUser, showToast } = useApp();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [roleMode, setRoleMode] = useState<UserRole>("USER");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);

    try {
      if (mode === "signup") {
        if (!email || !password || !fullName) {
          throw new Error("Lütfen tüm alanları doldurunuz.");
        }

        showToast("Kayıt başarılı! E-postanızı doğrulamanız için yönlendiriliyorsunuz.", "success");
        setTimeout(() => {
          router.push(
            `/verify?email=${encodeURIComponent(email)}&role=${roleMode}&name=${encodeURIComponent(fullName)}`
          );
        }, 500);
      } else {
        if (!email || !password) {
          throw new Error("Geçersiz e-posta veya şifre.");
        }

        if (roleMode === "VET") {
          login({
            id: "vet-1",
            name: "Dr. Selin",
            surname: "Aydın",
            email,
            phone: "0533 444 9876",
            role: "VET",
            title: "Uzm. Veteriner Hekim",
            clinic: "VetRota Mobil Sağlık",
            emailVerified: true,
          }, "VET");
          showToast("Hoş geldiniz, Dr. Selin Aydın!", "success");
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 300);
        } else {
          login({
            id: "user-1",
            name: fullName ? fullName.split(" ")[0] : "Yasin",
            surname: fullName ? fullName.split(" ").slice(1).join(" ") : "Demir",
            email,
            phone: "0532 555 0123",
            role: "USER",
            emailVerified: true,
          }, "USER");
          showToast("Hoş geldiniz!", "success");
          setTimeout(() => {
            window.location.href = "/home";
          }, 300);
        }
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Bir hata oluştu", "warning");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      setTimeout(() => {
        if (roleMode === "VET") {
          login({
            id: "vet-1",
            name: "Dr. Selin",
            surname: "Aydın",
            email: "selin.aydin@vetrota.com",
            phone: "0533 444 9876",
            role: "VET",
            title: "Uzm. Veteriner Hekim",
            clinic: "VetRota Mobil Sağlık",
            emailVerified: true,
          }, "VET");
          showToast("Google ile hekim girişi başarılı!", "success");
          window.location.href = "/dashboard";
        } else {
          login({
            id: "user-1",
            name: "Yasin",
            surname: "Demir",
            email: "yasin@vetrota.com",
            phone: "0532 555 0123",
            role: "USER",
            emailVerified: true,
          }, "USER");
          showToast("Google ile güvenli giriş yapıldı! 🐾", "success");
          window.location.href = "/home";
        }
        setBusy(false);
      }, 500);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Google girişi başarısız", "warning");
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background px-4 pt-6 pb-12 animate-in fade-in duration-300">
      <div className="mx-auto max-w-md">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-white shadow-[0_4px_16px_rgba(198,123,92,0.25)]">
            <PawPrint className="h-6 w-6" />
          </div>
          <div>
            <p className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
              VetRota
            </p>
            <p className="text-xs text-muted-foreground font-medium">
              Evde & Online Veterinerlik Hizmeti
            </p>
          </div>
        </div>

        {/* Role Toggle Selector */}
        <div className="mt-7">
          <div className="grid grid-cols-2 gap-2 bg-[#F4EFE6] p-1.5 rounded-[18px] border border-border shadow-inner">
            <button
              type="button"
              onClick={() => setRoleMode("USER")}
              className={`py-2.5 px-3 rounded-[13px] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                roleMode === "USER"
                  ? "bg-white text-primary shadow-sm font-extrabold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Hasta Sahibi</span>
            </button>

            <button
              type="button"
              onClick={() => setRoleMode("VET")}
              className={`py-2.5 px-3 rounded-[13px] text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                roleMode === "VET"
                  ? "bg-[#6B7B3C] text-white shadow-sm font-extrabold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Veteriner Hekim</span>
            </button>
          </div>
        </div>

        {/* Title & Subtitle */}
        <h1 className="mt-6 text-2xl sm:text-3xl font-heading font-extrabold text-foreground">
          {mode === "login"
            ? `${roleMode === "VET" ? "Hekim Hesabına" : "Hesabına"} Giriş Yap`
            : `${roleMode === "VET" ? "Hekim Olarak" : ""} Yeni Hesap Oluştur`}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "login"
            ? "Randevularına, aşı takvimine ve mesajlarına erişmek için giriş yap."
            : "E-posta doğrulama ile hesabını güvenceye alalım."}
        </p>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          {mode === "signup" && (
            <>
              <input
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ad Soyad"
                className="rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
              />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Telefon Numarası (Örn: 0532 555 0123)"
                className="rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
              />
            </>
          )}

          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-posta Adresi"
            className="rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
          />

          <input
            required
            type="password"
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Şifre (en az 6 karakter)"
            className="rounded-2xl border border-border bg-card px-4 py-3.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
          />

          <button
            disabled={busy}
            className={`mt-2 rounded-2xl py-3.5 text-sm font-bold text-white shadow-[0_4px_16px_rgba(198,123,92,0.25)] disabled:opacity-60 transition-all hover:scale-[0.98] active:scale-[0.96] flex items-center justify-center gap-2 ${
              roleMode === "VET"
                ? "bg-[#6B7B3C] hover:bg-[#586630]"
                : "bg-primary hover:bg-[#B5651D]"
            }`}
          >
            {busy ? (
              "Lütfen bekleyin…"
            ) : mode === "login" ? (
              <>
                Giriş Yap <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Kayıt Ol ve Doğrula <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
          <div className="h-px flex-1 bg-border" /> ya da <div className="h-px flex-1 bg-border" />
        </div>

        {/* Google Auth Button */}
        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border bg-card py-3.5 text-sm font-semibold shadow-sm hover:border-primary/50 transition-all hover:bg-[#FFFDF9] disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.6 6.2 29 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z"
            />
            <path
              fill="#FF3D00"
              d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C33.6 6.2 29 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
            />
            <path
              fill="#4CAF50"
              d="M24 44c5 0 9.5-1.9 12.9-5l-6-4.9c-1.9 1.4-4.4 2.3-6.9 2.3-5.3 0-9.7-3.4-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"
            />
            <path
              fill="#1976D2"
              d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.7l6 4.9c-.4.4 6.9-5 6.9-14.6 0-1.3-.1-2.3-.4-3.5z"
            />
          </svg>
          Google ile Devam Et
        </button>

        {/* Switch Mode Button */}
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-6 w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {mode === "login" ? (
            <>
              Hesabın yok mu?{" "}
              <span className="font-bold text-primary underline underline-offset-2">
                Kayıt ol
              </span>
            </>
          ) : (
            <>
              Zaten hesabın var mı?{" "}
              <span className="font-bold text-primary underline underline-offset-2">
                Giriş yap
              </span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
