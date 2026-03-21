import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Clock, Shield, TrendingUp } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

export default function Savings() {
  const { currentUser, isLoggedIn } = useApp();
  const [slots, setSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (currentUser) loadSlots(); }, [currentUser]);

  const loadSlots = async () => {
    const { data } = await supabase.from("slots").select("*, groups(name, contribution_amount, cycle_type, is_live)")
      .eq("user_id", currentUser!.id).order("seat_number");
    if (data) setSlots(data);
    setLoading(false);
  };

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const totalSaving = slots.reduce((s, sl) => s + (sl.groups?.contribution_amount || 0), 0);
  const disbursed = slots.filter(s => s.is_disbursed).length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <ParticleBackground />
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Overview</p>
          <h1 className="gold-gradient-text text-4xl font-cinzel font-bold">My Savings</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Shield, label: "Active Seats", value: slots.length.toString() },
            { icon: TrendingUp, label: "Total Contribution/Cycle", value: `₦${totalSaving.toLocaleString()}` },
            { icon: Clock, label: "Disbursed", value: `${disbursed}/${slots.length}` },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 flex flex-col gap-2 animate-fade-up glass-card-static">
              <s.icon size={20} className="text-gold" />
              <p className="text-muted-foreground text-xs">{s.label}</p>
              <p className="gold-gradient-text font-cinzel font-bold text-2xl">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-100">
          <div className="px-6 py-4 border-b border-gold/10">
            <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-wide">Your Seat Holdings</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
          ) : slots.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground text-sm">You haven't joined any groups yet. <a href="/groups" className="text-gold hover:underline">Browse groups →</a></div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gold/10 bg-gold/5">
                    {["Seat#","Group","Amount/Cycle","Payment Time","Status","Disbursed"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] text-muted-foreground/60 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {slots.map(s => (
                    <tr key={s.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                      <td className="px-5 py-3 text-gold font-bold">#{s.seat_number}</td>
                      <td className="px-5 py-3 text-foreground">{s.groups?.name}</td>
                      <td className="px-5 py-3 text-foreground font-semibold">₦{s.groups?.contribution_amount?.toLocaleString()}</td>
                      <td className="px-5 py-3 text-muted-foreground">{s.payment_time || "—"}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${
                          s.payment_status === "paid" ? "text-emerald-400 border-emerald-600/30 bg-emerald-900/20" :
                          s.payment_status === "pending" ? "text-amber-400 border-amber-600/30 bg-amber-900/20" :
                          s.payment_status === "defaulter" ? "text-red-400 border-red-600/30 bg-red-900/20" :
                          "text-muted-foreground border-white/10 bg-white/5"
                        }`}>{s.payment_status}</span>
                      </td>
                      <td className="px-5 py-3">
                        {s.is_disbursed
                          ? <span className="text-emerald-400 font-bold">✓ Disbursed</span>
                          : <span className="text-muted-foreground">Pending</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
