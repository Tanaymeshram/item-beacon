"use client";

import Link from 'next/link';
import { QrCode, MapPin, ShieldCheck, Sparkles, ScanLine, Trophy, ArrowRight, Star } from 'lucide-react';
import { useI18n } from '@/lib/i18n';

const features = [
  {
    icon: <QrCode size={28} />,
    title: "Smart QR Tags",
    desc: "Register your belongings and generate unique, encrypted QR stickers. One scan is all a finder needs.",
    color: "from-indigo-500 to-blue-600",
    shadow: "shadow-indigo-500/25"
  },
  {
    icon: <MapPin size={28} />,
    title: "Live Location Trace",
    desc: "GPS location is captured the moment your item is scanned or reported. See where it's been on a live map.",
    color: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/25",
    highlight: true
  },
  {
    icon: <ShieldCheck size={28} />,
    title: "Secure Recovery",
    desc: "Chat anonymously via our proxy system. No phone numbers. No email exposure. Safe for everyone.",
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/25"
  },
];

const stats = [
  { value: "99%", label: "Recovery Rate" },
  { value: "0ms", label: "QR Scan Speed" },
  { value: "100%", label: "Privacy Protected" },
  { value: "24/7", label: "Always Online" },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="flex-1 bg-slate-950 text-white">
      {/* ── HERO ──────────────────────────────── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 hero-bg" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}} />
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '50px 50px'}} />

        <div className="relative z-10 container mx-auto px-4 text-center max-w-5xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-full text-sm font-semibold mb-8 animate-float">
            <Sparkles size={14} /> AI-Powered • QR-Based • Privacy-First
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[1.05]">
            <span className="text-gradient">Never Lose</span>
            <br />
            <span className="text-white">What Matters</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Attach a smart QR code to your valuables. If someone finds them, they can contact you <strong className="text-white">instantly and anonymously</strong> — no personal info exposed.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/register"
              className="group flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-500/30 transition hover:scale-105"
            >
              {t("getStarted")}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/scan"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base bg-white/5 border border-white/10 text-white hover:bg-white/10 transition backdrop-blur-sm"
            >
              <ScanLine size={18} />
              {t("scanItem")}
            </Link>
            <Link
              href="/qr"
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base bg-white/5 border border-white/10 text-white hover:bg-white/10 transition backdrop-blur-sm"
            >
              <QrCode size={18} />
              QR Generator
            </Link>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/8 rounded-2xl p-4 backdrop-blur-sm">
                <div className="text-2xl font-black text-gradient">{s.value}</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────── */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-indigo-400 font-semibold mb-3 text-sm uppercase tracking-widest">How It Works</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Three Steps to Recovery</h2>
            <p className="text-slate-400 max-w-xl mx-auto">From tagging to getting your item back — the entire process takes seconds.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {features.map((f, i) => (
              <div
                key={i}
                className={`relative group rounded-3xl p-8 bg-slate-900 border border-white/5 card-hover overflow-hidden ${f.highlight ? 'border-indigo-500/30 ring-1 ring-indigo-500/20' : ''}`}
              >
                {f.highlight && (
                  <div className="absolute top-4 right-4 bg-indigo-500/20 text-indigo-400 text-xs font-bold px-2 py-1 rounded-full border border-indigo-500/30">
                    Popular
                  </div>
                )}
                {/* Glow background */}
                <div className={`absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br ${f.color} opacity-10 blur-2xl group-hover:opacity-20 transition`} />

                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-6 text-white shadow-lg ${f.shadow}`}>
                  {f.icon}
                </div>
                <div className="absolute top-8 left-20 text-slate-700 text-6xl font-black">0{i + 1}</div>
                <h3 className="relative text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="relative text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QR QUICK ACCESS ───────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/40 to-violet-950/40" />
        <div className="relative container mx-auto px-4 max-w-4xl">
          <div className="bg-gradient-to-br from-indigo-900/50 to-violet-900/50 border border-indigo-500/20 rounded-3xl p-10 md:p-16 text-center backdrop-blur-sm">
            <QrCode size={48} className="text-indigo-400 mx-auto mb-6 animate-float" />
            <h2 className="text-4xl font-black text-white mb-4">Need a QR Code Right Now?</h2>
            <p className="text-slate-300 mb-8 max-w-lg mx-auto">
              Use our free generator to create a custom QR code for any URL or text — no account required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/qr"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-500/30 transition hover:scale-105"
              >
                <QrCode size={20} /> Open QR Generator
              </Link>
              <Link
                href="/scan"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition"
              >
                <ScanLine size={20} /> Scan a QR Code
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI SECTION ────────────────────────── */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-violet-400 font-semibold text-sm uppercase tracking-widest mb-3">AI-Powered</p>
              <h2 className="text-4xl font-black text-white mb-6">Smart Image Matching</h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Don't have a QR code? Just upload a photo of the item you found. Our AI computer vision model will scan all registered lost items and return the best matches with similarity scores.
              </p>
              <Link
                href="/match"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-violet-600 hover:bg-violet-500 transition shadow-lg shadow-violet-500/20"
              >
                <Sparkles size={18} /> Try AI Matcher
              </Link>
            </div>
            <div className="bg-slate-900 border border-white/5 rounded-3xl p-6 space-y-3">
              {[
                { name: "Black Laptop Bag", score: 94, color: "bg-green-500" },
                { name: "Leather Wallet", score: 71, color: "bg-yellow-500" },
                { name: "Blue Water Bottle", score: 38, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-4 bg-white/5 rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                    <Star size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{item.name}</div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full mt-1.5">
                      <div className={`h-full ${item.color} rounded-full transition-all`} style={{ width: `${item.score}%` }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-white">{item.score}%</span>
                </div>
              ))}
              <div className="text-center text-xs text-slate-500 pt-2">AI Similarity Scores (Demo)</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BOTTOM ────────────────────────── */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <Trophy size={48} className="text-amber-400 mx-auto mb-6" />
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Ready to Protect Your Valuables?</h2>
          <p className="text-slate-400 text-lg mb-10">Join the platform and never worry about losing your items again.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl font-bold text-lg text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-2xl shadow-indigo-500/30 transition hover:scale-105"
          >
            Get Started — It's Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}
