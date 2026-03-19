import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";
import {
  Users, BarChart3, Shield, FileText, Bell, Ban, Star, Unlock, Lock,
  Search, Settings, AlertTriangle, CheckCircle, X, ChevronRight,
  MessageSquare, UserX, UserCheck, Crown, Eye, Edit, Trash2,
  ToggleLeft, ToggleRight, Send, Plus, Megaphone, ListChecks,
  Clock, TrendingUp, LogOut
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

type AdminTab = "users" | "groups" | "payments" | "announcements" | "support" | "curothings";

const MOCK_USERS = [
  { id: "u1", username: "michaelVictor0014", email: "Douegabrion", trustScore: 85, status: "active", isVip: true, aurelScor: 85, role: "user" as const },
  { id: "u2", username: "michaelVictor0014", email: "Douegabrion", trustScore: 29200, status: "active", isVip: true, aurelScor: 29200, role: "user" as const },
  { id: "u3", username: "michaelVictor0014", email: "Douegabrion", trustScore: 29200, status: "restricted", isVip: true, aurelScor: 29200, role: "moderator" as const },
  { id: "u4", username: "michaelVictor0014", email: "Douegabrion", trustScore: 29200, status: "active", isVip: false, aurelScor: 29200, role: "user" as const },
  { id: "u5", username: "goldmember", email: "rejoice@example.com", trustScore: 4500, status: "active", isVip: true, aurelScor: 4500, role: "user" as const },
];

const MOCK_SEAT_CHANGE_REQUESTS = [
  { id: "s1", user: "goldmember", from: 5, to: 12, reason: "Conflict with schedule", time: "2025-03-17 10:00" },
  { id: "s2", user: "ChiefSaver", from: 22, to: 45, reason: "Personal preference", time: "2025-03-16 15:30" },
];

const MOCK_DEFAULTERS = [
  { id: "d1", user: "testuser", group: "Golden Circle Alpha", since: "2025-03-15", count: 2 },
  { id: "d2", user: "newmember", group: "Silver Vault Weekly", since: "2025-03-14", count: 1 },
];

const MOCK_AUDIT_LOGS = [
  { id: "a1", action: "Acme Funstier 2014", admin: "admin", time: "2025-03-17 08:05", type: "approve" },
  { id: "a2", action: "Unact For 018", admin: "admin", time: "2025-03-16 14:22", type: "lock" },
  { id: "a3", action: "Some Maratler 2023", admin: "admin", time: "2025-03-15 10:10", type: "restrict" },
  { id: "a4", action: "Payment RAJ-0000012 approved for goldmember", admin: "admin", time: "2025-03-17 09:00", type: "approve" },
  { id: "a5", action: "User testuser marked as defaulter", admin: "system", time: "2025-03-15 00:01", type: "warn" },
];

const SIDEBAR_ITEMS = [
  { id: "overview", icon: BarChart3, label: "Overview" },
  { id: "users", icon: Users, label: "Users" },
  { id: "groups", icon: Shield, label: "Groups" },
  { id: "payments", icon: FileText, label: "Payments" },
  { id: "announcements", icon: Megaphone, label: "Annoucements" },
  { id: "seat-changes", icon: ListChecks, label: "Seat Changes" },
  { id: "defaulters", icon: AlertTriangle, label: "Defaulters" },
  { id: "audit", icon: FileText, label: "Audit Logs" },
] as const;

type SideTab = typeof SIDEBAR_ITEMS[number]["id"];

export default function Admin() {
  const { currentUser, isLoggedIn, groups, transactions } = useApp();
  const [sideTab, setSideTab] = useState<SideTab>("overview");
  const [mainTab, setMainTab] = useState<AdminTab>("users");
  const [searchQuery, setSearchQuery] = useState("");
  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [reminderTarget, setReminderTarget] = useState("");
  const [reminderMsg, setReminderMsg] = useState("");
  const [userActions, setUserActions] = useState<Record<string, string[]>>({});

  if (!isLoggedIn || currentUser?.role !== "admin") return <Navigate to="/" replace />;

  const stats = [
    { label: "Total Users", value: "1,248", icon: Users, color: "text-gold" },
    { label: "Active Groups", value: groups.filter(g => g.isLive).length.toString(), icon: Shield, color: "text-emerald-400" },
    { label: "Pending Payments", value: transactions.filter(t => t.status === "pending").length.toString(), icon: Clock, color: "text-amber-400" },
    { label: "Total Paid Out", value: "₦2.4B", icon: TrendingUp, color: "text-sky-400" },
  ];

  const toggleAction = (userId: string, action: string) => {
    setUserActions(prev => {
      const current = prev[userId] || [];
      return { ...prev, [userId]: current.includes(action) ? current.filter(a => a !== action) : [...current, action] };
    });
  };

  const filteredUsers = MOCK_USERS.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <ParticleBackground />

      {/* ============ SIDEBAR ============ */}
      <aside className="w-48 shrink-0 border-r border-gold/10 bg-black/60 backdrop-blur-xl pt-20 pb-8 flex flex-col z-10 hidden md:flex">
        {/* Logo area */}
        <div className="px-5 mb-6">
          <p className="gold-gradient-text font-cinzel font-black text-xl leading-tight">Rejoice</p>
          <p className="gold-gradient-text font-cinzel font-black text-xl leading-tight">Ajo</p>
          <p className="text-muted-foreground/60 text-[10px] mt-1">v1.05</p>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-2 space-y-1">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setSideTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                sideTab === item.id
                  ? "bg-gold/15 border border-gold/30 text-gold"
                  : "text-muted-foreground hover:text-foreground hover:bg-gold/5"
              }`}
            >
              <item.icon size={14} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Server Maintenance */}
        <div className="px-3 mt-auto pt-4 border-t border-gold/10">
          <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
            <p className="text-muted-foreground text-[10px] uppercase tracking-wider mb-2">Server Maintenance</p>
            <button
              onClick={() => setServerMaintenance(!serverMaintenance)}
              className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all ${
                serverMaintenance
                  ? "bg-gold/20 border border-gold/40 text-gold"
                  : "bg-muted/20 border border-muted/20 text-muted-foreground"
              }`}
            >
              {serverMaintenance ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
              {serverMaintenance ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 pt-20 pb-8 overflow-x-hidden z-10 min-w-0">

        {/* Top bar */}
        <div className="px-4 md:px-6 mb-5">
          <div className="flex items-center justify-between gap-3">
            <h1 className="gold-gradient-text text-2xl font-cinzel font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowAnnouncement(true)} className="btn-glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                <Send size={11} /> Send Announcement
              </button>
              <button onClick={() => setShowCreateGroup(true)} className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <Plus size={11} /> Create Group
              </button>
            </div>
          </div>

          {/* Tab bar (matches reference image top tabs) */}
          <div className="flex items-center gap-1 mt-4 border-b border-gold/10 pb-0">
            {(["users", "groups", "payments", "announcements", "support", "curothings"] as AdminTab[]).map(t => (
              <button
                key={t}
                onClick={() => { setMainTab(t); setSideTab(t === "users" ? "users" : t === "groups" ? "groups" : t === "payments" ? "payments" : t === "announcements" ? "announcements" : "overview"); }}
                className={`px-4 py-2.5 text-xs font-semibold capitalize border-b-2 transition-all whitespace-nowrap ${
                  mainTab === t
                    ? "border-gold text-gold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2 pb-1">
              <span className="text-muted-foreground text-xs">All</span>
              <select className="luxury-input py-1 text-xs w-16 rounded-lg">
                <option>All</option>
                <option>VIP</option>
                <option>Banned</option>
              </select>
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 space-y-5">

          {/* ======= OVERVIEW STATS (shown in overview mode) ======= */}
          {sideTab === "overview" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-fade-up">
              {stats.map(s => (
                <div key={s.label} className="glass-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <s.icon size={16} className={s.color} />
                    <span className={`text-2xl font-cinzel font-bold ${s.color}`}>{s.value}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ======= USERS TABLE ======= */}
          {(mainTab === "users" || sideTab === "users") && (
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
              {/* Table header */}
              <div className="px-4 py-3 border-b border-gold/10 flex items-center justify-between gap-3">
                <h2 className="gold-text font-cinzel font-bold text-sm">Users</h2>
                <div className="flex items-center gap-2 flex-1 max-w-xs">
                  <div className="relative flex-1">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search..."
                      className="luxury-input pl-7 py-1.5 text-xs"
                    />
                  </div>
                  <button className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold">Seletach</button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gold/5">
                      {["Username", "Email", "Trust Score", "Status", "VIP", "Aruet Scor", ""].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] text-muted-foreground/60 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u, i) => (
                      <tr key={u.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                        {/* Username */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                              i === 0 ? "bg-blue-600 text-white" :
                              i === 2 ? "bg-emerald-600 text-white" :
                              "bg-gold/20 text-gold"
                            }`}>
                              {u.username[0].toUpperCase()}
                            </div>
                            <span className="text-foreground font-semibold">{u.username}</span>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-3 py-3 text-muted-foreground">{u.email}</td>
                        {/* Trust Score */}
                        <td className="px-3 py-3">
                          <span className="text-muted-foreground">Trust Score <span className="text-foreground font-bold">{u.trustScore > 1000 ? "Catel Score" : "Trust Score"}</span></span>
                        </td>
                        {/* Status */}
                        <td className="px-3 py-3">
                          <span className={u.status === "active" ? "text-emerald-400 font-semibold" : u.status === "restricted" ? "text-amber-400 font-semibold" : "text-red-400 font-semibold"}>
                            {u.trustScore.toLocaleString()}
                          </span>
                        </td>
                        {/* VIP */}
                        <td className="px-3 py-3">
                          {u.isVip && <span className="vip-badge">VIP</span>}
                        </td>
                        {/* Aurel Score */}
                        <td className="px-3 py-3 text-muted-foreground">{u.aurelScor.toLocaleString()}</td>
                        {/* Actions */}
                        <td className="px-3 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            <button
                              onClick={() => toggleAction(u.id, "promoted")}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                                userActions[u.id]?.includes("promoted")
                                  ? "bg-purple-900/40 border-purple-500/50 text-purple-300"
                                  : "btn-glass text-xs"
                              }`}
                            >
                              <Crown size={9} className="inline mr-0.5" />Promote Moderator
                            </button>
                            <button
                              onClick={() => toggleAction(u.id, "frozen")}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                                userActions[u.id]?.includes("frozen")
                                  ? "bg-blue-900/40 border-blue-500/50 text-blue-300"
                                  : "btn-glass"
                              }`}
                            >
                              <Lock size={9} className="inline mr-0.5" />Freeze Account
                            </button>
                            <button
                              onClick={() => toggleAction(u.id, "banned")}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                                userActions[u.id]?.includes("banned")
                                  ? "bg-red-900/40 border-red-500/50 text-red-300"
                                  : "bg-muted/10 border-muted/20 text-muted-foreground hover:border-red-500/40 hover:text-red-400"
                              }`}
                            >
                              <Ban size={9} className="inline mr-0.5" />Ban
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======= GROUPS TABLE ======= */}
          {(mainTab === "groups" || sideTab === "groups") && (
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
              <div className="px-4 py-3 border-b border-gold/10 flex items-center justify-between">
                <h2 className="gold-text font-cinzel font-bold text-sm">Group Management</h2>
                <button onClick={() => setShowCreateGroup(true)} className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Plus size={11} /> Create Group
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[560px]">
                  <thead>
                    <tr className="border-b border-gold/5">
                      {["Group Name", "Amount", "Cycle", "Slots", "Status", "Actions"].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] text-muted-foreground/60 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {groups.map(g => (
                      <tr key={g.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                        <td className="px-3 py-3 text-foreground font-semibold">{g.name}</td>
                        <td className="px-3 py-3 text-gold font-bold">₦{g.contributionAmount.toLocaleString()}</td>
                        <td className="px-3 py-3 text-muted-foreground capitalize">{g.cycleType}</td>
                        <td className="px-3 py-3 text-muted-foreground">{g.filledSlots}/{g.totalSlots}</td>
                        <td className="px-3 py-3">
                          {g.isLive ? <span className="live-badge">LIVE</span> : <span className="status-pending">Inactive</span>}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            <button className="btn-gold px-2 py-1 rounded text-[10px] font-bold">Make Live</button>
                            <button className="btn-glass px-2 py-1 rounded text-[10px]">
                              {g.chatLocked ? <><Unlock size={9} className="inline mr-0.5" />Open Chat</> : <><Lock size={9} className="inline mr-0.5" />Lock Chat</>}
                            </button>
                            <button className="btn-glass px-2 py-1 rounded text-[10px]">
                              <Eye size={9} className="inline mr-0.5" />View
                            </button>
                            <button className="btn-glass px-2 py-1 rounded text-[10px]">
                              <Edit size={9} className="inline mr-0.5" />Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======= PAYMENTS TABLE ======= */}
          {(mainTab === "payments" || sideTab === "payments") && (
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
              <div className="px-4 py-3 border-b border-gold/10">
                <h2 className="gold-text font-cinzel font-bold text-sm">Transaction Approvals</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[520px]">
                  <thead>
                    <tr className="border-b border-gold/5">
                      {["Code", "Group", "User", "Amount", "Status", "Date", "Actions"].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] text-muted-foreground/60 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map(t => (
                      <tr key={t.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                        <td className="px-3 py-3 text-gold font-mono">{t.code}</td>
                        <td className="px-3 py-3 text-foreground/80">{t.groupName}</td>
                        <td className="px-3 py-3 text-foreground/80">goldmember</td>
                        <td className="px-3 py-3 text-foreground font-bold">₦{t.amount.toLocaleString()}</td>
                        <td className="px-3 py-3"><span className={`status-${t.status}`}>{t.status}</span></td>
                        <td className="px-3 py-3 text-muted-foreground">{t.date}</td>
                        <td className="px-3 py-3">
                          {t.status === "pending" && (
                            <div className="flex gap-1.5">
                              <button className="px-2 py-1 rounded text-[10px] bg-emerald-900/30 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-900/50 transition-all flex items-center gap-0.5">
                                <CheckCircle size={9} />Approve
                              </button>
                              <button className="px-2 py-1 rounded text-[10px] bg-red-900/30 border border-red-600/30 text-red-400 hover:bg-red-900/50 transition-all flex items-center gap-0.5">
                                <X size={9} />Decline
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======= BOTTOM PANELS GRID (matching reference image) ======= */}
          {(sideTab === "overview" || sideTab === "users") && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 animate-fade-up">

              {/* Seat Change Requests */}
              <div className="glass-card-static rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="gold-text font-cinzel font-bold text-xs uppercase tracking-widest">Seat Change Requests</h3>
                  <ChevronRight size={13} className="text-gold/50" />
                </div>
                <div className="space-y-2">
                  {MOCK_SEAT_CHANGE_REQUESTS.map(r => (
                    <div key={r.id} className="p-2 rounded-lg bg-gold/5 border border-gold/10">
                      <p className="text-foreground text-[10px] font-semibold">@{r.user}</p>
                      <p className="text-muted-foreground text-[10px]">Rest clame <span className="text-amber-400">ⓘ</span></p>
                      <div className="flex gap-1.5 mt-2">
                        <button className="flex-1 py-1 rounded text-[10px] font-bold bg-emerald-900/30 border border-emerald-600/30 text-emerald-400">Approve</button>
                        <button className="flex-1 py-1 rounded text-[10px] font-bold bg-red-900/30 border border-red-600/30 text-red-400">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Defaulters Panel */}
              <div className="glass-card-static rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="gold-text font-cinzel font-bold text-xs uppercase tracking-widest">Defaulters</h3>
                  <ChevronRight size={13} className="text-gold/50" />
                </div>
                <p className="text-muted-foreground text-[10px] mb-2">Penalty <span className="text-amber-400">ⓘ</span></p>
                {MOCK_DEFAULTERS.map(d => (
                  <div key={d.id} className="mb-2">
                    <p className="text-foreground text-[10px] font-semibold">@{d.user} — {d.group}</p>
                    <p className="text-muted-foreground text-[9px]">Since {d.since} · {d.count} missed</p>
                  </div>
                ))}
                <div className="flex gap-1.5 mt-3">
                  <button className="flex-1 py-1 rounded text-[10px] font-bold bg-amber-900/30 border border-amber-500/30 text-amber-400">Warn</button>
                  <button className="flex-1 py-1 rounded text-[10px] font-bold bg-orange-900/30 border border-orange-500/30 text-orange-400">Suspend</button>
                  <button className="flex-1 py-1 rounded text-[10px] font-bold bg-red-900/30 border border-red-600/30 text-red-400">Ban</button>
                </div>
              </div>

              {/* Audit Logs */}
              <div className="glass-card-static rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="gold-text font-cinzel font-bold text-xs uppercase tracking-widest">Audit Logs</h3>
                </div>
                <div className="space-y-1.5">
                  {MOCK_AUDIT_LOGS.slice(0, 5).map(log => (
                    <div key={log.id} className="flex items-start gap-2">
                      <CheckCircle size={10} className="text-gold mt-0.5 shrink-0" />
                      <p className="text-muted-foreground text-[10px] leading-relaxed">{log.action}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Server Maintenance */}
              <div className="glass-card-static rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="gold-text font-cinzel font-bold text-xs uppercase tracking-widest">Server Maintenance</h3>
                  <button
                    onClick={() => setServerMaintenance(!serverMaintenance)}
                    className={`w-10 h-5 rounded-full transition-all flex items-center ${serverMaintenance ? "bg-gold" : "bg-muted/40"}`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${serverMaintenance ? "translate-x-5" : "translate-x-0"}`} />
                  </button>
                </div>
                <p className="text-muted-foreground text-[10px] mb-3">
                  {serverMaintenance ? "🔴 Maintenance mode active. Users cannot access platform." : "Platform is running normally."}
                </p>
                <button
                  onClick={() => setShowAnnouncement(true)}
                  className="w-full py-2 rounded-lg btn-gold text-[10px] font-bold flex items-center justify-center gap-1.5"
                >
                  <Send size={10} /> Send Announcement
                </button>

                {/* Remind Users */}
                <button
                  onClick={() => setShowReminderModal(true)}
                  className="w-full py-2 rounded-lg btn-glass text-[10px] font-semibold flex items-center justify-center gap-1.5 mt-2"
                >
                  <Bell size={10} /> Remind User
                </button>
              </div>
            </div>
          )}

          {/* ======= AUDIT LOGS FULL VIEW ======= */}
          {sideTab === "audit" && (
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
              <div className="px-4 py-3 border-b border-gold/10">
                <h2 className="gold-text font-cinzel font-bold text-sm">Audit Logs</h2>
              </div>
              <div className="divide-y divide-gold/5">
                {MOCK_AUDIT_LOGS.map(log => (
                  <div key={log.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-gold/3 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      log.type === "approve" ? "bg-emerald-400" :
                      log.type === "warn" ? "bg-amber-400" :
                      log.type === "restrict" ? "bg-red-400" : "bg-gold"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-xs leading-relaxed">{log.action}</p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">
                        by <span className="text-gold">@{log.admin}</span> · {log.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======= DEFAULTERS FULL VIEW ======= */}
          {sideTab === "defaulters" && (
            <div className="space-y-4 animate-fade-up">
              <div className="glass-card-static rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gold/10 flex items-center gap-2">
                  <AlertTriangle size={15} className="text-amber-400" />
                  <h2 className="gold-text font-cinzel font-bold text-sm">Defaulter Management</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gold/5">
                        {["User", "Group", "Days Missed", "Since", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-[10px] text-muted-foreground/60 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_DEFAULTERS.map(d => (
                        <tr key={d.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                          <td className="px-4 py-3 text-foreground font-semibold">@{d.user}</td>
                          <td className="px-4 py-3 text-muted-foreground">{d.group}</td>
                          <td className="px-4 py-3 text-red-400 font-bold">{d.count}</td>
                          <td className="px-4 py-3 text-muted-foreground">{d.since}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-1.5">
                              <button className="px-2 py-1 rounded text-[10px] bg-amber-900/30 border border-amber-500/30 text-amber-400">Warn</button>
                              <button className="px-2 py-1 rounded text-[10px] bg-orange-900/30 border border-orange-500/30 text-orange-400">Suspend</button>
                              <button className="px-2 py-1 rounded text-[10px] bg-emerald-900/30 border border-emerald-600/30 text-emerald-400">Remove Status</button>
                              <button className="px-2 py-1 rounded text-[10px] btn-glass">
                                <Bell size={9} className="inline mr-0.5" />Remind
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ======= SEAT CHANGES ======= */}
          {sideTab === "seat-changes" && (
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
              <div className="px-4 py-3 border-b border-gold/10">
                <h2 className="gold-text font-cinzel font-bold text-sm">Pending Seat Change Requests</h2>
              </div>
              <div className="divide-y divide-gold/5">
                {MOCK_SEAT_CHANGE_REQUESTS.map(r => (
                  <div key={r.id} className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-gold/3 transition-colors">
                    <div>
                      <p className="text-foreground font-semibold text-sm">@{r.user}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">
                        Seat <span className="text-gold font-bold">#{r.from}</span> → <span className="text-gold font-bold">#{r.to}</span>
                      </p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">"{r.reason}" · {r.time}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-900/30 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-900/50 transition-all">Approve</button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-900/30 border border-red-600/30 text-red-400 hover:bg-red-900/50 transition-all">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Announcements */}
          {(mainTab === "announcements" || sideTab === "announcements") && (
            <div className="glass-card-static rounded-2xl p-5 animate-fade-up">
              <h2 className="gold-text font-cinzel font-bold text-sm mb-4">Send Announcement</h2>
              <div className="space-y-3">
                <div>
                  <label className="luxury-label">Target</label>
                  <select className="luxury-input">
                    <option>All Users</option>
                    <option>Group Members</option>
                    <option>VIP Users</option>
                    <option>Defaulters</option>
                  </select>
                </div>
                <div>
                  <label className="luxury-label">Message</label>
                  <textarea rows={4} className="luxury-input resize-none" placeholder="Type your announcement..." />
                </div>
                <button className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                  <Send size={14} /> Send Announcement
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ============ REMINDER MODAL ============ */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-static rounded-2xl p-6 max-w-md w-full border border-gold/30 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <h3 className="gold-gradient-text font-cinzel font-bold text-lg">Send Reminder</h3>
              <button onClick={() => setShowReminderModal(false)} className="text-muted-foreground hover:text-foreground p-1"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="luxury-label">Select User</label>
                <select value={reminderTarget} onChange={e => setReminderTarget(e.target.value)} className="luxury-input">
                  <option value="">Select user...</option>
                  {MOCK_USERS.map(u => <option key={u.id} value={u.username}>@{u.username}</option>)}
                </select>
              </div>
              <div>
                <label className="luxury-label">Notification Message</label>
                <textarea
                  rows={3}
                  value={reminderMsg}
                  onChange={e => setReminderMsg(e.target.value)}
                  className="luxury-input resize-none"
                  placeholder={`Dear ${reminderTarget || "{User Full Name}"}, note that you have not made payment today...`}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowReminderModal(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
                <button
                  onClick={() => setShowReminderModal(false)}
                  className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Send Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ CREATE GROUP MODAL ============ */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-static rounded-2xl p-6 max-w-lg w-full border border-gold/30 animate-scale-in max-h-[90vh] overflow-y-auto scrollbar-gold">
            <div className="flex items-start justify-between mb-4">
              <h3 className="gold-gradient-text font-cinzel font-bold text-lg">Create New Group</h3>
              <button onClick={() => setShowCreateGroup(false)} className="text-muted-foreground hover:text-foreground p-1"><X size={18} /></button>
            </div>
            <div className="space-y-3">
              {[
                { label: "Group Name", placeholder: "e.g., Golden Circle Beta" },
                { label: "Description", placeholder: "Group description..." },
              ].map(f => (
                <div key={f.label}>
                  <label className="luxury-label">{f.label}</label>
                  <input className="luxury-input" placeholder={f.placeholder} />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="luxury-label">Contribution Amount (₦)</label>
                  <input type="number" className="luxury-input" placeholder="5000" />
                </div>
                <div>
                  <label className="luxury-label">Cycle Type</label>
                  <select className="luxury-input">
                    <option>daily</option>
                    <option>weekly</option>
                    <option>monthly</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="luxury-label">Bank Name</label>
                <input className="luxury-input" placeholder="e.g., First Bank Nigeria" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="luxury-label">Account Number</label>
                  <input className="luxury-input" placeholder="0123456789" />
                </div>
                <div>
                  <label className="luxury-label">Account Name</label>
                  <input className="luxury-input" placeholder="Account name" />
                </div>
              </div>
              <div>
                <label className="luxury-label">Terms & Conditions Text</label>
                <textarea rows={4} className="luxury-input resize-none" placeholder="Enter group terms..." />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setShowCreateGroup(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
                <button onClick={() => setShowCreateGroup(false)} className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Plus size={14} /> Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ ANNOUNCEMENT MODAL ============ */}
      {showAnnouncement && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-static rounded-2xl p-6 max-w-md w-full border border-gold/30 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <h3 className="gold-gradient-text font-cinzel font-bold text-lg">Send Announcement</h3>
              <button onClick={() => setShowAnnouncement(false)} className="text-muted-foreground hover:text-foreground p-1"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="luxury-label">Target Audience</label>
                <select className="luxury-input">
                  <option>All Users</option>
                  <option>Group Members Only</option>
                  <option>VIP Users Only</option>
                  <option>Defaulters</option>
                </select>
              </div>
              <div>
                <label className="luxury-label">Announcement Message</label>
                <textarea rows={4} className="luxury-input resize-none" placeholder="Type your announcement to all users..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAnnouncement(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
                <button onClick={() => setShowAnnouncement(false)} className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Megaphone size={14} /> Send Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
