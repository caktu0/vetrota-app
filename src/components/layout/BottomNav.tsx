"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/context/AppContext";
import {
  Home,
  LayoutGrid,
  MessageSquare,
  BookOpen,
  User,
  CalendarCheck2,
  Stethoscope,
} from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();
  const { role, isAuthenticated } = useApp();

  if (!isAuthenticated) return null;

  const userNavItems = [
    { label: "Ana Sayfa", href: "/", icon: Home },
    { label: "Hizmetler", href: "/services", icon: LayoutGrid },
    { label: "Mesajlar", href: "/messages", icon: MessageSquare },
    { label: "Blog", href: "/blog", icon: BookOpen },
    { label: "Hesabım", href: "/account", icon: User },
  ];

  const vetNavItems = [
    { label: "Hekim Paneli", href: "/dashboard", icon: Stethoscope },
    { label: "Mesajlar", href: "/messages", icon: MessageSquare },
    { label: "Blog", href: "/blog", icon: BookOpen },
    { label: "Hesabım", href: "/account", icon: User },
  ];

  const navItems = role === "VET" ? vetNavItems : userNavItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-md border-t border-[#E8DFD3] pb-safe">
      <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/"
              ? pathname === "/" || pathname === "/home"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-14 h-full py-1 transition-all ${
                isActive
                  ? "text-[#C67B5C] font-bold scale-105"
                  : "text-[#8B7355] hover:text-[#2D241E] font-medium"
              }`}
            >
              <div
                className={`w-9 h-8 rounded-xl flex items-center justify-center transition-all ${
                  isActive ? "bg-[#C67B5C]/15" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
