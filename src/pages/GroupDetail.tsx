import { useParams, Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useState, useEffect, useRef } from "react";
import { Send, Lock, Unlock, Users, Upload, CheckCircle, X, LogOut, ChevronDown, ChevronRight, Bell } from "lucide-react";
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
  { id: "m4", username: "FaithSaves", text: "Group paged (Niv update she yo green Seat /Manage belngs tate can't grout.", time: "09:30 AM" },
];

// Mock participants with seat data
const MOCK_PARTICIPANTS = [
  { id: "p1", username: "Ninkname", avatar: "N", seatNo: 2333, ranking: 4406, trust: "+25+", chosen: 2333 },
  { id: "p2", username: "Hejjobor", avatar: "H", seatNo: 2433, ranking: 1431, trust: "+370", chosen: 2433 },
  { id: "p3", username: "Anlubur", avatar: "A", seatNo: 2334, ranking: 449, trust: "+32+", chosen: 2334 },
  { id: "p4", username: "Hejoulor", avatar: "H", seatNo: 2203, ranking: 300, trust: "+39+", chosen: 2203 },
  { id: "p5", username: "RTA", avatar: "R", seatNo: 2110, ranking: 250, trust: "+32+", chosen: 2110 },
  { id: "p6", username: "Arcup", avatar: "A", seatNo: 2114, ranking: 960, trust: "+229", chosen: 2114 },
  { id: "p7", username: "RTA2", avatar: "R", seatNo: 2110, ranking: 110, trust: "+15+", chosen: 2110 },
];

const initSlots = () =>
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    status: (
      i === 0 ? "mine" :
      i < 10 ? "taken" :
      i < 40 ? "taken" :
      i === 40 || i === 41 || i === 50 || i === 59 || i === 69 || i === 79 ? "taken" :
      i >= 90 ? "taken" :
      i === 15 || i === 25 || i === 35 ? "taken" :
      "available"
    ) as "available" | "taken" | "locked" | "mine",
  }));

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
      // Convert to GMT+1
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
    setSlots(prev => prev.map(s => s.id === selectedSlot ? { ...s, status: "mine" as const } : s));
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

  const slotClass = (status: string) => {
    if (status === "available") return "slot-available cursor-pointer hover:shadow-[0_0_12px_rgba(234,179,8,0.5)] hover:border-gold transition-all";
    if (status === "taken") return "slot-taken";
    if (status === "locked") return "slot-locked";
    if (status === "mine") return "slot-mine";
    return "";
  };

  const SlotIcon = ({ status }: { status: string }) => {
    if (status === "mine") return <CheckCircle size={12} />;
    return <Lock size={11} />;
  };

  return (
    <div className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      <ParticleBackground />

      {/* ============ BOLD TIMER HEADER ============ */}
      <div className="relative z-10 w-full border-b border-gold/10 bg-black/60 backdrop-blur-xl py-4 px-4 mb-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Big Timer */}
          <div className="flex items-center gap-4">
            <div className="flex items-baseline gap-1">
              <span className="font-cinzel font-black text-5xl md:text-6xl tabular-nums gold-gradient-text animate-countdown leading-none">
                {pad(countdown.h)}
              </span>
              <span className="text-gold/60 text-3xl font-black">HH</span>
              <span className="text-gold font-black text-4xl mx-1">:</span>
              <span className="font-cinzel font-black text-5xl md:text-6xl tabular-nums gold-gradient-text animate-countdown leading-none">
                {pad(countdown.m)}
              </span>
              <span className="text-gold/60 text-3xl font-black">mm</span>
              <span className="text-gold font-black text-4xl mx-1">:</span>
              <span className="font-cinzel font-black text-5xl md:text-6xl tabular-nums gold-gradient-text animate-countdown leading-none">
                {pad(countdown.s)}
              </span>
              <span className="text-gold/60 text-3xl font-black">SS</span>
            </div>
            <div className="flex flex-col gap-1 ml-2">
              <span className="text-muted-foreground text-xs font-semibold tracking-widest">GMT+1</span>
              {group.isLive && <span className="live-badge text-[10px]">1A</span>}
            </div>
          </div>

          {/* Header Right */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-muted-foreground text-xs uppercase tracking-widest">Group Page</p>
              <p className="gold-gradient-text font-cinzel font-bold text-sm">{group.name}</p>
            </div>
            <button className="btn-glass p-2 rounded-lg"><Bell size={15} /></button>
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian font-black text-sm">
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
                  <span className="text-muted-foreground text-xs capitalize">{group.cycleType}</span>
                </div>
                <h1 className="gold-gradient-text text-xl md:text-2xl font-cinzel font-bold">{group.name}</h1>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-muted-foreground text-xs">Contribution</p>
                <p className="gold-text font-cinzel font-bold text-lg">₦{group.contributionAmount.toLocaleString()}</p>
              </div>
            </div>

            {/* SLOT GRID */}
            <div className="glass-card-static rounded-2xl p-4 animate-fade-up delay-100">
              {/* Legend */}
              <div className="flex flex-wrap gap-3 mb-3 text-[10px]">
                {[
                  ["bg-emerald-900/50 border border-emerald-500/50", "Available"],
                  ["bg-red-900/40 border border-red-600/40", "Taken"],
                  ["bg-amber-900/30 border border-amber-500/40", "Admin Locked"],
                  ["bg-gold/25 border border-gold", "Your Slot"],
                ].map(([cls, label]) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className={`w-3.5 h-3.5 rounded ${cls} flex items-center justify-center`}>
                      <Lock size={7} className="opacity-60" />
                    </span>
                    <span className="text-muted-foreground">{label}</span>
                  </span>
                ))}
              </div>

              {/* Row numbers + Grid */}
              <div className="flex gap-1">
                {/* Row numbers */}
                <div className="flex flex-col gap-1 pt-0.5">
                  {Array.from({ length: 10 }, (_, i) => (
                    <div key={i} className="h-[calc((100%-9*4px)/10)] min-h-[28px] flex items-center justify-center">
                      <span className="text-muted-foreground/40 text-[9px] w-4 text-right">{i + 1}</span>
                    </div>
                  ))}
                </div>

                {/* 10x10 Grid */}
                <div className="grid grid-cols-10 gap-1 flex-1">
                  {slots.map(slot => (
                    <button
                      key={slot.id}
                      onClick={() => handleSlotClick(slot.id, slot.status)}
                      className={`aspect-square rounded-lg flex items-center justify-center transition-all min-h-[28px] ${slotClass(slot.status)}`}
                      title={`Slot ${slot.id} — ${slot.status}`}
                    >
                      <SlotIcon status={slot.status} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Slot stats */}
              <div className="mt-3 pt-3 border-t border-gold/10 flex flex-wrap gap-4 text-xs">
                <span className="text-muted-foreground">Total: <span className="text-foreground font-bold">100</span></span>
                <span className="text-muted-foreground">Taken: <span className="text-red-400 font-bold">{slots.filter(s => s.status === "taken").length}</span></span>
                <span className="text-muted-foreground">Available: <span className="text-emerald-400 font-bold">{slots.filter(s => s.status === "available").length}</span></span>
                <span className="text-muted-foreground">Mine: <span className="text-gold font-bold">{slots.filter(s => s.status === "mine").length}</span></span>
              </div>
            </div>

            {/* EXIT GROUP + PAYMENT PROOF ROW */}
            <div className="flex gap-3 animate-fade-up delay-200">
              <button
                onClick={() => setShowExitModal(true)}
                className="flex-shrink-0 px-5 py-3 rounded-xl text-sm font-bold bg-red-900/30 border border-red-600/40 text-red-400 hover:bg-red-900/50 hover:border-red-500/60 transition-all flex items-center gap-2"
              >
                <LogOut size={15} /> Exit Group Request
              </button>
              <label className="flex-1 glass-card-static rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-gold/40 transition-all group">
                <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                  {payProof ? "✅ Screenshot uploaded" : "Upload payment proof (file, adenp)"}
                </span>
                <div className="p-2 rounded-lg bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-all">
                  <Upload size={14} className="text-gold" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={() => setPayProof(true)} />
              </label>
            </div>

            {/* Make Payment */}
            {isLoggedIn && !payDone && (
              <div className="glass-card-static rounded-2xl p-5 animate-fade-up delay-200">
                <button
                  onClick={() => setShowPayment(!showPayment)}
                  className="w-full flex items-center justify-between mb-0"
                >
                  <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest">Make Payment</h2>
                  <ChevronDown size={16} className={`text-gold transition-transform ${showPayment ? "rotate-180" : ""}`} />
                </button>
                {showPayment && (
                  <div className="mt-4 space-y-4">
                    <div className="p-4 rounded-xl bg-gold/5 border border-gold/15">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Admin Bank Details</p>
                      <div className="space-y-1.5 text-sm">
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
                    <button
                      onClick={() => { if (payProof) setPayDone(true); }}
                      className={`btn-gold w-full py-3 rounded-xl font-bold text-sm ${!payProof ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={!payProof}
                    >
                      I Have Made Payment
                    </button>
                    {!payProof && <p className="text-muted-foreground text-xs text-center">Upload payment screenshot first</p>}
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

            {/* PARTICIPANTS LIST */}
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-100">
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="w-full px-4 py-3 border-b border-gold/10 flex items-center justify-between hover:bg-gold/5 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-gold/10 flex items-center justify-center">
                    <Users size={11} className="text-gold" />
                  </span>
                  <span className="gold-text font-cinzel font-bold text-xs uppercase tracking-wide">Group</span>
                </div>
                <ChevronDown size={14} className={`text-gold/60 transition-transform ${showParticipants ? "rotate-180" : ""}`} />
              </button>

              {showParticipants && (
                <>
                  {/* Column headers */}
                  <div className="px-3 py-2 grid grid-cols-4 gap-1 border-b border-gold/5">
                    {["Seder Memr", "Chosen", "Ranking", "Trust"].map(h => (
                      <span key={h} className="text-[9px] text-muted-foreground/60 uppercase tracking-wider">{h}</span>
                    ))}
                  </div>
                  <div className="max-h-72 overflow-y-auto scrollbar-gold">
                    {MOCK_PARTICIPANTS.map((p, i) => (
                      <div
                        key={p.id}
                        className={`px-3 py-2.5 grid grid-cols-4 gap-1 items-center border-b border-gold/5 transition-colors hover:bg-gold/5 ${i === 0 ? "bg-gold/8 border-l-2 border-l-gold" : ""}`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${
                            i === 0 ? "bg-emerald-500 text-white" :
                            i === 5 ? "bg-purple-600 text-white" :
                            "bg-gold/20 text-gold"
                          }`}>
                            {i === 0 ? "✓" : p.avatar}
                          </div>
                          <span className="text-foreground text-[10px] font-semibold truncate">{p.username}</span>
                        </div>
                        <span className="text-muted-foreground text-[10px]">{p.chosen}</span>
                        <span className="text-foreground text-[10px] font-semibold">{p.ranking}</span>
                        <span className="text-emerald-400 text-[10px] font-bold">{p.trust}</span>
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
                    ? <Lock size={11} className="text-red-400" />
                    : <Unlock size={11} className="text-emerald-400" />}
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
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                            m.username === "FaithSaves" ? "bg-orange-600 text-white" : "bg-gold/20 text-gold"
                          }`}>
                            {m.username[0].toUpperCase()}
                          </div>
                          <div className={`max-w-[78%] flex flex-col ${m.username === currentUser?.username ? "items-end" : "items-start"}`}>
                            <span className="text-muted-foreground text-[9px] mb-0.5">{m.username} · {m.time}</span>
                            <div className={`px-3 py-2 rounded-xl text-[11px] leading-relaxed ${
                              m.username === currentUser?.username
                                ? "bg-gold/15 border border-gold/20 text-foreground"
                                : m.username === "FaithSaves"
                                ? "bg-red-900/30 border border-red-600/20 text-red-300/90"
                                : "bg-muted/40 text-foreground/80"
                            }`}>
                              {m.username === "FaithSaves" && <span className="text-red-400 font-bold text-[10px]">Group Paged </span>}
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-static rounded-2xl p-6 max-w-md w-full border border-gold/30 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <h3 className="gold-gradient-text font-cinzel font-bold text-lg">Terms & Conditions</h3>
              <button onClick={() => setShowTerms(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X size={18} />
              </button>
            </div>
            <div className="bg-black/30 rounded-xl p-4 mb-4 max-h-40 overflow-y-auto scrollbar-gold">
              <p className="text-muted-foreground text-sm leading-relaxed">{group.termsText}</p>
            </div>
            <div className="mb-4">
              <label className="luxury-label">Select Daily Payment Deadline (12-hour)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="time"
                  value={paymentTime}
                  onChange={e => setPaymentTime(e.target.value)}
                  className="luxury-input flex-1"
                />
              </div>
              <p className="text-amber-400/80 text-xs mt-2 flex items-center gap-1">
                ⚠️ You cannot change this time after confirmation. Only admin can edit it.
              </p>
            </div>
            {selectedSlot && (
              <div className="mb-4 p-3 rounded-xl bg-gold/10 border border-gold/20 text-sm flex items-center justify-between">
                <span className="text-muted-foreground">Selected Seat</span>
                <span className="gold-text font-cinzel font-bold text-lg">#{selectedSlot}</span>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowTerms(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={confirmSlot} className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm">I Agree & Confirm Slot</button>
            </div>
          </div>
        </div>
      )}

      {/* ============ EXIT GROUP MODAL ============ */}
      {showExitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-static rounded-2xl p-6 max-w-sm w-full border border-red-500/30 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-red-400 font-cinzel font-bold text-lg">Exit Group Request</h3>
              <button onClick={() => setShowExitModal(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X size={18} />
              </button>
            </div>
            {!exitRequested ? (
              <>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  You cannot leave instantly. Your exit request will be reviewed by the admin.
                  Admin may approve or reject based on group rules.
                </p>
                <div className="mb-4">
                  <label className="luxury-label">Reason for leaving</label>
                  <textarea
                    rows={3}
                    className="luxury-input resize-none"
                    placeholder="Enter reason..."
                  />
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
                <p className="text-muted-foreground text-sm mt-2">Admin will review your exit request and notify you.</p>
                <button onClick={() => setShowExitModal(false)} className="btn-glass mt-4 px-6 py-2 rounded-xl text-sm font-semibold">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
