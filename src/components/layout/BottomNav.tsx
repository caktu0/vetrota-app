"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Home,
  ShoppingBag,
  CalendarPlus,
  Heart,
  User,
  Stethoscope,
  MessageSquare,
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isAuthenticated, setActiveMobileCategory } = useApp();

  if (!isAuthenticated) return null;

  const userNavItems = [
    { label: "Ana Sayfa", href: "/home", icon: Home },
    { label: "Siparişlerim", href: "/account?tab=appointments", icon: ShoppingBag },
    { label: "Randevu Al", href: "/home", icon: CalendarPlus, isCenter: true },
    { label: "Mesajlar", href: "/messages", icon: MessageSquare },
    { label: "Hesabım", href: "/account", icon: User },
  ];

  const vetNavItems = [
    { label: "Hekim Paneli", href: "/dashboard", icon: Stethoscope },
    { label: "Mesajlar", href: "/messages", icon: MessageSquare },
    { label: "Hesabım", href: "/account", icon: User },
  ];

  const navItems = role === "VET" ? vetNavItems : userNavItems;

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#E8DFD3] pb-2 pt-1.5 px-3 flex items-center justify-around flex-shrink-0">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/home"
            ? pathname === "/home" || pathname === "/"
            : pathname.startsWith(item.href);

        if (item.isCenter) {
          return (
            <button
              key={item.label}
              onClick={() => {
                setActiveMobileCategory(null);
                router.push("/home");
              }}
              className="flex flex-col items-center justify-center -mt-6 group"
            >
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#C67B5C] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform border-4 border-[#FDFBF7]">
                <Icon className="w-6 h-6 stroke-[2.5]" />
              </div>
              <span className="text-[10px] font-bold text-[#C67B5C] mt-1">
                {item.label}
              </span>
            </button>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
              isActive
                ? "text-[#C67B5C] font-bold"
                : "text-[#8B7355] hover:text-[#2D241E] font-medium"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
            <span className="text-[10px] mt-1 tracking-tight">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
