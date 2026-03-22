import { useApp } from "@/context/AppContext";
import { Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import {
  Star, Users, Calendar, Wallet, Clock, ArrowUpRight,
  LayoutDashboard, PiggyBank, Shield, Receipt, HeadphonesIcon, Settings, ChevronRight, User,
  Bell, AlertTriangle, CheckCircle
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

const SIDEBAR_LINKS = [
  { icon: LayoutDashboard, label: "Dashboard",    to: "/dashboard" },
  { icon: PiggyBank,       label: "Savings",       to: "/savings" },
  { icon: Shield,          label: "Groups",        to: "/groups" },
  { icon: Receipt,         label: "Transactions",  to: "/transactions" },
  { icon: HeadphonesIcon,  label: "Support",       to: "/support" },
  { icon: Calendar,        label: "Activity Log",  to: "/audit-logs" },
  { icon: Settings,        label: "Settings",      to: "/profile" },
];

export default function Dashboard() {
  const { currentUser, isLoggedIn, authLoading, groups, platformSettings } = useApp();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [mySlots, setMySlots] = useState<any[]>([]);
  const [showMaintenanceBanner, setShowMaintenanceBanner] = useState(false);

  useEffect(() => {
    if (currentUser) {
      loadTransactions();
      loadMySlots();
    }
  }, [currentUser]);

  useEffect(() => {
    if (platformSettings.maintenanceMode && currentUser?.role === "user") {
      setShowMaintenanceBanner(true);
    }
  }, [platformSettings, currentUser]);

  const loadTransactions = async () => {
    if (!currentUser) return;
    const { data } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setTransactions(data);
  };

  const loadMySlots = async () => {
    if (!currentUser) return;
    const { data } = await supabase
      .from("slots")
      .select("*, groups(name, contribution_amount, is_live)")
      .eq("user_id", currentUser.id);
    if (data) setMySlots(data);
  };

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
    </div>
  );
  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const activeGroups = mySlots.length;
  const totalPaid = currentUser?.totalPaid || 0;
  const pendingCount = transactions.filter(t => t.status === "pending").length;
  const nextPayout = mySlots.find(s => !s.is_disbursed);

  return (
    <div className="min-h-screen flex relative overflow-hidden pt-16">
      <ParticleBackground />

      {/* Maintenance Banner — non-closable */}
      {showMaintenanceBanner && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.90)", backdropFilter: "blur(8px)" }}>
          <div className="max-w-md w-full mx-4 rounded-2xl p-8 border border-amber-600/30 text-center"
            style={{ background: "rgba(15,10,0,0.95)" }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-900/30 border border-amber-600/40 flex items-center justify-center">
              <AlertTriangle size={28} className="text-amber-400" />
            </div>
            <h2 className="font-cinzel font-bold text-xl text-amber-400 mb-2">Platform Maintenance</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {platformSettings.maintenanceMessage}
            </p>
            <p className="text-amber-400/60 text-xs mt-4">
              We appreciate your patience and understanding. Our team is working hard to serve you better.
            </p>
            <div className="mt-6 p-3 rounded-xl bg-gold/5 border border-gold/15 text-xs text-muted-foreground">
              For urgent matters, please contact our support team.
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-gold/10 z-10 pt-6 pb-6"
        style={{ background: "rgba(8,8,8,0.85)", backdropFilter: "blur(20px)" }}>
        <div className="px-5 mb-8 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shadow animate-glow-pulse shrink-0">
            <span className="text-obsidian font-cinzel font-black text-xs">RA</span>
          </div>
          <span className="gold-gradient-text font-cinzel font-bold text-sm tracking-wide">RTA</span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {SIDEBAR_LINKS.map(item => {
            const isActive = window.location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? "bg-gold/15 border border-gold/25 text-gold" : "text-muted-foreground hover:text-foreground hover:bg-gold/5"
                }`}>
                <item.icon size={16} className={isActive ? "text-gold" : ""} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-w-0 overflow-x-hidden z-10 px-4 md:px-6 py-6">
        <div className="flex items-center justify-end gap-3 mb-6">
          <Link to="/profile"
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/20 bg-gold/5 hover:bg-gold/10 transition-all text-sm">
            <Settings size={13} className="text-muted-foreground" />
            <span className="text-foreground font-medium text-xs">{currentUser?.username}</span>
            <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
              {currentUser?.profilePicture ? (
                <img src={currentUser.profilePicture} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User size={12} className="text-obsidian" />
              )}
            </div>
            <ChevronRight size={12} className="text-muted-foreground" />
          </Link>
        </div>

        {/* Welcome */}
        <div className="mb-8 animate-fade-up">
          <h1 className="font-cinzel font-black text-3xl md:text-4xl mb-1"
            style={{ background: "linear-gradient(135deg, hsl(45,93%,47%), hsl(45,100%,65%), hsl(38,92%,50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "0.04em" }}>
            WELCOME BACK,
          </h1>
          <h2 className="font-cinzel font-black text-3xl md:text-4xl"
            style={{ background: "linear-gradient(135deg, hsl(45,93%,47%), hsl(45,100%,65%), hsl(38,92%,50%))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", letterSpacing: "0.04em" }}>
            {currentUser?.firstName?.toUpperCase() || "USER"}
            {currentUser?.isVip && <span className="vip-badge ml-3 align-middle text-base">✦ VIP</span>}
            {currentUser?.isDefaulter && <span className="ml-3 px-2 py-0.5 rounded-full bg-red-900/30 border border-red-600/30 text-red-400 text-xs font-bold align-middle">⚠ DEFAULTER</span>}
          </h2>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Star, label: "Trust Score", value: `${currentUser?.trustScore || 80}%★`, color: "text-gold" },
            { icon: Users, label: "Active Slots", value: activeGroups.toString(), color: "text-foreground" },
            { icon: Calendar, label: "Next Payout", value: nextPayout ? `Seat #${nextPayout.seat_number}` : "—", color: "text-foreground" },
          ].map((s, i) => (
            <div key={s.label} className="rounded-2xl p-6 flex flex-col gap-3 animate-fade-up"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(234,179,8,0.2)", backdropFilter: "blur(16px)", animationDelay: `${i * 0.1}s` }}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: "rgba(234,179,8,0.15)", border: "1px solid rgba(234,179,8,0.25)" }}>
                <s.icon size={22} className="text-gold" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">{s.label}</p>
                <p className={`font-cinzel font-black text-3xl mt-1 ${s.color}`}>{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Your Circles */}
          <div className="lg:col-span-2 rounded-2xl overflow-hidden animate-fade-up delay-300"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(234,179,8,0.15)", backdropFilter: "blur(16px)" }}>
            <div className="px-5 py-4 border-b border-gold/10">
              <h2 className="gold-gradient-text font-cinzel font-bold text-base">Your Circles</h2>
            </div>
            <div className="p-4 space-y-2">
              {mySlots.length === 0 ? (
                <p className="text-muted-foreground text-xs p-3 text-center">You haven't joined any groups yet.</p>
              ) : (
                mySlots.slice(0, 4).map((s) => (
                  <Link key={s.id} to={`/groups/${s.group_id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gold/5 border border-transparent hover:border-gold/20 transition-all group">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(234,179,8,0.1)", border: "1px solid rgba(234,179,8,0.2)" }}>
                      <Users size={14} className="text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-sm font-semibold truncate">{s.groups?.name}</p>
                      <p className="text-muted-foreground text-xs">Seat #{s.seat_number} · ₦{s.groups?.contribution_amount?.toLocaleString()}</p>
                    </div>
                    {s.groups?.is_live && <span className="live-badge shrink-0 text-[9px]">● LIVE</span>}
                    <ChevronRight size={13} className="text-muted-foreground group-hover:text-gold transition-colors shrink-0" />
                  </Link>
                ))
              )}
              <Link to="/groups" className="flex items-center justify-center gap-2 mt-2 py-2.5 rounded-xl text-xs font-semibold btn-glass">
                Browse All Groups <ArrowUpRight size={12} />
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="lg:col-span-3 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Wallet, label: "Total Paid", value: `₦${totalPaid.toLocaleString()}`, color: "text-gold" },
                { icon: Clock,  label: "Pending",    value: pendingCount.toString(), color: "text-amber-400" },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-4 animate-fade-up"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(234,179,8,0.12)", backdropFilter: "blur(12px)" }}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${s.color}`} style={{ background: "rgba(234,179,8,0.1)" }}>
                    <s.icon size={16} />
                  </div>
                  <p className={`text-xl font-cinzel font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-muted-foreground text-xs mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Transactions table */}
            <div className="rounded-2xl overflow-hidden animate-fade-up delay-200"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(234,179,8,0.12)", backdropFilter: "blur(16px)" }}>
              <div className="px-5 py-3.5 border-b border-gold/10 flex items-center justify-between">
                <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-wide">Recent Transactions</h2>
                <Link to="/transactions" className="text-xs text-muted-foreground hover:text-gold transition-colors flex items-center gap-1">
                  View all <ArrowUpRight size={11} />
                </Link>
              </div>
              <div className="overflow-x-auto">
                {transactions.length === 0 ? (
                  <p className="text-muted-foreground text-xs p-4 text-center">No transactions yet.</p>
                ) : (
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gold/5">
                        {["Code","Group","Amount","Status","Date"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] text-muted-foreground/60 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(t => (
                        <tr key={t.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                          <td className="px-4 py-3 text-gold font-mono">{t.code}</td>
                          <td className="px-4 py-3 text-foreground/70 truncate max-w-[80px]">{t.group_name}</td>
                          <td className="px-4 py-3 text-foreground font-semibold">₦{t.amount?.toLocaleString()}</td>
                          <td className="px-4 py-3"><span className={`status-${t.status}`}>{t.status}</span></td>
                          <td className="px-4 py-3 text-muted-foreground">{t.created_at?.split("T")[0]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
