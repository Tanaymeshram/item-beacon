"use client";

import { useState, useRef, useEffect } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Camera, RefreshCw, Download, Sparkles, CameraOff, CheckCircle2, User, Phone, ShieldQuestion, ArrowRight, Loader2 } from "lucide-react";

type Step = "capture" | "details" | "security" | "result";

export default function CameraQRPage() {
  const [step, setStep] = useState<Step>("capture");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [itemId, setItemId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    itemName: "",
    color: "",
    birthplace: ""
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, 
        audio: false 
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("Camera access error:", err);
      alert("Please allow camera access to use this feature.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL("image/png"));
        stopCamera();
        setStep("details");
      }
    }
  };

  const saveAndGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/items/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          image: capturedImage
        })
      });
      const data = await response.json();
      if (data.success) {
        setItemId(data.itemId);
        setStep("result");
      } else {
        alert("Registration failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error saving item. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (step === "capture") startCamera();
    return () => stopCamera();
  }, [step]);

  return (
    <div className="min-h-screen bg-slate-950 text-white py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Progress Header */}
        <div className="flex justify-between mb-8 max-w-md mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-800 -translate-y-1/2 -z-10" />
          {["capture", "details", "security", "result"].map((s, i) => (
            <div key={s} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                step === s ? "bg-indigo-600 text-white glow-primary" : 
                (i < ["capture", "details", "security", "result"].indexOf(step) ? "bg-green-600 text-white" : "bg-slate-800 text-slate-500")
              }`}>
                {i < ["capture", "details", "security", "result"].indexOf(step) ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              <span className={`text-[10px] mt-2 font-bold uppercase tracking-tighter ${step === s ? "text-indigo-400" : "text-slate-600"}`}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          {step === "capture" && (
            <div className="relative aspect-video bg-black flex items-center justify-center animate-in fade-in duration-500">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
                <button onClick={handleCapture} className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 shadow-xl hover:scale-105 transition flex items-center justify-center group">
                  <div className="w-12 h-12 rounded-full bg-indigo-600 group-hover:bg-indigo-500 transition" />
                </button>
                <span className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-md">Capture Item</span>
              </div>
            </div>
          )}

          {(step === "details" || step === "security") && (
            <div className="p-8 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                  <img src={capturedImage!} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">{step === "details" ? "Guardian Information" : "Security Verification"}</h2>
                  <p className="text-sm text-slate-400">{step === "details" ? "Who should the finder contact?" : "Ask questions only you know the answer to."}</p>
                </div>
              </div>

              {step === "details" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2"><User size={14} /> Full Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Your Name" className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2"><Phone size={14} /> Contact No. / Email</label>
                    <input type="text" value={formData.contact} onChange={e => setFormData({ ...formData, contact: e.target.value })} placeholder="How to reach you?" className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Item Name (Optional)</label>
                    <input type="text" value={formData.itemName} onChange={e => setFormData({ ...formData, itemName: e.target.value })} placeholder="e.g. My Blue Wallet" className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <button onClick={() => setStep("security")} disabled={!formData.name || !formData.contact} className="w-full mt-6 py-4 bg-indigo-600 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition">
                    Next Step <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-200 leading-relaxed">
                    <strong>Note:</strong> These questions will be used to verify your identity before someone returns the item to you.
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2"><ShieldQuestion size={14} /> What is your favorite color?</label>
                    <input type="text" value={formData.color} onChange={e => setFormData({ ...formData, color: e.target.value })} placeholder="e.g. Blue" className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5 flex items-center gap-2"><ShieldQuestion size={14} /> What is your birthplace name?</label>
                    <input type="text" value={formData.birthplace} onChange={e => setFormData({ ...formData, birthplace: e.target.value })} placeholder="Name of city/town" className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <button onClick={saveAndGenerate} disabled={!formData.color || !formData.birthplace || isLoading} className="w-full mt-6 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition shadow-lg shadow-indigo-500/20">
                    {isLoading ? <><Loader2 className="animate-spin" size={18} /> Saving...</> : <><CheckCircle2 size={18} /> Complete & Generate QR</>}
                  </button>
                  <button onClick={() => setStep("details")} className="w-full py-2 text-slate-500 text-sm font-medium hover:text-slate-300 transition">Back to Details</button>
                </div>
              )}
            </div>
          )}

          {step === "result" && (
            <div className="p-10 text-center animate-in zoom-in-95 duration-500">
              <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-3xl font-black mb-2">Item Registered!</h2>
              <p className="text-slate-400 mb-8 max-w-sm mx-auto">Your item ID <strong>{itemId.split('-')[0]}</strong> is active. Download your secure QR code below.</p>
              
              <div className="inline-block bg-white p-4 rounded-2xl shadow-2xl mb-8">
                <QRCodeCanvas id="qr-canvas" value={`${window.location.origin}/item/${itemId}`} size={200} level="H" includeMargin={true} />
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                <button onClick={() => {
                  const canvas = document.getElementById("qr-canvas") as HTMLCanvasElement;
                  const link = document.createElement("a");
                  link.href = canvas.toDataURL("image/png");
                  link.download = `item-${itemId.split('-')[0]}.png`;
                  link.click();
                }} className="flex items-center justify-center gap-2 py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20">
                  <Download size={18} /> Download
                </button>
                <button onClick={() => setStep("capture")} className="flex items-center justify-center gap-2 py-4 bg-slate-800 rounded-xl font-bold hover:bg-slate-700 transition">
                  <RefreshCw size={18} /> New Item
                </button>
              </div>
            </div>
          )}
        </div>
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
}
