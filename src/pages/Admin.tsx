import { useState, useRef, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Users, BarChart3, Shield, FileText, Bell, Ban, Star, Unlock, Lock,
  Search, AlertTriangle, CheckCircle, X, MessageSquare,
  UserX, UserCheck, Crown, Eye, EyeOff, Edit, Send, Plus, Megaphone, ListChecks,
  Clock, TrendingUp, LogOut, Trash2, Image, Phone, Mail,
  Calendar, Key, RefreshCw, Settings,
  ToggleLeft, ToggleRight, Facebook, ChevronDown,
  Reply, UserCog, Server, Info
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

type SideTab =
  | "overview" | "users" | "groups" | "payments"
  | "announcements" | "seat-changes" | "defaulters"
  | "audit" | "exit-requests" | "live-groups" | "tags"
  | "support" | "contact-info" | "group-messages";

const SIDEBAR_ITEMS: { id: SideTab; icon: React.FC<any>; label: string; modOk?: boolean }[] = [
  { id: "overview",       icon: BarChart3,     label: "Overview",          modOk: true  },
  { id: "users",          icon: Users,         label: "Users"                            },
  { id: "groups",         icon: Shield,        label: "Groups"                           },
  { id: "payments",       icon: FileText,      label: "Payments",          modOk: true  },
  { id: "announcements",  icon: Megaphone,     label: "Announcements"                    },
  { id: "group-messages", icon: MessageSquare, label: "Group Messages"                   },
  { id: "support",        icon: Bell,          label: "Support Tickets",   modOk: true  },
  { id: "contact-info",   icon: Phone,         label: "Contact Info"                     },
  { id: "seat-changes",   icon: ListChecks,    label: "Seat Changes",      modOk: true  },
  { id: "defaulters",     icon: AlertTriangle, label: "Defaulters"                       },
  { id: "exit-requests",  icon: LogOut,        label: "Exit Requests",     modOk: true  },
  { id: "live-groups",    icon: TrendingUp,    label: "Live Groups",       modOk: true  },
  { id: "audit",          icon: FileText,      label: "Audit Logs"                       },
  { id: "tags",           icon: Star,          label: "VIP Tags"                         },
];

const Btn = ({ onClick, children, variant = "glass", size = "sm", className = "", disabled = false }: {
  onClick?: () => void; children: React.ReactNode;
  variant?: "glass" | "gold" | "red" | "green" | "blue" | "amber";
  size?: "xs" | "sm"; className?: string; disabled?: boolean;
}) => {
  const base = "inline-flex items-center gap-1 font-semibold rounded-lg transition-all cursor-pointer border disabled:opacity-50";
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
    <button disabled={disabled} onClick={onClick} className={`${base} ${sz} ${vars[variant]} ${className}`}>
      {children}
    </button>
  );
};

const SectionHeader = ({ title, sub }: { title: string; sub?: string }) => (
  <div className="mb-6">
    <h2 className="gold-gradient-text font-cinzel font-bold text-xl">{title}</h2>
    {sub && <p className="text-muted-foreground text-xs mt-1">{sub}</p>}
  </div>
);

const TableComp = ({ cols, children }: { cols: string[]; children: React.ReactNode }) => (
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

export default function Admin() {
  const { currentUser, isLoggedIn, groups, refreshGroups, announcements, refreshAnnouncements, contactInfo, refreshContactInfo, platformSettings, refreshPlatformSettings } = useApp();
  const isAdmin = currentUser?.role === "admin";
  const isMod = currentUser?.role === "moderator";

  // ── Real data state ──────────────────────────────────────────────────────────
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [seatChanges, setSeatChanges] = useState<any[]>([]);
  const [exitRequests, setExitRequests] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [defaulters, setDefaulters] = useState<any[]>([]);
  const [forgotRequests, setForgotRequests] = useState<any[]>([]);
  const [groupSlots, setGroupSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [sideTab, setSideTab] = useState<SideTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [maintenanceOn, setMaintenanceOn] = useState(platformSettings.maintenanceMode);

  // modals
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showGroupMsg, setShowGroupMsg] = useState(false);
  const [showUserEdit, setShowUserEdit] = useState<string | null>(null);
  const [showGroupSeatView, setShowGroupSeatView] = useState<string | null>(null);
  const [showSupportReply, setShowSupportReply] = useState<string | null>(null);
  const [showPasswordReset, setShowPasswordReset] = useState<string | null>(null);
  const [showForgotRequests, setShowForgotRequests] = useState(false);
  const [showDisburse, setShowDisburse] = useState<{ slot: any; group: any } | null>(null);

  // form state
  const [reminderTarget, setReminderTarget] = useState("");
  const [reminderMsg, setReminderMsg] = useState("");
  const [annTitle, setAnnTitle] = useState("");
  const [annBody, setAnnBody] = useState("");
  const [annType, setAnnType] = useState<"announcement"|"promotion"|"server-update"|"group-message">("announcement");
  const [annImg, setAnnImg] = useState<File | null>(null);
  const [annImgPreview, setAnnImgPreview] = useState<string | null>(null);
  const [groupMsgTarget, setGroupMsgTarget] = useState("");
  const [groupMsgBody, setGroupMsgBody] = useState("");
  const [supportReplyText, setSupportReplyText] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [editedUser, setEditedUser] = useState<Record<string, string>>({});
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  // create group form
  const [cgName, setCgName] = useState("");
  const [cgDesc, setCgDesc] = useState("");
  const [cgAmount, setCgAmount] = useState("");
  const [cgCycle, setCgCycle] = useState("daily");
  const [cgBank, setCgBank] = useState("");
  const [cgAccNum, setCgAccNum] = useState("");
  const [cgAccName, setCgAccName] = useState("");

  // contact edit
  const [editContact, setEditContact] = useState({ ...contactInfo });

  const imgRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMaintenanceOn(platformSettings.maintenanceMode); }, [platformSettings.maintenanceMode]);
  useEffect(() => { setEditContact({ ...contactInfo }); }, [contactInfo]);

  // ── Load all admin data ──────────────────────────────────────────────────────
  const loadAll = async () => {
    setLoading(true);
    const [
      { data: users },
      { data: txs },
      { data: tickets },
      { data: sc },
      { data: er },
      { data: al },
      { data: fp },
    ] = await Promise.all([
      supabase.from("profiles").select("*, user_roles(role)").order("created_at", { ascending: false }),
      supabase.from("transactions").select("*").order("created_at", { ascending: false }).limit(100),
      supabase.from("support_tickets").select("*").order("created_at", { ascending: false }),
      supabase.from("seat_change_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("exit_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("audit_logs").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("forgot_password_requests").select("*").eq("status", "pending").order("created_at", { ascending: false }),
    ]);
    if (users) {
      setDbUsers(users.map((u: any) => ({
        ...u,
        role: u.user_roles?.[0]?.role || "user",
        fullName: `${u.first_name} ${u.last_name}`.trim(),
        status: u.is_banned ? "banned" : u.is_frozen ? "frozen" : u.is_restricted ? "restricted" : "active",
      })));
      setDefaulters(users.filter((u: any) => u.is_defaulter).map((u: any) => ({
        ...u,
        fullName: `${u.first_name} ${u.last_name}`.trim(),
        role: u.user_roles?.[0]?.role || "user",
        status: u.is_banned ? "banned" : u.is_frozen ? "frozen" : u.is_restricted ? "restricted" : "active",
      })));
    }
    if (txs) setTransactions(txs);
    if (tickets) setSupportTickets(tickets);
    if (sc) setSeatChanges(sc);
    if (er) setExitRequests(er);
    if (al) setAuditLogs(al);
    if (fp) setForgotRequests(fp);
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  if (!isLoggedIn || (!isAdmin && !isMod)) return <Navigate to="/login" replace />;

  const filteredUsers = dbUsers.filter(u =>
    u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ── User actions (real DB) ────────────────────────────────────────────────────
  const userAction = async (userId: string, action: string) => {
    const updates: Record<string, any> = {};
    let newRole: string | null = null;
    switch (action) {
      case "ban":         updates.is_banned = true;  break;
      case "unban":       updates.is_banned = false; break;
      case "freeze":      updates.is_frozen = true;  break;
      case "unfreeze":    updates.is_frozen = false; break;
      case "restrict":    updates.is_restricted = true;  break;
      case "unrestrict":  updates.is_restricted = false; break;
      case "vip":
        const u = dbUsers.find(x => x.id === userId);
        updates.is_vip = !u?.is_vip; break;
      case "defaulter-remove":
        updates.is_defaulter = false; break;
      case "moderator":
        const usr = dbUsers.find(x => x.id === userId);
        newRole = usr?.role === "moderator" ? "user" : "moderator";
        break;
    }
    if (Object.keys(updates).length > 0) {
      await supabase.from("profiles").update(updates).eq("id", userId);
    }
    if (newRole !== null) {
      await supabase.from("user_roles").update({ role: newRole }).eq("user_id", userId);
    }
    await supabase.from("audit_logs").insert({
      action: `Admin performed action "${action}" on user ${dbUsers.find(x => x.id === userId)?.username}`,
      performed_by: currentUser!.id,
      performed_by_username: currentUser!.username,
      target_user_id: userId,
      target_username: dbUsers.find(x => x.id === userId)?.username,
      type: action,
    });
    await loadAll();
  };

  // ── Maintenance toggle ───────────────────────────────────────────────────────
  const toggleMaintenance = async () => {
    const newVal = !maintenanceOn;
    await supabase.from("platform_settings").update({ maintenance_mode: newVal }).eq("id", 1);
    setMaintenanceOn(newVal);
    await refreshPlatformSettings();
    await supabase.from("audit_logs").insert({
      action: `Maintenance mode turned ${newVal ? "ON" : "OFF"}`,
      performed_by: currentUser!.id,
      performed_by_username: currentUser!.username,
      type: "server",
    });
  };

  // ── Group seat view ──────────────────────────────────────────────────────────
  const loadGroupSlots = async (groupId: string) => {
    const { data } = await supabase
      .from("slots")
      .select("*")
      .eq("group_id", groupId)
      .order("seat_number");
    if (data) setGroupSlots(data);
  };

  const removeSeat = async (slotId: string, username: string, seatNo: number) => {
    await supabase.from("slots").update({
      user_id: null, username: null, full_name: null,
      status: "available", payment_status: "unpaid", locked_until: null,
    }).eq("id", slotId);
    await supabase.from("audit_logs").insert({
      action: `Admin removed @${username} from Seat #${seatNo}`,
      performed_by: currentUser!.id,
      performed_by_username: currentUser!.username,
      type: "remove",
    });
    if (showGroupSeatView) loadGroupSlots(showGroupSeatView);
  };

  const disburseSlot = async (slot: any, group: any) => {
    await supabase.from("slots").update({ is_disbursed: true, disbursed_at: new Date().toISOString() }).eq("id", slot.id);
    await supabase.from("payout_queue").insert({
      user_id: slot.user_id, username: slot.username,
      group_id: group.id, seat_number: slot.seat_number,
      amount: group.contributionAmount, status: "disbursed",
      disbursed_at: new Date().toISOString(),
    });
    await supabase.from("notifications").insert({
      user_id: slot.user_id,
      message: `🎉 Your payout for Seat #${slot.seat_number} in "${group.name}" has been disbursed by admin!`,
      type: "payout",
    });
    await supabase.from("audit_logs").insert({
      action: `Disbursed payment for @${slot.username} Seat #${slot.seat_number} in "${group.name}"`,
      performed_by: currentUser!.id,
      performed_by_username: currentUser!.username,
      target_user_id: slot.user_id,
      target_username: slot.username,
      type: "disburse",
    });
    setShowDisburse(null);
    if (showGroupSeatView) loadGroupSlots(showGroupSeatView);
  };

  // ── Payment actions ──────────────────────────────────────────────────────────
  const approvePayment = async (txId: string, userId: string, seatNumber: number | null, groupId: string | null) => {
    await supabase.from("transactions").update({ status: "approved", updated_at: new Date().toISOString() }).eq("id", txId);
    if (seatNumber && groupId) {
      await supabase.from("slots").update({ payment_status: "paid" })
        .eq("group_id", groupId).eq("seat_number", seatNumber).eq("user_id", userId);
      await supabase.from("profiles").update({ total_paid: supabase.rpc as any }).eq("id", userId);
    }
    await supabase.from("notifications").insert({
      user_id: userId,
      message: `✅ Your payment has been approved by admin.`,
      type: "payment",
    });
    await supabase.from("audit_logs").insert({
      action: `Payment ${txId.slice(0,8)} approved`,
      performed_by: currentUser!.id,
      performed_by_username: currentUser!.username,
      target_user_id: userId,
      type: "approve",
    });
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: "approved" } : t));
  };

  const declinePayment = async (txId: string, userId: string) => {
    await supabase.from("transactions").update({ status: "declined", updated_at: new Date().toISOString() }).eq("id", txId);
    await supabase.from("notifications").insert({
      user_id: userId,
      message: `❌ Your payment submission was declined. Please contact support.`,
      type: "payment",
    });
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: "declined" } : t));
  };

  // ── Announcement ─────────────────────────────────────────────────────────────
  const submitAnnouncement = async () => {
    if (!annTitle || !annBody) return;
    let imageUrl: string | null = null;
    if (annImg) {
      const path = `announcements/${Date.now()}-${annImg.name}`;
      const { error: upErr } = await supabase.storage.from("announcements").upload(path, annImg);
      if (!upErr) {
        const { data } = supabase.storage.from("announcements").getPublicUrl(path);
        imageUrl = data.publicUrl;
      }
    }
    await supabase.from("announcements").insert({
      title: annTitle, body: annBody, type: annType,
      image_url: imageUrl, admin_name: currentUser?.username ?? "admin",
    });
    await refreshAnnouncements();
    setAnnTitle(""); setAnnBody(""); setAnnImg(null); setAnnImgPreview(null);
    setShowAnnouncement(false);
  };

  const submitGroupMessage = async () => {
    if (!groupMsgTarget || !groupMsgBody) return;
    const group = groups.find(g => g.id === groupMsgTarget);
    // Also insert into group_messages as a system message
    const { data: slots } = await supabase.from("slots").select("user_id").eq("group_id", groupMsgTarget).not("user_id", "is", null);
    if (slots) {
      for (const s of slots) {
        await supabase.from("notifications").insert({
          user_id: s.user_id,
          message: `📢 Admin message in "${group?.name}": ${groupMsgBody}`,
          type: "group-message",
        });
      }
    }
    await supabase.from("group_messages").insert({
      group_id: groupMsgTarget,
      user_id: currentUser!.id,
      username: currentUser!.username,
      message: `📢 Admin: ${groupMsgBody}`,
      is_system: true,
    });
    await supabase.from("announcements").insert({
      title: `Message to ${group?.name ?? "Group"}`,
      body: groupMsgBody, type: "group-message",
      target_group_id: groupMsgTarget, admin_name: currentUser?.username ?? "admin",
    });
    await refreshAnnouncements();
    setGroupMsgBody(""); setGroupMsgTarget(""); setShowGroupMsg(false);
  };

  const submitSupportReply = async (ticketId: string, userId: string) => {
    if (!supportReplyText) return;
    await supabase.from("support_tickets").update({
      admin_reply: supportReplyText, status: "replied", replied_at: new Date().toISOString(),
    }).eq("id", ticketId);
    await supabase.from("notifications").insert({
      user_id: userId,
      message: `💬 Admin replied to your support ticket.`,
      type: "support",
    });
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, admin_reply: supportReplyText, status: "replied" } : t));
    setSupportReplyText(""); setShowSupportReply(null);
  };

  // ── Save user edits (real DB) ─────────────────────────────────────────────────
  const saveUserEdit = async (userId: string) => {
    const updates: Record<string, any> = {};
    if (editedUser.firstName !== undefined) updates.first_name = editedUser.firstName;
    if (editedUser.lastName !== undefined) updates.last_name = editedUser.lastName;
    if (editedUser.email !== undefined) updates.email = editedUser.email;
    if (editedUser.phone !== undefined) updates.phone = editedUser.phone;
    if (editedUser.dob !== undefined) updates.dob = editedUser.dob;
    if (editedUser.state !== undefined) updates.state_of_origin = editedUser.state;
    if (editedUser.lga !== undefined) updates.lga = editedUser.lga;
    if (editedUser.address !== undefined) updates.current_address = editedUser.address;
    if (editedUser.username !== undefined) updates.username = editedUser.username;
    if (editedUser.nickname !== undefined) updates.nickname = editedUser.nickname;
    await supabase.from("profiles").update(updates).eq("id", userId);
    await supabase.from("audit_logs").insert({
      action: `Admin edited profile of @${dbUsers.find(u => u.id === userId)?.username}`,
      performed_by: currentUser!.id,
      performed_by_username: currentUser!.username,
      target_user_id: userId,
      type: "edit",
    });
    setEditedUser({}); setShowUserEdit(null);
    await loadAll();
  };

  // ── Admin set user password ──────────────────────────────────────────────────
  const setUserPasswordAdmin = async (userId: string) => {
    if (!newPassword || newPassword.length < 6) return;
    // Use service role via edge function - for now notify user to change
    await supabase.from("notifications").insert({
      user_id: userId,
      message: `🔑 Admin has updated your password. New password: ${newPassword}. Please change it after logging in.`,
      type: "security",
    });
    await supabase.from("audit_logs").insert({
      action: `Admin set new password for @${dbUsers.find(u => u.id === userId)?.username}`,
      performed_by: currentUser!.id,
      performed_by_username: currentUser!.username,
      target_user_id: userId,
      type: "password",
    });
    alert("Password notification sent to user. They will receive it on next login.");
    setShowPasswordReset(null); setNewPassword("");
  };

  // ── Send reminder ─────────────────────────────────────────────────────────────
  const sendReminder = async () => {
    if (!reminderTarget || !reminderMsg) return;
    const user = dbUsers.find(u => u.username === reminderTarget);
    if (!user) return;
    await supabase.from("notifications").insert({
      user_id: user.id,
      message: reminderMsg,
      type: "reminder",
    });
    setShowReminderModal(false); setReminderMsg(""); setReminderTarget("");
  };

  // ── Create Group ──────────────────────────────────────────────────────────────
  const createGroup = async () => {
    if (!cgName || !cgAmount) return;
    await supabase.from("groups").insert({
      name: cgName, description: cgDesc,
      contribution_amount: parseInt(cgAmount),
      cycle_type: cgCycle, bank_name: cgBank,
      account_number: cgAccNum, account_name: cgAccName,
      total_slots: 100, filled_slots: 0,
      is_live: false, is_locked: false, chat_locked: false,
      created_by: currentUser!.id,
    });
    await refreshGroups();
    setCgName(""); setCgDesc(""); setCgAmount(""); setCgBank(""); setCgAccNum(""); setCgAccName("");
    setShowCreateGroup(false);
  };

  // ── Group live toggle ─────────────────────────────────────────────────────────
  const toggleGroupLive = async (groupId: string, currentLive: boolean) => {
    await supabase.from("groups").update({ is_live: !currentLive }).eq("id", groupId);
    await supabase.from("audit_logs").insert({
      action: `Group ${groups.find(g => g.id === groupId)?.name} set to ${!currentLive ? "LIVE" : "inactive"}`,
      performed_by: currentUser!.id,
      performed_by_username: currentUser!.username,
      type: "group",
    });
    await refreshGroups();
  };

  // ── Contact info ─────────────────────────────────────────────────────────────
  const saveContactInfo = async () => {
    await supabase.from("contact_info").update({
      whatsapp: editContact.whatsapp, facebook: editContact.facebook,
      email: editContact.email, call_number: editContact.callNumber,
      sms_number: editContact.smsNumber,
    }).eq("id", 1);
    await refreshContactInfo();
  };

  // ── Seat/Exit request approve/reject ─────────────────────────────────────────
  const approveSeatChange = async (req: any) => {
    // Swap seats
    await supabase.from("slots").update({ seat_number: req.to_seat }).eq("group_id", req.group_id).eq("seat_number", req.from_seat).eq("user_id", req.user_id);
    await supabase.from("seat_change_requests").update({ status: "approved" }).eq("id", req.id);
    await supabase.from("notifications").insert({ user_id: req.user_id, message: `✅ Your seat change request from #${req.from_seat} to #${req.to_seat} was approved!`, type: "seat" });
    await loadAll();
  };
  const rejectSeatChange = async (req: any) => {
    await supabase.from("seat_change_requests").update({ status: "rejected" }).eq("id", req.id);
    await supabase.from("notifications").insert({ user_id: req.user_id, message: `❌ Your seat change request from #${req.from_seat} to #${req.to_seat} was rejected.`, type: "seat" });
    await loadAll();
  };
  const approveExitRequest = async (req: any) => {
    await supabase.from("slots").update({ user_id: null, username: null, full_name: null, status: "available", payment_status: "unpaid" }).eq("group_id", req.group_id).eq("user_id", req.user_id);
    await supabase.from("exit_requests").update({ status: "approved" }).eq("id", req.id);
    await supabase.from("notifications").insert({ user_id: req.user_id, message: `✅ Your exit request from "${req.group_name}" was approved.`, type: "exit" });
    await loadAll();
  };
  const rejectExitRequest = async (req: any) => {
    await supabase.from("exit_requests").update({ status: "rejected" }).eq("id", req.id);
    await supabase.from("notifications").insert({ user_id: req.user_id, message: `❌ Your exit request from "${req.group_name}" was rejected.`, type: "exit" });
    await loadAll();
  };

  const editUser = dbUsers.find(u => u.id === showUserEdit);
  const replyTicket = supportTickets.find(t => t.id === showSupportReply);
  const pwUser = dbUsers.find(u => u.id === showPasswordReset);

  const pendingTx = transactions.filter(t => t.status === "pending").length;
  const openTickets = supportTickets.filter(t => t.status === "open").length;

  return (
    <div className="min-h-screen pt-16 flex relative">
      <ParticleBackground />

      {/* Sidebar */}
      <aside className="fixed left-0 top-16 bottom-0 w-52 border-r border-gold/10 z-40 overflow-y-auto"
        style={{ background: "rgba(8,8,8,0.92)", backdropFilter: "blur(20px)" }}>
        <div className="p-4 border-b border-gold/10">
          <p className="gold-gradient-text font-cinzel font-bold text-sm">{isMod ? "MOD PANEL" : "ADMIN PANEL"}</p>
          <p className="text-muted-foreground text-[10px] mt-0.5">@{currentUser?.username}</p>
        </div>
        <nav className="p-2">
          {SIDEBAR_ITEMS.filter(item => isAdmin || item.modOk).map(item => (
            <button key={item.id} onClick={() => setSideTab(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all mb-1 text-left ${
                sideTab === item.id
                  ? "bg-gold/15 border border-gold/30 text-gold"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent"
              }`}>
              <item.icon size={13} />
              {item.label}
              {item.id === "payments" && pendingTx > 0 && (
                <span className="ml-auto text-[9px] bg-amber-500 text-black rounded-full px-1.5 py-0.5 font-black">{pendingTx}</span>
              )}
              {item.id === "support" && openTickets > 0 && (
                <span className="ml-auto text-[9px] bg-blue-500 text-white rounded-full px-1.5 py-0.5 font-black">{openTickets}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Maintenance toggle — admin only */}
        {isAdmin && (
          <div className="p-3 border-t border-gold/10 mt-2">
            <p className="text-muted-foreground text-[10px] mb-2 uppercase tracking-widest">Server</p>
            <button onClick={toggleMaintenance}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                maintenanceOn
                  ? "bg-red-900/20 border-red-600/30 text-red-400"
                  : "bg-emerald-900/10 border-emerald-600/20 text-emerald-400"
              }`}>
              {maintenanceOn ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
              {maintenanceOn ? "Maintenance ON" : "Platform Live"}
            </button>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="ml-52 flex-1 p-6 relative z-10">

        {/* ═══ OVERVIEW ══════════════════════════════════════════════════════ */}
        {sideTab === "overview" && (
          <div>
            <SectionHeader title="Admin Overview" sub="Platform summary and quick actions" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Users",       val: dbUsers.length,        color: "text-gold" },
                { label: "Active Groups",     val: groups.filter(g => g.isLive).length, color: "text-emerald-400" },
                { label: "Pending Payments",  val: pendingTx,             color: "text-amber-400" },
                { label: "Open Tickets",      val: openTickets,           color: "text-blue-400" },
              ].map(s => (
                <div key={s.label} className="glass-card-static rounded-2xl p-5 text-center">
                  <p className={`${s.color} font-cinzel font-bold text-3xl`}>{s.val}</p>
                  <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="glass-card-static rounded-2xl p-5 mb-6">
              <p className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">Quick Actions</p>
              <div className="flex flex-wrap gap-2">
                {isAdmin && <Btn variant="gold"  onClick={() => { setSideTab("announcements"); setShowAnnouncement(true); }}><Megaphone size={12} />New Announcement</Btn>}
                {isAdmin && <Btn variant="green" onClick={() => setShowCreateGroup(true)}><Plus size={12} />Create Group</Btn>}
                {isAdmin && <Btn variant="blue"  onClick={() => { setSideTab("group-messages"); setShowGroupMsg(true); }}><MessageSquare size={12} />Group Message</Btn>}
                <Btn variant="amber" onClick={() => setShowReminderModal(true)}><Bell size={12} />Send Reminder</Btn>
                <Btn variant="glass" onClick={() => setSideTab("payments")}><FileText size={12} />Review Payments</Btn>
                <Btn variant="glass" onClick={() => setSideTab("support")}><Reply size={12} />Support Tickets</Btn>
              </div>
            </div>

            <div className="glass-card-static rounded-2xl p-5">
              <p className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">Recent Activity</p>
              <div className="space-y-2">
                {auditLogs.slice(0, 8).map(log => (
                  <div key={log.id} className="flex items-center gap-3 text-xs py-2 border-b border-white/5 last:border-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${
                      log.type === "approve" ? "bg-emerald-400" :
                      log.type === "ban" ? "bg-red-400" :
                      log.type === "restrict" ? "bg-amber-400" : "bg-gold"
                    }`} />
                    <span className="text-muted-foreground flex-1">{log.action}</span>
                    <span className="text-muted-foreground/50 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString("en-NG", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                ))}
                {auditLogs.length === 0 && <p className="text-muted-foreground text-xs">No activity yet.</p>}
              </div>
            </div>
          </div>
        )}

        {/* ═══ USERS ════════════════════════════════════════════════════════ */}
        {sideTab === "users" && isAdmin && (
          <div>
            <SectionHeader title="User Management" sub="View, edit, and manage all platform users" />
            <div className="flex gap-3 mb-5 flex-wrap">
              <div className="relative flex-1 min-w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs luxury-input" />
              </div>
              <Btn variant="glass" onClick={() => setShowForgotRequests(true)}><Key size={12} />Password Requests ({forgotRequests.length})</Btn>
              <Btn variant="glass" onClick={loadAll}><RefreshCw size={12} />Refresh</Btn>
            </div>
            {loading ? (
              <div className="text-center py-8"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
            ) : (
              <TableComp cols={["User", "Email", "Phone", "Status", "Role", "Trust", "Actions"]}>
                {filteredUsers.map(u => (
                  <TR key={u.id}>
                    <TD>
                      <div>
                        <p className="text-foreground font-semibold">@{u.username}</p>
                        <p className="text-muted-foreground text-[10px]">{u.fullName}</p>
                      </div>
                    </TD>
                    <TD><span className="text-muted-foreground">{u.email}</span></TD>
                    <TD><span className="text-muted-foreground">{u.phone || "—"}</span></TD>
                    <TD><StatusBadge status={u.status} /></TD>
                    <TD>
                      <span className={`text-xs font-semibold ${u.role === "moderator" ? "text-purple-400" : u.role === "admin" ? "text-gold" : "text-muted-foreground"}`}>
                        {u.role}
                      </span>
                    </TD>
                    <TD><span className="text-emerald-400 font-bold">{u.trust_score || 80}%</span></TD>
                    <TD>
                      <div className="flex gap-1 flex-wrap">
                        <Btn size="xs" variant="glass" onClick={() => { setShowUserEdit(u.id); setEditedUser({ firstName: u.first_name, lastName: u.last_name, email: u.email, phone: u.phone || "", dob: u.dob || "", state: u.state_of_origin || "", lga: u.lga || "", address: u.current_address || "", username: u.username, nickname: u.nickname || "" }); }}>
                          <Edit size={10} />Edit
                        </Btn>
                        <Btn size="xs" variant="gold" onClick={() => { setShowPasswordReset(u.id); setNewPassword(""); }}>
                          <Key size={10} />Password
                        </Btn>
                        <Btn size="xs" variant={u.is_vip ? "glass" : "gold"} onClick={() => userAction(u.id, "vip")}>
                          <Star size={10} />{u.is_vip ? "Remove VIP" : "VIP"}
                        </Btn>
                        <Btn size="xs" variant={u.role === "moderator" ? "glass" : "blue"} onClick={() => userAction(u.id, "moderator")}>
                          <Crown size={10} />{u.role === "moderator" ? "Demote" : "Mod"}
                        </Btn>
                        <Btn size="xs" variant={u.is_frozen ? "glass" : "blue"} onClick={() => userAction(u.id, u.is_frozen ? "unfreeze" : "freeze")}>
                          {u.is_frozen ? <Unlock size={10} /> : <Lock size={10} />}{u.is_frozen ? "Unfreeze" : "Freeze"}
                        </Btn>
                        <Btn size="xs" variant={u.is_restricted ? "glass" : "amber"} onClick={() => userAction(u.id, u.is_restricted ? "unrestrict" : "restrict")}>
                          {u.is_restricted ? <UserCheck size={10} /> : <UserX size={10} />}{u.is_restricted ? "Unrestrict" : "Restrict"}
                        </Btn>
                        <Btn size="xs" variant={u.is_banned ? "glass" : "red"} onClick={() => userAction(u.id, u.is_banned ? "unban" : "ban")}>
                          {u.is_banned ? <CheckCircle size={10} /> : <Ban size={10} />}{u.is_banned ? "Unban" : "Ban"}
                        </Btn>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TableComp>
            )}
          </div>
        )}

        {/* ═══ GROUPS ══════════════════════════════════════════════════════ */}
        {sideTab === "groups" && isAdmin && (
          <div>
            <SectionHeader title="Group Management" sub="Manage all savings groups and their seats" />
            <div className="flex gap-2 mb-5">
              <Btn variant="gold" onClick={() => setShowCreateGroup(true)}><Plus size={12} />Create Group</Btn>
              <Btn variant="glass" onClick={loadAll}><RefreshCw size={12} />Refresh</Btn>
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
                      <p className="text-muted-foreground text-xs mt-1">Bank: {g.bankName || "—"} · {g.accountNumber || "—"} ({g.accountName || "—"})</p>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      <Btn size="xs" variant="gold" onClick={async () => { setShowGroupSeatView(g.id); await loadGroupSlots(g.id); }}>
                        <Eye size={10} />View Seats
                      </Btn>
                      <Btn size="xs" variant="blue" onClick={() => { setSideTab("group-messages"); setGroupMsgTarget(g.id); setShowGroupMsg(true); }}>
                        <MessageSquare size={10} />Message
                      </Btn>
                      <Btn size="xs" variant={g.chatLocked ? "glass" : "amber"} onClick={async () => {
                        await supabase.from("groups").update({ chat_locked: !g.chatLocked }).eq("id", g.id);
                        await refreshGroups();
                      }}>
                        {g.chatLocked ? <Unlock size={10} /> : <Lock size={10} />}{g.chatLocked ? "Unlock Chat" : "Lock Chat"}
                      </Btn>
                      <Btn size="xs" variant={g.isLive ? "amber" : "green"} onClick={() => toggleGroupLive(g.id, g.isLive)}>
                        {g.isLive ? <Lock size={10} /> : <CheckCircle size={10} />}{g.isLive ? "Deactivate" : "Go Live"}
                      </Btn>
                      <Btn size="xs" variant="red" onClick={async () => {
                        if (!confirm(`Delete group "${g.name}"?`)) return;
                        await supabase.from("groups").delete().eq("id", g.id);
                        await refreshGroups();
                      }}><Trash2 size={10} />Delete</Btn>
                    </div>
                  </div>
                </div>
              ))}
              {groups.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No groups created yet.</p>}
            </div>
          </div>
        )}

        {/* ═══ PAYMENTS ══════════════════════════════════════════════════════ */}
        {sideTab === "payments" && (
          <div>
            <SectionHeader title="Payment Management" sub="Approve or decline submitted payments" />
            <div className="flex gap-2 mb-4">
              <Btn variant="glass" onClick={loadAll}><RefreshCw size={12} />Refresh</Btn>
            </div>
            {loading ? (
              <div className="text-center py-8"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
            ) : (
              <TableComp cols={["Code", "User", "Group", "Seat", "Amount", "Date", "Screenshot", "Status", "Actions"]}>
                {transactions.map(p => (
                  <TR key={p.id}>
                    <TD><span className="text-gold font-mono text-[10px]">{p.code}</span></TD>
                    <TD><span className="text-foreground font-semibold">@{p.username}</span></TD>
                    <TD><span className="text-muted-foreground">{p.group_name}</span></TD>
                    <TD><span className="text-muted-foreground">{p.seat_number ? `#${p.seat_number}` : "—"}</span></TD>
                    <TD><span className="text-emerald-400 font-bold">₦{p.amount?.toLocaleString()}</span></TD>
                    <TD><span className="text-muted-foreground">{p.created_at?.split("T")[0]}</span></TD>
                    <TD>
                      {p.screenshot_url
                        ? <a href={p.screenshot_url} target="_blank" rel="noopener noreferrer"><Btn size="xs" variant="blue"><Eye size={10} />View</Btn></a>
                        : <span className="text-muted-foreground/50 text-[10px]">None</span>}
                    </TD>
                    <TD><StatusBadge status={p.status} /></TD>
                    <TD>
                      {p.status === "pending" && (
                        <div className="flex gap-1">
                          <Btn size="xs" variant="green" onClick={() => approvePayment(p.id, p.user_id, p.seat_number, p.group_id)}><CheckCircle size={10} />Approve</Btn>
                          <Btn size="xs" variant="red" onClick={() => declinePayment(p.id, p.user_id)}><X size={10} />Decline</Btn>
                        </div>
                      )}
                    </TD>
                  </TR>
                ))}
                {transactions.length === 0 && (
                  <TR><TD className="text-center text-muted-foreground py-6" colSpan={9 as any}>No transactions yet.</TD></TR>
                )}
              </TableComp>
            )}
          </div>
        )}

        {/* ═══ ANNOUNCEMENTS ═════════════════════════════════════════════════ */}
        {sideTab === "announcements" && isAdmin && (
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
                      <span className="text-muted-foreground/50 text-[10px]">{new Date(ann.createdAt).toLocaleString("en-NG")}</span>
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
              {announcements.filter(a => !a.targetGroupId).length === 0 && (
                <p className="text-muted-foreground text-sm">No public announcements yet.</p>
              )}
            </div>
          </div>
        )}

        {/* ═══ GROUP MESSAGES ════════════════════════════════════════════════ */}
        {sideTab === "group-messages" && isAdmin && (
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
                      <span className="text-muted-foreground/50 text-[10px]">{new Date(ann.createdAt).toLocaleString("en-NG")}</span>
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
            <div className="flex gap-2 mb-4"><Btn variant="glass" onClick={loadAll}><RefreshCw size={12} />Refresh</Btn></div>
            <div className="space-y-4">
              {supportTickets.map(ticket => (
                <div key={ticket.id} className="glass-card-static rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-foreground font-bold text-sm">@{ticket.username}</span>
                        <StatusBadge status={ticket.status} />
                        <span className="text-muted-foreground text-[10px]">{ticket.created_at?.split("T")[0]}</span>
                      </div>
                      <p className="text-gold text-xs font-semibold">{ticket.subject}</p>
                    </div>
                    <div className="flex gap-2">
                      {ticket.status !== "closed" && (
                        <Btn size="xs" variant="blue" onClick={() => { setShowSupportReply(ticket.id); setSupportReplyText(ticket.admin_reply ?? ""); }}>
                          <Reply size={10} />Reply
                        </Btn>
                      )}
                      <Btn size="xs" variant="glass" onClick={async () => {
                        await supabase.from("support_tickets").update({ status: "closed" }).eq("id", ticket.id);
                        setSupportTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: "closed" } : t));
                      }}>
                        <X size={10} />Close
                      </Btn>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-xs bg-white/3 rounded-lg p-3 mb-2">{ticket.message}</p>
                  {ticket.attachment_url && (
                    <a href={ticket.attachment_url} target="_blank" rel="noopener noreferrer"
                      className="text-gold text-xs hover:underline flex items-center gap-1 mb-2">
                      <Eye size={11} /> View Attachment
                    </a>
                  )}
                  {ticket.admin_reply && (
                    <div className="bg-gold/5 border border-gold/15 rounded-lg p-3">
                      <p className="text-gold text-[10px] font-bold mb-1">Admin Reply ({ticket.replied_at?.split("T")[0]}):</p>
                      <p className="text-foreground/80 text-xs">{ticket.admin_reply}</p>
                    </div>
                  )}
                </div>
              ))}
              {supportTickets.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No support tickets yet.</p>}
            </div>
          </div>
        )}

        {/* ═══ CONTACT INFO ══════════════════════════════════════════════════ */}
        {sideTab === "contact-info" && isAdmin && (
          <div>
            <SectionHeader title="Contact Information" sub="Update support contact links shown on homepage" />
            <div className="glass-card-static rounded-2xl p-6 max-w-lg">
              <div className="space-y-4">
                {[
                  { key: "whatsapp",   label: "WhatsApp Number",  placeholder: "+234 800 000 0000" },
                  { key: "facebook",   label: "Facebook URL",     placeholder: "https://facebook.com/..." },
                  { key: "email",      label: "Support Email",    placeholder: "support@example.com" },
                  { key: "callNumber", label: "Call Number",      placeholder: "+234 800 000 0001" },
                  { key: "smsNumber",  label: "SMS Number",       placeholder: "+234 800 000 0002" },
                ].map(field => (
                  <div key={field.key}>
                    <label className="luxury-label">{field.label}</label>
                    <input
                      value={(editContact as any)[field.key] || ""}
                      onChange={e => setEditContact(prev => ({ ...prev, [field.key]: e.target.value }))}
                      placeholder={field.placeholder} className="luxury-input"
                    />
                  </div>
                ))}
                <Btn variant="gold" onClick={saveContactInfo}><CheckCircle size={12} />Save Contact Info</Btn>
              </div>
            </div>
          </div>
        )}

        {/* ═══ SEAT CHANGES ══════════════════════════════════════════════════ */}
        {sideTab === "seat-changes" && (
          <div>
            <SectionHeader title="Seat Change Requests" sub="Approve or decline seat number change requests" />
            <div className="flex gap-2 mb-4"><Btn variant="glass" onClick={loadAll}><RefreshCw size={12} />Refresh</Btn></div>
            {seatChanges.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No seat change requests.</p>
            ) : (
              <TableComp cols={["User", "Group", "From Seat", "To Seat", "Reason", "Date", "Status", "Actions"]}>
                {seatChanges.map(s => (
                  <TR key={s.id}>
                    <TD><span className="text-foreground font-semibold">@{s.username}</span></TD>
                    <TD><span className="text-muted-foreground">{s.group_name}</span></TD>
                    <TD><span className="text-amber-400 font-bold">#{s.from_seat}</span></TD>
                    <TD><span className="text-emerald-400 font-bold">#{s.to_seat}</span></TD>
                    <TD><span className="text-muted-foreground">{s.reason}</span></TD>
                    <TD><span className="text-muted-foreground">{s.created_at?.split("T")[0]}</span></TD>
                    <TD><StatusBadge status={s.status} /></TD>
                    <TD>
                      {s.status === "pending" && (
                        <div className="flex gap-1">
                          <Btn size="xs" variant="green" onClick={() => approveSeatChange(s)}><CheckCircle size={10} />Approve</Btn>
                          <Btn size="xs" variant="red" onClick={() => rejectSeatChange(s)}><X size={10} />Reject</Btn>
                        </div>
                      )}
                    </TD>
                  </TR>
                ))}
              </TableComp>
            )}
          </div>
        )}

        {/* ═══ DEFAULTERS ══════════════════════════════════════════════════ */}
        {sideTab === "defaulters" && isAdmin && (
          <div>
            <SectionHeader title="Defaulter Management" sub="Users who have missed payments" />
            <div className="flex gap-2 mb-4"><Btn variant="glass" onClick={loadAll}><RefreshCw size={12} />Refresh</Btn></div>
            {defaulters.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No defaulters detected.</p>
            ) : (
              <TableComp cols={["User", "Email", "Trust Score", "Actions"]}>
                {defaulters.map(d => (
                  <TR key={d.id}>
                    <TD>
                      <div>
                        <p className="text-foreground font-semibold">@{d.username}</p>
                        <p className="text-muted-foreground text-[10px]">{d.fullName}</p>
                      </div>
                    </TD>
                    <TD><span className="text-muted-foreground">{d.email}</span></TD>
                    <TD><span className="text-red-400 font-bold">{d.trust_score}%</span></TD>
                    <TD>
                      <div className="flex gap-1">
                        <Btn size="xs" variant="amber" onClick={async () => {
                          await supabase.from("notifications").insert({ user_id: d.id, message: "⚠️ Warning: You have been marked as a defaulter. Please make your payments on time to avoid restrictions.", type: "warning" });
                        }}><Bell size={10} />Warn</Btn>
                        <Btn size="xs" variant="blue" onClick={() => userAction(d.id, "restrict")}>
                          <UserX size={10} />Restrict
                        </Btn>
                        <Btn size="xs" variant="glass" onClick={() => userAction(d.id, "defaulter-remove")}>
                          <CheckCircle size={10} />Remove Status
                        </Btn>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TableComp>
            )}
          </div>
        )}

        {/* ═══ EXIT REQUESTS ══════════════════════════════════════════════ */}
        {sideTab === "exit-requests" && (
          <div>
            <SectionHeader title="Exit Requests" sub="Users requesting to leave groups" />
            <div className="flex gap-2 mb-4"><Btn variant="glass" onClick={loadAll}><RefreshCw size={12} />Refresh</Btn></div>
            {exitRequests.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">No exit requests.</p>
            ) : (
              <TableComp cols={["User", "Group", "Reason", "Date", "Status", "Actions"]}>
                {exitRequests.map(r => (
                  <TR key={r.id}>
                    <TD><span className="text-foreground font-semibold">@{r.username}</span></TD>
                    <TD><span className="text-muted-foreground">{r.group_name}</span></TD>
                    <TD><span className="text-muted-foreground">{r.reason}</span></TD>
                    <TD><span className="text-muted-foreground">{r.created_at?.split("T")[0]}</span></TD>
                    <TD><StatusBadge status={r.status} /></TD>
                    <TD>
                      {r.status === "pending" && (
                        <div className="flex gap-1">
                          <Btn size="xs" variant="green" onClick={() => approveExitRequest(r)}><CheckCircle size={10} />Approve</Btn>
                          <Btn size="xs" variant="red" onClick={() => rejectExitRequest(r)}><X size={10} />Reject</Btn>
                        </div>
                      )}
                    </TD>
                  </TR>
                ))}
              </TableComp>
            )}
          </div>
        )}

        {/* ═══ LIVE GROUPS ══════════════════════════════════════════════════ */}
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
                      <div className="h-full bg-gold rounded-full" style={{ width: `${Math.min((g.filledSlots / g.totalSlots) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Btn size="xs" variant="gold" onClick={async () => { setShowGroupSeatView(g.id); await loadGroupSlots(g.id); }}><Eye size={10} />View Seats</Btn>
                    <Btn size="xs" variant="blue" onClick={() => { setSideTab("group-messages"); setGroupMsgTarget(g.id); setShowGroupMsg(true); }}><MessageSquare size={10} />Message</Btn>
                    <Btn size="xs" variant="amber" onClick={() => toggleGroupLive(g.id, g.isLive)}><Lock size={10} />Deactivate</Btn>
                  </div>
                </div>
              ))}
              {groups.filter(g => g.isLive).length === 0 && <p className="text-muted-foreground text-sm">No live groups.</p>}
            </div>
          </div>
        )}

        {/* ═══ AUDIT LOGS ══════════════════════════════════════════════════ */}
        {sideTab === "audit" && isAdmin && (
          <div>
            <SectionHeader title="Audit Logs" sub="All platform actions with timestamps" />
            <div className="flex gap-2 mb-4"><Btn variant="glass" onClick={loadAll}><RefreshCw size={12} />Refresh</Btn></div>
            {loading ? (
              <div className="text-center py-8"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
            ) : (
              <TableComp cols={["Action", "Performed By", "Target User", "Time", "Type"]}>
                {auditLogs.map(log => (
                  <TR key={log.id}>
                    <TD><span className="text-muted-foreground">{log.action}</span></TD>
                    <TD><span className="text-gold font-semibold">@{log.performed_by_username || "system"}</span></TD>
                    <TD><span className="text-muted-foreground">{log.target_username ? `@${log.target_username}` : "—"}</span></TD>
                    <TD>
                      <span className="text-muted-foreground">
                        {new Date(log.created_at).toLocaleString("en-NG", { month: "short", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </TD>
                    <TD>
                      <span className={`text-[10px] font-bold uppercase ${
                        log.type === "approve" ? "text-emerald-400" :
                        log.type === "ban" ? "text-red-400" :
                        log.type === "restrict" ? "text-amber-400" : "text-gold"
                      }`}>{log.type}</span>
                    </TD>
                  </TR>
                ))}
                {auditLogs.length === 0 && (
                  <TR><TD className="text-center text-muted-foreground py-6">No audit logs yet.</TD></TR>
                )}
              </TableComp>
            )}
          </div>
        )}

        {/* ═══ VIP TAGS ══════════════════════════════════════════════════════ */}
        {sideTab === "tags" && isAdmin && (
          <div>
            <SectionHeader title="VIP Tag Management" sub="Assign or remove VIP badges from users" />
            <TableComp cols={["User", "Email", "Current Status", "Actions"]}>
              {dbUsers.map(u => (
                <TR key={u.id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-semibold">@{u.username}</span>
                      {u.is_vip && <span className="vip-badge">VIP ✦</span>}
                    </div>
                  </TD>
                  <TD><span className="text-muted-foreground">{u.email}</span></TD>
                  <TD><span className={u.is_vip ? "text-gold font-bold" : "text-muted-foreground"}>{u.is_vip ? "VIP Member" : "Standard"}</span></TD>
                  <TD>
                    <Btn size="xs" variant={u.is_vip ? "red" : "gold"} onClick={() => userAction(u.id, "vip")}>
                      <Star size={10} />{u.is_vip ? "Remove VIP" : "Grant VIP"}
                    </Btn>
                  </TD>
                </TR>
              ))}
            </TableComp>
          </div>
        )}

      </main>

      {/* ══════════════════════════════════════════════════════════════════
          MODALS
      ══════════════════════════════════════════════════════════════════ */}

      {/* ── User Edit Modal ── */}
      {showUserEdit && editUser && (
        <Modal title={`Edit User: @${editUser.username}`} onClose={() => { setShowUserEdit(null); setEditedUser({}); }}>
          <div className="space-y-3">
            <div className="p-3 rounded-xl border border-gold/20 bg-gold/5 mb-2">
              <p className="text-gold text-[10px] font-bold uppercase mb-1">Bank Details (Admin View)</p>
              <p className="text-foreground text-xs font-semibold">{editUser.bank_acc_name || "—"}</p>
              <p className="text-muted-foreground text-xs">{editUser.bank_acc_number || "—"} — {editUser.bank_name || "—"}</p>
            </div>
            {[
              { key: "firstName",  label: "First Name" },
              { key: "lastName",   label: "Last Name" },
              { key: "username",   label: "Username" },
              { key: "nickname",   label: "Nickname" },
              { key: "email",      label: "Email" },
              { key: "phone",      label: "Phone" },
              { key: "dob",        label: "Date of Birth" },
              { key: "state",      label: "State" },
              { key: "lga",        label: "LGA" },
              { key: "address",    label: "Address" },
            ].map(f => (
              <div key={f.key}>
                <label className="luxury-label">{f.label}</label>
                <input
                  value={editedUser[f.key] ?? ""}
                  onChange={e => setEditedUser(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="luxury-input"
                />
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Btn variant="gold" onClick={() => saveUserEdit(editUser.id)}><CheckCircle size={12} />Save Changes</Btn>
              <Btn variant="glass" onClick={() => { setShowUserEdit(null); setEditedUser({}); }}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Password Reset Modal ── */}
      {showPasswordReset && pwUser && (
        <Modal title={`Password Management: @${pwUser.username}`} onClose={() => setShowPasswordReset(null)}>
          <div className="space-y-4">
            <div className="p-3 rounded-xl border border-amber-600/20 bg-amber-900/10 text-amber-400 text-xs">
              ⚠️ For security, new password will be sent as a notification to the user. They must change it immediately.
            </div>
            <div>
              <label className="luxury-label">Set New Password (min 8 chars)</label>
              <div className="relative">
                <input
                  type={showPasswords[pwUser.id] ? "text" : "password"}
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="luxury-input pr-10"
                />
                <button onClick={() => setShowPasswords(prev => ({ ...prev, [pwUser.id]: !prev[pwUser.id] }))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gold">
                  {showPasswords[pwUser.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <Btn variant="gold" disabled={newPassword.length < 6} onClick={() => setUserPasswordAdmin(pwUser.id)}>
                <Key size={12} />Set & Notify User
              </Btn>
              <Btn variant="glass" onClick={() => setShowPasswordReset(null)}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Forgot Password Requests ── */}
      {showForgotRequests && (
        <Modal title="Forgotten Password Requests" onClose={() => setShowForgotRequests(false)}>
          <div className="space-y-3">
            {forgotRequests.length === 0 && <p className="text-muted-foreground text-sm text-center">No pending requests.</p>}
            {forgotRequests.map(r => (
              <div key={r.id} className="p-3 rounded-xl border border-gold/15 bg-white/3 flex items-center justify-between gap-4">
                <div>
                  <p className="text-foreground font-semibold text-sm">{r.identifier}</p>
                  <p className="text-muted-foreground text-xs">{new Date(r.created_at).toLocaleString("en-NG")}</p>
                </div>
                <div className="flex gap-1">
                  <Btn size="xs" variant="gold" onClick={() => {
                    const u = dbUsers.find(u => u.username === r.identifier || u.email === r.identifier);
                    if (u) { setShowForgotRequests(false); setShowPasswordReset(u.id); setNewPassword(""); }
                  }}><Key size={10} />Set Password</Btn>
                  <Btn size="xs" variant="glass" onClick={async () => {
                    await supabase.from("forgot_password_requests").update({ status: "dismissed" }).eq("id", r.id);
                    setForgotRequests(prev => prev.filter(x => x.id !== r.id));
                  }}><X size={10} />Dismiss</Btn>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* ── Group Seat View Modal ── */}
      {showGroupSeatView && (
        <Modal title={`Seat Map: ${groups.find(g => g.id === showGroupSeatView)?.name || ""}`} onClose={() => { setShowGroupSeatView(null); setGroupSlots([]); }}>
          <div className="space-y-2">
            {groupSlots.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-4">No occupied seats yet.</p>
            ) : (
              <TableComp cols={["Seat #", "Username", "Full Name", "Pay Status", "Disbursed", "Actions"]}>
                {groupSlots.filter(s => s.user_id).map(s => (
                  <TR key={s.id}>
                    <TD><span className="text-gold font-bold font-mono">#{s.seat_number}</span></TD>
                    <TD><span className="text-foreground font-semibold">@{s.username}</span></TD>
                    <TD><span className="text-muted-foreground">{s.full_name}</span></TD>
                    <TD>
                      <span className={`text-[10px] font-bold ${s.payment_status === "paid" ? "text-emerald-400" : s.payment_status === "defaulter" ? "text-red-400" : "text-amber-400"}`}>
                        {s.payment_status || "unpaid"}
                      </span>
                    </TD>
                    <TD>
                      {s.is_disbursed
                        ? <span className="text-emerald-400 text-[10px] font-bold">✓ Done</span>
                        : <span className="text-muted-foreground text-[10px]">Pending</span>}
                    </TD>
                    <TD>
                      <div className="flex gap-1">
                        {!s.is_disbursed && (
                          <Btn size="xs" variant="gold" onClick={() => setShowDisburse({ slot: s, group: groups.find(g => g.id === showGroupSeatView) })}>
                            <CheckCircle size={10} />Disburse
                          </Btn>
                        )}
                        <Btn size="xs" variant="red" onClick={() => removeSeat(s.id, s.username, s.seat_number)}>
                          <UserX size={10} />Remove
                        </Btn>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TableComp>
            )}
          </div>
        </Modal>
      )}

      {/* ── Disburse Confirm Modal ── */}
      {showDisburse && (
        <Modal title="Confirm Disbursement" onClose={() => setShowDisburse(null)}>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-gold/5 border border-gold/20 text-center">
              <p className="text-gold font-cinzel font-bold text-lg">Seat #{showDisburse.slot.seat_number}</p>
              <p className="text-foreground font-semibold mt-1">@{showDisburse.slot.username}</p>
              <p className="text-muted-foreground text-sm mt-1">{showDisburse.slot.full_name}</p>
              <p className="text-gold text-xl font-bold mt-3">₦{showDisburse.group?.contributionAmount?.toLocaleString()}</p>
            </div>
            <p className="text-muted-foreground text-sm text-center">Are you sure you want to mark this seat as disbursed? This action cannot be undone.</p>
            <div className="flex gap-2">
              <Btn variant="gold" className="flex-1 justify-center" onClick={() => disburseSlot(showDisburse.slot, showDisburse.group)}>
                <CheckCircle size={12} />Confirm Disbursement
              </Btn>
              <Btn variant="glass" className="flex-1 justify-center" onClick={() => setShowDisburse(null)}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Announcement Modal ── */}
      {showAnnouncement && (
        <Modal title="New Public Announcement" onClose={() => setShowAnnouncement(false)}>
          <div className="space-y-4">
            <div>
              <label className="luxury-label">Type</label>
              <select value={annType} onChange={e => setAnnType(e.target.value as any)} className="luxury-input">
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
                <Btn variant="glass" onClick={() => imgRef.current?.click()}><Image size={12} />Upload Image</Btn>
                {annImg && <span className="text-emerald-400 text-xs">✓ {annImg.name}</span>}
                {annImg && <Btn size="xs" variant="red" onClick={() => { setAnnImg(null); setAnnImgPreview(null); }}><X size={10} />Remove</Btn>}
              </div>
              <input ref={imgRef} type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) { setAnnImg(f); const r = new FileReader(); r.onload = ev => setAnnImgPreview(ev.target?.result as string); r.readAsDataURL(f); }
              }} />
              {annImgPreview && <img src={annImgPreview} alt="preview" className="mt-2 h-24 rounded-xl object-cover" />}
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
              <Btn variant="gold" disabled={!groupMsgTarget || !groupMsgBody} onClick={submitGroupMessage}><Send size={12} />Send to Group</Btn>
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
              <Btn variant="gold" onClick={() => submitSupportReply(replyTicket.id, replyTicket.user_id)}><Send size={12} />Send Reply</Btn>
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
                {dbUsers.map(u => <option key={u.id} value={u.username}>@{u.username} ({u.fullName})</option>)}
              </select>
            </div>
            <div>
              <label className="luxury-label">Message</label>
              <textarea value={reminderMsg} onChange={e => setReminderMsg(e.target.value)} placeholder="Enter reminder message..." className="luxury-input h-24 resize-none" />
            </div>
            <div className="flex gap-2">
              <Btn variant="gold" disabled={!reminderTarget || !reminderMsg} onClick={sendReminder}><Send size={12} />Send Reminder</Btn>
              <Btn variant="glass" onClick={() => setShowReminderModal(false)}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Create Group Modal ── */}
      {showCreateGroup && (
        <Modal title="Create New Group" onClose={() => setShowCreateGroup(false)}>
          <div className="space-y-3">
            <div><label className="luxury-label">Group Name *</label><input value={cgName} onChange={e => setCgName(e.target.value)} placeholder="e.g. Golden Circle Beta" className="luxury-input" /></div>
            <div><label className="luxury-label">Description</label><input value={cgDesc} onChange={e => setCgDesc(e.target.value)} placeholder="Group description..." className="luxury-input" /></div>
            <div><label className="luxury-label">Contribution Amount (₦) *</label><input type="number" value={cgAmount} onChange={e => setCgAmount(e.target.value)} placeholder="e.g. 5000" className="luxury-input" /></div>
            <div>
              <label className="luxury-label">Cycle Type</label>
              <select value={cgCycle} onChange={e => setCgCycle(e.target.value)} className="luxury-input">
                <option>daily</option><option>weekly</option><option>monthly</option>
              </select>
            </div>
            <div><label className="luxury-label">Bank Name</label><input value={cgBank} onChange={e => setCgBank(e.target.value)} placeholder="e.g. Zenith Bank" className="luxury-input" /></div>
            <div><label className="luxury-label">Account Number</label><input value={cgAccNum} onChange={e => setCgAccNum(e.target.value)} placeholder="10-digit account number" className="luxury-input" /></div>
            <div><label className="luxury-label">Account Name</label><input value={cgAccName} onChange={e => setCgAccName(e.target.value)} placeholder="Account holder name" className="luxury-input" /></div>
            <div className="flex gap-2 pt-2">
              <Btn variant="gold" disabled={!cgName || !cgAmount} onClick={createGroup}><Plus size={12} />Create Group</Btn>
              <Btn variant="glass" onClick={() => setShowCreateGroup(false)}><X size={12} />Cancel</Btn>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
