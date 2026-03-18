import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "admin" | "moderator" | "user";

export interface User {
  id: string;
  username: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  isVip: boolean;
  isRestricted: boolean;
  isBanned: boolean;
  isFrozen: boolean;
  profilePicture?: string;
  totalPaid: number;
  activeSlots: number;
  unreadNotifications: number;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  contributionAmount: number;
  cycleType: "daily" | "weekly" | "monthly";
  totalSlots: number;
  filledSlots: number;
  isLive: boolean;
  isLocked: boolean;
  chatLocked: boolean;
  payoutAccount?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  termsText: string;
  createdAt: string;
}

export interface Slot {
  id: number;
  groupId: string;
  userId?: string;
  username?: string;
  status: "available" | "locked" | "taken" | "mine";
  lockedUntil?: Date;
  paymentTime?: string;
}

export interface Transaction {
  id: string;
  code: string;
  groupName: string;
  userId: string;
  amount: number;
  status: "pending" | "approved" | "declined";
  date: string;
  screenshotUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoggedIn: boolean;
  notifications: Notification[];
  markNotificationsRead: () => void;
  groups: Group[];
  transactions: Transaction[];
  leaderboard: User[];
}

const AppContext = createContext<AppContextType | null>(null);

const mockUser: User = {
  id: "u1",
  username: "goldmember",
  firstName: "Rejoice",
  middleName: "Grace",
  lastName: "Adeyemi",
  email: "rejoice@example.com",
  phone: "+234 801 234 5678",
  role: "user",
  isVip: true,
  isRestricted: false,
  isBanned: false,
  isFrozen: false,
  totalPaid: 450000,
  activeSlots: 3,
  unreadNotifications: 2,
};

const mockGroups: Group[] = [
  {
    id: "g1",
    name: "Golden Circle Alpha",
    description: "Our premier daily contribution group for serious savers. Members contribute daily and receive payouts in slot order.",
    contributionAmount: 5000,
    cycleType: "daily",
    totalSlots: 100,
    filledSlots: 67,
    isLive: true,
    isLocked: false,
    chatLocked: false,
    bankName: "First Bank Nigeria",
    accountNumber: "3012345678",
    accountName: "Rejoice Ajo Platform",
    termsText: "By joining this group you agree to make daily contributions on time. Failure to pay will result in defaulter status. All members must contribute for the full cycle duration.",
    createdAt: "2025-01-15",
  },
  {
    id: "g2",
    name: "Silver Vault Weekly",
    description: "Weekly contributions for those who prefer a relaxed saving pace. Ideal for mid-level savers.",
    contributionAmount: 25000,
    cycleType: "weekly",
    totalSlots: 100,
    filledSlots: 42,
    isLive: true,
    isLocked: false,
    chatLocked: false,
    bankName: "GTBank",
    accountNumber: "0123456789",
    accountName: "Rejoice Ajo Platform",
    termsText: "Weekly contributions must be made before 11:59 PM every Sunday. Late payment = defaulter status.",
    createdAt: "2025-02-01",
  },
  {
    id: "g3",
    name: "Platinum Monthly Reserve",
    description: "Monthly contributions for high-value savers. Receive large payout when your slot arrives.",
    contributionAmount: 100000,
    cycleType: "monthly",
    totalSlots: 100,
    filledSlots: 18,
    isLive: false,
    isLocked: false,
    chatLocked: false,
    bankName: "Zenith Bank",
    accountNumber: "2012345678",
    accountName: "Rejoice Ajo Platform",
    termsText: "Monthly contributions are due on the 1st of each month. Members must contribute for the full 12-month cycle.",
    createdAt: "2025-03-01",
  },
  {
    id: "g4",
    name: "Diamond Elite Circle",
    description: "Exclusive group for top contributors. Limited slots available for our most trusted members.",
    contributionAmount: 50000,
    cycleType: "weekly",
    totalSlots: 50,
    filledSlots: 48,
    isLive: true,
    isLocked: false,
    chatLocked: true,
    bankName: "Access Bank",
    accountNumber: "0098765432",
    accountName: "Rejoice Ajo Platform",
    termsText: "Diamond Elite members hold a higher standard. Contributions must be verified with a payment screenshot uploaded by 9 PM every Sunday.",
    createdAt: "2025-01-05",
  },
];

const mockTransactions: Transaction[] = [
  { id: "t1", code: "RAJ-0000012", groupName: "Golden Circle Alpha", userId: "u1", amount: 5000, status: "approved", date: "2025-03-17" },
  { id: "t2", code: "RAJ-0000011", groupName: "Golden Circle Alpha", userId: "u1", amount: 5000, status: "approved", date: "2025-03-16" },
  { id: "t3", code: "RAJ-0000010", groupName: "Silver Vault Weekly", userId: "u1", amount: 25000, status: "pending", date: "2025-03-15" },
  { id: "t4", code: "RAJ-0000009", groupName: "Golden Circle Alpha", userId: "u1", amount: 5000, status: "declined", date: "2025-03-14" },
  { id: "t5", code: "RAJ-0000008", groupName: "Platinum Monthly Reserve", userId: "u1", amount: 100000, status: "approved", date: "2025-03-01" },
];

const mockNotifications: Notification[] = [
  { id: "n1", userId: "u1", message: "Dear Rejoice Adeyemi, your payment for Golden Circle Alpha has been approved.", read: false, createdAt: "2025-03-17T08:00:00" },
  { id: "n2", userId: "u1", message: "Dear Rejoice Adeyemi, Silver Vault Weekly has gone LIVE! Start your contributions today.", read: false, createdAt: "2025-03-16T09:00:00" },
  { id: "n3", userId: "u1", message: "Dear Rejoice Adeyemi, your upcoming payout for slot #5 is scheduled for this week.", read: true, createdAt: "2025-03-15T10:00:00" },
];

const mockLeaderboard: User[] = [
  { ...mockUser, id: "l1", username: "ChiefSaver", firstName: "Emeka", lastName: "Okonkwo", totalPaid: 1200000, isVip: true, unreadNotifications: 0 },
  { ...mockUser, id: "l2", username: "GoldQueen", firstName: "Aisha", lastName: "Mohammed", totalPaid: 980000, isVip: true, unreadNotifications: 0 },
  { ...mockUser, id: "l3", username: "StrongBase", firstName: "Tunde", lastName: "Bakare", totalPaid: 750000, isVip: false, unreadNotifications: 0 },
  { ...mockUser, id: "l4", username: "FaithSaves", firstName: "Ngozi", lastName: "Eze", totalPaid: 620000, isVip: true, unreadNotifications: 0 },
  { ...mockUser, id: "l5", username: "goldmember", firstName: "Rejoice", lastName: "Adeyemi", totalPaid: 450000, isVip: true, unreadNotifications: 0 },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  const markNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    if (currentUser) {
      setCurrentUser({ ...currentUser, unreadNotifications: 0 });
    }
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser,
      isLoggedIn: !!currentUser,
      notifications,
      markNotificationsRead,
      groups: mockGroups,
      transactions: mockTransactions,
      leaderboard: mockLeaderboard,
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

export { mockUser, mockGroups, mockTransactions, mockLeaderboard };
