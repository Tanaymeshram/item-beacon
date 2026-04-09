"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { Globe, QrCode, ScanLine, Menu, X, Camera } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { lang, setLang, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleLanguage = () => setLang(lang === "en" ? "hi" : "en");

  const links = [
    { href: "/dashboard", label: t("dashboard") },
    { href: "/leaderboard", label: t("leaderboard") },
    { href: "/map", label: t("map") },
    { href: "/match", label: t("match") },
    { href: "/qr", label: "QR Generator", icon: <QrCode size={14} /> },
    { href: "/camera-qr", label: "Image to QR", icon: <Camera size={14} /> },
    { href: "/scan", label: "Scanner", icon: <ScanLine size={14} /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition">
            <QrCode size={16} className="text-white" />
          </div>
          <span className="font-bold text-lg text-white">Lost &amp; Found</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/8 transition font-medium"
            >
              {link.icon && link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Lang Toggle */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white transition font-medium"
          >
            <Globe size={14} />
            {lang === "en" ? "HI" : "EN"}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-t border-white/5 px-4 pb-4 pt-2 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/8 transition"
            >
              {link.icon && link.icon}
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
