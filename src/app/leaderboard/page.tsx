import prisma from "@/lib/prisma";
import { Trophy, Medal, Star } from "lucide-react";

export default async function LeaderboardPage() {
  const topUsers = await prisma.user.findMany({
    orderBy: { rewardPoints: "desc" },
    take: 10,
    select: { id: true, name: true, rewardPoints: true }
  });

  const totalItems = await prisma.item.count();
  const recoveredItems = await prisma.item.count({ where: { status: "recovered" } });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Analytics & Leaderboard</h1>
        <p className="text-muted-foreground mt-1">Platform insights and the top helpful Samaritans.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-primary mb-2">{totalItems}</span>
          <span className="text-muted-foreground font-medium">Total Items Protected</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <span className="text-4xl font-bold text-green-500 mb-2">{recoveredItems}</span>
          <span className="text-muted-foreground font-medium">Items Recovered</span>
        </div>
        <div className="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center bg-gradient-to-br from-primary/5 to-accent/5">
          <span className="text-4xl font-bold text-accent mb-2">{(recoveredItems / (totalItems || 1) * 100).toFixed(1)}%</span>
          <span className="text-muted-foreground font-medium">Success Rate</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="text-amber-500" /> Top Helpers
        </h2>
        
        <div className="glass-card rounded-2xl overflow-hidden shadow-sm">
          {topUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No data yet.</div>
          ) : (
            <div className="divide-y divide-border">
              {topUsers.map((user: any, index: number) => (
                <div key={user.id} className="p-4 sm:p-6 flex items-center justify-between hover:bg-muted/50 transition">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                      ${index === 0 ? 'bg-amber-100 text-amber-600' : index === 1 ? 'bg-slate-200 text-slate-600' : index === 2 ? 'bg-orange-100 text-orange-600' : 'bg-muted text-muted-foreground'}
                    `}>
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{user.name}</h3>
                      {index === 0 && <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full font-medium">Top Hero</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-primary">
                    <Star size={16} className="fill-primary" />
                    <span>{user.rewardPoints} Karma</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
