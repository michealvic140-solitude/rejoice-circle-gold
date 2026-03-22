import { useParams, Navigate } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { useState, useEffect, useRef } from "react";
import {
  Send, Lock, Unlock, Users, Upload, CheckCircle, X, LogOut,
  ChevronDown, Bell, Trash2
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";
import { supabase } from "@/lib/supabase";

interface DBSlot {
  id: string;
  seat_number: number;
  user_id: string | null;
  username: string | null;
  full_name: string | null;
  status: string;
  locked_until: string | null;
  payment_status: string | null;
  payment_time: string | null;
  is_disbursed: boolean | null;
}

interface ChatMessage {
  id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
  is_system: boolean | null;
}

export default function GroupDetail() {
  const { id } = useParams<{ id: string }>();
  const { groups, isLoggedIn, currentUser } = useApp();

  const [dbSlots, setDbSlots] = useState<DBSlot[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [paymentTime, setPaymentTime] = useState("08:00 PM");
  const [chatMsg, setChatMsg] = useState("");
  const [countdown, setCountdown] = useState({ h: 24, m: 0, s: 0 });
  const [payProof, setPayProof] = useState<File | null>(null);
  const [payDone, setPayDone] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  const [exitReason, setExitReason] = useState("");
  const [exitRequested, setExitRequested] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [joiningSlot, setJoiningSlot] = useState(false);
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const group = groups.find(g => g.id === id);

  // ── Load slots ──────────────────────────────────────────────────────────────
  const loadSlots = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("slots")
      .select("*")
      .eq("group_id", id)
      .order("seat_number");
    if (data) setDbSlots(data);
    setLoadingSlots(false);
  };

  // ── Load chat messages ───────────────────────────────────────────────────────
  const loadMessages = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("group_messages")
      .select("*")
      .eq("group_id", id)
      .order("created_at")
      .limit(100);
    if (data) setMessages(data);
  };

  useEffect(() => {
    if (id) {
      loadSlots();
      loadMessages();
    }
  }, [id]);

  // ── Real-time chat subscription ─────────────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    const channel = supabase
      .channel(`group-chat-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "group_messages", filter: `group_id=eq.${id}` },
        (payload) => {
          setMessages(prev => [...prev, payload.new as ChatMessage]);
          setTimeout(() => chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" }), 50);
        })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [id]);

  // ── Countdown — resets at Nigerian midnight GMT+1 ──────────────────────────
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const nowGMT1 = new Date(now.getTime() + (1 * 60 * 60 * 1000));
      const midnightGMT1 = new Date(nowGMT1);
      midnightGMT1.setUTCHours(23, 0, 0, 0);
      if (nowGMT1 > midnightGMT1) midnightGMT1.setUTCDate(midnightGMT1.getUTCDate() + 1);
      const diff = midnightGMT1.getTime() - nowGMT1.getTime();
      setCountdown({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  if (!group) return <Navigate to="/groups" replace />;

  const pad = (n: number) => n.toString().padStart(2, "0");

  // ── Build 100-seat grid from DB ──────────────────────────────────────────────
  const buildGrid = () => {
    return Array.from({ length: 100 }, (_, i) => {
      const seatNo = i + 1;
      const dbSlot = dbSlots.find(s => s.seat_number === seatNo);
      if (!dbSlot) {
        return { id: seatNo, status: "available" as const, occupant: null, dbId: null };
      }
      const isMine = dbSlot.user_id === currentUser?.id;
      const isLocked = dbSlot.status === "locked" || (dbSlot.locked_until && new Date(dbSlot.locked_until) > new Date());
      const isTaken = dbSlot.status === "taken" || (dbSlot.user_id && !isMine);
      const status = isMine ? "mine" : isLocked ? "locked" : isTaken ? "taken" : "available";
      return { id: seatNo, status, occupant: dbSlot.username, dbId: dbSlot.id };
    });
  };

  const grid = buildGrid();

  const slotColorClass = (status: string) => {
    if (status === "available") return "bg-emerald-900/40 border border-emerald-500/50 text-emerald-400 cursor-pointer hover:bg-emerald-800/60 hover:border-emerald-400 hover:shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all";
    if (status === "taken")     return "bg-red-900/30 border border-red-600/40 text-red-400 cursor-not-allowed";
    if (status === "locked")    return "bg-amber-900/25 border border-amber-500/40 text-amber-500 cursor-not-allowed";
    if (status === "mine")      return "bg-gold/20 border border-gold text-gold shadow-[0_0_10px_rgba(234,179,8,0.4)] cursor-default";
    return "";
  };

  const handleSlotClick = (seatNo: number, status: string) => {
    if (!isLoggedIn) return;
    if (status === "taken" || status === "locked" || status === "mine") return;
    setSelectedSlot(seatNo);
    setShowTerms(true);
  };

  // ── Confirm seat (real DB write) ─────────────────────────────────────────────
  const confirmSlot = async () => {
    if (!selectedSlot || !currentUser || !group) return;
    setJoiningSlot(true);
    try {
      // Check if slot already taken (race condition)
      const { data: existing } = await supabase
        .from("slots")
        .select("id,status,user_id")
        .eq("group_id", group.id)
        .eq("seat_number", selectedSlot)
        .single();

      if (existing && existing.status === "taken" && existing.user_id !== currentUser.id) {
        alert("This seat was just taken! Please choose another.");
        setShowTerms(false);
        setJoiningSlot(false);
        return;
      }

      const fullName = `${currentUser.firstName} ${currentUser.lastName}`.trim();

      if (existing) {
        await supabase.from("slots").update({
          user_id: currentUser.id,
          username: currentUser.username,
          full_name: fullName,
          status: "taken",
          payment_status: "unpaid",
          payment_time: paymentTime,
          locked_until: null,
        }).eq("id", existing.id);
      } else {
        await supabase.from("slots").insert({
          group_id: group.id,
          seat_number: selectedSlot,
          user_id: currentUser.id,
          username: currentUser.username,
          full_name: fullName,
          status: "taken",
          payment_status: "unpaid",
          payment_time: paymentTime,
        });
      }

      // Update filled_slots count
      const takenCount = dbSlots.filter(s => s.status === "taken" || s.user_id).length + 1;
      await supabase.from("groups").update({ filled_slots: takenCount }).eq("id", group.id);

      // Log audit
      await supabase.from("audit_logs").insert({
        action: `Joined group "${group.name}" - Seat #${selectedSlot}`,
        performed_by: currentUser.id,
        performed_by_username: currentUser.username,
        target_user_id: currentUser.id,
        target_username: currentUser.username,
        type: "join",
      });

      await loadSlots();
      setShowTerms(false);
    } catch (e) {
      console.error("Error joining slot:", e);
    }
    setJoiningSlot(false);
  };

  // ── Send chat message (real DB) ──────────────────────────────────────────────
  const sendMsg = async () => {
    if (!chatMsg.trim() || !currentUser || !group) return;
    await supabase.from("group_messages").insert({
      group_id: group.id,
      user_id: currentUser.id,
      username: currentUser.username,
      message: chatMsg.trim(),
      is_system: false,
    });
    setChatMsg("");
  };

  // ── Submit payment ───────────────────────────────────────────────────────────
  const submitPayment = async () => {
    if (!currentUser || !group) return;
    const mySlots = dbSlots.filter(s => s.user_id === currentUser.id);
    if (mySlots.length === 0) { setPaymentError("You haven't joined any seat in this group."); return; }
    setSubmittingPayment(true);
    setPaymentError("");
    try {
      let screenshotUrl: string | null = null;
      if (payProof) {
        const path = `${currentUser.id}/${group.id}/${Date.now()}-${payProof.name}`;
        const { error: upErr } = await supabase.storage.from("payment-proofs").upload(path, payProof);
        if (!upErr) {
          const { data } = supabase.storage.from("payment-proofs").getPublicUrl(path);
          screenshotUrl = data.publicUrl;
        }
      }
      // Create a transaction per seat
      for (const slot of mySlots) {
        const code = `RAJ-${Date.now().toString().slice(-7)}`;
        await supabase.from("transactions").insert({
          user_id: currentUser.id,
          username: currentUser.username,
          group_id: group.id,
          group_name: group.name,
          seat_number: slot.seat_number,
          amount: group.contributionAmount,
          code,
          screenshot_url: screenshotUrl,
          status: "pending",
        });
        // Mark slot payment as pending
        await supabase.from("slots").update({ payment_status: "pending" }).eq("id", slot.id);
      }
      await loadSlots();
      setPayDone(true);
    } catch (e) {
      setPaymentError("Failed to submit payment. Please try again.");
    }
    setSubmittingPayment(false);
  };

  // ── Exit group request ───────────────────────────────────────────────────────
  const submitExitRequest = async () => {
    if (!currentUser || !group) return;
    await supabase.from("exit_requests").insert({
      user_id: currentUser.id,
      username: currentUser.username,
      group_id: group.id,
      group_name: group.name,
      reason: exitReason,
      status: "pending",
    });
    setExitRequested(true);
  };

  // ── Members list: sorted by seat, name repeated per seat ──────────────────
  const membersInGroup = dbSlots
    .filter(s => s.user_id && (s.status === "taken" || s.status === "available"))
    .filter(s => s.username)
    .sort((a, b) => a.seat_number - b.seat_number);

  const mySeats = dbSlots.filter(s => s.user_id === currentUser?.id);

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
            <div className="flex items-baseline gap-0.5" style={{ fontFamily: "'Cinzel', serif", fontWeight: 900, letterSpacing: "0.05em" }}>
              {[pad(countdown.h), pad(countdown.m), pad(countdown.s)].map((val, i) => (
                <span key={i} style={{ display: "contents" }}>
                  <span className="tabular-nums leading-none" style={{
                    fontSize: "clamp(3rem, 8vw, 5rem)",
                    background: "linear-gradient(135deg, hsl(45,93%,47%), hsl(45,100%,70%))",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                    filter: "drop-shadow(0 0 18px rgba(234,179,8,0.5))",
                  }}>{val}</span>
                  {i < 2 && <span className="text-gold/50 font-black mx-0.5" style={{ fontSize: "clamp(2rem,5vw,3.5rem)" }}>:</span>}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-1 ml-1">
              <span className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">GMT+1</span>
              <span className="text-muted-foreground/50 text-[9px]">Daily Reset</span>
              {group.isLive
                ? <span className="live-badge text-[9px] px-2 py-0.5">● LIVE</span>
                : <span className="px-2 py-0.5 text-[9px] rounded-full border border-muted/20 text-muted-foreground">● WAITING</span>}
            </div>
          </div>

          {/* Right info */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-muted-foreground text-[10px] uppercase tracking-widest">Group</p>
              <p className="gold-gradient-text font-cinzel font-bold text-sm">{group.name}</p>
              <p className="text-muted-foreground text-xs">₦{group.contributionAmount.toLocaleString()} / {group.cycleType}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian font-black text-sm">
              {currentUser?.firstName?.[0] || "G"}
            </div>
          </div>
        </div>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div className="max-w-7xl mx-auto px-4 mt-4 relative z-10">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">

          {/* ======= LEFT: SLOT GRID ======= */}
          <div className="xl:col-span-2 space-y-4">
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

              {loadingSlots ? (
                <div className="flex items-center justify-center h-40">
                  <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                </div>
              ) : (
                <>
                  {/* Column headers */}
                  <div className="flex gap-0.5 mb-0.5 ml-6">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div key={i} className="flex-1 text-center text-[8px] text-muted-foreground/40">{i + 1}</div>
                    ))}
                  </div>
                  {/* Row numbers + Grid */}
                  <div className="flex gap-0.5">
                    <div className="flex flex-col gap-0.5">
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="w-5 h-8 flex items-center justify-end pr-1">
                          <span className="text-muted-foreground/40 text-[8px]">{(i + 1) * 10 - 9}–{(i + 1) * 10}</span>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-10 gap-0.5 flex-1">
                      {grid.map(slot => (
                        <button
                          key={slot.id}
                          onClick={() => handleSlotClick(slot.id, slot.status)}
                          className={`h-8 rounded flex flex-col items-center justify-center transition-all relative group ${slotColorClass(slot.status)}`}
                          title={`Seat ${slot.id}${slot.occupant ? ` — @${slot.occupant}` : ""} · ${slot.status}`}
                        >
                          <span className="text-[8px] font-bold leading-none">{slot.id}</span>
                          {slot.status === "mine" && <span className="text-[6px] leading-none opacity-80 mt-0.5">YOU</span>}
                          {slot.occupant && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 rounded-lg bg-black/90 border border-gold/20 text-[9px] text-foreground whitespace-nowrap z-20 hidden group-hover:block pointer-events-none">
                              @{slot.occupant}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Stats */}
              <div className="mt-3 pt-3 border-t border-gold/10 flex flex-wrap gap-4 text-xs">
                <span className="text-muted-foreground">Total: <span className="text-foreground font-bold">100</span></span>
                <span className="text-muted-foreground">Taken: <span className="text-red-400 font-bold">{grid.filter(s => s.status === "taken").length}</span></span>
                <span className="text-muted-foreground">Available: <span className="text-emerald-400 font-bold">{grid.filter(s => s.status === "available").length}</span></span>
                <span className="text-muted-foreground">My Seats: <span className="text-gold font-bold">{grid.filter(s => s.status === "mine").length}</span></span>
              </div>
            </div>

            {/* EXIT + PAYMENT ROW */}
            <div className="flex gap-3 animate-fade-up delay-200">
              {isLoggedIn && mySeats.length > 0 && (
                <button onClick={() => setShowExitModal(true)}
                  className="shrink-0 px-4 py-3 rounded-xl text-sm font-bold border border-red-600/40 bg-red-900/20 text-red-400 hover:bg-red-900/35 transition-all flex items-center gap-2">
                  <LogOut size={14} /> Exit Group
                </button>
              )}
              <label className="flex-1 glass-card-static rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-gold/40 transition-all group">
                <span className="text-muted-foreground text-sm group-hover:text-foreground transition-colors">
                  {payProof ? `✅ ${payProof.name}` : "Upload payment proof screenshot"}
                </span>
                <div className="p-2 rounded-lg bg-gold/10 border border-gold/20 group-hover:bg-gold/20 transition-all">
                  <Upload size={13} className="text-gold" />
                </div>
                <input type="file" accept="image/*" className="hidden" onChange={e => setPayProof(e.target.files?.[0] || null)} />
              </label>
            </div>

            {/* Make Payment */}
            {isLoggedIn && !payDone && mySeats.length > 0 && (
              <div className="glass-card-static rounded-2xl p-5 animate-fade-up delay-200">
                <button onClick={() => setShowPayment(!showPayment)} className="w-full flex items-center justify-between">
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
                          ["Amount per Seat", `₦${group.contributionAmount.toLocaleString()}`],
                          ["Total Seats", mySeats.length.toString()],
                          ["Total Due", `₦${(group.contributionAmount * mySeats.length).toLocaleString()}`],
                        ].map(([label, val]) => (
                          <div key={label} className="flex justify-between">
                            <span className="text-muted-foreground">{label}:</span>
                            <span className={label === "Total Due" ? "text-gold font-bold" : "text-foreground font-semibold"}>{val || "—"}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">Your Seats</p>
                      <div className="flex flex-wrap gap-2">
                        {mySeats.map(s => (
                          <span key={s.id} className={`px-2 py-0.5 rounded-full text-xs font-bold border ${
                            s.payment_status === "paid" ? "text-emerald-400 border-emerald-600/30 bg-emerald-900/20" :
                            s.payment_status === "pending" ? "text-amber-400 border-amber-600/30 bg-amber-900/20" :
                            "text-gold border-gold/30 bg-gold/10"
                          }`}>
                            Seat #{s.seat_number} — {s.payment_status || "unpaid"}
                          </span>
                        ))}
                      </div>
                    </div>
                    {paymentError && <p className="text-red-400 text-xs">{paymentError}</p>}
                    <div className="p-3 rounded-xl bg-amber-900/15 border border-amber-500/25 text-xs text-amber-400/80">
                      ⚠️ Transfer the exact amount externally, upload your screenshot above, then click below.
                    </div>
                    <button onClick={submitPayment} disabled={submittingPayment || !payProof}
                      className={`btn-gold w-full py-3 rounded-xl font-bold text-sm ${(!payProof || submittingPayment) ? "opacity-40 cursor-not-allowed" : ""}`}>
                      {submittingPayment ? "Submitting..." : "I Have Made Payment"}
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
                <button onClick={() => setPayDone(false)} className="btn-glass mt-3 px-4 py-2 rounded-xl text-xs font-semibold">Submit Another</button>
              </div>
            )}
          </div>

          {/* ======= RIGHT SIDEBAR ======= */}
          <div className="space-y-4">

            {/* MEMBERS LIST */}
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-100">
              <button onClick={() => setShowParticipants(!showParticipants)}
                className="w-full px-4 py-3 border-b border-gold/10 flex items-center justify-between hover:bg-gold/5 transition-colors">
                <div className="flex items-center gap-2">
                  <Users size={13} className="text-gold" />
                  <span className="gold-text font-cinzel font-bold text-xs uppercase tracking-wide">Members by Seat</span>
                  <span className="text-muted-foreground/60 text-[10px]">({membersInGroup.length})</span>
                </div>
                <ChevronDown size={14} className={`text-gold/60 transition-transform ${showParticipants ? "rotate-180" : ""}`} />
              </button>

              {showParticipants && (
                <>
                  <div className="px-3 py-2 grid grid-cols-12 gap-1 border-b border-gold/5 bg-gold/3">
                    <span className="col-span-2 text-[9px] text-muted-foreground/60 uppercase tracking-wider">Seat</span>
                    <span className="col-span-6 text-[9px] text-muted-foreground/60 uppercase tracking-wider">Member</span>
                    <span className="col-span-4 text-[9px] text-muted-foreground/60 uppercase tracking-wider">Status</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto scrollbar-gold">
                    {membersInGroup.length === 0 ? (
                      <p className="p-4 text-center text-muted-foreground text-xs">No members yet.</p>
                    ) : (
                      membersInGroup.map((s, i) => (
                        <div key={`${s.id}-${i}`}
                          className={`px-3 py-2.5 grid grid-cols-12 gap-1 items-center border-b border-gold/5 hover:bg-gold/5 transition-colors ${
                            s.user_id === currentUser?.id ? "bg-gold/8 border-l-2 border-l-gold" : ""
                          }`}>
                          <div className="col-span-2">
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black"
                              style={{
                                background: s.user_id === currentUser?.id ? "rgba(234,179,8,0.25)" : "rgba(255,255,255,0.06)",
                                border: s.user_id === currentUser?.id ? "1px solid rgba(234,179,8,0.5)" : "1px solid rgba(255,255,255,0.1)",
                                color: s.user_id === currentUser?.id ? "hsl(45,93%,47%)" : "hsl(0,0%,70%)",
                              }}>
                              {s.seat_number}
                            </span>
                          </div>
                          <div className="col-span-6 flex items-center gap-1.5 min-w-0">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 bg-gold/15 text-gold">
                              {(s.full_name || s.username || "?")[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-foreground text-[10px] font-semibold truncate">{s.full_name || s.username}</p>
                              <p className="text-muted-foreground text-[9px] truncate">@{s.username}</p>
                            </div>
                          </div>
                          <div className="col-span-4">
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                              s.payment_status === "paid" ? "text-emerald-400 border-emerald-600/30 bg-emerald-900/15" :
                              s.payment_status === "pending" ? "text-amber-400 border-amber-600/30 bg-amber-900/15" :
                              s.payment_status === "defaulter" ? "text-red-400 border-red-600/30 bg-red-900/15" :
                              "text-muted-foreground border-white/10 bg-white/5"
                            }`}>{s.is_disbursed ? "✓ Paid" : (s.payment_status || "unpaid")}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>

            {/* GROUP CHAT */}
            <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-200">
              <button onClick={() => setShowChat(!showChat)}
                className="w-full px-4 py-3 border-b border-gold/10 flex items-center justify-between hover:bg-gold/5 transition-colors">
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
                      {messages.length === 0 && (
                        <p className="text-muted-foreground text-xs text-center py-4">No messages yet. Say hello!</p>
                      )}
                      {messages.map(m => (
                        <div key={m.id} className={`flex gap-2 ${m.user_id === currentUser?.id ? "flex-row-reverse" : ""}`}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[9px] font-bold bg-gold/20 text-gold">
                            {m.username[0].toUpperCase()}
                          </div>
                          <div className={`max-w-[78%] flex flex-col ${m.user_id === currentUser?.id ? "items-end" : "items-start"}`}>
                            <span className="text-muted-foreground text-[9px] mb-0.5">
                              @{m.username} · {new Date(m.created_at).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                            </span>
                            <div className={`px-3 py-2 rounded-xl text-[11px] leading-relaxed ${
                              m.user_id === currentUser?.id
                                ? "bg-gold/15 border border-gold/20 text-foreground"
                                : m.is_system
                                  ? "bg-blue-900/20 border border-blue-600/20 text-blue-300 italic"
                                  : "bg-muted/30 text-foreground/80"
                            }`}>
                              {m.message}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {isLoggedIn && (
                      <div className="p-3 border-t border-gold/10 flex gap-2">
                        <input type="text" value={chatMsg} onChange={e => setChatMsg(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && sendMsg()}
                          placeholder="Type a message..." className="luxury-input text-xs py-2 flex-1" />
                        <button onClick={sendMsg} className="btn-gold p-2 rounded-lg shrink-0"><Send size={13} /></button>
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
              <input type="time" value={paymentTime} onChange={e => setPaymentTime(e.target.value)} className="luxury-input" />
              <p className="text-amber-400/70 text-xs mt-2">⚠️ You cannot change this time after confirming. Only admin can edit it.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowTerms(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm font-semibold">Cancel</button>
              <button onClick={confirmSlot} disabled={joiningSlot}
                className="btn-gold flex-1 py-2.5 rounded-xl font-bold text-sm disabled:opacity-60">
                {joiningSlot ? "Joining..." : `Agree & Confirm Seat #${selectedSlot}`}
              </button>
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
                  You cannot leave instantly. Your exit request will be reviewed by admin who may approve or reject it.
                </p>
                <div className="mb-4">
                  <label className="luxury-label">Reason for leaving</label>
                  <textarea rows={3} value={exitReason} onChange={e => setExitReason(e.target.value)}
                    className="luxury-input resize-none" placeholder="Enter your reason..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowExitModal(false)} className="btn-glass flex-1 py-2.5 rounded-xl text-sm">Cancel</button>
                  <button onClick={submitExitRequest}
                    className="flex-1 py-2.5 rounded-xl font-bold text-sm bg-red-900/40 border border-red-600/50 text-red-400 hover:bg-red-900/60 transition-all">
                    Submit Request
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <CheckCircle size={36} className="text-gold mx-auto mb-3" />
                <h4 className="gold-text font-cinzel font-bold">Request Submitted</h4>
                <p className="text-muted-foreground text-sm mt-2">Admin will review and notify you of the decision.</p>
                <button onClick={() => { setShowExitModal(false); setExitRequested(false); }}
                  className="btn-glass mt-4 px-6 py-2 rounded-xl text-sm font-semibold">Close</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
