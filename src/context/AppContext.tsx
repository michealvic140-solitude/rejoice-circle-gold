import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

export type UserRole = "admin" | "moderator" | "user";

export interface Profile {
  id: string;
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  nickname?: string;
  email?: string;
  phone?: string;
  dob?: string;
  age?: number;
  stateOfOrigin?: string;
  lga?: string;
  currentState?: string;
  currentAddress?: string;
  homeAddress?: string;
  bvnNin?: string;
  profilePicture?: string;
  isVip: boolean;
  isRestricted: boolean;
  isBanned: boolean;
  isFrozen: boolean;
  isDefaulter: boolean;
  totalPaid: number;
  trustScore: number;
  bankAccName?: string;
  bankAccNumber?: string;
  bankName?: string;
  role: UserRole;
  unreadNotifications: number;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  contributionAmount: number;
  cycleType: "daily" | "weekly" | "monthly";
  totalSlots: number;
  filledSlots: number;
  isLive: boolean;
  isLocked: boolean;
  chatLocked: boolean;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  termsText: string;
  createdAt: string;
}

export interface SlotRow {
  id: string;
  groupId: string;
  seatNumber: number;
  userId?: string;
  username?: string;
  fullName?: string;
  status: "available" | "locked" | "taken";
  lockedUntil?: string;
  paymentTime?: string;
  paymentStatus: "unpaid" | "pending" | "paid" | "defaulter";
  isDisbursed: boolean;
  disbursedAt?: string;
}

export interface Transaction {
  id: string;
  code: string;
  groupId?: string;
  groupName?: string;
  userId: string;
  username?: string;
  seatNumber?: number;
  amount: number;
  status: "pending" | "approved" | "declined";
  screenshotUrl?: string;
  adminNote?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  type: "announcement" | "promotion" | "server-update" | "group-message";
  imageUrl?: string;
  targetGroupId?: string;
  adminName?: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  username?: string;
  subject: string;
  message: string;
  attachmentUrl?: string;
  status: "open" | "replied" | "closed";
  adminReply?: string;
  repliedAt?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  action: string;
  performedByUsername?: string;
  targetUsername?: string;
  type: string;
  createdAt: string;
}

export interface ContactInfo {
  whatsapp: string;
  facebook: string;
  email: string;
  callNumber: string;
  smsNumber: string;
}

export interface PlatformSettings {
  maintenanceMode: boolean;
  maintenanceMessage: string;
}

interface AppContextType {
  // Auth
  session: Session | null;
  currentUser: Profile | null;
  isLoggedIn: boolean;
  authLoading: boolean;
  setCurrentUser: (u: Profile | null) => void;
  refreshProfile: () => Promise<void>;

  // Data
  groups: Group[];
  refreshGroups: () => Promise<void>;
  notifications: Notification[];
  unreadCount: number;
  markNotificationsRead: () => void;
  refreshNotifications: () => Promise<void>;
  announcements: Announcement[];
  refreshAnnouncements: () => Promise<void>;
  contactInfo: ContactInfo;
  refreshContactInfo: () => Promise<void>;
  platformSettings: PlatformSettings;
  refreshPlatformSettings: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_CONTACT: ContactInfo = {
  whatsapp: "+234 800 000 0000",
  facebook: "https://facebook.com/rejoiceajo",
  email: "support@rejoiceajo.com",
  callNumber: "+234 800 000 0001",
  smsNumber: "+234 800 000 0002",
};

const DEFAULT_SETTINGS: PlatformSettings = {
  maintenanceMode: false,
  maintenanceMessage: "The platform is currently under maintenance. Please check back later.",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [groups, setGroups] = useState<Group[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);

  // ── Load profile from DB ──────────────────────────────────────────────────
  const loadProfile = async (userId: string): Promise<Profile | null> => {
    try {
      const [{ data: profile }, { data: roleRow }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        supabase.from("user_roles").select("role").eq("user_id", userId).single(),
      ]);
      if (!profile) return null;
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("read", false);
      return {
        id: profile.id,
        username: profile.username,
        firstName: profile.first_name,
        middleName: profile.middle_name,
        lastName: profile.last_name,
        nickname: profile.nickname,
        email: profile.email,
        phone: profile.phone,
        dob: profile.dob,
        age: profile.age,
        stateOfOrigin: profile.state_of_origin,
        lga: profile.lga,
        currentState: profile.current_state,
        currentAddress: profile.current_address,
        homeAddress: profile.home_address,
        bvnNin: profile.bvn_nin,
        profilePicture: profile.profile_picture,
        isVip: profile.is_vip,
        isRestricted: profile.is_restricted,
        isBanned: profile.is_banned,
        isFrozen: profile.is_frozen,
        isDefaulter: profile.is_defaulter,
        totalPaid: profile.total_paid,
        trustScore: profile.trust_score,
        bankAccName: profile.bank_acc_name,
        bankAccNumber: profile.bank_acc_number,
        bankName: profile.bank_name,
        role: (roleRow?.role as UserRole) || "user",
        unreadNotifications: count || 0,
      };
    } catch {
      return null;
    }
  };

  const refreshProfile = async () => {
    if (session?.user) {
      const p = await loadProfile(session.user.id);
      setCurrentUser(p);
    }
  };

  // ── Auth listener ─────────────────────────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, sess) => {
      setSession(sess);
      if (sess?.user) {
        const p = await loadProfile(sess.user.id);
        setCurrentUser(p);
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session: sess } }) => {
      setSession(sess);
      if (sess?.user) {
        const p = await loadProfile(sess.user.id);
        setCurrentUser(p);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // ── Load public data ──────────────────────────────────────────────────────
  const refreshGroups = async () => {
    const { data } = await supabase.from("groups").select("*").order("created_at", { ascending: false });
    if (data) {
      setGroups(data.map(g => ({
        id: g.id, name: g.name, description: g.description ?? undefined,
        contributionAmount: g.contribution_amount, cycleType: (g.cycle_type as Group["cycleType"]),
        totalSlots: g.total_slots ?? 0, filledSlots: g.filled_slots ?? 0,
        isLive: g.is_live ?? false, isLocked: g.is_locked ?? false, chatLocked: g.chat_locked ?? false,
        bankName: g.bank_name ?? undefined, accountNumber: g.account_number ?? undefined, accountName: g.account_name ?? undefined,
        termsText: g.terms_text ?? "", createdAt: g.created_at ?? "",
      })));
    }
  };

  const refreshNotifications = async () => {
    if (!session?.user) return;
    const { data } = await supabase
      .from("notifications").select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) {
      setNotifications(data.map(n => ({
        id: n.id, userId: n.user_id, message: n.message,
        type: n.type, read: n.read, createdAt: n.created_at,
      })));
    }
  };

  const markNotificationsRead = async () => {
    if (!session?.user) return;
    await supabase.from("notifications")
      .update({ read: true })
      .eq("user_id", session.user.id)
      .eq("read", false);
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setCurrentUser(prev => prev ? { ...prev, unreadNotifications: 0 } : null);
  };

  const refreshAnnouncements = async () => {
    const { data } = await supabase
      .from("announcements").select("*")
      .is("target_group_id", null)
      .order("created_at", { ascending: false });
    if (data) {
      setAnnouncements(data.map(a => ({
        id: a.id, title: a.title, body: a.body, type: (a.type as Announcement["type"]) ?? "announcement",
        imageUrl: a.image_url ?? undefined, targetGroupId: a.target_group_id ?? undefined,
        adminName: a.admin_name ?? undefined, createdAt: a.created_at ?? "",
      })));
    }
  };

  const refreshContactInfo = async () => {
    const { data } = await supabase.from("contact_info").select("*").eq("id", 1).single();
    if (data) {
      setContactInfo({
        whatsapp: data.whatsapp || "", facebook: data.facebook || "",
        email: data.email || "", callNumber: data.call_number || "",
        smsNumber: data.sms_number || "",
      });
    }
  };

  const refreshPlatformSettings = async () => {
    const { data } = await supabase.from("platform_settings").select("*").eq("id", 1).single();
    if (data) {
      setPlatformSettings({
        maintenanceMode: data.maintenance_mode,
        maintenanceMessage: data.maintenance_message,
      });
    }
  };

  useEffect(() => {
    refreshGroups();
    refreshAnnouncements();
    refreshContactInfo();
    refreshPlatformSettings();
  }, []);

  useEffect(() => {
    if (session?.user) refreshNotifications();
  }, [session]);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppContext.Provider value={{
      session, currentUser, isLoggedIn: !!currentUser, authLoading, setCurrentUser,
      refreshProfile, groups, refreshGroups, notifications, unreadCount,
      markNotificationsRead, refreshNotifications, announcements, refreshAnnouncements,
      contactInfo, refreshContactInfo, platformSettings, refreshPlatformSettings,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
