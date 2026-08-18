"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function RootRedirectPage() {
  const router = useRouter();
  const { isAuthenticated, role } = useApp();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("vetrota_auth") === "true" || isAuthenticated;
      const currentRole = localStorage.getItem("vetrota_role") || role;

      if (auth) {
        if (currentRole === "VET") {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/home";
        }
      } else {
        window.location.href = "/login";
      }
    }
  }, [isAuthenticated, role]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div className="w-12 h-12 rounded-2xl bg-[#C67B5C] text-white flex items-center justify-center text-2xl animate-bounce">
        🐾
      </div>
      <p className="text-sm font-semibold text-[#8B7355]">Yönlendiriliyorsunuz...</p>
    </div>
  );
}
