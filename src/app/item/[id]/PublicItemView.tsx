"use client";

import { useEffect, useState } from "react";
import { Search, MessageSquare, MapPin, Loader2, Sparkles, AlertCircle, ShieldCheck, User, Phone, CheckCircle2, XCircle } from "lucide-react";
import ChatWidget from "@/components/ChatWidget";

export default function PublicItemView({ item }: { item: any }) {
  const [reporting, setReporting] = useState(false);
  const [message, setMessage] = useState("");
  const [finderName, setFinderName] = useState("");
  const [finderContact, setFinderContact] = useState("");
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Verification state
  const [verifying, setVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyData, setVerifyData] = useState({ color: "", birthplace: "" });
  const [verifyError, setVerifyError] = useState("");

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => console.log("Location access denied or failed", error)
      );
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setVerifyError("");
    try {
      const res = await fetch("/api/items/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemId: item.id,
          color: verifyData.color,
          birthplace: verifyData.birthplace
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsVerified(true);
      } else {
        setVerifyError("Incorrect answers. Please try again.");
      }
    } catch (err) {
      setVerifyError("Verification error.");
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isVerified) {
      alert("Please verify identity first.");
      return;
    }
    setLoading(true);
    
    try {
      const payload = {
        itemId: item.id,
        finderName,
        finderContact,
        message,
        locationLat: location?.lat || null,
        locationLng: location?.lng || null
      };

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        alert("Failed to submit report. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error reporting item.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-lg">
        <div className="glass-card p-10 rounded-3xl text-center shadow-lg mb-8 bg-slate-900 border border-green-500/30">
          <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-3xl font-black mb-4">Return Initiated!</h2>
          <p className="text-slate-400 mb-8">
            The owner has been notified. You can now coordinate the return via secure chat.
          </p>
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-3 rounded-xl flex items-start gap-3 text-left">
            <Sparkles className="shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <strong>Reward Points Granted!</strong><br />
              You've earned <strong>+50 Karma Points</strong> for this verified return.
            </div>
          </div>
        </div>
        <ChatWidget itemId={item.id} isOwner={false} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl bg-slate-950 text-white min-h-screen">
      <div className="glass-card overflow-hidden rounded-3xl border border-white/10 shadow-2xl mb-8 bg-slate-900">
        {item.imageUrl ? (
          <div className="h-64 md:h-80 w-full relative">
            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full mb-2 bg-indigo-600/80 backdrop-blur-md">
                {item.status.toUpperCase()}
              </span>
              <h1 className="text-3xl font-black">{item.name}</h1>
            </div>
          </div>
        ) : (
          <div className="p-8 pb-0">
             <span className="inline-block px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full mb-2 bg-indigo-600/20 text-indigo-400">
                {item.status.toUpperCase()}
              </span>
              <h1 className="text-4xl font-black">{item.name}</h1>
          </div>
        )}

        <div className="p-6 md:p-8">
          <div className="grid md:grid-cols-2 gap-4 mb-8">
             <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Owner Name</p>
                <p className="text-slate-200 flex items-center gap-2"><User size={14} className="text-indigo-400" /> {item.ownerName || "Private Guardian"}</p>
             </div>
             <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Contact Info</p>
                <p className="text-slate-200 flex items-center gap-2"><Phone size={14} className="text-indigo-400" /> {isVerified ? item.ownerContact : "••••••••••"}</p>
             </div>
          </div>

          <h3 className="font-bold text-lg mb-2 text-slate-200">Description</h3>
          <p className="text-slate-400 mb-8 leading-relaxed italic">
            "{item.description}"
          </p>

          {!isVerified ? (
            <div className="space-y-4">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-6 text-center">
                <ShieldCheck size={32} className="mx-auto text-indigo-400 mb-3" />
                <h3 className="text-xl font-bold mb-2">Secure Verification Required</h3>
                <p className="text-sm text-slate-400 mb-6">To protect the owner's privacy, please verify the item's identity by answering the security questions.</p>
                
                {!verifying ? (
                  <button onClick={() => setVerifying(true)} className="w-full py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition shadow-lg shadow-indigo-500/20">
                    Process Return / Claim
                  </button>
                ) : (
                  <form onSubmit={handleVerify} className="space-y-4 text-left animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">What is the favorite color?</label>
                      <input required type="text" value={verifyData.color} onChange={e => setVerifyData({...verifyData, color: e.target.value})} className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Type answer..." />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">What is the birthplace name?</label>
                      <input required type="text" value={verifyData.birthplace} onChange={e => setVerifyData({...verifyData, birthplace: e.target.value})} className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-indigo-500" placeholder="Type answer..." />
                    </div>
                    {verifyError && <p className="text-red-400 text-xs font-bold flex items-center gap-1"><XCircle size={14} /> {verifyError}</p>}
                    <button type="submit" disabled={loading} className="w-full py-4 bg-white text-slate-950 rounded-xl font-bold hover:bg-slate-200 transition">
                      {loading ? "Verifying..." : "Confirm Authentication"}
                    </button>
                    <button type="button" onClick={() => setVerifying(false)} className="w-full text-xs text-slate-500 hover:text-slate-300 transition">Cancel</button>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 duration-500">
               <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-6 mb-8 text-center">
                  <CheckCircle2 size={32} className="mx-auto text-green-500 mb-3" />
                  <h3 className="text-xl font-bold text-green-500 mb-1">Identity Verified!</h3>
                  <p className="text-sm text-slate-400">The contact details are now visible. You can send a secure message below.</p>
               </div>

               {!reporting ? (
                  <button onClick={() => setReporting(true)} className="w-full py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition flex items-center justify-center gap-2">
                    <MessageSquare size={18} /> Coordinate Return
                  </button>
               ) : (
                  <form onSubmit={handleReport} className="space-y-4 animate-in fade-in duration-300">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Your Name</label>
                        <input required type="text" value={finderName} onChange={e => setFinderName(e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-indigo-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5">Message to Owner</label>
                        <textarea required rows={3} value={message} onChange={e => setMessage(e.target.value)} className="w-full bg-slate-800 border border-white/5 rounded-xl px-4 py-3 text-white outline-none focus:ring-1 focus:ring-indigo-500" placeholder="e.g. I have your item, please reach out!" />
                    </div>
                    <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 rounded-xl font-bold hover:bg-indigo-500 transition">
                        {loading ? "Sending..." : "Notify Owner"}
                    </button>
                  </form>
               )}
            </div>
          )}
        </div>
      </div>
      
      {/* Footer Branding */}
      <div className="text-center py-8">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/5 px-4 py-2 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <ShieldCheck size={12} className="text-indigo-400" /> Digital Guardian Flow Active
        </div>
      </div>
    </div>
  );
}
