import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";
import { Users, BarChart3, Shield, Bell, FileText, Ban, Star, Unlock, Lock } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

const tabs = [
  { id: "overview", icon: BarChart3, label: "Overview" },
  { id: "users", icon: Users, label: "Users" },
  { id: "groups", icon: Shield, label: "Groups" },
  { id: "transactions", icon: FileText, label: "Transactions" },
  { id: "audit", icon: FileText, label: "Audit Logs" },
];

export default function Admin() {
  const { currentUser, isLoggedIn, groups, transactions } = useApp();
  const [tab, setTab] = useState("overview");

  if (!isLoggedIn || currentUser?.role !== "admin") return <Navigate to="/" replace />;

  const mockUsers = [
    { id: "u1", username: "goldmember", name: "Rejoice Adeyemi", status: "active", isVip: true, paid: 450000 },
    { id: "u2", username: "ChiefSaver", name: "Emeka Okonkwo", status: "active", isVip: true, paid: 1200000 },
    { id: "u3", username: "testuser", name: "Test User", status: "restricted", isVip: false, paid: 50000 },
  ];

  const auditLogs = [
    { id: "a1", action: "User goldmember approved for Golden Circle Alpha", admin: "admin", time: "2025-03-17 08:05" },
    { id: "a2", action: "Group 'Diamond Elite Circle' chat locked", admin: "admin", time: "2025-03-16 14:22" },
    { id: "a3", action: "User testuser restricted by admin", admin: "admin", time: "2025-03-15 10:10" },
    { id: "a4", action: "Payment RAJ-0000012 approved for goldmember", admin: "admin", time: "2025-03-17 09:00" },
  ];

  const stats = [
    { label: "Total Users", value: "1,248", color: "text-gold" },
    { label: "Active Groups", value: groups.filter(g => g.isLive).length.toString(), color: "text-emerald-400" },
    { label: "Pending Payments", value: transactions.filter(t => t.status === "pending").length.toString(), color: "text-amber-400" },
    { label: "Total Paid Out", value: "₦2.4B", color: "text-sky-400" },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <ParticleBackground />
      <div className="max-w-7xl mx-auto relative">
        <div className="mb-8 animate-fade-up">
          <p className="text-muted-foreground text-xs uppercase tracking-widest">Admin Panel</p>
          <h1 className="gold-gradient-text text-3xl font-cinzel font-bold mt-1">Rejoice Ajo Control Center</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap animate-fade-up delay-100">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${tab === t.id ? "btn-gold" : "btn-glass"}`}>
              <t.icon size={13} />{t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === "overview" && (
          <div className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(s => (
                <div key={s.label} className="glass-card p-5">
                  <p className={`text-2xl font-bold font-cinzel ${s.color}`}>{s.value}</p>
                  <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="glass-card-static rounded-2xl p-6">
              <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {["Approve Payments","Create Group","Ban User","Freeze Account","Assign VIP","Remind User","Lock Chat","View Defaulters"].map(a => (
                  <button key={a} className="btn-glass px-3 py-2.5 rounded-lg text-xs font-semibold text-left hover:bg-gold/10 transition-all">{a}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users */}
        {tab === "users" && (
          <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
            <div className="px-6 py-4 border-b border-gold/10">
              <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest">User Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gold/5">
                  {["Username","Full Name","Status","Total Paid","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {mockUsers.map(u => (
                    <tr key={u.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                      <td className="px-4 py-3"><div className="flex items-center gap-2"><span className="text-foreground font-semibold text-xs">@{u.username}</span>{u.isVip && <span className="vip-badge">VIP</span>}</div></td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{u.name}</td>
                      <td className="px-4 py-3"><span className={u.status === "active" ? "status-approved" : "status-declined"}>{u.status}</span></td>
                      <td className="px-4 py-3 text-gold font-semibold text-xs">₦{u.paid.toLocaleString()}</td>
                      <td className="px-4 py-3"><div className="flex gap-1.5">
                        <button className="btn-glass px-2 py-1 rounded text-xs"><Ban size={10} className="inline mr-1" />Ban</button>
                        <button className="btn-glass px-2 py-1 rounded text-xs"><Star size={10} className="inline mr-1" />VIP</button>
                        <button className="btn-glass px-2 py-1 rounded text-xs"><Bell size={10} className="inline mr-1" />Remind</button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Groups */}
        {tab === "groups" && (
          <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
            <div className="px-6 py-4 border-b border-gold/10">
              <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest">Group Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gold/5">
                  {["Group","Amount","Cycle","Status","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {groups.map(g => (
                    <tr key={g.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                      <td className="px-4 py-3 text-foreground font-semibold text-xs">{g.name}</td>
                      <td className="px-4 py-3 text-gold font-bold text-xs">₦{g.contributionAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs capitalize">{g.cycleType}</td>
                      <td className="px-4 py-3">{g.isLive ? <span className="live-badge">LIVE</span> : <span className="status-pending">Inactive</span>}</td>
                      <td className="px-4 py-3"><div className="flex gap-1.5">
                        <button className="btn-glass px-2 py-1 rounded text-xs">Make Live</button>
                        {g.chatLocked ? <button className="btn-glass px-2 py-1 rounded text-xs"><Unlock size={10} className="inline mr-1" />Open Chat</button> : <button className="btn-glass px-2 py-1 rounded text-xs"><Lock size={10} className="inline mr-1" />Lock Chat</button>}
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Transactions */}
        {tab === "transactions" && (
          <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
            <div className="px-6 py-4 border-b border-gold/10">
              <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest">Transaction Approvals</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-gold/5">
                  {["Code","Group","Amount","Status","Date","Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                      <td className="px-4 py-3 text-gold text-xs font-mono">{t.code}</td>
                      <td className="px-4 py-3 text-foreground/80 text-xs">{t.groupName}</td>
                      <td className="px-4 py-3 text-foreground font-semibold text-xs">₦{t.amount.toLocaleString()}</td>
                      <td className="px-4 py-3"><span className={`status-${t.status}`}>{t.status}</span></td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{t.date}</td>
                      <td className="px-4 py-3">{t.status === "pending" && <div className="flex gap-1.5"><button className="px-2 py-1 rounded text-xs bg-emerald-900/30 border border-emerald-600/30 text-emerald-400">Approve</button><button className="px-2 py-1 rounded text-xs bg-red-900/30 border border-red-600/30 text-red-400">Decline</button></div>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Audit Logs */}
        {tab === "audit" && (
          <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
            <div className="px-6 py-4 border-b border-gold/10">
              <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest">Audit Logs</h2>
            </div>
            <div className="divide-y divide-gold/5">
              {auditLogs.map(log => (
                <div key={log.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gold/3 transition-colors">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2 shrink-0" />
                  <div className="flex-1">
                    <p className="text-foreground text-sm">{log.action}</p>
                    <p className="text-muted-foreground text-xs mt-0.5">by <span className="text-gold">@{log.admin}</span> · {log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
