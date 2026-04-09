"use client";

import { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Printer, Link as LinkIcon, Sparkles, Type, Globe, RefreshCw, Check, QrCode } from "lucide-react";

const presets = [
  { label: "Indigo", fg: "#312e81", bg: "#ffffff" },
  { label: "Dark", fg: "#ffffff", bg: "#0f172a" },
  { label: "Forest", fg: "#14532d", bg: "#dcfce7" },
  { label: "Amber", fg: "#78350f", bg: "#fef3c7" },
];

export default function QRGeneratorPage() {
  const [mode, setMode] = useState<"url" | "text">("url");
  const [input, setInput] = useState("");
  const [qrValue, setQrValue] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fgColor, setFgColor] = useState("#1e1b4b");
  const [size, setSize] = useState(256);
  const [copied, setCopied] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleGenerate = () => {
    if (!input.trim()) return;
    setQrValue(input.trim());
  };

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "dlf-qr-code.png";
      link.click();
    }
  };

  const copyURL = async () => {
    await navigator.clipboard.writeText(qrValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="relative overflow-hidden py-14 border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/60 via-slate-950 to-violet-950/40" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-violet-500/20 blur-3xl" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/30 text-violet-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <QrCode size={14} /> Free QR Code Generator
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Generate a <span className="text-gradient">QR Code</span>
          </h1>
          <p className="text-slate-400 max-w-md mx-auto text-lg">
            Create a custom QR code for any URL or text. Customize colors, download instantly — no sign-up required.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
          {/* ── LEFT: Controls ── */}
          <div className="space-y-6">
            {/* Mode Toggle */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-1 flex gap-1">
              {[{ v: "url" as const, label: "URL / Link", icon: <Globe size={15} /> }, { v: "text" as const, label: "Plain Text", icon: <Type size={15} /> }].map((m) => (
                <button
                  key={m.v}
                  onClick={() => setMode(m.v)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition ${mode === m.v ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
                >
                  {m.icon} {m.label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 space-y-3">
              <label className="block text-sm font-semibold text-slate-200">
                {mode === "url" ? "Enter URL" : "Enter Text Content"}
              </label>
              {mode === "url" ? (
                <div className="relative">
                  <LinkIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="url"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                    placeholder="https://your-website.com"
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  />
                </div>
              ) : (
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type anything — contact info, a message, a link..."
                  rows={4}
                  className="w-full px-4 py-3.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-sm"
                />
              )}
            </div>

            {/* Color Presets */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200">Color Theme</h3>
              <div className="flex gap-2">
                {presets.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => { setFgColor(p.fg); setBgColor(p.bg); }}
                    className="group flex-1 rounded-xl overflow-hidden border-2 border-transparent hover:border-indigo-500 transition"
                    title={p.label}
                  >
                    <div className="h-8 flex">
                      <div className="flex-1" style={{ background: p.bg }} />
                      <div className="flex-1" style={{ background: p.fg }} />
                    </div>
                    <div className="text-center text-xs text-slate-400 py-1 group-hover:text-white transition">{p.label}</div>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">QR Color</label>
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl p-2.5">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
                    <span className="text-xs font-mono text-slate-300">{fgColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5 font-medium">Background</label>
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl p-2.5">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent" />
                    <span className="text-xs font-mono text-slate-300">{bgColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Size Slider */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl p-5">
              <div className="flex justify-between mb-3">
                <label className="text-sm font-semibold text-slate-200">QR Size</label>
                <span className="text-sm text-indigo-400 font-bold">{size}px</span>
              </div>
              <input
                type="range"
                min={128}
                max={512}
                step={32}
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full accent-indigo-500 h-2"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-1.5">
                <span>128px</span>
                <span>512px</span>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!input.trim()}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold rounded-xl hover:from-indigo-500 hover:to-violet-500 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-2 text-base"
            >
              <Sparkles size={18} /> Generate QR Code
            </button>
          </div>

          {/* Divider */}
          <div className="hidden lg:flex flex-col items-center gap-2 py-20">
            <div className="w-px h-24 bg-gradient-to-b from-transparent to-slate-700" />
            <div className="w-8 h-8 rounded-full border border-slate-700 flex items-center justify-center text-slate-600 text-xs font-bold">→</div>
            <div className="w-px h-24 bg-gradient-to-b from-slate-700 to-transparent" />
          </div>

          {/* ── RIGHT: Preview ── */}
          <div className="bg-slate-900 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[500px]">
            {qrValue ? (
              <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                <div ref={qrRef} className="rounded-2xl p-4 shadow-2xl ring-4 ring-white/5 mb-4" style={{ background: bgColor }}>
                  <QRCodeCanvas
                    value={qrValue}
                    size={Math.min(size, 280)}
                    bgColor={bgColor}
                    fgColor={fgColor}
                    level="H"
                    includeMargin={true}
                  />
                </div>

                {/* Encoded value */}
                <div className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 flex items-center gap-2 mb-6">
                  <span className="text-xs text-slate-400 truncate flex-1">{qrValue}</span>
                  <button onClick={copyURL} className="text-slate-400 hover:text-white transition shrink-0">
                    {copied ? <Check size={14} className="text-green-400" /> : <LinkIcon size={14} />}
                  </button>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 w-full">
                  <button
                    onClick={downloadQR}
                    className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl font-semibold text-sm transition shadow-lg shadow-indigo-500/20"
                  >
                    <Download size={16} /> Download
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 transition"
                  >
                    <Printer size={16} />
                  </button>
                  <button
                    onClick={() => { setQrValue(""); setInput(""); }}
                    className="flex items-center gap-2 bg-slate-800 border border-slate-700 text-slate-300 px-4 py-3 rounded-xl font-semibold text-sm hover:bg-slate-700 transition"
                    title="Reset"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>

                <div className="mt-6 w-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-3 rounded-xl text-xs text-center leading-relaxed">
                  💡 <strong>Tip:</strong> Register this item in your Dashboard to link this QR to the Lost & Found tracking system.
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                {/* Animated placeholder QR */}
                <div className="relative w-48 h-48 mx-auto mb-6">
                  <div className="absolute inset-0 border-2 border-dashed border-slate-700 rounded-2xl animate-pulse" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <QrCode size={64} className="text-slate-700" />
                  </div>
                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-indigo-500/40 rounded-tl" />
                  <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-indigo-500/40 rounded-tr" />
                  <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-indigo-500/40 rounded-bl" />
                  <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-indigo-500/40 rounded-br" />
                </div>
                <p className="font-semibold text-slate-400 mb-2">Your QR code will appear here</p>
                <p className="text-sm text-slate-600">Enter a URL or text, then click Generate</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
