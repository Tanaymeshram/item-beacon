"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "hi";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  en: {
    dashboard: "Dashboard",
    login: "Login",
    register: "Register",
    leaderboard: "Leaderboard",
    map: "Map",
    match: "AI Match",
    heroTitle: "Securely Link Your Life",
    heroDesc: "Digital Lost & Found uses QR codes and AI to connect lost items with their owners efficiently and securely, without compromising privacy.",
    getStarted: "Get Started for Free",
    scanItem: "Scan Found Item",
    add_item: "Add New Item",
    points: "Karma Points",
  },
  hi: {
    dashboard: "डैशबोर्ड",
    login: "लॉग इन",
    register: "रजिस्टर",
    leaderboard: "लीडरबोर्ड",
    map: "नक्शा",
    match: "AI खोजना",
    heroTitle: "अपने जीवन को सुरक्षित रूप से जोड़ें",
    heroDesc: "डिजिटल लॉस्ट एंड फाउंड गोपनीयता से समझौता किए बिना खोई हुई वस्तुओं को उनके मालिकों से कुशलतापूर्वक और सुरक्षित रूप से जोड़ने के लिए क्यूआर कोड और एआई का उपयोग करता है।",
    getStarted: "मुफ्त में शुरू करें",
    scanItem: "मिली हुई वस्तु को स्कैन करें",
    add_item: "नया आइटम जोड़ें",
    points: "कर्म अंक",
  },
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  const t = (key: string) => {
    return translations[lang][key] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
