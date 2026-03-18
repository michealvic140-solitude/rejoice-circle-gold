import { useParams, Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useState, useEffect, useRef } from "react";
import { Send, Lock, Unlock, Users, Upload, CheckCircle, X } from "lucide-react";
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
];

const initSlots = () =>
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    status: (
      i === 4 ? "mine" :
      i < 67 ? "taken" :
      i === 70 || i === 71 ? "locked" :
      "available"
    ) as "available" | "taken" | "locked" | "mine",
  }));

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { groups, isLoggedIn, currentUser } = useApp();

  const [slots, setSlots] = useState(initSlots);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [paymentTime, setPaymentTime] = useState("20:00");
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });
  const [payProof, setPayProof] = useState(false);
  const [payDone, setPayDone] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const group = groups.find(g => g.id === id);

  // Countdown timer
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(23, 59, 59, 999);
      const diff = midnight.getTime() - now.getTime();
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
    if (status === "available") return "slot-available cursor-pointer hover:shadow-[0_0_12px_rgba(234,179,8,0.4)] hover:border-gold transition-all";
    if (status === "taken") return "slot-taken";
    if (status === "locked") return "slot-locked";
    if (status === "mine") return "slot-mine";
    return "";
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <ParticleBackground />
      <div className="max-w-7xl mx-auto relative">

        {/* Group Header */}
        <div className="glass-card-static rounded-2xl p-6 md:p-8 mb-6 animate-fade-up">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                {group.isLive && <span className="live-badge">● LIVE</span>}
                <span className="text-muted-foreground text-xs px-2 py-1 rounded-full bg-muted/40 capitalize">{group.cycleType}</span>
              </div>
              <h1 className="gold-gradient-text text-3xl md:text-4xl font-cinzel font-bold">{group.name}</h1>
              <p className="text-muted-foreground mt-2 text-sm max-w-xl">{group.description}</p>
            </div>
            {group.isLive && (
              <div className="glass-card p-4 rounded-xl text-center min-w-[160px]">
                <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Time Remaining</p>
                <div className="flex items-center gap-1 justify-center animate-countdown">
                  {[pad(countdown.h), pad(countdown.m), pad(countdown.s)].map((v, i) => (
                    <div key={i} className="flex items-center gap-1">
                      <span className="gold-gradient-text text-2xl font-cinzel font-bold tabular-nums">{v}</span>
                      {i < 2 && <span className="text-gold/60 text-xl font-bold">:</span>}
                    </div>
                  ))}
                </div>
                <p className="text-muted-foreground/60 text-[10px] mt-1">HH : MM : SS</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gold/10">
            {[
              { label: "Contribution", value: `₦${group.contributionAmount.toLocaleString()}` },
              { label: "Cycle", value: group.cycleType },
              { label: "Slots Filled", value: `${group.filledSlots} / ${group.totalSlots}` },
              { label: "Remaining", value: `${group.totalSlots - group.filledSlots} slots` },
            ].map(item => (
              <div key={item.label}>
                <p className="text-muted-foreground text-xs uppercase tracking-widest">{item.label}</p>
                <p className="text-foreground font-bold capitalize mt-0.5">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Slot Grid + Payment */}
          <div className="xl:col-span-2 space-y-6">
            <div className="glass-card-static rounded-2xl p-6 animate-fade-up delay-100">
              <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">Slot Selection Grid</h2>
              <div className="flex flex-wrap gap-3 mb-4 text-xs">
                {[
                  ["bg-emerald-900/40 border border-emerald-600/40", "Available"],
                  ["bg-red-900/30 border border-red-600/30", "Taken"],
                  ["bg-amber-900/20 border border-amber-500/30", "Locked"],
                  ["bg-gold/20 border border-gold", "Your Slot"],
                ].map(([cls, label]) => (
                  <span key={label} className="flex items-center gap-1.5">
                    <span className={`w-4 h-4 rounded ${cls}`} />
                    <span className="text-muted-foreground">{label}</span>
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-10 gap-1.5">
                {slots.map(slot => (
                  <button
                    key={slot.id}
                    onClick={() => handleSlotClick(slot.id, slot.status)}
                    className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${slotClass(slot.status)}`}
                    title={`Slot ${slot.id} - ${slot.status}`}
                  >
                    {slot.id}
                  </button>
                ))}
              </div>
            </div>

            {isLoggedIn && (
              <div className="glass-card-static rounded-2xl p-6 animate-fade-up delay-200">
                <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">Make Payment</h2>
                {!payDone ? (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-gold/5 border border-gold/15">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest mb-3">Admin Bank Details</p>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between"><span className="text-muted-foreground">Bank Name:</span><span className="text-foreground font-semibold">{group.bankName}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Account No:</span><span className="text-foreground font-mono font-bold">{group.accountNumber}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Account Name:</span><span className="text-foreground font-semibold">{group.accountName}</span></div>
                        <div className="flex justify-between"><span className="text-muted-foreground">Amount:</span><span className="text-gold font-bold">₦{group.contributionAmount.toLocaleString()}</span></div>
                      </div>
                    </div>
                    {!payProof ? (
                      <button onClick={() => setPayProof(true)} className="btn-glass w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2">
                        <Upload size={16} /> Upload Payment Screenshot
                      </button>
                    ) : (
                      <div className="p-4 rounded-xl bg-emerald-900/20 border border-emerald-600/30 text-sm text-center">
                        <CheckCircle size={20} className="text-emerald-400 mx-auto mb-2" />
                        <p className="text-emerald-400 font-semibold">Screenshot uploaded!</p>
                      </div>
                    )}
                    <button
                      onClick={() => { if (payProof) setPayDone(true); }}
                      className={`btn-gold w-full py-3 rounded-xl font-bold text-sm ${!payProof ? "opacity-50 cursor-not-allowed" : ""}`}
                      disabled={!payProof}
                    >
                      I Have Made Payment
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <CheckCircle size={40} className="text-gold mx-auto mb-3 animate-glow-pulse" />
                    <h3 className="gold-text font-cinzel font-bold text-lg">Payment Submitted!</h3>
                    <p className="text-muted-foreground text-sm mt-2">Admin will verify your transaction. You'll be notified once approved.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-200">
              <div className="px-5 py-4 border-b border-gold/10 flex items-center gap-2">
                <Users size={15} className="text-gold" />
                <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-wide">Participants</h2>
              </div>
              <div className="p-3 max-h-60 overflow-y-auto scrollbar-gold space-y-1">
                {slots.filter(s => s.status === "taken" || s.status === "mine").slice(0, 12).map((s, i) => (
                  <div key={s.id} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${s.status === "mine" ? "bg-gold/10 border border-gold/20" : "hover:bg-muted/30"} transition-colors`}>
                    <div className="w-7 h-7 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
                      <span className="text-obsidian text-[10px] font-black">{(i + 1).toString().padStart(2, "0")}</span>
                    </div>
                    <div>
                      <p className="text-foreground text-xs font-semibold">
                        {s.status === "mine" ? currentUser?.username : `member_${s.id}`}
                        {s.status === "mine" && <span className="text-gold ml-1">★</span>}
                      </p>
                      <p className="text-muted-foreground text-[10px]">Role #{s.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-300">
              <div className="px-5 py-4 border-b border-gold/10 flex items-center justify-between">
                <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-wide">Group Chat</h2>
                {group.chatLocked ? <Lock size={14} className="text-red-400" /> : <Unlock size={14} className="text-emerald-400" />}
              </div>
              {group.chatLocked ? (
                <div className="p-6 text-center text-muted-foreground text-sm">
                  <Lock size={20} className="mx-auto mb-2 text-red-400/60" />
                  Chat is locked by admin
                </div>
              ) : (
                <>
                  <div ref={chatRef} className="p-3 h-48 overflow-y-auto scrollbar-gold space-y-2">
                    {messages.map(m => (
                      <div key={m.id} className={`flex gap-2 ${m.username === currentUser?.username ? "flex-row-reverse" : ""}`}>
                        <div className="w-6 h-6 rounded-full bg-gold/20 flex items-center justify-center shrink-0 text-[10px] font-bold text-gold">
                          {m.username[0].toUpperCase()}
                        </div>
                        <div className={`max-w-[75%] flex flex-col ${m.username === currentUser?.username ? "items-end" : "items-start"}`}>
                          <span className="text-muted-foreground text-[10px] mb-0.5">{m.username} · {m.time}</span>
                          <div className={`px-3 py-2 rounded-xl text-xs ${m.username === currentUser?.username ? "bg-gold/15 border border-gold/20 text-foreground" : "bg-muted/40 text-foreground/80"}`}>
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
                      <button onClick={sendMsg} className="btn-gold p-2 rounded-lg">
                        <Send size={14} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-card-static rounded-2xl p-6 max-w-md w-full border border-gold/30 animate-scale-in">
            <div className="flex items-start justify-between mb-4">
              <h3 className="gold-gradient-text font-cinzel font-bold text-lg">Terms & Conditions</h3>
              <button onClick={() => setShowTerms(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-4">{group.termsText}</p>
            <div className="mb-4">
              <label className="luxury-label">Select Daily Payment Deadline</label>
              <input type="time" value={paymentTime} onChange={e => setPaymentTime(e.target.value)} className="luxury-input" />
              <p className="text-muted-foreground text-xs mt-1">⚠️ You cannot change this time once confirmed. Only admin can edit it.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowTerms(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={confirmSlot} className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm">I Agree & Confirm Slot</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
