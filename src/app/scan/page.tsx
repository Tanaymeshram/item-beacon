"use client";

import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import { Loader2, ScanLine, Camera, Zap, QrCode, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: { width: 260, height: 260 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      (result) => {
        scanner.clear();
        setScanResult(result);
        setIsLoading(true);
        setTimeout(() => {
          try {
            if (
              result.includes(window.location.origin) ||
              result.includes("localhost") ||
              result.includes("vercel.app")
            ) {
              const url = new URL(result);
              router.push(url.pathname);
            } else if (result.length > 20) {
              router.push(`/item/${result}`);
            }
          } catch {
            // invalid URL, show result
            setIsLoading(false);
          }
        }, 800);
      },
      () => {}
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Hero Header */}
      <div className="relative overflow-hidden py-14 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-slate-950 to-violet-950/40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-500/20 blur-3xl" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Camera size={14} /> Live Camera Scanner
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-gradient">Scan</span> a Found Item
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-lg">
            Point your camera at any Digital Lost &amp; Found QR code to instantly view the item's details and contact the owner.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {isLoading ? (
          <div className="bg-slate-900 border border-white/10 rounded-3xl p-16 text-center animate-in fade-in duration-500">
            <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-6">
              <Loader2 className="animate-spin text-indigo-400" size={36} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">QR Code Detected!</h2>
            <p className="text-slate-400">Redirecting to item page...</p>
            <div className="mt-4 bg-white/5 rounded-xl px-4 py-2 inline-block">
              <code className="text-xs text-slate-300 font-mono break-all">{scanResult}</code>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Scanner Box */}
            <div className="relative bg-slate-900 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
              {/* Corner decorations */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-indigo-500 rounded-tl-lg z-10" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-indigo-500 rounded-tr-lg z-10" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-indigo-500 rounded-bl-lg z-10" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-indigo-500 rounded-br-lg z-10" />

              {/* Scanning line animation */}
              <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-60 animate-pulse z-10" />

              <div id="reader" className="w-full [&>*]:!border-0 [&_video]:!rounded-xl [&_select]:!bg-slate-800 [&_select]:!text-white [&_select]:!border-slate-700 [&_button]:!bg-indigo-600 [&_button]:!text-white [&_button]:!rounded-lg [&_button]:!border-0 [&_button]:!px-4 [&_button]:!py-2" />
            </div>

            {/* Tips */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Zap size={16} />, tip: "Hold steady for best results" },
                { icon: <ScanLine size={16} />, tip: "Keep QR code in frame" },
                { icon: <Camera size={16} />, tip: "Good lighting helps" },
              ].map((item, i) => (
                <div key={i} className="bg-slate-900/60 border border-white/5 rounded-2xl p-4 text-center">
                  <div className="text-indigo-400 flex justify-center mb-2">{item.icon}</div>
                  <p className="text-xs text-slate-400 leading-snug">{item.tip}</p>
                </div>
              ))}
            </div>

            {/* Alternative */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white mb-1">No QR code to scan?</h3>
                <p className="text-sm text-slate-400">Use our AI Image Matcher instead</p>
              </div>
              <Link
                href="/match"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition whitespace-nowrap"
              >
                AI Match <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
