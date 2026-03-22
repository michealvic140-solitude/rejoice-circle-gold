import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import {
  Clock, Shield, TrendingUp, FileText, AlertCircle
} from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

export default function AuditLogs() {
  const { currentUser, isLoggedIn } = useApp();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) loadLogs();
  }, [currentUser]);

  const loadLogs = async () => {
    const { data } = await supabase
      .from("audit_logs")
      .select("*")
      .or(`target_user_id.eq.${currentUser!.id},performed_by.eq.${currentUser!.id}`)
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setLogs(data);
    setLoading(false);
  };

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  const typeColor = (type: string) => {
    switch (type) {
      case "join": return "text-emerald-400 border-emerald-600/30 bg-emerald-900/15";
      case "payment": return "text-blue-400 border-blue-600/30 bg-blue-900/15";
      case "approve": return "text-emerald-400 border-emerald-600/30 bg-emerald-900/15";
      case "ban": return "text-red-400 border-red-600/30 bg-red-900/15";
      case "restrict": return "text-amber-400 border-amber-600/30 bg-amber-900/15";
      case "vip": return "text-gold border-gold/30 bg-gold/10";
      case "announce": return "text-purple-400 border-purple-600/30 bg-purple-900/15";
      default: return "text-muted-foreground border-white/10 bg-white/5";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <ParticleBackground />
      <div className="max-w-4xl mx-auto relative">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">History</p>
          <h1 className="gold-gradient-text text-4xl font-cinzel font-bold">Activity Log</h1>
          <p className="text-muted-foreground text-sm mt-2">Your complete account activity history with timestamps.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: FileText,    label: "Total Actions",  value: logs.length.toString() },
            { icon: TrendingUp,  label: "This Month",     value: logs.filter(l => l.created_at?.startsWith(new Date().toISOString().slice(0, 7))).length.toString() },
            { icon: Clock,       label: "Last Activity",  value: logs[0]?.created_at ? new Date(logs[0].created_at).toLocaleDateString("en-NG") : "—" },
          ].map(s => (
            <div key={s.label} className="glass-card-static rounded-2xl p-5 flex items-center gap-4 animate-fade-up">
              <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                <s.icon size={18} className="text-gold" />
              </div>
              <div>
                <p className="text-muted-foreground text-xs">{s.label}</p>
                <p className="gold-gradient-text font-cinzel font-bold text-xl">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-100">
          <div className="px-6 py-4 border-b border-gold/10 flex items-center gap-2">
            <Shield size={16} className="text-gold" />
            <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-wide">Activity History</h2>
          </div>
          {loading ? (
            <div className="p-8 text-center"><div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" /></div>
          ) : logs.length === 0 ? (
            <div className="p-10 text-center">
              <AlertCircle size={32} className="text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No activity recorded yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-gold/5">
              {logs.map(l => (
                <div key={l.id} className="px-6 py-4 flex items-start gap-4 hover:bg-gold/3 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-gold/60 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm">{l.action}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-muted-foreground text-[10px]">
                        {new Date(l.created_at).toLocaleString("en-NG", {
                          year: "numeric", month: "short", day: "2-digit",
                          hour: "2-digit", minute: "2-digit", second: "2-digit",
                        })}
                      </span>
                      {l.performed_by_username && (
                        <span className="text-muted-foreground/60 text-[10px]">by @{l.performed_by_username}</span>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase shrink-0 ${typeColor(l.type)}`}>
                    {l.type || "general"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link to="/dashboard" className="text-muted-foreground text-xs hover:text-gold transition-colors">← Back to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
