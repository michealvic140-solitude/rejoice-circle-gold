import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Receipt, ArrowUpRight } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

export default function Transactions() {
  const { currentUser, isLoggedIn } = useApp();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) loadTx();
  }, [currentUser]);

  const loadTx = async () => {
    const { data } = await supabase
      .from("transactions").select("*")
      .eq("user_id", currentUser!.id)
      .order("created_at", { ascending: false });
    if (data) setTransactions(data);
    setLoading(false);
  };

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <ParticleBackground />
      <div className="max-w-5xl mx-auto relative">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">History</p>
          <h1 className="gold-gradient-text text-4xl font-cinzel font-bold">Transactions</h1>
        </div>
        <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-100">
          <div className="px-6 py-4 border-b border-gold/10 flex items-center gap-2">
            <Receipt size={16} className="text-gold" />
            <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-wide">All Transactions</h2>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
            ) : transactions.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground text-sm">No transactions yet. Join a group and make your first payment!</div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gold/10 bg-gold/5">
                    {["Code","Group","Seat","Amount","Status","Date"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] text-muted-foreground/60 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(t => (
                    <tr key={t.id} className="border-b border-gold/5 hover:bg-gold/3 transition-colors">
                      <td className="px-5 py-3 text-gold font-mono">{t.code}</td>
                      <td className="px-5 py-3 text-foreground/70">{t.group_name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{t.seat_number ? `#${t.seat_number}` : "—"}</td>
                      <td className="px-5 py-3 text-foreground font-semibold">₦{t.amount?.toLocaleString()}</td>
                      <td className="px-5 py-3"><span className={`status-${t.status}`}>{t.status}</span></td>
                      <td className="px-5 py-3 text-muted-foreground">{t.created_at?.split("T")[0]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
