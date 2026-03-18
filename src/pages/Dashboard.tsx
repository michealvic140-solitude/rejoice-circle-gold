import { useApp } from "@/context/AppContext";
import { Navigate, Link } from "react-router-dom";
import { TrendingUp, Wallet, Clock, Gift, ArrowUpRight } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

export default function Dashboard() {
  const { currentUser, isLoggedIn, transactions, groups } = useApp();
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const stats = [
    { icon: TrendingUp, label: "Active Slots", value: currentUser!.activeSlots.toString(), sub: "across all groups", color: "text-emerald-400" },
    { icon: Wallet, label: "Total Paid", value: `₦${currentUser!.totalPaid.toLocaleString()}`, sub: "lifetime contributions", color: "text-gold" },
    { icon: Clock, label: "Pending", value: transactions.filter(t => t.status === "pending").length.toString(), sub: "awaiting approval", color: "text-amber-400" },
    { icon: Gift, label: "Upcoming Payout", value: "₦500,000", sub: "estimated next payout", color: "text-sky-400" },
  ];

  const myGroups = groups.slice(0, 3);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <ParticleBackground />
      <div className="max-w-7xl mx-auto relative">

        {/* Welcome */}
        <div className="mb-8 animate-fade-up">
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Dashboard</p>
          <h1 className="gold-gradient-text text-3xl font-cinzel font-bold mt-1">
            Welcome back, {currentUser!.firstName}
            {currentUser!.isVip && <span className="vip-badge ml-3 align-middle">VIP ✦</span>}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Here's an overview of your savings activity.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s, i) => (
            <div key={s.label} className={`glass-card p-5 animate-fade-up delay-${(i + 1) * 100}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl bg-muted/50 flex items-center justify-center ${s.color}`}>
                  <s.icon size={18} />
                </div>
              </div>
              <p className={`text-2xl font-bold font-cinzel ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              <p className="text-xs text-muted-foreground/60">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Transaction Table */}
          <div className="lg:col-span-2 glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-200">
            <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between">
              <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-wide">Recent Transactions</h2>
              <Link to="/transactions" className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center gap-1">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="overflow-x-auto scrollbar-gold">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gold/5">
                    {["Code", "Group", "Amount", "Status", "Date"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                      <td className="px-4 py-3 text-gold text-xs font-mono">{t.code}</td>
                      <td className="px-4 py-3 text-foreground/80 text-xs">{t.groupName}</td>
                      <td className="px-4 py-3 text-foreground font-semibold text-xs">₦{t.amount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={`status-${t.status}`}>{t.status}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{t.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* My Groups */}
          <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-300">
            <div className="px-6 py-4 border-b border-gold/10 flex items-center justify-between">
              <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-wide">My Groups</h2>
              <Link to="/groups" className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center gap-1">
                Browse <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="p-4 space-y-3">
              {myGroups.map(g => (
                <Link key={g.id} to={`/groups/${g.id}`} className="glass-card p-4 block">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-foreground text-sm font-semibold">{g.name}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">₦{g.contributionAmount.toLocaleString()} / {g.cycleType}</p>
                    </div>
                    {g.isLive && <span className="live-badge shrink-0">● LIVE</span>}
                  </div>
                  <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(g.filledSlots / g.totalSlots) * 100}%`, background: "linear-gradient(90deg, hsl(45,93%,47%), hsl(45,100%,60%))" }}
                    />
                  </div>
                </Link>
              ))}
              <Link to="/groups" className="btn-glass w-full text-center py-2.5 rounded-lg text-xs font-semibold block mt-2">
                + Join New Group
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
