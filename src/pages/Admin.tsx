import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";
import {
  Users, BarChart3, Shield, FileText, Bell, Ban, Star, Unlock, Lock,
  Search, AlertTriangle, CheckCircle, X, ChevronRight, MessageSquare,
  UserX, UserCheck, Crown, Eye, Edit, Send, Plus, Megaphone, ListChecks,
  Clock, TrendingUp, LogOut, Trash2, Image, Phone, Mail, MapPin,
  Calendar, Key, Hash, UserCog, RefreshCw, Wallet, Settings,
  ToggleLeft, ToggleRight
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

type SideTab =
  | "overview" | "users" | "groups" | "payments"
  | "announcements" | "seat-changes" | "defaulters"
  | "audit" | "exit-requests" | "live-groups" | "tags";

const SIDEBAR_ITEMS: { id: SideTab; icon: React.FC<any>; label: string }[] = [
  { id: "overview",      icon: BarChart3,    label: "Overview" },
  { id: "users",         icon: Users,        label: "Users" },
  { id: "groups",        icon: Shield,       label: "Groups" },
  { id: "payments",      icon: FileText,     label: "Payments" },
  { id: "announcements", icon: Megaphone,    label: "Announcements" },
  { id: "seat-changes",  icon: ListChecks,   label: "Seat Changes" },
  { id: "defaulters",    icon: AlertTriangle,label: "Defaulters" },
  { id: "exit-requests", icon: LogOut,       label: "Exit Requests" },
  { id: "live-groups",   icon: TrendingUp,   label: "Live Groups" },
  { id: "audit",         icon: FileText,     label: "Audit Logs" },
  { id: "tags",          icon: Star,         label: "VIP Tags" },
];

const MOCK_USERS = [
  { id: "u1", username: "ChiefSaver",   email: "emeka@example.com",   fullName: "Emeka Okonkwo",  phone: "+234 801 000 0001", dob: "1985-04-12", state: "Lagos",   lga: "Ikeja",       address: "5 Marina St, Lagos", trustScore: 98, status: "active",     isVip: true,  role: "user",      isBanned: false, isFrozen: false, isRestricted: false },
  { id: "u2", username: "GoldQueen",    email: "aisha@example.com",   fullName: "Aisha Mohammed", phone: "+234 802 000 0002", dob: "1990-07-25", state: "Abuja",   lga: "Bwari",       address: "12 Unity Rd, Abuja", trustScore: 95, status: "active",     isVip: true,  role: "user",      isBanned: false, isFrozen: false, isRestricted: false },
  { id: "u3", username: "StrongBase",   email: "tunde@example.com",   fullName: "Tunde Bakare",   phone: "+234 803 000 0003", dob: "1988-11-03", state: "Ogun",    lga: "Abeokuta",    address: "8 Freedom Way, Ogun",trustScore: 89, status: "active",     isVip: false, role: "moderator", isBanned: false, isFrozen: false, isRestricted: false },
  { id: "u4", username: "FaithSaves",   email: "ngozi@example.com",   fullName: "Ngozi Eze",      phone: "+234 804 000 0004", dob: "1992-02-14", state: "Enugu",   lga: "Enugu North", address: "3 Grace Ave, Enugu",  trustScore: 92, status: "restricted", isVip: false, role: "user",      isBanned: false, isFrozen: false, isRestricted: true  },
  { id: "u5", username: "goldmember",   email: "rejoice@example.com", fullName: "Rejoice Adeyemi",phone: "+234 801 234 5678", dob: "1995-09-20", state: "Oyo",     lga: "Ibadan North",address: "10 Gold St, Ibadan",  trustScore: 95, status: "active",     isVip: true,  role: "user",      isBanned: false, isFrozen: false, isRestricted: false },
  { id: "u6", username: "DiamondHand",  email: "fatima@example.com",  fullName: "Fatima Garba",   phone: "+234 806 000 0006", dob: "1993-06-08", state: "Kano",    lga: "Kano Munic",  address: "7 Diamond Rd, Kano",  trustScore: 91, status: "frozen",     isVip: true,  role: "user",      isBanned: false, isFrozen: true,  isRestricted: false },
  { id: "u7", username: "VaultKeeper",  email: "samuel@example.com",  fullName: "Samuel Ojo",     phone: "+234 807 000 0007", dob: "1987-12-30", state: "Rivers",  lga: "Port Harcourt",address: "2 Creek Rd, PH",     trustScore: 74, status: "banned",     isVip: false, role: "user",      isBanned: true,  isFrozen: false, isRestricted: false },
];

const MOCK_SEAT_CHANGES = [
  { id: "s1", user: "goldmember",  group: "Golden Circle Alpha",     from: 5,  to: 12, reason: "Schedule conflict", time: "2025-03-17 10:00" },
  { id: "s2", user: "ChiefSaver",  group: "Silver Vault Weekly",     from: 22, to: 45, reason: "Personal preference", time: "2025-03-16 15:30" },
  { id: "s3", user: "GoldQueen",   group: "Diamond Elite Circle",    from: 8,  to: 3,  reason: "Better slot timing", time: "2025-03-18 09:15" },
];

const MOCK_DEFAULTERS = [
  { id: "d1", user: "FaithSaves",  group: "Golden Circle Alpha", since: "2025-03-15", count: 2, amount: "₦10,000" },
  { id: "d2", user: "VaultKeeper", group: "Silver Vault Weekly", since: "2025-03-14", count: 4, amount: "₦100,000" },
  { id: "d3", user: "StrongBase",  group: "Platinum Monthly",    since: "2025-03-16", count: 1, amount: "₦100,000" },
];

const MOCK_EXIT_REQUESTS = [
  { id: "e1", user: "StrongBase",  group: "Golden Circle Alpha",  reason: "Financial difficulties", date: "2025-03-17" },
  { id: "e2", user: "VaultKeeper", group: "Silver Vault Weekly",  reason: "Relocating abroad",      date: "2025-03-16" },
];

const MOCK_AUDIT_LOGS = [
  { id: "a1", action: "Payment RAJ-0000012 approved for goldmember",     admin: "admin",  time: "2025-03-17 09:00", type: "approve" },
  { id: "a2", action: "User FaithSaves restricted — missed 2 payments",  admin: "admin",  time: "2025-03-17 08:05", type: "restrict" },
  { id: "a3", action: "VaultKeeper banned — policy violation",            admin: "admin",  time: "2025-03-16 14:22", type: "ban" },
  { id: "a4", action: "DiamondHand account frozen temporarily",           admin: "admin",  time: "2025-03-16 11:30", type: "lock" },
  { id: "a5", action: "goldmember promoted to VIP status",                admin: "admin",  time: "2025-03-15 10:10", type: "vip" },
  { id: "a6", action: "User StrongBase defaulter status removed",         admin: "admin",  time: "2025-03-15 09:00", type: "approve" },
  { id: "a7", action: "Announcement sent to all users",                   admin: "admin",  time: "2025-03-14 12:00", type: "announce" },
];

// Group participants with seat info for admin seat view
const GROUP_SEAT_MAP: Record<string, { seatNo: number; username: string; fullName: string; paymentStatus: "paid" | "pending" | "defaulter" }[]> = {
  "g1": [
    { seatNo: 1,  username: "ChiefSaver",  fullName: "Emeka Okonkwo",  paymentStatus: "paid" },
    { seatNo: 2,  username: "GoldQueen",   fullName: "Aisha Mohammed", paymentStatus: "paid" },
    { seatNo: 3,  username: "StrongBase",  fullName: "Tunde Bakare",   paymentStatus: "pending" },
    { seatNo: 4,  username: "FaithSaves",  fullName: "Ngozi Eze",      paymentStatus: "defaulter" },
    { seatNo: 5,  username: "goldmember",  fullName: "Rejoice Adeyemi",paymentStatus: "paid" },
    { seatNo: 6,  username: "DiamondHand", fullName: "Fatima Garba",   paymentStatus: "pending" },
    { seatNo: 7,  username: "VaultKeeper", fullName: "Samuel Ojo",     paymentStatus: "defaulter" },
    { seatNo: 8,  username: "GoldQueen",   fullName: "Aisha Mohammed", paymentStatus: "paid" },
    { seatNo: 10, username: "ChiefSaver",  fullName: "Emeka Okonkwo",  paymentStatus: "paid" },
  ],
};

export default function Admin() {
  const { currentUser, isLoggedIn, groups, transactions } = useApp();
  const [sideTab, setSideTab] = useState<SideTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [serverMaintenance, setServerMaintenance] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState<string | null>(null);
  const [showGroupSeatView, setShowGroupSeatView] = useState<string | null>(null);
  const [reminderTarget, setReminderTarget] = useState("");
  const [reminderMsg, setReminderMsg] = useState("");
  const [announcementImg, setAnnouncementImg] = useState<string | null>(null);
  const [userActions, setUserActions] = useState<Record<string, Set<string>>>({});
  const [editedUser, setEditedUser] = useState<Record<string, string>>({});
  const [passwordVisibility, setPasswordVisibility] = useState<Record<string, boolean>>({});

  if (!isLoggedIn || currentUser?.role !== "admin") return <Navigate to="/" replace />;

  const stats = [
    { label: "Total Users",      value: "1,248",                                                icon: Users,      color: "text-gold" },
    { label: "Active Groups",    value: groups.filter(g => g.isLive).length.toString(),         icon: Shield,     color: "text-emerald-400" },
    { label: "Pending Payments", value: transactions.filter(t => t.status === "pending").length.toString(), icon: Clock, color: "text-amber-400" },
    { label: "Total Paid Out",   value: "₦2.4B",                                               icon: TrendingUp, color: "text-sky-400" },
  ];

  const toggleAction = (userId: string, action: string) => {
    setUserActions(prev => {
      const s = new Set(prev[userId] || []);
      s.has(action) ? s.delete(action) : s.add(action);
      return { ...prev, [userId]: s };
    });
  };

  const hasAction = (userId: string, action: string) => userActions[userId]?.has(action) || false;

  const filteredUsers = MOCK_USERS.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const editingUser = showUserEdit ? MOCK_USERS.find(u => u.id === showUserEdit) : null;

  // --- RENDER ---
  return (
    <div className="min-h-screen flex relative overflow-hidden">
      <ParticleBackground />

      {/* ============ SIDEBAR ============ */}
      <aside className="w-52 shrink-0 border-r border-gold/10 pt-20 pb-8 flex flex-col z-10 hidden md:flex"
        style={{ background: "rgba(5,5,5,0.9)", backdropFilter: "blur(20px)" }}
      >
        <div className="px-5 mb-6">
          <p className="gold-gradient-text font-cinzel font-black text-xl leading-tight">Rejoice</p>
          <p className="gold-gradient-text font-cinzel font-black text-xl leading-tight">Ajo</p>
          <p className="text-muted-foreground/50 text-[10px] mt-1 font-mono">v1.05 · Admin</p>
        </div>
        <nav className="flex-1 px-2 space-y-0.5">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setSideTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all ${
                sideTab === item.id
                  ? "bg-gold/15 border border-gold/30 text-gold"
                  : "text-muted-foreground hover:text-foreground hover:bg-gold/5"
              }`}
            >
              <item.icon size={13} />
              {item.label}
            </button>
          ))}
        </nav>
        {/* Server toggle */}
        <div className="px-3 mt-4 pt-4 border-t border-gold/10">
          <div className="p-3 rounded-xl bg-gold/5 border border-gold/10">
            <p className="text-muted-foreground text-[9px] uppercase tracking-wider mb-2">Server Maintenance</p>
            <button
              onClick={() => setServerMaintenance(!serverMaintenance)}
              className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                serverMaintenance ? "bg-gold/20 border-gold/40 text-gold" : "bg-muted/20 border-muted/20 text-muted-foreground"
              }`}
            >
              {serverMaintenance ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
              {serverMaintenance ? "MAINTENANCE ON" : "PLATFORM LIVE"}
            </button>
          </div>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <div className="flex-1 pt-20 pb-8 overflow-x-hidden z-10 min-w-0">
        {/* Top bar */}
        <div className="px-4 md:px-6 mb-5 flex items-center justify-between gap-3 flex-wrap">
          <h1 className="gold-gradient-text text-2xl font-cinzel font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setShowReminderModal(true)} className="btn-glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
              <Bell size={11} /> Remind User
            </button>
            <button onClick={() => setShowAnnouncement(true)} className="btn-glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
              <Megaphone size={11} /> Announce
            </button>
            <button onClick={() => setShowCreateGroup(true)} className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
              <Plus size={11} /> Create Group
            </button>
          </div>
        </div>

        <div className="px-4 md:px-6 space-y-5">

          {/* ======= OVERVIEW ======= */}
          {sideTab === "overview" && (
            <div className="space-y-5 animate-fade-up">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {stats.map(s => (
                  <div key={s.label} className="glass-card-static p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-2">
                      <s.icon size={16} className={s.color} />
                      <span className={`text-2xl font-cinzel font-bold ${s.color}`}>{s.value}</span>
                    </div>
                    <p className="text-muted-foreground text-xs">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick action panels */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                {/* Seat Changes */}
                <div className="glass-card-static rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="gold-text font-cinzel font-bold text-xs uppercase tracking-widest">Seat Changes</h3>
                    <span className="text-gold text-xs font-bold">{MOCK_SEAT_CHANGES.length}</span>
                  </div>
                  {MOCK_SEAT_CHANGES.slice(0, 2).map(r => (
                    <div key={r.id} className="mb-2 p-2 rounded-lg bg-gold/5 border border-gold/10 text-[10px]">
                      <p className="text-foreground font-semibold">@{r.user} — Seat {r.from} → {r.to}</p>
                      <p className="text-muted-foreground mt-0.5">{r.reason}</p>
                      <div className="flex gap-1 mt-1.5">
                        <button className="flex-1 py-1 rounded bg-emerald-900/30 border border-emerald-600/30 text-emerald-400 font-bold">Approve</button>
                        <button className="flex-1 py-1 rounded bg-red-900/30 border border-red-600/30 text-red-400 font-bold">Decline</button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Defaulters */}
                <div className="glass-card-static rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="gold-text font-cinzel font-bold text-xs uppercase tracking-widest">Defaulters</h3>
                    <span className="text-red-400 text-xs font-bold">{MOCK_DEFAULTERS.length}</span>
                  </div>
                  {MOCK_DEFAULTERS.slice(0, 2).map(d => (
                    <div key={d.id} className="mb-2">
                      <p className="text-foreground text-[10px] font-semibold">@{d.user} — {d.group}</p>
                      <p className="text-muted-foreground text-[9px]">{d.count} missed · since {d.since}</p>
                    </div>
                  ))}
                  <div className="flex gap-1 mt-2">
                    <button className="flex-1 py-1 rounded text-[10px] font-bold bg-amber-900/30 border border-amber-500/30 text-amber-400">Warn All</button>
                    <button className="flex-1 py-1 rounded text-[10px] font-bold bg-red-900/30 border border-red-600/30 text-red-400">Ban All</button>
                  </div>
                </div>

                {/* Audit Logs preview */}
                <div className="glass-card-static rounded-2xl p-4">
                  <h3 className="gold-text font-cinzel font-bold text-xs uppercase tracking-widest mb-3">Recent Logs</h3>
                  {MOCK_AUDIT_LOGS.slice(0, 4).map(log => (
                    <div key={log.id} className="flex items-start gap-1.5 mb-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1 shrink-0 ${
                        log.type === "approve" ? "bg-emerald-400" : log.type === "ban" ? "bg-red-400" : log.type === "restrict" ? "bg-amber-400" : "bg-gold"
                      }`} />
                      <p className="text-muted-foreground text-[10px] leading-relaxed">{log.action}</p>
                    </div>
                  ))}
                </div>

                {/* Server panel */}
                <div className="glass-card-static rounded-2xl p-4">
                  <h3 className="gold-text font-cinzel font-bold text-xs uppercase tracking-widest mb-3">Platform Control</h3>
                  <p className="text-muted-foreground text-[10px] mb-3">
                    {serverMaintenance ? "🔴 Maintenance mode active." : "🟢 Platform running normally."}
                  </p>
                  <button onClick={() => setServerMaintenance(!serverMaintenance)}
                    className={`w-full py-2 rounded-lg text-[10px] font-bold mb-2 border transition-all ${
                      serverMaintenance ? "bg-gold/20 border-gold/40 text-gold" : "bg-muted/20 border-muted/20 text-muted-foreground"
                    }`}
                  >
                    {serverMaintenance ? "Disable Maintenance" : "Enable Maintenance"}
                  </button>
                  <button onClick={() => setShowAnnouncement(true)} className="w-full py-2 rounded-lg btn-gold text-[10px] font-bold flex items-center justify-center gap-1.5 mb-2">
                    <Send size={10} /> Announcement
                  </button>
                  <button onClick={() => setShowReminderModal(true)} className="w-full py-2 rounded-lg btn-glass text-[10px] font-semibold flex items-center justify-center gap-1.5">
                    <Bell size={10} /> Remind User
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ======= USERS ======= */}
          {sideTab === "users" && (
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
              <div className="px-4 py-3 border-b border-gold/10 flex items-center justify-between gap-3 flex-wrap">
                <h2 className="gold-text font-cinzel font-bold text-sm">User Management</h2>
                <div className="relative max-w-xs flex-1">
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" />
                  <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search by name, email, username..." className="luxury-input pl-7 py-1.5 text-xs" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[900px]">
                  <thead>
                    <tr className="border-b border-gold/5">
                      {["User", "Email / Phone", "Trust", "Status", "Role", "Actions (30+ Commands)"].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] text-muted-foreground/50 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                        {/* User */}
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-[11px] font-black shrink-0">
                              {u.fullName[0]}
                            </div>
                            <div>
                              <p className="text-foreground font-semibold">{u.fullName}</p>
                              <p className="text-muted-foreground text-[9px]">@{u.username}</p>
                              {u.isVip && <span className="vip-badge text-[8px] px-1">VIP</span>}
                            </div>
                          </div>
                        </td>
                        {/* Contact */}
                        <td className="px-3 py-3 text-muted-foreground text-[10px]">
                          <p>{u.email}</p>
                          <p>{u.phone}</p>
                        </td>
                        {/* Trust */}
                        <td className="px-3 py-3">
                          <span className={`font-bold text-sm ${u.trustScore >= 90 ? "text-emerald-400" : u.trustScore >= 75 ? "text-amber-400" : "text-red-400"}`}>
                            {u.trustScore}%
                          </span>
                        </td>
                        {/* Status */}
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            u.isBanned ? "bg-red-900/30 border-red-600/40 text-red-400" :
                            u.isFrozen ? "bg-blue-900/30 border-blue-600/40 text-blue-400" :
                            u.isRestricted ? "bg-amber-900/30 border-amber-500/40 text-amber-400" :
                            "bg-emerald-900/20 border-emerald-600/30 text-emerald-400"
                          }`}>
                            {u.isBanned ? "Banned" : u.isFrozen ? "Frozen" : u.isRestricted ? "Restricted" : "Active"}
                          </span>
                        </td>
                        {/* Role */}
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-semibold ${u.role === "moderator" ? "text-purple-400" : "text-muted-foreground"}`}>
                            {u.role}
                          </span>
                        </td>
                        {/* Actions — 30+ commands */}
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1">
                            {/* View/Edit Profile */}
                            <button onClick={() => setShowUserEdit(u.id)}
                              className="px-2 py-1 rounded text-[10px] font-semibold btn-glass flex items-center gap-0.5">
                              <UserCog size={9} />Edit Profile
                            </button>
                            {/* Promote Moderator */}
                            <button onClick={() => toggleAction(u.id, "moderator")}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all flex items-center gap-0.5 ${
                                hasAction(u.id, "moderator") ? "bg-purple-900/40 border-purple-500/50 text-purple-300" : "btn-glass"
                              }`}>
                              <Crown size={9} />{hasAction(u.id, "moderator") ? "Demote" : "Promote Mod"}
                            </button>
                            {/* Assign VIP */}
                            <button onClick={() => toggleAction(u.id, "vip")}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all flex items-center gap-0.5 ${
                                hasAction(u.id, "vip") ? "bg-gold/20 border-gold/40 text-gold" : "btn-glass"
                              }`}>
                              <Star size={9} />{hasAction(u.id, "vip") ? "Remove VIP" : "Assign VIP"}
                            </button>
                            {/* Freeze */}
                            <button onClick={() => toggleAction(u.id, "frozen")}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all flex items-center gap-0.5 ${
                                hasAction(u.id, "frozen") ? "bg-blue-900/40 border-blue-500/50 text-blue-300" : "btn-glass"
                              }`}>
                              <Lock size={9} />{hasAction(u.id, "frozen") ? "Unfreeze" : "Freeze"}
                            </button>
                            {/* Restrict */}
                            <button onClick={() => toggleAction(u.id, "restricted")}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all flex items-center gap-0.5 ${
                                hasAction(u.id, "restricted") ? "bg-amber-900/40 border-amber-500/50 text-amber-300" : "btn-glass"
                              }`}>
                              <UserX size={9} />{hasAction(u.id, "restricted") ? "Unrestrict" : "Restrict"}
                            </button>
                            {/* Ban */}
                            <button onClick={() => toggleAction(u.id, "banned")}
                              className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all flex items-center gap-0.5 ${
                                hasAction(u.id, "banned") ? "bg-red-900/40 border-red-500/50 text-red-300" : "bg-muted/10 border-muted/20 text-muted-foreground hover:border-red-500/40 hover:text-red-400"
                              }`}>
                              <Ban size={9} />{hasAction(u.id, "banned") ? "Unban" : "Ban"}
                            </button>
                            {/* Remove Defaulter */}
                            <button className="px-2 py-1 rounded text-[10px] font-semibold btn-glass flex items-center gap-0.5">
                              <UserCheck size={9} />Rm Defaulter
                            </button>
                            {/* Remind */}
                            <button onClick={() => { setReminderTarget(u.username); setShowReminderModal(true); }}
                              className="px-2 py-1 rounded text-[10px] font-semibold btn-glass flex items-center gap-0.5">
                              <Bell size={9} />Remind
                            </button>
                            {/* Change Password */}
                            <button onClick={() => { setShowUserEdit(u.id); }}
                              className="px-2 py-1 rounded text-[10px] font-semibold btn-glass flex items-center gap-0.5">
                              <Key size={9} />Change Pwd
                            </button>
                            {/* Kick from Group */}
                            <button className="px-2 py-1 rounded text-[10px] font-semibold bg-red-900/20 border border-red-600/25 text-red-400 hover:bg-red-900/35 transition-all flex items-center gap-0.5">
                              <Trash2 size={9} />Kick Group
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

          {/* ======= GROUPS ======= */}
          {sideTab === "groups" && (
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
              <div className="px-4 py-3 border-b border-gold/10 flex items-center justify-between">
                <h2 className="gold-text font-cinzel font-bold text-sm">Group Management</h2>
                <button onClick={() => setShowCreateGroup(true)} className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <Plus size={11} /> Create Group
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gold/5">
                      {["Group Name", "Amount", "Cycle", "Slots", "Status", "Actions"].map(h => (
                        <th key={h} className="px-3 py-2.5 text-left text-[10px] text-muted-foreground/50 uppercase tracking-wider whitespace-nowrap">{h}</th>
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
                          {g.isLive ? <span className="live-badge">● LIVE</span> : <span className="status-pending">Inactive</span>}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            <button className="btn-gold px-2 py-1 rounded text-[10px] font-bold">Make Live</button>
                            <button onClick={() => setShowGroupSeatView(g.id)} className="btn-glass px-2 py-1 rounded text-[10px] flex items-center gap-0.5">
                              <Eye size={9} />View Seats
                            </button>
                            <button className="btn-glass px-2 py-1 rounded text-[10px] flex items-center gap-0.5">
                              <Edit size={9} />Edit
                            </button>
                            <button className="btn-glass px-2 py-1 rounded text-[10px] flex items-center gap-0.5">
                              {g.chatLocked ? <><Unlock size={9} />Open Chat</> : <><Lock size={9} />Lock Chat</>}
                            </button>
                            <button className="px-2 py-1 rounded text-[10px] bg-amber-900/25 border border-amber-500/30 text-amber-400 flex items-center gap-0.5">
                              <Lock size={9} />Lock Reg.
                            </button>
                            <button className="px-2 py-1 rounded text-[10px] bg-red-900/25 border border-red-600/30 text-red-400 flex items-center gap-0.5">
                              <Trash2 size={9} />Delete
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

          {/* ======= PAYMENTS ======= */}
          {sideTab === "payments" && (
            <div className="space-y-4 animate-fade-up">
              {/* Pending transactions */}
              <div className="glass-card-static rounded-2xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gold/10 flex items-center justify-between">
                  <h2 className="gold-text font-cinzel font-bold text-sm">Transaction Approvals</h2>
                  <div className="flex gap-2 text-xs text-muted-foreground">
                    <span className="status-pending">Pending: {transactions.filter(t => t.status === "pending").length}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs min-w-[600px]">
                    <thead>
                      <tr className="border-b border-gold/5">
                        {["Code", "Group", "User", "Amount", "Screenshot", "Status", "Date", "Actions"].map(h => (
                          <th key={h} className="px-3 py-2.5 text-left text-[10px] text-muted-foreground/50 uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(t => (
                        <tr key={t.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                          <td className="px-3 py-3 text-gold font-mono">{t.code}</td>
                          <td className="px-3 py-3 text-foreground/80">{t.groupName}</td>
                          <td className="px-3 py-3 text-foreground/80 font-semibold">goldmember</td>
                          <td className="px-3 py-3 text-foreground font-bold">₦{t.amount.toLocaleString()}</td>
                          <td className="px-3 py-3">
                            <button className="btn-glass px-2 py-1 rounded text-[10px] flex items-center gap-0.5">
                              <Eye size={9} /> View
                            </button>
                          </td>
                          <td className="px-3 py-3"><span className={`status-${t.status}`}>{t.status}</span></td>
                          <td className="px-3 py-3 text-muted-foreground">{t.date}</td>
                          <td className="px-3 py-3">
                            {t.status === "pending" && (
                              <div className="flex gap-1.5">
                                <button className="px-2 py-1 rounded text-[10px] bg-emerald-900/30 border border-emerald-600/30 text-emerald-400 flex items-center gap-0.5">
                                  <CheckCircle size={9} />Approve
                                </button>
                                <button className="px-2 py-1 rounded text-[10px] bg-red-900/30 border border-red-600/30 text-red-400 flex items-center gap-0.5">
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

              {/* Payment method settings */}
              <div className="glass-card-static rounded-2xl p-5">
                <h3 className="gold-text font-cinzel font-bold text-sm mb-4 flex items-center gap-2">
                  <Wallet size={15} />Set Platform Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[["Bank Name", "e.g. First Bank Nigeria"], ["Account Number", "e.g. 3012345678"], ["Account Name", "e.g. Rejoice Ajo Platform"]].map(([label, ph]) => (
                    <div key={label}>
                      <label className="luxury-label">{label}</label>
                      <input type="text" className="luxury-input text-xs" placeholder={ph} />
                    </div>
                  ))}
                </div>
                <button className="btn-gold px-5 py-2 rounded-xl font-bold text-xs mt-3 flex items-center gap-2">
                  <Settings size={12} />Save Payment Method
                </button>
              </div>
            </div>
          )}

          {/* ======= ANNOUNCEMENTS ======= */}
          {sideTab === "announcements" && (
            <div className="glass-card-static rounded-2xl p-5 animate-fade-up max-w-2xl">
              <h2 className="gold-text font-cinzel font-bold text-sm mb-4 flex items-center gap-2">
                <Megaphone size={15} />Send Announcement
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="luxury-label">Target Audience</label>
                  <select className="luxury-input text-sm">
                    <option>All Users</option>
                    <option>VIP Users Only</option>
                    <option>Defaulters</option>
                    <option>Group Members</option>
                    <option>Restricted Users</option>
                  </select>
                </div>
                <div>
                  <label className="luxury-label">Title</label>
                  <input type="text" className="luxury-input text-sm" placeholder="Announcement title..." />
                </div>
                <div>
                  <label className="luxury-label">Message</label>
                  <textarea rows={5} className="luxury-input resize-none text-sm" placeholder="Type your announcement..." />
                </div>
                {/* Optional image upload */}
                <div>
                  <label className="luxury-label">Attach Image (Optional)</label>
                  <label className="flex items-center gap-3 glass-card-static rounded-xl px-4 py-3 cursor-pointer hover:border-gold/40 transition-all group">
                    <div className="p-2 rounded-lg bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-all">
                      <Image size={14} className="text-gold" />
                    </div>
                    <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                      {announcementImg ? "✅ Image attached" : "Click to upload announcement image"}
                    </span>
                    <input type="file" accept="image/*" className="hidden" onChange={() => setAnnouncementImg("uploaded")} />
                  </label>
                  {announcementImg && (
                    <button onClick={() => setAnnouncementImg(null)} className="mt-1 text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                      <X size={10} />Remove image
                    </button>
                  )}
                </div>
                <button className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                  <Send size={14} /> Send Announcement
                </button>
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
                {MOCK_SEAT_CHANGES.map(r => (
                  <div key={r.id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap hover:bg-gold/3 transition-colors">
                    <div>
                      <p className="text-foreground font-semibold text-sm">@{r.user}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">{r.group}</p>
                      <p className="text-muted-foreground text-xs">Seat <span className="text-gold font-bold">#{r.from}</span> → <span className="text-gold font-bold">#{r.to}</span></p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">"{r.reason}" · {r.time}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-900/30 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-900/50 transition-all">Approve</button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-900/30 border border-red-600/30 text-red-400 hover:bg-red-900/50 transition-all">Decline</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======= DEFAULTERS ======= */}
          {sideTab === "defaulters" && (
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
              <div className="px-4 py-3 border-b border-gold/10 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-400" />
                <h2 className="gold-text font-cinzel font-bold text-sm">Defaulter Management</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gold/5">
                      {["User", "Group", "Missed", "Since", "Total Owed", "Actions"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-[10px] text-muted-foreground/50 uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {MOCK_DEFAULTERS.map(d => (
                      <tr key={d.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                        <td className="px-4 py-3 text-foreground font-semibold">@{d.user}</td>
                        <td className="px-4 py-3 text-muted-foreground">{d.group}</td>
                        <td className="px-4 py-3 text-red-400 font-bold">{d.count} days</td>
                        <td className="px-4 py-3 text-muted-foreground">{d.since}</td>
                        <td className="px-4 py-3 text-amber-400 font-bold">{d.amount}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1.5 flex-wrap">
                            <button className="px-2 py-1 rounded text-[10px] bg-amber-900/30 border border-amber-500/30 text-amber-400">Warn</button>
                            <button className="px-2 py-1 rounded text-[10px] bg-orange-900/30 border border-orange-500/30 text-orange-400">Suspend</button>
                            <button className="px-2 py-1 rounded text-[10px] bg-emerald-900/30 border border-emerald-600/30 text-emerald-400">Remove Status</button>
                            <button onClick={() => { setReminderTarget(d.user); setShowReminderModal(true); }}
                              className="px-2 py-1 rounded text-[10px] btn-glass flex items-center gap-0.5">
                              <Bell size={9} />Remind
                            </button>
                            <button className="px-2 py-1 rounded text-[10px] bg-red-900/30 border border-red-600/30 text-red-400">Ban</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======= EXIT REQUESTS ======= */}
          {sideTab === "exit-requests" && (
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
              <div className="px-4 py-3 border-b border-gold/10">
                <h2 className="gold-text font-cinzel font-bold text-sm">Exit Group Requests</h2>
              </div>
              <div className="divide-y divide-gold/5">
                {MOCK_EXIT_REQUESTS.map(r => (
                  <div key={r.id} className="px-5 py-4 flex items-center justify-between gap-4 flex-wrap hover:bg-gold/3 transition-colors">
                    <div>
                      <p className="text-foreground font-semibold text-sm">@{r.user}</p>
                      <p className="text-muted-foreground text-xs mt-0.5">Group: <span className="text-foreground">{r.group}</span></p>
                      <p className="text-muted-foreground text-xs">Reason: "{r.reason}"</p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">{r.date}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-900/30 border border-emerald-600/30 text-emerald-400 hover:bg-emerald-900/50 transition-all">Approve Exit</button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-900/30 border border-red-600/30 text-red-400 hover:bg-red-900/50 transition-all">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======= LIVE GROUPS ======= */}
          {sideTab === "live-groups" && (
            <div className="space-y-3 animate-fade-up">
              {groups.filter(g => g.isLive).map(g => (
                <div key={g.id} className="glass-card-static rounded-2xl p-5">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="live-badge">● LIVE</span>
                        <span className="text-muted-foreground text-xs capitalize">{g.cycleType}</span>
                      </div>
                      <h3 className="gold-text font-cinzel font-bold text-base">{g.name}</h3>
                      <p className="text-muted-foreground text-xs mt-1">₦{g.contributionAmount.toLocaleString()} · {g.filledSlots}/{g.totalSlots} slots filled</p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => setShowGroupSeatView(g.id)} className="btn-glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                        <Eye size={11} />View Seat Map
                      </button>
                      <button className="btn-glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                        {g.chatLocked ? <><Unlock size={11} />Open Chat</> : <><Lock size={11} />Lock Chat</>}
                      </button>
                      <button className="btn-glass px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5">
                        <Edit size={11} />Edit Group
                      </button>
                      <button className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-900/25 border border-amber-500/30 text-amber-400 flex items-center gap-1.5">
                        <Lock size={11} />Lock Group
                      </button>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(g.filledSlots / g.totalSlots) * 100}%`, background: "linear-gradient(90deg, hsl(45,93%,47%), hsl(45,100%,60%))" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ======= VIP TAGS ======= */}
          {sideTab === "tags" && (
            <div className="glass-card-static rounded-2xl p-5 animate-fade-up max-w-2xl">
              <h2 className="gold-text font-cinzel font-bold text-sm mb-4 flex items-center gap-2">
                <Star size={15} />VIP Tag Management
              </h2>
              <div className="space-y-2">
                {MOCK_USERS.map(u => (
                  <div key={u.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-gold/3 border border-gold/10 hover:bg-gold/6 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gold/20 text-gold flex items-center justify-center text-sm font-black">{u.fullName[0]}</div>
                      <div>
                        <p className="text-foreground text-sm font-semibold">{u.fullName}</p>
                        <p className="text-muted-foreground text-xs">@{u.username}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {u.isVip && <span className="vip-badge">VIP ✦</span>}
                      <button className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                        u.isVip ? "bg-red-900/20 border-red-600/30 text-red-400 hover:bg-red-900/35" : "bg-gold/15 border-gold/30 text-gold hover:bg-gold/25"
                      }`}>
                        {u.isVip ? "Remove VIP" : "Assign VIP"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======= AUDIT LOGS ======= */}
          {sideTab === "audit" && (
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up">
              <div className="px-4 py-3 border-b border-gold/10">
                <h2 className="gold-text font-cinzel font-bold text-sm">Full Audit Log</h2>
              </div>
              <div className="divide-y divide-gold/5">
                {MOCK_AUDIT_LOGS.map(log => (
                  <div key={log.id} className="px-5 py-3.5 flex items-start gap-3 hover:bg-gold/3 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                      log.type === "approve" ? "bg-emerald-400" : log.type === "ban" ? "bg-red-400" : log.type === "restrict" ? "bg-amber-400" : log.type === "vip" ? "bg-gold" : "bg-blue-400"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground text-xs">{log.action}</p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">by <span className="text-gold">@{log.admin}</span> · {log.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ============ USER EDIT MODAL ============ */}
      {showUserEdit && editingUser && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card-static rounded-2xl p-6 max-w-2xl w-full border border-gold/25 animate-scale-in my-4">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="gold-gradient-text font-cinzel font-bold text-lg">Edit User Profile</h3>
                <p className="text-muted-foreground text-xs mt-0.5">@{editingUser.username} · {editingUser.fullName}</p>
              </div>
              <button onClick={() => setShowUserEdit(null)} className="text-muted-foreground hover:text-foreground p-1"><X size={18} /></button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Personal info */}
              {[
                { label: "Full Name",    key: "fullName",  val: editingUser.fullName,  icon: <User size={12} /> },
                { label: "Username",     key: "username",  val: editingUser.username,  icon: <Hash size={12} /> },
                { label: "Email",        key: "email",     val: editingUser.email,     icon: <Mail size={12} /> },
                { label: "Phone Number", key: "phone",     val: editingUser.phone,     icon: <Phone size={12} /> },
                { label: "Date of Birth",key: "dob",       val: editingUser.dob,       icon: <Calendar size={12} />, type: "date" },
                { label: "State",        key: "state",     val: editingUser.state,     icon: <MapPin size={12} /> },
                { label: "LGA",          key: "lga",       val: editingUser.lga,       icon: <MapPin size={12} /> },
                { label: "Home Address", key: "address",   val: editingUser.address,   icon: <MapPin size={12} /> },
              ].map(f => (
                <div key={f.key}>
                  <label className="luxury-label flex items-center gap-1.5">{f.icon}{f.label}</label>
                  <input
                    type={f.type || "text"}
                    defaultValue={editedUser[f.key] ?? f.val}
                    onChange={e => setEditedUser(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="luxury-input text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Password section */}
            <div className="mt-4 p-4 rounded-xl bg-gold/5 border border-gold/15">
              <h4 className="gold-text font-cinzel font-bold text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <Key size={13} />Password Management
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="luxury-label">Previous Password (visible)</label>
                  <div className="relative">
                    <input
                      type={passwordVisibility["prev"] ? "text" : "password"}
                      defaultValue="•••••••••"
                      readOnly
                      className="luxury-input text-sm pr-10 cursor-not-allowed opacity-70"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisibility(prev => ({ ...prev, prev: !prev["prev"] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="luxury-label">Set New Password</label>
                  <div className="relative">
                    <input
                      type={passwordVisibility["new"] ? "text" : "password"}
                      placeholder="Enter new password..."
                      className="luxury-input text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setPasswordVisibility(prev => ({ ...prev, new: !prev["new"] }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                    >
                      <Eye size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <button className="mt-3 px-4 py-2 rounded-lg text-xs font-bold btn-glass flex items-center gap-1.5">
                <Send size={11} />Send New Password to User (Email/Phone)
              </button>
            </div>

            {/* Nickname */}
            <div className="mt-4">
              <label className="luxury-label">Nickname / Display Name</label>
              <input type="text" placeholder="Optional nickname..." className="luxury-input text-sm" />
            </div>

            {/* Action row */}
            <div className="mt-5 flex gap-3 flex-wrap">
              <button onClick={() => setShowUserEdit(null)} className="btn-glass px-5 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
              <button className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
                <CheckCircle size={14} />Save Changes
              </button>
              <button className="px-4 py-2.5 rounded-xl font-bold text-sm bg-amber-900/30 border border-amber-500/30 text-amber-400 hover:bg-amber-900/50 transition-all flex items-center gap-1.5">
                <RefreshCw size={13} />Reset Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============ GROUP SEAT MAP MODAL ============ */}
      {showGroupSeatView && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card-static rounded-2xl p-6 max-w-2xl w-full border border-gold/25 animate-scale-in my-4">
            <div className="flex items-start justify-between mb-5">
              <div>
                <h3 className="gold-gradient-text font-cinzel font-bold text-lg">Group Seat Map</h3>
                <p className="text-muted-foreground text-xs mt-0.5">{groups.find(g => g.id === showGroupSeatView)?.name}</p>
              </div>
              <button onClick={() => setShowGroupSeatView(null)} className="text-muted-foreground hover:text-foreground p-1"><X size={18} /></button>
            </div>

            {/* Seat map table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gold/10">
                    {["Seat #", "Member Name", "Username", "Payment", "Actions"].map(h => (
                      <th key={h} className="px-3 py-2.5 text-left text-[10px] text-muted-foreground/60 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(GROUP_SEAT_MAP[showGroupSeatView] || []).map((seat, i) => (
                    <tr key={i} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                      <td className="px-3 py-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black bg-gold/15 border border-gold/25 text-gold">
                          {seat.seatNo}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-foreground font-semibold">{seat.fullName}</td>
                      <td className="px-3 py-3 text-muted-foreground">@{seat.username}</td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          seat.paymentStatus === "paid" ? "bg-emerald-900/25 border-emerald-600/30 text-emerald-400" :
                          seat.paymentStatus === "defaulter" ? "bg-red-900/25 border-red-600/30 text-red-400" :
                          "bg-amber-900/25 border-amber-500/30 text-amber-400"
                        }`}>
                          {seat.paymentStatus}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-1.5">
                          <button className="px-2 py-1 rounded text-[10px] btn-glass flex items-center gap-0.5">
                            <Bell size={9} />Remind
                          </button>
                          <button className="px-2 py-1 rounded text-[10px] bg-red-900/25 border border-red-600/30 text-red-400 hover:bg-red-900/40 transition-all flex items-center gap-0.5">
                            <Trash2 size={9} />Remove from Seat
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {/* Empty seats */}
                  {Array.from({ length: 3 }, (_, i) => (
                    <tr key={`empty-${i}`} className="border-b border-gold/5 opacity-40">
                      <td className="px-3 py-3">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-black bg-muted/20 border border-muted/20 text-muted-foreground">
                          {(GROUP_SEAT_MAP[showGroupSeatView]?.length || 0) + i + 1}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground/50 text-[11px]">— Available —</td>
                      <td colSpan={3} />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button onClick={() => setShowGroupSeatView(null)} className="mt-4 btn-glass px-5 py-2.5 rounded-xl text-sm font-semibold">Close</button>
          </div>
        </div>
      )}

      {/* ============ REMINDER MODAL ============ */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                  {MOCK_USERS.map(u => <option key={u.id} value={u.username}>@{u.username} — {u.fullName}</option>)}
                </select>
              </div>
              <div>
                <label className="luxury-label">Notification Message</label>
                <textarea
                  rows={4}
                  value={reminderMsg}
                  onChange={e => setReminderMsg(e.target.value)}
                  className="luxury-input resize-none"
                  placeholder={`Dear ${reminderTarget || "{User Full Name}"}, note that you have not made payment today. Please make payment immediately or penalty may apply.`}
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowReminderModal(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
                <button onClick={() => setShowReminderModal(false)} className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Send size={14} /> Send Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ ANNOUNCEMENT MODAL ============ */}
      {showAnnouncement && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-static rounded-2xl p-6 max-w-lg w-full border border-gold/30 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <h3 className="gold-gradient-text font-cinzel font-bold text-lg">Send Announcement</h3>
              <button onClick={() => setShowAnnouncement(false)} className="text-muted-foreground hover:text-foreground p-1"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="luxury-label">Target</label>
                <select className="luxury-input">
                  <option>All Users</option>
                  <option>VIP Users Only</option>
                  <option>Defaulters</option>
                  <option>Group Members</option>
                </select>
              </div>
              <div>
                <label className="luxury-label">Message</label>
                <textarea rows={4} className="luxury-input resize-none" placeholder="Type announcement..." />
              </div>
              <div>
                <label className="luxury-label">Image (Optional)</label>
                <label className="flex items-center gap-3 glass-card-static rounded-xl px-3 py-2.5 cursor-pointer hover:border-gold/40 transition-all group">
                  <Image size={14} className="text-gold shrink-0" />
                  <span className="text-muted-foreground text-xs group-hover:text-foreground transition-colors">
                    {announcementImg ? "✅ Image attached" : "Attach image (optional)"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={() => setAnnouncementImg("uploaded")} />
                </label>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowAnnouncement(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
                <button onClick={() => setShowAnnouncement(false)} className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Send size={14} /> Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ CREATE GROUP MODAL ============ */}
      {showCreateGroup && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card-static rounded-2xl p-6 max-w-lg w-full border border-gold/30 animate-scale-in my-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="gold-gradient-text font-cinzel font-bold text-lg">Create New Group</h3>
              <button onClick={() => setShowCreateGroup(false)} className="text-muted-foreground hover:text-foreground p-1"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {[
                { label: "Group Name", ph: "e.g. Golden Circle Alpha" },
                { label: "Description", ph: "Group description...", type: "textarea" },
                { label: "Contribution Amount (₦)", ph: "e.g. 5000", type: "number" },
              ].map(f => (
                <div key={f.label}>
                  <label className="luxury-label">{f.label}</label>
                  {f.type === "textarea"
                    ? <textarea rows={3} className="luxury-input resize-none text-sm" placeholder={f.ph} />
                    : <input type={f.type || "text"} className="luxury-input text-sm" placeholder={f.ph} />
                  }
                </div>
              ))}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="luxury-label">Cycle Type</label>
                  <select className="luxury-input text-sm"><option>Daily</option><option>Weekly</option><option>Monthly</option></select>
                </div>
                <div>
                  <label className="luxury-label">Total Slots</label>
                  <input type="number" defaultValue={100} max={100} className="luxury-input text-sm" />
                </div>
              </div>
              <div>
                <label className="luxury-label">Terms & Conditions</label>
                <textarea rows={3} className="luxury-input resize-none text-sm" placeholder="Enter terms..." />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCreateGroup(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
                <button onClick={() => setShowCreateGroup(false)} className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
                  <Plus size={14} /> Create Group
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
