import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Users, BarChart3, Shield, FileText, Bell, Ban, Star, Unlock, Lock,
  Search, AlertTriangle, CheckCircle, X, MessageSquare,
  UserX, UserCheck, Crown, Eye, EyeOff, Edit, Send, Plus, Megaphone, ListChecks,
  Clock, TrendingUp, LogOut, Trash2, Image, Phone, Mail, MapPin,
  Calendar, Key, Hash, RefreshCw, Wallet, Settings,
  ToggleLeft, ToggleRight, Facebook, ChevronDown, ChevronUp,
  CreditCard, Reply, UserCog, Tag, Server, Info
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

type SideTab =
  | "overview" | "users" | "groups" | "payments"
  | "announcements" | "seat-changes" | "defaulters"
  | "audit" | "exit-requests" | "live-groups" | "tags"
  | "support" | "contact-info" | "group-messages";

const SIDEBAR_ITEMS: { id: SideTab; icon: React.FC<any>; label: string }[] = [
  { id: "overview",       icon: BarChart3,     label: "Overview" },
  { id: "users",          icon: Users,         label: "Users" },
  { id: "groups",         icon: Shield,        label: "Groups" },
  { id: "payments",       icon: FileText,      label: "Payments" },
  { id: "announcements",  icon: Megaphone,     label: "Announcements" },
  { id: "group-messages", icon: MessageSquare, label: "Group Messages" },
  { id: "support",        icon: Bell,          label: "Support Tickets" },
  { id: "contact-info",   icon: Phone,         label: "Contact Info" },
  { id: "seat-changes",   icon: ListChecks,    label: "Seat Changes" },
  { id: "defaulters",     icon: AlertTriangle, label: "Defaulters" },
  { id: "exit-requests",  icon: LogOut,        label: "Exit Requests" },
  { id: "live-groups",    icon: TrendingUp,    label: "Live Groups" },
  { id: "audit",          icon: FileText,      label: "Audit Logs" },
  { id: "tags",           icon: Star,          label: "VIP Tags" },
];

const MOCK_USERS = [
  { id: "u1", username: "ChiefSaver",  email: "emeka@example.com",   fullName: "Emeka Okonkwo",   phone: "+234 801 000 0001", dob: "1985-04-12", state: "Lagos",  lga: "Ikeja",         address: "5 Marina St, Lagos",     trustScore: 98, status: "active",     isVip: true,  role: "user",      isBanned: false, isFrozen: false, isRestricted: false, password: "chiefsaver123", bankAccName: "Emeka Okonkwo",   bankAccNum: "0123456780", bankName: "GTBank" },
  { id: "u2", username: "GoldQueen",   email: "aisha@example.com",   fullName: "Aisha Mohammed",  phone: "+234 802 000 0002", dob: "1990-07-25", state: "Abuja",  lga: "Bwari",         address: "12 Unity Rd, Abuja",     trustScore: 95, status: "active",     isVip: true,  role: "user",      isBanned: false, isFrozen: false, isRestricted: false, password: "goldqueen456", bankAccName: "Aisha Mohammed",  bankAccNum: "0234567891", bankName: "Access Bank" },
  { id: "u3", username: "StrongBase",  email: "tunde@example.com",   fullName: "Tunde Bakare",    phone: "+234 803 000 0003", dob: "1988-11-03", state: "Ogun",   lga: "Abeokuta",      address: "8 Freedom Way, Ogun",    trustScore: 89, status: "active",     isVip: false, role: "moderator", isBanned: false, isFrozen: false, isRestricted: false, password: "strongbase789", bankAccName: "Tunde Bakare",    bankAccNum: "0345678902", bankName: "Zenith Bank" },
  { id: "u4", username: "FaithSaves",  email: "ngozi@example.com",   fullName: "Ngozi Eze",       phone: "+234 804 000 0004", dob: "1992-02-14", state: "Enugu",  lga: "Enugu North",   address: "3 Grace Ave, Enugu",     trustScore: 92, status: "restricted", isVip: false, role: "user",      isBanned: false, isFrozen: false, isRestricted: true,  password: "faithsaves321", bankAccName: "Ngozi Eze",       bankAccNum: "0456789013", bankName: "First Bank" },
  { id: "u5", username: "goldmember",  email: "rejoice@example.com", fullName: "Rejoice Adeyemi", phone: "+234 801 234 5678", dob: "1995-09-20", state: "Oyo",    lga: "Ibadan North",  address: "10 Gold St, Ibadan",     trustScore: 95, status: "active",     isVip: true,  role: "user",      isBanned: false, isFrozen: false, isRestricted: false, password: "password123",   bankAccName: "Rejoice Adeyemi", bankAccNum: "0123456789", bankName: "Zenith Bank" },
  { id: "u6", username: "DiamondHand", email: "fatima@example.com",  fullName: "Fatima Garba",    phone: "+234 806 000 0006", dob: "1993-06-08", state: "Kano",   lga: "Kano Munic",    address: "7 Diamond Rd, Kano",     trustScore: 91, status: "frozen",     isVip: true,  role: "user",      isBanned: false, isFrozen: true,  isRestricted: false, password: "diamond654",    bankAccName: "Fatima Garba",    bankAccNum: "0567890124", bankName: "Fidelity Bank" },
  { id: "u7", username: "VaultKeeper", email: "samuel@example.com",  fullName: "Samuel Ojo",      phone: "+234 807 000 0007", dob: "1987-12-30", state: "Rivers", lga: "Port Harcourt", address: "2 Creek Rd, PH",         trustScore: 74, status: "banned",     isVip: false, role: "user",      isBanned: true,  isFrozen: false, isRestricted: false, password: "vault987",      bankAccName: "Samuel Ojo",      bankAccNum: "0678901235", bankName: "UBA" },
];

const MOCK_SEAT_CHANGES = [
  { id: "s1", user: "goldmember", group: "Golden Circle Alpha",  from: 5,  to: 12, reason: "Schedule conflict",   time: "2026-03-17 10:00" },
  { id: "s2", user: "ChiefSaver", group: "Silver Vault Weekly",  from: 22, to: 45, reason: "Personal preference", time: "2026-03-16 15:30" },
  { id: "s3", user: "GoldQueen",  group: "Diamond Elite Circle", from: 8,  to: 3,  reason: "Better slot timing",  time: "2026-03-18 09:15" },
];

const MOCK_DEFAULTERS = [
  { id: "d1", user: "FaithSaves",  group: "Golden Circle Alpha", since: "2026-03-15", count: 2, amount: "₦10,000" },
  { id: "d2", user: "VaultKeeper", group: "Silver Vault Weekly", since: "2026-03-14", count: 4, amount: "₦100,000" },
  { id: "d3", user: "StrongBase",  group: "Platinum Monthly",    since: "2026-03-16", count: 1, amount: "₦100,000" },
];

const MOCK_EXIT_REQUESTS = [
  { id: "e1", user: "StrongBase",  group: "Golden Circle Alpha", reason: "Financial difficulties", date: "2026-03-17" },
  { id: "e2", user: "VaultKeeper", group: "Silver Vault Weekly", reason: "Relocating abroad",      date: "2026-03-16" },
];

const MOCK_AUDIT_LOGS = [
  { id: "a1", action: "Payment RAJ-0000012 approved for goldmember",    admin: "michaelvictor0014", time: "2026-03-17 09:00", type: "approve" },
  { id: "a2", action: "User FaithSaves restricted — missed 2 payments", admin: "michaelvictor0014", time: "2026-03-17 08:05", type: "restrict" },
  { id: "a3", action: "VaultKeeper banned — policy violation",           admin: "michaelvictor0014", time: "2026-03-16 14:22", type: "ban" },
  { id: "a4", action: "DiamondHand account frozen temporarily",          admin: "michaelvictor0014", time: "2026-03-16 11:30", type: "lock" },
  { id: "a5", action: "goldmember promoted to VIP status",               admin: "michaelvictor0014", time: "2026-03-15 10:10", type: "vip" },
  { id: "a6", action: "User StrongBase defaulter status removed",        admin: "michaelvictor0014", time: "2026-03-15 09:00", type: "approve" },
  { id: "a7", action: "Public announcement published",                   admin: "michaelvictor0014", time: "2026-03-14 12:00", type: "announce" },
];

const GROUP_SEAT_MAP: Record<string, { seatNo: number; username: string; fullName: string; paymentStatus: "paid" | "pending" | "defaulter" }[]> = {
  "g1": [
    { seatNo: 1,  username: "ChiefSaver",  fullName: "Emeka Okonkwo",   paymentStatus: "paid" },
    { seatNo: 2,  username: "GoldQueen",   fullName: "Aisha Mohammed",  paymentStatus: "paid" },
    { seatNo: 3,  username: "StrongBase",  fullName: "Tunde Bakare",    paymentStatus: "pending" },
    { seatNo: 4,  username: "FaithSaves",  fullName: "Ngozi Eze",       paymentStatus: "defaulter" },
    { seatNo: 5,  username: "goldmember",  fullName: "Rejoice Adeyemi", paymentStatus: "paid" },
    { seatNo: 6,  username: "DiamondHand", fullName: "Fatima Garba",    paymentStatus: "pending" },
    { seatNo: 7,  username: "VaultKeeper", fullName: "Samuel Ojo",      paymentStatus: "defaulter" },
    { seatNo: 8,  username: "GoldQueen",   fullName: "Aisha Mohammed",  paymentStatus: "paid" },
    { seatNo: 10, username: "ChiefSaver",  fullName: "Emeka Okonkwo",   paymentStatus: "paid" },
  ],
  "g2": [
    { seatNo: 1, username: "goldmember", fullName: "Rejoice Adeyemi", paymentStatus: "paid" },
    { seatNo: 3, username: "ChiefSaver", fullName: "Emeka Okonkwo",   paymentStatus: "pending" },
  ],
};

const MOCK_PAYMENTS = [
  { id: "p1", code: "RAJ-0000015", user: "goldmember",  group: "Golden Circle Alpha", amount: 5000,   date: "2026-03-17", status: "pending",  screenshot: true },
  { id: "p2", code: "RAJ-0000014", user: "ChiefSaver",  group: "Silver Vault Weekly", amount: 25000,  date: "2026-03-17", status: "pending",  screenshot: true },
  { id: "p3", code: "RAJ-0000013", user: "GoldQueen",   group: "Diamond Elite Circle",amount: 50000,  date: "2026-03-16", status: "approved", screenshot: true },
  { id: "p4", code: "RAJ-0000012", user: "FaithSaves",  group: "Platinum Monthly",    amount: 100000, date: "2026-03-16", status: "declined", screenshot: false },
];

// ─── Btn helper ─────────────────────────────────────────────────────────────
const Btn = ({ onClick, children, variant = "glass", size = "sm", className = "" }: {
  onClick?: () => void; children: React.ReactNode;
  variant?: "glass" | "gold" | "red" | "green" | "blue" | "amber";
  size?: "xs" | "sm"; className?: string;
}) => {
  const base = "inline-flex items-center gap-1 font-semibold rounded-lg transition-all cursor-pointer border";
  const sz = size === "xs" ? "px-2 py-1 text-[10px]" : "px-3 py-1.5 text-xs";
  const vars: Record<string, string> = {
    glass:  "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground hover:border-white/20",
    gold:   "border-gold/40 bg-gold/10 text-gold hover:bg-gold/20",
    red:    "border-red-600/30 bg-red-900/15 text-red-400 hover:bg-red-900/30",
    green:  "border-emerald-600/30 bg-emerald-900/15 text-emerald-400 hover:bg-emerald-900/30",
    blue:   "border-blue-600/30 bg-blue-900/15 text-blue-400 hover:bg-blue-900/30",
    amber:  "border-amber-600/30 bg-amber-900/15 text-amber-400 hover:bg-amber-900/30",
  };
  return (
    <button onClick={onClick} className={`${base} ${sz} ${vars[variant]} ${className}`}>
      {children}
    </button>
  );
};

// ─── Section header ──────────────────────────────────────────────────────────
const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-6">
    <h2 className="gold-gradient-text font-cinzel font-bold text-xl">{title}</h2>
    {sub && <p className="text-muted-foreground text-xs mt-1">{sub}</p>}
  </div>
);

// ─── Table wrapper ──────────────────────────────────────────────────────────
const Table = ({ cols, children }: { cols: string[]; children: React.ReactNode }) => (
  <div className="overflow-x-auto rounded-xl border border-gold/15">
    <table className="w-full text-xs">
      <thead>
        <tr className="border-b border-gold/15 bg-gold/5">
          {cols.map(c => (
            <th key={c} className="px-4 py-3 text-left text-muted-foreground font-semibold uppercase tracking-wider text-[10px]">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

const TR = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <tr className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${className}`}>{children}</tr>
);
const TD = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    active: "text-emerald-400 bg-emerald-900/20 border-emerald-600/25",
    restricted: "text-amber-400 bg-amber-900/20 border-amber-600/25",
    frozen: "text-blue-400 bg-blue-900/20 border-blue-600/25",
    banned: "text-red-400 bg-red-900/20 border-red-600/25",
    pending: "text-amber-400 bg-amber-900/20 border-amber-600/25",
    approved: "text-emerald-400 bg-emerald-900/20 border-emerald-600/25",
    declined: "text-red-400 bg-red-900/20 border-red-600/25",
    open: "text-blue-400 bg-blue-900/20 border-blue-600/25",
    replied: "text-emerald-400 bg-emerald-900/20 border-emerald-600/25",
    closed: "text-muted-foreground bg-muted/20 border-muted/25",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${map[status] ?? "text-muted-foreground"}`}>
      {status}
    </span>
  );
};

// ─── Modal wrapper ───────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}>
    <div className="w-full max-w-xl glass-card-static rounded-2xl border border-gold/20 shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-5 border-b border-gold/15">
        <h3 className="gold-text font-cinzel font-bold text-base">{title}</h3>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors"><X size={18} /></button>
      </div>
      <div className="p-5">{children}</div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────
export default function Admin() {
  const { currentUser, isLoggedIn, groups, announcements, refreshAnnouncements, contactInfo, refreshContactInfo, platformSettings, refreshPlatformSettings } = useApp();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [localContactInfo, setLocalContactInfo] = useState({ ...contactInfo });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    const [{ data: txs }, { data: tickets }] = await Promise.all([
      supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(50),
      supabase.from("support_tickets").select("*").order("created_at", { ascending: false }),
    ]);
    if (txs) setTransactions(txs);
    if (tickets) setSupportTickets(tickets);
  };

  const [sideTab, setSideTab]               = useState<SideTab>("overview");
  const [searchQuery, setSearchQuery]       = useState("");
  const [serverMaintenance, setServerMaintenance] = useState(false);

  // modals
  const [showReminderModal, setShowReminderModal]     = useState(false);
  const [showCreateGroup, setShowCreateGroup]         = useState(false);
  const [showAnnouncement, setShowAnnouncement]       = useState(false);
  const [showGroupMsg, setShowGroupMsg]               = useState(false);
  const [showUserEdit, setShowUserEdit]               = useState<string | null>(null);
  const [showGroupSeatView, setShowGroupSeatView]     = useState<string | null>(null);
  const [showSupportReply, setShowSupportReply]       = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset]     = useState<string | null>(null);
  const [showForgotRequests, setShowForgotRequests]   = useState(false);

  // form state
  const [reminderTarget, setReminderTarget]     = useState("");
  const [reminderMsg, setReminderMsg]           = useState("");
  const [annTitle, setAnnTitle]                 = useState("");
  const [annBody, setAnnBody]                   = useState("");
  const [annType, setAnnType]                   = useState<"announcement"|"promotion"|"server-update"|"group-message">("announcement");
  const [annImg, setAnnImg]                     = useState<string | null>(null);
  const [groupMsgTarget, setGroupMsgTarget]     = useState("");
  const [groupMsgBody, setGroupMsgBody]         = useState("");
  const [supportReplyText, setSupportReplyText] = useState("");
  const [newPassword, setNewPassword]           = useState("");
  const [seatViewGroup, setSeatViewGroup]       = useState<string | null>(null);
  const [seatMap, setSeatMap]                   = useState(GROUP_SEAT_MAP);

  // user edit fields
  const [editedUser, setEditedUser]             = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords]       = useState<Record<string, boolean>>({});
  const [userList, setUserList]                 = useState(MOCK_USERS);

  // contact info editing
  const [editContact, setEditContact]           = useState({ ...contactInfo });

  const imgRef = useRef<HTMLInputElement>(null);

  if (!isLoggedIn || currentUser?.role !== "admin") return <Navigate to="/login" replace />;

  // ── helpers ──
  const filteredUsers = userList.filter(u =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const userAction = (userId: string, action: string) => {
    setUserList(prev => prev.map(u => {
      if (u.id !== userId) return u;
      switch (action) {
        case "ban":        return { ...u, isBanned: true,  status: "banned" };
        case "unban":      return { ...u, isBanned: false, status: "active" };
        case "freeze":     return { ...u, isFrozen: true,  status: "frozen" };
        case "unfreeze":   return { ...u, isFrozen: false, status: "active" };
        case "restrict":   return { ...u, isRestricted: true,  status: "restricted" };
        case "unrestrict": return { ...u, isRestricted: false, status: "active" };
        case "vip":        return { ...u, isVip: !u.isVip };
        case "moderator":  return { ...u, role: u.role === "moderator" ? "user" : "moderator" };
        default:           return u;
      }
    }));
  };

  const removeSeat = (groupId: string, seatNo: number) => {
    setSeatMap(prev => ({
      ...prev,
      [groupId]: (prev[groupId] ?? []).filter(s => s.seatNo !== seatNo),
    }));
  };

  const submitAnnouncement = async () => {
    if (!annTitle || !annBody) return;
    await supabase.from("announcements").insert({
      title: annTitle, body: annBody, type: annType,
      image_url: annImg ?? null, admin_name: currentUser?.username ?? "admin",
    });
    await refreshAnnouncements();
    setAnnTitle(""); setAnnBody(""); setAnnImg(null); setShowAnnouncement(false);
  };

  const submitGroupMessage = async () => {
    if (!groupMsgTarget || !groupMsgBody) return;
    const group = groups.find(g => g.id === groupMsgTarget);
    await supabase.from("announcements").insert({
      title: `Message to ${group?.name ?? "Group"}`,
      body: groupMsgBody, type: "group-message",
      target_group_id: groupMsgTarget, admin_name: currentUser?.username ?? "admin",
    });
    setGroupMsgBody(""); setGroupMsgTarget(""); setShowGroupMsg(false);
  };

  const submitSupportReply = async (ticketId: string) => {
    if (!supportReplyText) return;
    await supabase.from("support_tickets").update({
      admin_reply: supportReplyText, status: "replied", replied_at: new Date().toISOString(),
    }).eq("id", ticketId);
    setSupportTickets((prev: any[]) => prev.map((t: any) =>
      t.id === ticketId ? { ...t, admin_reply: supportReplyText, status: "replied" } : t
    ));
    setSupportReplyText(""); setShowSupportReply(null);
  };

  const saveUserEdit = async (userId: string) => {
    await supabase.from("profiles").update({
      first_name: editedUser.firstName,
      last_name: editedUser.lastName,
      email: editedUser.email,
      phone: editedUser.phone,
      dob: editedUser.dob,
      state_of_origin: editedUser.state,
      lga: editedUser.lga,
      current_address: editedUser.address,
      username: editedUser.username,
    }).eq("id", userId);
    setUserList((prev: any[]) => prev.map((u: any) => u.id !== userId ? u : { ...u, ...editedUser }));
    setEditedUser({});
    setShowUserEdit(null);
  };

  const handleAnnImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAnnImg(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const saveContactInfo = async () => {
    await supabase.from("contact_info").update({
      whatsapp: localContactInfo.whatsapp, facebook: localContactInfo.facebook,
      email: localContactInfo.email, call_number: localContactInfo.callNumber,
      sms_number: localContactInfo.smsNumber,
    }).eq("id", 1);
    await refreshContactInfo();
  };

  // ── User edit modal data ──
  const editUser = userList.find(u => u.id === showUserEdit);
  const replyTicket = supportTickets.find(t => t.id === showSupportReply);
  const pwUser = userList.find(u => u.id === showPasswordReset);
  const seatGroupData = seatMap[seatViewGroup ?? "g1"] ?? [];
  const seatGroupName = groups.find(g => g.id === seatViewGroup)?.name ?? "";

  // ─── SIDEBAR ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-16 flex relative">
      <ParticleBackground />

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-52 border-r border-gold/10 z-40 overflow-y-auto"
        style={{ background: "rgba(8,8,8,0.92)", backdropFilter: "blur(20px)" }}>
        <div className="p-4 border-b border-gold/10">
          <p className="gold-gradient-text font-cinzel font-bold text-sm">ADMIN PANEL</p>
          <p className="text-muted-foreground text-[10px] mt-0.5">v1.06</p>
        </div>
        <nav className="p-2">
          {SIDEBAR_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setSideTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all mb-1 text-left ${
                sideTab === item.id
                  ? "bg-gold/15 border border-gold/30 text-gold"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon size={13} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Server maintenance toggle */}
        <div className="p-3 border-t border-gold/10 mt-2">
          <p className="text-muted-foreground text-[10px] mb-2 uppercase tracking-widest">Server</p>
          <button
            onClick={() => setServerMaintenance(!serverMaintenance)}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
              serverMaintenance
                ? "bg-red-900/20 border-red-600/30 text-red-400"
                : "bg-emerald-900/10 border-emerald-600/20 text-emerald-400"
            }`}
          >
            {serverMaintenance ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
            {serverMaintenance ? "Maintenance ON" : "Platform Live"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="ml-52 flex-1 p-6 relative z-10">

        {/* ═══ OVERVIEW ═══════════════════════════════════════════════════════ */}
        {sideTab === "overview" && (
          <div>
            <SectionHeader title="Admin Overview" sub="Platform summary and quick actions" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Users",    val: userList.length,                      color: "text-gold" },
                { label: "Active Groups",  val: groups.filter(g => g.isLive).length,  color: "text-emerald-400" },
                { label: "Pending Payments", val: MOCK_PAYMENTS.filter(p => p.status === "pending").length, color: "text-amber-400" },
                { label: "Open Tickets",   val: supportTickets.filter(t => t.status === "open").length, color: "text-blue-400" },
              ].map(s => (
                <div key={s.label} className="glass-card-static rounded-2xl p-5 text-center">
                  <p className={`${s.color} font-cinzel font-bold text-3xl`}>{s.val}</p>
                  <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="glass-card-static rounded-2xl p-5 mb-6">
              <p className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                <Btn variant="gold"  onClick={() => { setSideTab("announcements"); setShowAnnouncement(true); }}><Megaphone size={12} />New Announcement</Btn>
                <Btn variant="green" onClick={() => setShowCreateGroup(true)}><Plus size={12} />Create Group</Btn>
                <Btn variant="blue"  onClick={() => { setSideTab("group-messages"); setShowGroupMsg(true); }}><MessageSquare size={12} />Group Message</Btn>
                <Btn variant="amber" onClick={() => setShowReminderModal(true)}><Bell size={12} />Send Reminder</Btn>
                <Btn variant="glass" onClick={() => setSideTab("payments")}><FileText size={12} />Review Payments</Btn>
                <Btn variant="glass" onClick={() => setSideTab("support")}><Reply size={12} />Support Tickets</Btn>
              </div>
            </div>

            {/* Recent audit */}
            <div className="glass-card-static rounded-2xl p-5">
              <p className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">Recent Activity</p>
              <div className="space-y-2">
                {MOCK_AUDIT_LOGS.slice(0, 5).map(log => (
                  <div key={log.id} className="flex items-center gap-3 text-xs py-2 border-b border-white/5 last:border-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      log.type === "approve" ? "bg-emerald-400" :
                      log.type === "ban" ? "bg-red-400" :
                      log.type === "restrict" ? "bg-amber-400" :
                      "bg-gold"
                    }`} />
                    <span className="text-muted-foreground flex-1">{log.action}</span>
                    <span className="text-muted-foreground/50">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ USERS ══════════════════════════════════════════════════════════ */}
        {sideTab === "users" && (
          <div>
            <SectionHeader title="User Management" sub="View, edit, and manage all platform users" />
            <div className="flex gap-3 mb-5 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search users..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs luxury-input"
                />
              </div>
              <Btn variant="glass" onClick={() => setShowForgotRequests(true)}><Key size={12} />Password Requests</Btn>
            </div>

            <Table cols={["User", "Email", "Status", "Role", "Trust", "Actions"]}>
              {filteredUsers.map(u => (
                <TR key={u.id}>
                  <TD>
                    <div>
                      <p className="text-foreground font-semibold">@{u.username}</p>
                      <p className="text-muted-foreground text-[10px]">{u.fullName}</p>
                    </div>
                  </TD>
                  <TD><span className="text-muted-foreground">{u.email}</span></TD>
                  <TD><StatusBadge status={u.status} /></TD>
                  <TD>
                    <span className={`text-xs font-semibold ${u.role === "moderator" ? "text-purple-400" : u.role === "admin" ? "text-gold" : "text-muted-foreground"}`}>
                      {u.role}
                    </span>
                  </TD>
                  <TD><span className="text-emerald-400 font-bold">{u.trustScore}%</span></TD>
                  <TD>
                    <div className="flex gap-1 flex-wrap">
                      <Btn size="xs" variant="glass" onClick={() => { setShowUserEdit(u.id); setEditedUser({ fullName: u.fullName, email: u.email, phone: u.phone, dob: u.dob, state: u.state, lga: u.lga, address: u.address, username: u.username, password: u.password }); }}>
                        <Edit size={10} />Edit
                      </Btn>
                      <Btn size="xs" variant="gold" onClick={() => { setShowPasswordReset(u.id); setNewPassword(""); }}>
                        <Key size={10} />Password
                      </Btn>
                      <Btn size="xs" variant={u.isVip ? "glass" : "gold"} onClick={() => userAction(u.id, "vip")}>
                        <Star size={10} />{u.isVip ? "Remove VIP" : "VIP"}
                      </Btn>
                      <Btn size="xs" variant={u.role === "moderator" ? "glass" : "blue"} onClick={() => userAction(u.id, "moderator")}>
                        <Crown size={10} />{u.role === "moderator" ? "Demote" : "Mod"}
                      </Btn>
                      <Btn size="xs" variant={u.isFrozen ? "glass" : "blue"} onClick={() => userAction(u.id, u.isFrozen ? "unfreeze" : "freeze")}>
                        {u.isFrozen ? <Unlock size={10} /> : <Lock size={10} />}{u.isFrozen ? "Unfreeze" : "Freeze"}
                      </Btn>
                      <Btn size="xs" variant={u.isRestricted ? "glass" : "amber"} onClick={() => userAction(u.id, u.isRestricted ? "unrestrict" : "restrict")}>
                        {u.isRestricted ? <UserCheck size={10} /> : <UserX size={10} />}{u.isRestricted ? "Unrestrict" : "Restrict"}
                      </Btn>
                      <Btn size="xs" variant={u.isBanned ? "glass" : "red"} onClick={() => userAction(u.id, u.isBanned ? "unban" : "ban")}>
                        {u.isBanned ? <CheckCircle size={10} /> : <Ban size={10} />}{u.isBanned ? "Unban" : "Ban"}
                      </Btn>
                    </div>
                  </TD>
                </TR>
              ))}
            </Table>
          </div>
        )}

        {/* ═══ GROUPS ═════════════════════════════════════════════════════════ */}
        {sideTab === "groups" && (
          <div>
            <SectionHeader title="Group Management" sub="Manage all savings groups and their seats" />
            <div className="flex gap-2 mb-5">
              <Btn variant="gold" onClick={() => setShowCreateGroup(true)}><Plus size={12} />Create Group</Btn>
            </div>
            <div className="space-y-4">
              {groups.map(g => (
                <div key={g.id} className="glass-card-static rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-foreground font-bold">{g.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${g.isLive ? "text-emerald-400 border-emerald-600/30 bg-emerald-900/15" : "text-muted-foreground border-white/10 bg-white/5"}`}>
                          {g.isLive ? "● LIVE" : "Inactive"}
                        </span>
                        {g.isLocked && <span className="px-2 py-0.5 rounded-full text-[10px] font-bold border text-amber-400 border-amber-600/30 bg-amber-900/15">Locked</span>}
                      </div>
                      <p className="text-muted-foreground text-xs">{g.cycleType} · ₦{g.contributionAmount.toLocaleString()} per slot · {g.filledSlots}/{g.totalSlots} filled</p>
                      <p className="text-muted-foreground text-xs mt-1">Bank: {g.bankName} · {g.accountNumber} ({g.accountName})</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <Btn size="xs" variant="gold" onClick={() => { setSeatViewGroup(g.id); setShowGroupSeatView(g.id); }}>
                        <Eye size={10} />View Seats
                      </Btn>
                      <Btn size="xs" variant="glass"><Edit size={10} />Edit</Btn>
                      <Btn size="xs" variant={g.chatLocked ? "glass" : "amber"}>
                        {g.chatLocked ? <Unlock size={10} /> : <Lock size={10} />}{g.chatLocked ? "Unlock Chat" : "Lock Chat"}
                      </Btn>
                      <Btn size="xs" variant={g.isLive ? "glass" : "green"}>
                        {g.isLive ? <Lock size={10} /> : <CheckCircle size={10} />}{g.isLive ? "Deactivate" : "Go Live"}
                      </Btn>
                      <Btn size="xs" variant="red"><Trash2 size={10} />Delete</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ PAYMENTS ═══════════════════════════════════════════════════════ */}
        {sideTab === "payments" && (
          <div>
            <SectionHeader title="Payment Management" sub="Approve or decline submitted payments" />
            <Table cols={["Code", "User", "Group", "Amount", "Date", "Screenshot", "Status", "Actions"]}>
              {MOCK_PAYMENTS.map(p => (
                <TR key={p.id}>
                  <TD><span className="text-gold font-mono text-[10px]">{p.code}</span></TD>
                  <TD><span className="text-foreground font-semibold">@{p.user}</span></TD>
                  <TD><span className="text-muted-foreground">{p.group}</span></TD>
                  <TD><span className="text-emerald-400 font-bold">₦{p.amount.toLocaleString()}</span></TD>
                  <TD><span className="text-muted-foreground">{p.date}</span></TD>
                  <TD>
                    {p.screenshot
                      ? <Btn size="xs" variant="blue"><Eye size={10} />View</Btn>
                      : <span className="text-muted-foreground/50 text-[10px]">None</span>}
                  </TD>
                  <TD><StatusBadge status={p.status} /></TD>
                  <TD>
                    {p.status === "pending" && (
                      <div className="flex gap-1">
                        <Btn size="xs" variant="green"><CheckCircle size={10} />Approve</Btn>
                        <Btn size="xs" variant="red"><X size={10} />Decline</Btn>
                      </div>
                    )}
                  </TD>
                </TR>
              ))}
            </Table>
          </div>
        )}

        {/* ═══ ANNOUNCEMENTS ══════════════════════════════════════════════════ */}
        {sideTab === "announcements" && (
          <div>
            <SectionHeader title="Public Announcements" sub="Post announcements visible on the homepage" />
            <div className="flex gap-2 mb-5">
              <Btn variant="gold" onClick={() => setShowAnnouncement(true)}><Plus size={12} />New Announcement</Btn>
            </div>
            <div className="space-y-3">
              {announcements.filter(a => !a.targetGroupId).map(ann => (
                <div key={ann.id} className="glass-card-static rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gold font-bold text-xs uppercase tracking-widest">{ann.type}</span>
                      <span className="text-muted-foreground/50 text-[10px]">{ann.createdAt}</span>
                    </div>
                    <p className="text-foreground font-semibold text-sm">{ann.title}</p>
                    <p className="text-muted-foreground text-xs mt-1">{ann.body}</p>
                    {ann.imageUrl && <img src={ann.imageUrl} alt="" className="mt-2 h-16 rounded-lg object-cover" />}
                  </div>
                   <Btn size="xs" variant="red" onClick={async () => { await supabase.from("announcements").delete().eq("id", ann.id); await refreshAnnouncements(); }}>
                    <Trash2 size={10} />Delete
                  </Btn>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ GROUP MESSAGES ═════════════════════════════════════════════════ */}
        {sideTab === "group-messages" && (
          <div>
            <SectionHeader title="Group Direct Messages" sub="Send a message directly to a specific group's members" />
            <div className="flex gap-2 mb-5">
              <Btn variant="gold" onClick={() => setShowGroupMsg(true)}><Send size={12} />Send Group Message</Btn>
            </div>
            <div className="space-y-3">
              {announcements.filter(a => a.targetGroupId).map(ann => (
                <div key={ann.id} className="glass-card-static rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">Group Message</span>
                      <span className="text-muted-foreground/50 text-[10px]">{ann.createdAt}</span>
                      <span className="text-muted-foreground text-[10px]">→ {groups.find(g => g.id === ann.targetGroupId)?.name}</span>
                    </div>
                    <p className="text-foreground font-semibold text-sm">{ann.title}</p>
                    <p className="text-muted-foreground text-xs mt-1">{ann.body}</p>
                  </div>
                  <Btn size="xs" variant="red" onClick={async () => { await supabase.from("announcements").delete().eq("id", ann.id); await refreshAnnouncements(); }}>
                    <Trash2 size={10} />Delete
                  </Btn>
                </div>
              ))}
              {announcements.filter(a => a.targetGroupId).length === 0 && (
                <p className="text-muted-foreground text-sm">No group messages sent yet.</p>
              )}
            </div>
          </div>
        )}

        {/* ═══ SUPPORT TICKETS ════════════════════════════════════════════════ */}
        {sideTab === "support" && (
          <div>
            <SectionHeader title="Support Tickets" sub="View and reply to user support requests" />
            <div className="space-y-4">
              {supportTickets.map(ticket => (
                <div key={ticket.id} className="glass-card-static rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-foreground font-bold text-sm">@{ticket.username}</span>
                        <StatusBadge status={ticket.status} />
                        <span className="text-muted-foreground text-[10px]">{ticket.createdAt.split("T")[0]}</span>
                      </div>
                      <p className="text-gold text-xs font-semibold">{ticket.subject}</p>
                    </div>
                    <div className="flex gap-2">
                      {ticket.status !== "closed" && (
                        <Btn size="xs" variant="blue" onClick={() => { setShowSupportReply(ticket.id); setSupportReplyText(ticket.adminReply ?? ""); }}>
                          <Reply size={10} />Reply
                        </Btn>
                      )}
                      <Btn size="xs" variant="glass" onClick={() => setSupportTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: "closed" } : t))}>
                        <X size={10} />Close
                      </Btn>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs bg-white/3 rounded-lg p-3 mb-2">{ticket.message}</p>
                  {ticket.adminReply && (
                    <div className="bg-gold/5 border border-gold/15 rounded-lg p-3">
                      <p className="text-gold text-[10px] font-bold mb-1">Admin Reply ({ticket.repliedAt?.split("T")[0]}):</p>
                      <p className="text-foreground/80 text-xs">{ticket.adminReply}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ CONTACT INFO ═══════════════════════════════════════════════════ */}
        {sideTab === "contact-info" && (
          <div>
            <SectionHeader title="Contact Information" sub="Update support contact links shown on homepage" />
            <div className="glass-card-static rounded-2xl p-6 max-w-lg">
              <div className="space-y-4">
                {[
                  { key: "whatsapp",   label: "WhatsApp Number",  icon: MessageSquare, placeholder: "+234 800 000 0000" },
                  { key: "facebook",   label: "Facebook URL",     icon: Facebook,      placeholder: "https://facebook.com/..." },
                  { key: "email",      label: "Support Email",    icon: Mail,          placeholder: "support@example.com" },
                  { key: "callNumber", label: "Call Number",      icon: Phone,         placeholder: "+234 800 000 0001" },
                  { key: "smsNumber",  label: "SMS Number",       icon: MessageSquare, placeholder: "+234 800 000 0002" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="luxury-label flex items-center gap-1.5">
                      <field.icon size={12} className="text-gold" />{field.label}
                    </label>
                    <input
                      value={(editContact as any)[field.key]}
                      onChange={e => setEditContact(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder}
                      className="luxury-input"
                    />
                  </div>
                ))}
                <Btn variant="gold" onClick={saveContactInfo}><CheckCircle size={12} />Save Contact Info</Btn>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SEAT CHANGES ═══════════════════════════════════════════════════ */}
        {sideTab === "seat-changes" && (
          <div>
            <SectionHeader title="Seat Change Requests" sub="Approve or decline seat number change requests" />
            <Table cols={["User", "Group", "From Seat", "To Seat", "Reason", "Time", "Actions"]}>
              {MOCK_SEAT_CHANGES.map(s => (
                <TR key={s.id}>
                  <TD><span className="text-foreground font-semibold">@{s.user}</span></TD>
                  <TD><span className="text-muted-foreground">{s.group}</span></TD>
                  <TD><span className="text-amber-400 font-bold">#{s.from}</span></TD>
                  <TD><span className="text-emerald-400 font-bold">#{s.to}</span></TD>
                  <TD><span className="text-muted-foreground">{s.reason}</span></TD>
                  <TD><span className="text-muted-foreground">{s.time}</span></TD>
                  <TD>
                    <div className="flex gap-1">
                      <Btn size="xs" variant="green"><CheckCircle size={10} />Approve</Btn>
                      <Btn size="xs" variant="red"><X size={10} />Decline</Btn>
                    </div>
                  </TD>
                </TR>
              ))}
            </Table>
          </div>
        )}

        {/* ═══ DEFAULTERS ═════════════════════════════════════════════════════ */}
        {sideTab === "defaulters" && (
          <div>
            <SectionHeader title="Defaulter Management" sub="Users who have missed payments" />
            <Table cols={["User", "Group", "Since", "Missed", "Amount", "Actions"]}>
              {MOCK_DEFAULTERS.map(d => (
                <TR key={d.id}>
                  <TD><span className="text-foreground font-semibold">@{d.user}</span></TD>
                  <TD><span className="text-muted-foreground">{d.group}</span></TD>
                  <TD><span className="text-muted-foreground">{d.since}</span></TD>
                  <TD><span className="text-red-400 font-bold">{d.count}x</span></TD>
                  <TD><span className="text-amber-400 font-bold">{d.amount}</span></TD>
                  <TD>
                    <div className="flex gap-1">
                      <Btn size="xs" variant="amber"><Bell size={10} />Warn</Btn>
                      <Btn size="xs" variant="blue"><UserX size={10} />Restrict</Btn>
                      <Btn size="xs" variant="glass"><CheckCircle size={10} />Remove Status</Btn>
                    </div>
                  </TD>
                </TR>
              ))}
            </Table>
          </div>
        )}

        {/* ═══ EXIT REQUESTS ══════════════════════════════════════════════════ */}
        {sideTab === "exit-requests" && (
          <div>
            <SectionHeader title="Exit Requests" sub="Users requesting to leave groups" />
            <Table cols={["User", "Group", "Reason", "Date", "Actions"]}>
              {MOCK_EXIT_REQUESTS.map(r => (
                <TR key={r.id}>
                  <TD><span className="text-foreground font-semibold">@{r.user}</span></TD>
                  <TD><span className="text-muted-foreground">{r.group}</span></TD>
                  <TD><span className="text-muted-foreground">{r.reason}</span></TD>
                  <TD><span className="text-muted-foreground">{r.date}</span></TD>
                  <TD>
                    <div className="flex gap-1">
                      <Btn size="xs" variant="green"><CheckCircle size={10} />Approve</Btn>
                      <Btn size="xs" variant="red"><X size={10} />Reject</Btn>
                    </div>
                  </TD>
                </TR>
              ))}
            </Table>
          </div>
        )}

        {/* ═══ LIVE GROUPS ════════════════════════════════════════════════════ */}
        {sideTab === "live-groups" && (
          <div>
            <SectionHeader title="Live Groups Monitor" sub="Real-time view of active groups" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.filter(g => g.isLive).map(g => (
                <div key={g.id} className="glass-card-static rounded-2xl p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <h3 className="text-foreground font-bold">{g.name}</h3>
                  </div>
                  <p className="text-muted-foreground text-xs mb-3">{g.cycleType} · ₦{g.contributionAmount.toLocaleString()}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-muted-foreground text-xs">Slots: {g.filledSlots}/{g.totalSlots}</span>
                    <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${(g.filledSlots / g.totalSlots) * 100}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn size="xs" variant="gold" onClick={() => { setSeatViewGroup(g.id); setShowGroupSeatView(g.id); }}><Eye size={10} />View Seats</Btn>
                    <Btn size="xs" variant="amber"><Lock size={10} />Lock Group</Btn>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ═══ AUDIT LOGS ═════════════════════════════════════════════════════ */}
        {sideTab === "audit" && (
          <div>
            <SectionHeader title="Audit Logs" sub="All admin actions on the platform" />
            <Table cols={["Action", "Admin", "Time", "Type"]}>
              {MOCK_AUDIT_LOGS.map(log => (
                <TR key={log.id}>
                  <TD><span className="text-muted-foreground">{log.action}</span></TD>
                  <TD><span className="text-gold font-semibold">@{log.admin}</span></TD>
                  <TD><span className="text-muted-foreground">{log.time}</span></TD>
                  <TD>
                    <span className={`text-[10px] font-bold uppercase ${
                      log.type === "approve" ? "text-emerald-400" :
                      log.type === "ban" ? "text-red-400" :
                      log.type === "restrict" ? "text-amber-400" :
                      "text-gold"
                    }`}>{log.type}</span>
                  </TD>
                </TR>
              ))}
            </Table>
          </div>
        )}

        {/* ═══ VIP TAGS ═══════════════════════════════════════════════════════ */}
        {sideTab === "tags" && (
          <div>
            <SectionHeader title="VIP Tag Management" sub="Assign or remove VIP badges from users" />
            <Table cols={["User", "Email", "Current Status", "Actions"]}>
              {userList.map(u => (
                <TR key={u.id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold">@{u.username}</span>
                      {u.isVip && <span className="vip-badge">VIP ✦</span>}
                    </div>
                  </TD>
                  <TD><span className="text-muted-foreground">{u.email}</span></TD>
                  <TD><span className={u.isVip ? "text-gold font-bold" : "text-muted-foreground"}>{u.isVip ? "VIP Member" : "Standard"}</span></TD>
                  <TD>
                    <Btn size="xs" variant={u.isVip ? "red" : "gold"} onClick={() => userAction(u.id, "vip")}>
                      <Star size={10} />{u.isVip ? "Remove VIP" : "Grant VIP"}
                    </Btn>
                  </TD>
                </TR>
              ))}
            </Table>
          </div>
        )}

      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════════ */}

      {/* ── User Edit Modal ── */}
      {showUserEdit && editUser && (
        <Modal title={`Edit User: @${editUser.username}`} onClose={() => { setShowUserEdit(null); setEditedUser({}); }}>
          <div className="space-y-3">
            {/* bank details — read only */}
            <div className="p-3 rounded-xl border border-gold/20 bg-gold/5 mb-2">
              <p className="text-gold text-[10px] font-bold uppercase mb-1">Bank Details (Private)</p>
              <p className="text-foreground text-xs font-semibold">{editUser.bankAccName}</p>
              <p className="text-muted-foreground text-xs">{editUser.bankAccNum} — {editUser.bankName}</p>
            </div>
            {[
              { key: "fullName",  label: "Full Name" },
              { key: "username",  label: "Username" },
              { key: "email",     label: "Email" },
              { key: "phone",     label: "Phone" },
              { key: "dob",       label: "Date of Birth" },
              { key: "state",     label: "State" },
              { key: "lga",       label: "LGA" },
              { key: "address",   label: "Address" },
            ].map(f => (
              <div key={f.key}>
                <label className="luxury-label">{f.label}</label>
                <input
                  value={editedUser[f.key] ?? (editUser as any)[f.key] ?? ""}
                  onChange={e => setEditedUser(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="luxury-input"
                />
              </div>
            ))}
            <div>
              <label className="luxury-label flex items-center justify-between">
                Password
                <button onClick={() => setShowPasswords(prev => ({ ...prev, [editUser.id]: !prev[editUser.id] }))}
                  className="text-gold text-[10px] flex items-center gap-1">
                  {showPasswords[editUser.id] ? <EyeOff size={10} /> : <Eye size={10} />}
                  {showPasswords[editUser.id] ? "Hide" : "View"}
                </button>
              </label>
              <input
                type={showPasswords[editUser.id] ? "text" : "password"}
                value={editedUser.password ?? editUser.password ?? ""}
                onChange={e => setEditedUser(prev => ({ ...prev, password: e.target.value }))}
                className="luxury-input"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Btn variant="gold" onClick={() => saveUserEdit(editUser.id)}><CheckCircle size={12} />Save Changes</Btn>
              <Btn variant="glass" onClick={() => { setShowUserEdit(null); setEditedUser({}); }}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Password Reset / Send Modal ── */}
      {showPasswordReset && pwUser && (
        <Modal title={`Password Management: @${pwUser.username}`} onClose={() => setShowPasswordReset(null)}>
          <div className="space-y-4">
            <div className="p-3 rounded-xl border border-gold/20 bg-gold/5">
              <p className="text-gold text-[10px] font-bold uppercase mb-1">Current Password</p>
              <div className="flex items-center gap-2">
                <span className="text-foreground text-sm font-mono">
                  {showPasswords[pwUser.id] ? pwUser.password : "••••••••••"}
                </span>
                <button
                  onClick={() => setShowPasswords(prev => ({ ...prev, [pwUser.id]: !prev[pwUser.id] }))}
                  className="text-gold"
                >
                  {showPasswords[pwUser.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="luxury-label">Set New Password</label>
              <input
                type="text"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password to assign"
                className="luxury-input"
              />
            </div>
            <div className="flex gap-2">
              <Btn variant="gold" onClick={() => { setUserList(prev => prev.map(u => u.id === pwUser.id ? { ...u, password: newPassword } : u)); setShowPasswordReset(null); }}>
                <Key size={12} />Set Password
              </Btn>
              <Btn variant="blue"><Send size={12} />Send via Email</Btn>
              <Btn variant="glass"><Phone size={12} />Send via SMS</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Forgot Password Requests ── */}
      {showForgotRequests && (
        <Modal title="Forgotten Password Requests" onClose={() => setShowForgotRequests(false)}>
          <div className="space-y-3">
            {[
              { user: "FaithSaves", email: "ngozi@example.com", requested: "2026-03-17 08:00" },
              { user: "StrongBase", email: "tunde@example.com", requested: "2026-03-16 14:30" },
            ].map((r, i) => (
              <div key={i} className="p-3 rounded-xl border border-gold/15 bg-white/3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-foreground font-semibold text-sm">@{r.user}</p>
                  <p className="text-muted-foreground text-xs">{r.email} · {r.requested}</p>
                </div>
                <div className="flex gap-1">
                  <Btn size="xs" variant="gold" onClick={() => { setShowForgotRequests(false); setShowPasswordReset(userList.find(u => u.username === r.user)?.id ?? null); setNewPassword(""); }}>
                    <Key size={10} />Set Password
                  </Btn>
                  <Btn size="xs" variant="glass"><X size={10} />Dismiss</Btn>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ── Group Seat View Modal ── */}
      {showGroupSeatView && (
        <Modal title={`Seat Map: ${seatGroupName}`} onClose={() => setShowGroupSeatView(null)}>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            <Table cols={["Seat #", "Username", "Full Name", "Payment", "Actions"]}>
              {(seatMap[seatViewGroup ?? "g1"] ?? []).map(s => (
                <TR key={s.seatNo}>
                  <TD><span className="text-gold font-bold font-mono">#{s.seatNo}</span></TD>
                  <TD><span className="text-foreground font-semibold">@{s.username}</span></TD>
                  <TD><span className="text-muted-foreground">{s.fullName}</span></TD>
                  <TD>
                    <span className={`text-[10px] font-bold ${s.paymentStatus === "paid" ? "text-emerald-400" : s.paymentStatus === "defaulter" ? "text-red-400" : "text-amber-400"}`}>
                      {s.paymentStatus}
                    </span>
                  </TD>
                  <TD>
                    <Btn size="xs" variant="red" onClick={() => removeSeat(seatViewGroup ?? "g1", s.seatNo)}>
                      <UserX size={10} />Remove
                    </Btn>
                  </TD>
                </TR>
              ))}
            </Table>
          </div>
        </Modal>
      )}

      {/* ── Announcement Modal ── */}
      {showAnnouncement && (
        <Modal title="New Public Announcement" onClose={() => setShowAnnouncement(false)}>
          <div className="space-y-4">
            <div>
              <label className="luxury-label">Type</label>
              <select value={annType} onChange={e => setAnnType(e.target.value as Announcement["type"])} className="luxury-input">
                <option value="announcement">Announcement</option>
                <option value="promotion">Promotion</option>
                <option value="server-update">Server Update</option>
              </select>
            </div>
            <div>
              <label className="luxury-label">Title</label>
              <input value={annTitle} onChange={e => setAnnTitle(e.target.value)} placeholder="Announcement title" className="luxury-input" />
            </div>
            <div>
              <label className="luxury-label">Message</label>
              <textarea value={annBody} onChange={e => setAnnBody(e.target.value)} placeholder="Write your announcement..." className="luxury-input h-24 resize-none" />
            </div>
            <div>
              <label className="luxury-label">Image (Optional)</label>
              <div className="flex items-center gap-3">
                <Btn variant="glass" onClick={() => imgRef.current?.click()}>
                  <Image size={12} />Upload Image
                </Btn>
                {annImg && <span className="text-emerald-400 text-xs">Image attached ✓</span>}
                {annImg && <Btn size="xs" variant="red" onClick={() => setAnnImg(null)}><X size={10} />Remove</Btn>}
              </div>
              <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={handleAnnImageUpload} />
              {annImg && <img src={annImg} alt="preview" className="mt-2 h-24 rounded-xl object-cover" />}
            </div>
            <div className="flex gap-2">
              <Btn variant="gold" onClick={submitAnnouncement}><Send size={12} />Publish</Btn>
              <Btn variant="glass" onClick={() => setShowAnnouncement(false)}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Group Message Modal ── */}
      {showGroupMsg && (
        <Modal title="Send Message to Group" onClose={() => setShowGroupMsg(false)}>
          <div className="space-y-4">
            <div>
              <label className="luxury-label">Select Group</label>
              <select value={groupMsgTarget} onChange={e => setGroupMsgTarget(e.target.value)} className="luxury-input">
                <option value="">— Select a group —</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="luxury-label">Message</label>
              <textarea value={groupMsgBody} onChange={e => setGroupMsgBody(e.target.value)} placeholder="Write your message to group members..." className="luxury-input h-28 resize-none" />
            </div>
            <div className="flex gap-2">
              <Btn variant="gold" onClick={submitGroupMessage}><Send size={12} />Send to Group</Btn>
              <Btn variant="glass" onClick={() => setShowGroupMsg(false)}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Support Reply Modal ── */}
      {showSupportReply && replyTicket && (
        <Modal title={`Reply to: ${replyTicket.subject}`} onClose={() => setShowSupportReply(null)}>
          <div className="space-y-4">
            <div className="p-3 rounded-xl bg-white/3 border border-white/10">
              <p className="text-muted-foreground text-xs font-bold mb-1">@{replyTicket.username}'s message:</p>
              <p className="text-foreground text-xs">{replyTicket.message}</p>
            </div>
            <div>
              <label className="luxury-label">Your Reply</label>
              <textarea value={supportReplyText} onChange={e => setSupportReplyText(e.target.value)} placeholder="Type your reply..." className="luxury-input h-28 resize-none" />
            </div>
            <div className="flex gap-2">
              <Btn variant="gold" onClick={() => submitSupportReply(replyTicket.id)}><Send size={12} />Send Reply</Btn>
              <Btn variant="glass" onClick={() => setShowSupportReply(null)}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Send Reminder Modal ── */}
      {showReminderModal && (
        <Modal title="Send Reminder" onClose={() => setShowReminderModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="luxury-label">Target User</label>
              <select value={reminderTarget} onChange={e => setReminderTarget(e.target.value)} className="luxury-input">
                <option value="">— Select user —</option>
                {userList.map(u => <option key={u.id} value={u.username}>@{u.username} ({u.fullName})</option>)}
              </select>
            </div>
            <div>
              <label className="luxury-label">Message</label>
              <textarea value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} placeholder="Enter reminder message..." className="luxury-input h-24 resize-none" />
            </div>
            <div className="flex gap-2">
              <Btn variant="gold" onClick={() => { setShowReminderModal(false); setReminderMsg(""); setReminderTarget(""); }}>
                <Send size={12} />Send Reminder
              </Btn>
              <Btn variant="glass" onClick={() => setShowReminderModal(false)}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Create Group Modal ── */}
      {showCreateGroup && (
        <Modal title="Create New Group" onClose={() => setShowCreateGroup(false)}>
          <div className="space-y-3">
            {[
              { label: "Group Name", placeholder: "e.g. Golden Circle Beta" },
              { label: "Description", placeholder: "Group description..." },
              { label: "Contribution Amount (₦)", placeholder: "e.g. 5000" },
              { label: "Bank Name", placeholder: "e.g. Zenith Bank" },
              { label: "Account Number", placeholder: "10-digit account number" },
              { label: "Account Name", placeholder: "Account holder name" },
            ].map(f => (
              <div key={f.label}>
                <label className="luxury-label">{f.label}</label>
                <input placeholder={f.placeholder} className="luxury-input" />
              </div>
            ))}
            <div>
              <label className="luxury-label">Cycle Type</label>
              <select className="luxury-input">
                <option>daily</option>
                <option>weekly</option>
                <option>monthly</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <Btn variant="gold" onClick={() => setShowCreateGroup(false)}><Plus size={12} />Create Group</Btn>
              <Btn variant="glass" onClick={() => setShowCreateGroup(false)}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
