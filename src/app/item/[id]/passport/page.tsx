import prisma from "@/lib/prisma";
import Link from "next/link";
import { ShieldCheck, History, Fingerprint, Activity, Clock } from "lucide-react";
import crypto from "crypto";

export default async function ItemPassportPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      auditLogs: {
        orderBy: { createdAt: 'desc' }
      },
      owner: {
        select: { name: true }
      }
    }
  });

  if (!item) {
    return <div className="p-8 text-center text-muted-foreground">Item not found.</div>;
  }

  // Generate a mock hash for visual blockchain layer effect if not present
  const mockHash = item.cryptoHash || crypto.createHash('sha256').update(item.id + item.createdAt.toISOString()).digest('hex');

  // Insert a dummy history event for creation
  const logs = [...item.auditLogs, {
    id: "genesis",
    action: "ITEM_REGISTERED",
    details: "Item was securely minted into Digital Lost & Found system.",
    createdAt: item.createdAt
  }];

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Fingerprint className="text-primary" size={32} /> Digital Passport
          </h1>
          <p className="text-muted-foreground mt-1">Immutable record of ownership and history</p>
        </div>
        <Link href={`/dashboard`} className="text-sm bg-muted px-4 py-2 rounded-lg font-medium hover:bg-muted/80">
          Back
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary">
          <h3 className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Item Identity</h3>
          <p className="text-xl font-bold">{item.name}</p>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground uppercase mb-1 font-bold">Category</p>
            <p className="font-medium capitalize">{item.category}</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl bg-gradient-to-br from-background to-blue-500/5">
          <h3 className="text-sm font-bold text-muted-foreground mb-1 uppercase tracking-wider">Registered Owner</h3>
          <p className="text-xl font-bold flex items-center gap-2">
             {item.owner.name} <ShieldCheck className="text-green-500" size={20} />
          </p>
          <div className="mt-4 pt-4 border-t border-border">
             <p className="text-xs text-muted-foreground uppercase mb-1 font-bold">Registration Date</p>
             <p className="font-medium">{item.createdAt.toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Blockchain Mock Panel */}
      <div className="glass-card p-6 rounded-2xl border border-border mb-8 bg-slate-900 text-slate-300">
        <div className="flex items-center gap-2 mb-4 text-white">
          <Activity size={20} className="text-primary" />
          <h3 className="font-bold">Blockchain Ownership Protocol (Mock)</h3>
        </div>
        <p className="text-sm mb-2 text-slate-400">Smart Contract Hash (SHA-256)</p>
        <div className="bg-black/50 p-3 rounded-lg font-mono text-xs overflow-x-auto text-green-400 border border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]">
          0x{mockHash}
        </div>
      </div>

      {/* Audit Log Timeline */}
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <History /> Audit History
      </h2>
      <div className="glass-card rounded-2xl p-6">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {logs.map((log, i) => (
            <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-white p-2">
                <Clock size={16} />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl glass-card shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold text-sm text-primary">{log.action}</h4>
                  <time className="text-xs text-muted-foreground font-mono">{log.createdAt.toLocaleDateString()}</time>
                </div>
                <p className="text-sm text-foreground/80">{log.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
