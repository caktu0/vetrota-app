"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Home,
  Stethoscope,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, setActiveMobileCategory, cartCount } = useApp();

  // Hide bottom nav on auth screens
  if (pathname === "/login" || pathname === "/verify" || pathname === "/auth" || pathname === "/register") {
    return null;
  }

  const userNavItems = [
    { label: "Ana Sayfa", href: "/", icon: Home },
    { label: "Hizmetler", href: "/services", icon: Stethoscope },
    { label: "Arama", href: "/search", icon: Search, isCenter: true },
    { label: "Sepetim", href: "/cart", icon: ShoppingCart, badge: cartCount },
    { label: "Hesabım", href: "/account", icon: User },
  ];

  const vetNavItems = [
    { label: "Hekim Paneli", href: "/dashboard", icon: Home },
    { label: "Hizmetler", href: "/services", icon: Stethoscope },
    { label: "Arama", href: "/search", icon: Search, isCenter: true },
    { label: "Hesabım", href: "/account", icon: User },
  ];

  const navItems = role === "VET" ? vetNavItems : userNavItems;

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#E8DFD3] pb-2 pt-1.5 px-3 flex items-center justify-around flex-shrink-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/" || pathname === "/home"
            : pathname.startsWith(item.href);

        if (item.isCenter) {
          return (
            <button
              key={item.label}
              onClick={() => {
                setActiveMobileCategory(null);
                router.push(item.href);
              }}
              className="flex flex-col items-center justify-center -mt-7 group"
            >
              <div className="w-14 h-14 rounded-full bg-[#C87D55] hover:bg-[#B86B43] text-white flex items-center justify-center shadow-[0_8px_20px_rgba(200,125,85,0.35)] group-hover:scale-105 transition-transform border-4 border-[#FDFBF7] ring-2 ring-[#C87D55]/20">
                <Icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className={`text-[10px] font-extrabold mt-0.5 ${
                isActive ? "text-[#C87D55]" : "text-[#8B7355]"
              }`}>
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all relative ${
              isActive
                ? "text-[#C87D55] font-bold"
                : "text-[#8B7355] hover:text-[#2D241E] font-medium"
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.8]"}`} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-[#C87D55] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full min-w-[16px] h-4 flex items-center justify-center border border-white shadow-xs animate-in zoom-in-50">
                  {item.badge > 9 ? "9+" : item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-medium">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
