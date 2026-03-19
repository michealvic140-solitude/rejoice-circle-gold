import { useParams, Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useState, useEffect, useRef } from "react";
import {
  Send, Lock, Unlock, Users, Upload, CheckCircle, X, LogOut,
  ChevronDown, Bell, Trash2
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

interface ChatMessage {
  id: string;
  username: string;
  text: string;
  time: string;
}

const MOCK_MESSAGES: ChatMessage[] = [
  { id: "m1", username: "ChiefSaver", text: "Good morning everyone! Remember today's payment deadline is 8PM.", time: "07:15 AM" },
  { id: "m2", username: "GoldQueen", text: "Paid mine already! ✅ Screenshot uploaded.", time: "08:30 AM" },
  { id: "m3", username: "goldmember", text: "On my way to make payment now 💪", time: "09:00 AM" },
  { id: "m4", username: "FaithSaves", text: "Has everyone made payment today? Let's keep our trust scores high!", time: "09:30 AM" },
];

// Each participant can hold multiple seats — name repeated for each
const MOCK_PARTICIPANTS_SEATS: Array<{ seatNo: number; username: string; fullName: string; trustScore: string; isVip?: boolean }> = [
  { seatNo: 1,  username: "ChiefSaver",   fullName: "Emeka Okonkwo",      trustScore: "98%" , isVip: true  },
  { seatNo: 2,  username: "GoldQueen",    fullName: "Aisha Mohammed",     trustScore: "95%" , isVip: true  },
  { seatNo: 3,  username: "StrongBase",   fullName: "Tunde Bakare",       trustScore: "89%"               },
  { seatNo: 4,  username: "FaithSaves",   fullName: "Ngozi Eze",          trustScore: "92%"               },
  { seatNo: 5,  username: "goldmember",   fullName: "Rejoice Adeyemi",    trustScore: "95%" , isVip: true  },
  { seatNo: 6,  username: "RoyalSaver",   fullName: "Bola Adewale",       trustScore: "78%"               },
  { seatNo: 7,  username: "TrustPillar",  fullName: "Chidi Nwosu",        trustScore: "85%"               },
  { seatNo: 8,  username: "DiamondHand",  fullName: "Fatima Garba",       trustScore: "91%" , isVip: true  },
  { seatNo: 9,  username: "VaultKeeper",  fullName: "Samuel Ojo",         trustScore: "74%"               },
  { seatNo: 10, username: "GoldQueen",    fullName: "Aisha Mohammed",     trustScore: "95%" , isVip: true  }, // multi-seat
  { seatNo: 11, username: "ChiefSaver",   fullName: "Emeka Okonkwo",      trustScore: "98%" , isVip: true  }, // multi-seat
  { seatNo: 12, username: "SilverStar",   fullName: "Kemi Adeyemi",       trustScore: "82%"               },
  { seatNo: 13, username: "IronWill",     fullName: "David Obi",          trustScore: "77%"               },
  { seatNo: 14, username: "NobleCircle",  fullName: "Grace Ihejirika",    trustScore: "88%"               },
  { seatNo: 15, username: "goldmember",   fullName: "Rejoice Adeyemi",    trustScore: "95%" , isVip: true  }, // multi-seat
];

const initSlots = () =>
  Array.from({ length: 100 }, (_, i) => {
    const seatNo = i + 1;
    const participant = MOCK_PARTICIPANTS_SEATS.find(p => p.seatNo === seatNo);
    const isMine = seatNo === 5 || seatNo === 15;
    return {
      id: seatNo,
      status: (
        isMine ? "mine" :
        participant ? "taken" :
        seatNo === 20 || seatNo === 30 || seatNo === 40 ? "locked" :
        "available"
      ) as "available" | "taken" | "locked" | "mine",
      occupant: participant?.username,
    };
  });

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { groups, isLoggedIn, currentUser } = useApp();

  const [slots, setSlots] = useState(initSlots);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [paymentTime, setPaymentTime] = useState("08:00 PM");
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [countdown, setCountdown] = useState({ h: 24, m: 0, s: 0 });
  const [payProof, setPayProof] = useState(false);
  const [payDone, setPayDone] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitRequested, setExitRequested] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const group = groups.find(g => g.id === id);

  // Countdown timer — resets at midnight GMT+1
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nowGMT1 = new Date(now.getTime() + (1 * 60 * 60 * 1000));
      const midnightGMT1 = new Date(nowGMT1);
      midnightGMT1.setUTCHours(23, 0, 0, 0);
      if (nowGMT1 > midnightGMT1) midnightGMT1.setUTCDate(midnightGMT1.getUTCDate() + 1);
      const diff = midnightGMT1.getTime() - nowGMT1.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown({ h, m, s });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  if (!group) return <Navigate to="/groups" replace />;

  const handleSlotClick = (slotId: number, status: string) => {
    if (!isLoggedIn) return;
    if (status === "taken" || status === "locked" || status === "mine") return;
    setSelectedSlot(slotId);
    setShowTerms(true);
  };

  const confirmSlot = () => {
    if (!selectedSlot) return;
    setSlots(prev => prev.map(s => s.id === selectedSlot ? { ...s, status: "mine" as const, occupant: currentUser?.username } : s));
    setShowTerms(false);
  };

  const sendMsg = () => {
    if (!chatMsg.trim() || !currentUser) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      username: currentUser.username,
      text: chatMsg,
      time: new Date().toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(prev => [...prev, newMsg]);
    setChatMsg("");
    setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 50);
  };

  const pad = (n: number) => n.toString().padStart(2, "0");

  const slotColorClass = (status: string) => {
    if (status === "available") return "bg-emerald-900/40 border border-emerald-500/50 text-emerald-400 cursor-pointer hover:bg-emerald-800/60 hover:border-emerald-400 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all";
    if (status === "taken")     return "bg-red-900/30 border border-red-600/40 text-red-400 cursor-not-allowed";
    if (status === "locked")    return "bg-amber-900/25 border border-amber-500/40 text-amber-500 cursor-not-allowed";
    if (status === "mine")      return "bg-gold/20 border border-gold text-gold shadow-[0_0_10px_rgba(234,179,8,0.4)] cursor-default";
    return "";
  };

  // Members sorted by seat number
  const sortedMembers = [...MOCK_PARTICIPANTS_SEATS].sort((a, b) => a.seatNo - b.seatNo);

  return (
    <div className="min-h-screen pt-16 pb-16 relative overflow-hidden">
      <ParticleBackground />

      {/* ============ BOLD DIGITAL TIMER — TOP ============ */}
      <div
        className="relative z-10 w-full border-b border-gold/10 py-5 px-4"
        style={{ background: "rgba(5,5,5,0.85)", backdropFilter: "blur(24px)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">

          {/* HUGE TIMER */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-baseline gap-0.5"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 900,
                letterSpacing: "0.05em",
              }}
            >
              {/* HH */}
              <span
                className="tabular-nums leading-none animate-countdown"
                style={{
                  fontSize: "clamp(3rem, 8vw, 5rem)",
                  background: "linear-gradient(135deg, hsl(45,93%,47%), hsl(45,100%,70%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                  filter: "drop-shadow(0 0 18px rgba(234,179,8,0.5))",
                }}
              >
                {pad(countdown.h)}
              </span>
              <span className="text-gold/50 font-black mx-0.5" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>:</span>
              {/* MM */}
              <span
                className="tabular-nums leading-none animate-countdown"
                style={{
                  fontSize: "clamp(3rem, 8vw, 5rem)",
                  background: "linear-gradient(135deg, hsl(45,93%,47%), hsl(45,100%,70%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 18px rgba(234,179,8,0.5))",
                }}
              >
                {pad(countdown.m)}
              </span>
              <span className="text-gold/50 font-black mx-0.5" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>:</span>
              {/* SS */}
              <span
                className="tabular-nums leading-none animate-countdown"
                style={{
                  fontSize: "clamp(3rem, 8vw, 5rem)",
                  background: "linear-gradient(135deg, hsl(45,93%,47%), hsl(45,100%,70%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  filter: "drop-shadow(0 0 18px rgba(234,179,8,0.5))",
                }}
              >
                {pad(countdown.s)}
              </span>
            </div>
            <div className="flex flex-col gap-1 ml-1">
              <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">GMT+1</span>
              <span className="text-muted-foreground/50 text-[9px]">Daily Reset</span>
              {group.isLive && <span className="live-badge text-[9px] px-2 py-0.5">● LIVE</span>}
            </div>
          </div>

          {/* Right info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest">Group</p>
              <p className="gold-gradient-text font-cinzel font-bold text-sm">{group.name}</p>
              <p className="text-muted-foreground text-xs">₦{group.contributionAmount.toLocaleString()} / {group.cycleType}</p>
            </div>
            <button className="p-2 rounded-lg border border-gold/15 bg-gold/5 hover:bg-gold/10 transition-all">
              <Bell size={15} className="text-gold" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian font-black text-sm">
              {currentUser?.firstName?.[0] || "R"}
            </div>
          </div>
        </div>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="max-w-7xl mx-auto px-4 mt-4 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* ======= LEFT: SLOT GRID ======= */}
          <div className="xl:col-span-2 space-y-4">

            {/* Group title bar */}
            <div className="glass-card-static rounded-xl px-5 py-3 flex items-center justify-between animate-fade-up">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  {group.isLive && <span className="live-badge">● LIVE</span>}
                  <span className="text-muted-foreground text-xs capitalize">{group.cycleType} contributions</span>
                </div>
                <h1 className="gold-gradient-text text-xl md:text-2xl font-cinzel font-bold">{group.name}</h1>
                <p className="text-muted-foreground text-xs mt-1 max-w-md">{group.description}</p>
              </div>
            </div>

            {/* SLOT GRID */}
            <div className="glass-card-static rounded-2xl p-4 animate-fade-up delay-100">
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-4 text-[10px]">
                {[
                  { cls: "bg-emerald-900/40 border border-emerald-500/50", label: "Available" },
                  { cls: "bg-red-900/30 border border-red-600/40", label: "Taken" },
                  { cls: "bg-amber-900/25 border border-amber-500/40", label: "Admin Locked" },
                  { cls: "bg-gold/20 border border-gold", label: "Your Seat" },
                ].map(({ cls, label }) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded ${cls}`} />
                    <span className="text-muted-foreground">{label}</span>
                  </span>
                ))}
              </div>

              {/* Column headers (1-10) */}
              <div className="flex gap-0.5 mb-0.5 ml-6">
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="flex-1 text-center text-[8px] text-muted-foreground/40">{i + 1}</div>
                ))}
              </div>

              {/* Row numbers + Grid */}
              <div className="flex gap-0.5">
                {/* Row numbers */}
                <div className="flex flex-col gap-0.5">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="w-5 h-8 flex items-center justify-end pr-1">
                      <span className="text-muted-foreground/40 text-[8px]">{(i + 1) * 10 - 9}–{(i + 1) * 10}</span>
                    </div>
                  ))}
                </div>

                {/* 10x10 Grid */}
                <div className="grid grid-cols-10 gap-0.5 flex-1">
                  {slots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot.id, slot.status)}
                      className={`h-8 rounded flex flex-col items-center justify-center transition-all relative group ${slotColorClass(slot.status)}`}
                      title={`Seat ${slot.id}${slot.occupant ? ` — @${slot.occupant}` : ""} · ${slot.status}`}
                    >
                      {/* Seat number label */}
                      <span className="text-[8px] font-bold leading-none">{slot.id}</span>
                      {slot.status === "mine" && (
                        <span className="text-[6px] leading-none opacity-80 mt-0.5">YOU</span>
                      )}
                      {/* Tooltip on hover */}
                      {slot.occupant && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-lg bg-black/90 border border-gold/20 text-[9px] text-foreground whitespace-nowrap z-20 hidden group-hover:block pointer-events-none">
                          @{slot.occupant}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot stats */}
              <div className="mt-3 pt-3 border-t border-gold/10 flex flex-wrap gap-4 text-xs">
                <span className="text-muted-foreground">Total: <span className="text-foreground font-bold">100</span></span>
                <span className="text-muted-foreground">Taken: <span className="text-red-400 font-bold">{slots.filter(s => s.status === "taken").length}</span></span>
                <span className="text-muted-foreground">Available: <span className="text-emerald-400 font-bold">{slots.filter(s => s.status === "available").length}</span></span>
                <span className="text-muted-foreground">My Seats: <span className="text-gold font-bold">{slots.filter(s => s.status === "mine").length}</span></span>
              </div>
            </div>

            {/* EXIT GROUP + PAYMENT PROOF ROW */}
            <div className="flex gap-3 animate-fade-up delay-200">
              <button
                onClick={() => setShowExitModal(true)}
                className="shrink-0 px-4 py-3 rounded-xl text-sm font-bold border border-red-600/40 bg-red-900/20 text-red-400 hover:bg-red-900/35 transition-all flex items-center gap-2"
              >
                <LogOut size={14} /> Exit Group
              </button>
              <label className="flex-1 glass-card-static rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-gold/40 transition-all group">
                <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                  {payProof ? "✅ Payment screenshot uploaded" : "Upload payment proof screenshot"}
                </span>
                <div className="p-2 rounded-lg bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-all">
                  <Upload size={13} className="text-gold" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={() => setPayProof(true)} />
              </label>
            </div>

            {/* Make Payment */}
            {isLoggedIn && !payDone && (
              <div className="glass-card-static rounded-2xl p-5 animate-fade-up delay-200">
                <button
                  onClick={() => setShowPayment(!showPayment)}
                  className="w-full flex items-center justify-between"
                >
                  <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest">Make Payment</h2>
                  <ChevronDown size={16} className={`text-gold transition-transform ${showPayment ? "rotate-180" : ""}`} />
                </button>
                {showPayment && (
                  <div className="mt-4 space-y-4">
                    <div className="p-4 rounded-xl bg-gold/5 border border-gold/15">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Admin Bank Details</p>
                      <div className="space-y-2 text-sm">
                        {[
                          ["Bank Name", group.bankName],
                          ["Account No", group.accountNumber],
                          ["Account Name", group.accountName],
                          ["Amount", `₦${group.contributionAmount.toLocaleString()}`],
                        ].map(([label, val]) => (
                          <div key={label} className="flex justify-between">
                            <span className="text-muted-foreground">{label}:</span>
                            <span className={label === "Amount" ? "text-gold font-bold" : "text-foreground font-semibold"}>{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-900/15 border border-amber-500/25 text-xs text-amber-400/80">
                      ⚠️ Transfer externally then upload your screenshot above before clicking below.
                    </div>
                    <button
                      onClick={() => { if (payProof) setPayDone(true); }}
                      className={`btn-gold w-full py-3 rounded-xl font-bold text-sm ${!payProof ? "opacity-40 cursor-not-allowed" : ""}`}
                      disabled={!payProof}
                    >
                      I Have Made Payment
                    </button>
                  </div>
                )}
              </div>
            )}
            {payDone && (
              <div className="glass-card-static rounded-2xl p-5 text-center animate-scale-in">
                <CheckCircle size={36} className="text-gold mx-auto mb-2 animate-glow-pulse" />
                <h3 className="gold-text font-cinzel font-bold">Payment Submitted!</h3>
                <p className="text-muted-foreground text-sm mt-1">Admin will verify your transaction. You'll be notified once approved.</p>
              </div>
            )}
          </div>

          {/* ======= RIGHT SIDEBAR ======= */}
          <div className="space-y-4">

            {/* MEMBERS LIST — sorted by seat number */}
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-100">
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="w-full px-4 py-3 border-b border-gold/10 flex items-center justify-between hover:bg-gold/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-gold" />
                  <span className="gold-text font-cinzel font-bold text-xs uppercase tracking-wide">Members by Seat</span>
                  <span className="text-muted-foreground/60 text-[10px]">({sortedMembers.length})</span>
                </div>
                <ChevronDown size={14} className={`text-gold/60 transition-transform ${showParticipants ? "rotate-180" : ""}`} />
              </button>

              {showParticipants && (
                <>
                  {/* Column headers */}
                  <div className="px-3 py-2 grid grid-cols-12 gap-1 border-b border-gold/5 bg-gold/3">
                    <span className="col-span-2 text-[9px] text-muted-foreground/60 uppercase tracking-wider">Seat</span>
                    <span className="col-span-5 text-[9px] text-muted-foreground/60 uppercase tracking-wider">Member</span>
                    <span className="col-span-3 text-[9px] text-muted-foreground/60 uppercase tracking-wider">Username</span>
                    <span className="col-span-2 text-[9px] text-muted-foreground/60 uppercase tracking-wider">Trust</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto scrollbar-gold">
                    {sortedMembers.map((p, i) => (
                      <div
                        key={`${p.seatNo}-${i}`}
                        className={`px-3 py-2.5 grid grid-cols-12 gap-1 items-center border-b border-gold/5 transition-colors hover:bg-gold/5 ${
                          p.username === currentUser?.username ? "bg-gold/8 border-l-2 border-l-gold" : ""
                        }`}
                      >
                        {/* Seat # */}
                        <div className="col-span-2">
                          <span
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black"
                            style={{
                              background: p.username === currentUser?.username
                                ? "rgba(234,179,8,0.25)"
                                : "rgba(255,255,255,0.06)",
                              border: p.username === currentUser?.username
                                ? "1px solid rgba(234,179,8,0.5)"
                                : "1px solid rgba(255,255,255,0.1)",
                              color: p.username === currentUser?.username ? "hsl(45,93%,47%)" : "hsl(0,0%,70%)",
                            }}
                          >
                            {p.seatNo}
                          </span>
                        </div>
                        {/* Full name */}
                        <div className="col-span-5 flex items-center gap-1.5 min-w-0">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 bg-gold/15 text-gold">
                            {p.fullName[0]}
                          </div>
                          <div className="min-w-0">
                            <p className="text-foreground text-[10px] font-semibold truncate">{p.fullName}</p>
                            {p.isVip && <span className="vip-badge text-[8px] px-1 py-0">VIP</span>}
                          </div>
                        </div>
                        {/* Username */}
                        <span className="col-span-3 text-muted-foreground text-[9px] truncate">@{p.username}</span>
                        {/* Trust */}
                        <span className="col-span-2 text-emerald-400 text-[10px] font-bold">{p.trustScore}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* GROUP CHAT */}
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-200">
              <button
                onClick={() => setShowChat(!showChat)}
                className="w-full px-4 py-3 border-b border-gold/10 flex items-center justify-between hover:bg-gold/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="gold-text font-cinzel font-bold text-xs uppercase tracking-wide">Group Chat</span>
                  {group.chatLocked
                    ? <Lock size={10} className="text-red-400" />
                    : <Unlock size={10} className="text-emerald-400" />}
                </div>
                <ChevronDown size={14} className={`text-gold/60 transition-transform ${showChat ? "rotate-180" : ""}`} />
              </button>

              {showChat && (
                group.chatLocked ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    <Lock size={20} className="mx-auto mb-2 text-red-400/60" />
                    Chat is locked by admin
                  </div>
                ) : (
                  <>
                    <div ref={chatRef} className="p-3 h-52 overflow-y-auto scrollbar-gold space-y-2">
                      {messages.map(m => (
                        <div key={m.id} className={`flex gap-2 ${m.username === currentUser?.username ? "flex-row-reverse" : ""}`}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold bg-gold/20 text-gold">
                            {m.username[0].toUpperCase()}
                          </div>
                          <div className={`max-w-[78%] flex flex-col ${m.username === currentUser?.username ? "items-end" : "items-start"}`}>
                            <span className="text-muted-foreground text-[9px] mb-0.5">@{m.username} · {m.time}</span>
                            <div className={`px-3 py-2 rounded-xl text-[11px] leading-relaxed ${
                              m.username === currentUser?.username
                                ? "bg-gold/15 border border-gold/20 text-foreground"
                                : "bg-muted/30 text-foreground/80"
                            }`}>
                              {m.text}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {isLoggedIn && (
                      <div className="p-3 border-t border-gold/10 flex gap-2">
                        <input
                          type="text"
                          value={chatMsg}
                          onChange={e => setChatMsg(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && sendMsg()}
                          placeholder="Type a message..."
                          className="luxury-input text-xs py-2 flex-1"
                        />
                        <button onClick={sendMsg} className="btn-gold p-2 rounded-lg shrink-0">
                          <Send size={13} />
                        </button>
                      </div>
                    )}
                  </>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ TERMS MODAL ============ */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-static rounded-2xl p-6 max-w-md w-full border border-gold/30 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <h3 className="gold-gradient-text font-cinzel font-bold text-lg">Terms & Conditions</h3>
              <button onClick={() => setShowTerms(false)} className="text-muted-foreground hover:text-foreground p-1"><X size={18} /></button>
            </div>
            {selectedSlot && (
              <div className="mb-3 p-3 rounded-xl bg-gold/10 border border-gold/20 text-sm flex items-center justify-between">
                <span className="text-muted-foreground">You are selecting</span>
                <span className="gold-text font-cinzel font-bold text-xl">Seat #{selectedSlot}</span>
              </div>
            )}
            <div className="bg-black/30 rounded-xl p-4 mb-4 max-h-36 overflow-y-auto scrollbar-gold">
              <p className="text-muted-foreground text-sm leading-relaxed">{group.termsText}</p>
            </div>
            <div className="mb-4">
              <label className="luxury-label">Select Daily Payment Deadline</label>
              <input
                type="time"
                value={paymentTime}
                onChange={e => setPaymentTime(e.target.value)}
                className="luxury-input"
              />
              <p className="text-amber-400/70 text-xs mt-2">⚠️ You cannot change this time. Only admin can edit it.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowTerms(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={confirmSlot} className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm">I Agree & Confirm Seat #{selectedSlot}</button>
            </div>
          </div>
        </div>
      )}

      {/* ============ EXIT GROUP MODAL ============ */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-static rounded-2xl p-6 max-w-sm w-full border border-red-500/30 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-red-400 font-cinzel font-bold text-lg">Exit Group Request</h3>
              <button onClick={() => setShowExitModal(false)} className="text-muted-foreground hover:text-foreground p-1"><X size={18} /></button>
            </div>
            {!exitRequested ? (
              <>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  You cannot leave instantly. Your request will be reviewed by admin who may approve or reject it.
                </p>
                <div className="mb-4">
                  <label className="luxury-label">Reason for leaving</label>
                  <textarea rows={3} className="luxury-input resize-none" placeholder="Enter your reason..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowExitModal(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
                  <button
                    onClick={() => setExitRequested(true)}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-900/40 border border-red-600/50 text-red-400 hover:bg-red-900/60 transition-all"
                  >
                    Submit Request
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle size={36} className="text-gold mx-auto mb-3" />
                <h4 className="gold-text font-cinzel font-bold">Request Submitted</h4>
                <p className="text-muted-foreground text-sm mt-2">Admin will review your exit request and notify you of the decision.</p>
                <button onClick={() => setShowExitModal(false)} className="btn-glass mt-4 px-6 py-2 rounded-xl text-sm font-semibold">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
