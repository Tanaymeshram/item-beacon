"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { Download, ChevronLeft, Printer } from "lucide-react";

export default function QRDisplay({ item }: { item: any }) {
  const [url, setUrl] = useState("");
  const qrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUrl(`${window.location.origin}/item/${item.id}`);
  }, [item.id]);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `QR_${item.name.replace(/\s+/g, '_')}.png`;
      a.click();
    }
  };

  const printQR = () => {
    window.print();
  };

  if (!url) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-lg">
      <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-primary mb-6 transition">
        <ChevronLeft size={20} className="mr-1" />
        Back to Dashboard
      </Link>
      
      <div className="glass-card rounded-2xl p-8 text-center print:shadow-none print:border-none print:bg-white print:text-black">
        <div className="print:hidden">
          <h1 className="text-2xl font-bold mb-2">QR Code Generated</h1>
          <p className="text-muted-foreground mb-8">
            Print this code and stick it on your <strong>{item.name}</strong>. If anyone finds it, they can scan it to contact you.
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-xl inline-block mx-auto mb-8 shadow-sm border border-border print:border-0 print:mb-0" ref={qrRef}>
          <QRCodeCanvas 
            value={url} 
            size={256} 
            level="H"
            includeMargin={true}
          />
          <p className="text-black font-bold mt-2 font-mono text-sm print:block hidden">
            DLF-{item.id.split('-')[0]}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center print:hidden">
          <button 
            onClick={downloadQR}
            className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition shadow-sm"
          >
            <Download size={20} />
            Download PNG
          </button>
          
          <button 
            onClick={printQR}
            className="flex items-center justify-center gap-2 bg-background border border-border px-6 py-3 rounded-lg hover:bg-muted transition shadow-sm"
          >
            <Printer size={20} />
            Print Directly
          </button>
        </div>
      </div>
    </div>
  );
}
