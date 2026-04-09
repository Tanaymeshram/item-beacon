import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PlusCircle, QrCode, Search, Activity, Settings } from "lucide-react";
import prisma from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token")?.value;
  
  if (!token) {
    redirect("/login");
  }

  const decoded = verifyToken(token) as { userId: string, email: string };
  if (!decoded) {
    redirect("/login");
  }

  const items = await prisma.item.findMany({
    where: { ownerId: decoded.userId },
    orderBy: { createdAt: "desc" },
  });

  const userRecord = await prisma.user.findUnique({
    where: { id: decoded.userId }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Your Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your digitally secured items</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-600 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
            Karma Points: {userRecord?.rewardPoints || 0}
          </div>
          <Link 
            href="/item/add" 
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            <PlusCircle size={20} />
            <span className="hidden sm:inline">Add New Item</span>
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl border border-dashed border-border">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
            <QrCode size={32} />
          </div>
          <h3 className="text-xl font-medium mb-2">No items registered yet</h3>
          <p className="text-muted-foreground mb-6">Register your first item to generate its secure QR code.</p>
          <Link 
            href="/item/add" 
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition w-max mx-auto"
          >
            <PlusCircle size={20} />
            <span>Add Your First Item</span>
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: any) => (
            <div key={item.id} className="glass-card rounded-xl overflow-hidden shadow-sm flex flex-col">
              {item.imageUrl ? (
                <div 
                  className="h-48 w-full bg-cover bg-center border-b border-border"
                  style={{ backgroundImage: `url(${item.imageUrl})` }}
                />
              ) : (
                <div className="h-48 w-full bg-muted flex items-center justify-center border-b border-border">
                  <span className="text-muted-foreground">No Image</span>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{item.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${item.status === 'lost' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    {item.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <Link href={`/item/${item.id}/qr`} className="text-xs bg-muted px-3 py-1.5 rounded-full hover:bg-border transition flex items-center gap-1 font-medium">
                    <QrCode size={12} /> View QR
                  </Link>
                  <Link href={`/item/${item.id}/passport`} className="text-xs bg-muted px-3 py-1.5 rounded-full hover:bg-border transition flex items-center gap-1 font-medium">
                    <Activity size={12} /> Digital Passport
                  </Link>
                </div>
                
                <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
                  <Link href={`/item/${item.id}`} className="w-full text-center text-sm bg-primary/10 text-primary py-2 rounded-lg font-bold hover:bg-primary/20 transition flex justify-center items-center gap-2">
                    <Search size={16} /> Public View / Chat
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
