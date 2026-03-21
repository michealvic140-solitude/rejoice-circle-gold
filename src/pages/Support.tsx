import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { HeadphonesIcon, Send, Paperclip, CheckCircle } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

export default function Support() {
  const { currentUser, isLoggedIn } = useApp();
  const [tickets, setTickets] = useState<any[]>([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (currentUser) loadTickets(); }, [currentUser]);

  const loadTickets = async () => {
    const { data } = await supabase.from("support_tickets").select("*")
      .eq("user_id", currentUser!.id).order("created_at", { ascending: false });
    if (data) setTickets(data);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    setSubmitting(true);
    let attachmentUrl: string | null = null;
    if (file) {
      const path = `${currentUser!.id}/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("support-attachments").upload(path, file);
      if (!upErr) {
        const { data } = supabase.storage.from("support-attachments").getPublicUrl(path);
        attachmentUrl = data.publicUrl;
      }
    }
    await supabase.from("support_tickets").insert({
      user_id: currentUser!.id, username: currentUser!.username,
      subject, message, attachment_url: attachmentUrl,
    });
    setSubject(""); setMessage(""); setFile(null); setSuccess(true);
    await loadTickets();
    setTimeout(() => setSuccess(false), 3000);
    setSubmitting(false);
  };

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <ParticleBackground />
      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-10 animate-fade-up">
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Help Center</p>
          <h1 className="gold-gradient-text text-4xl font-cinzel font-bold">Support</h1>
          <p className="text-muted-foreground text-sm mt-2">Submit a ticket and our team will assist you promptly.</p>
        </div>

        {/* Submit form */}
        <div className="glass-card-static rounded-2xl p-6 mb-6 animate-fade-up delay-100">
          <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">New Support Ticket</h2>
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-900/20 border border-emerald-600/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle size={14} /> Ticket submitted! Our admin/moderator will reply soon.
            </div>
          )}
          <form onSubmit={submit} className="space-y-4">
            <div><label className="luxury-label">Subject *</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief description of your issue" className="luxury-input" required /></div>
            <div><label className="luxury-label">Message *</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue in detail..." className="luxury-input resize-none h-28" required /></div>
            <div>
              <label className="luxury-label">Attachment (optional)</label>
              <label className="flex items-center gap-3 luxury-input cursor-pointer hover:border-gold/40 transition-all">
                <Paperclip size={14} className="text-gold shrink-0" />
                <span className="text-muted-foreground text-sm">{file ? file.name : "Attach image or file"}</span>
                <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
              </label>
            </div>
            <button type="submit" disabled={submitting} className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-60">
              {submitting ? <span className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" /> : <Send size={14} />}
              {submitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </div>

        {/* Tickets list */}
        <div className="glass-card-static rounded-2xl overflow-hidden animate-fade-up delay-200">
          <div className="px-5 py-4 border-b border-gold/10">
            <h2 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest">My Tickets</h2>
          </div>
          {tickets.length === 0 ? (
            <p className="p-6 text-center text-muted-foreground text-sm">No tickets submitted yet.</p>
          ) : (
            <div className="divide-y divide-gold/5">
              {tickets.map(t => (
                <div key={t.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-foreground font-semibold text-sm">{t.subject}</p>
                      <p className="text-muted-foreground text-xs mt-1">{t.message}</p>
                      <p className="text-muted-foreground/50 text-[10px] mt-1">{t.created_at?.replace("T"," ").slice(0,16)}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase shrink-0 ${
                      t.status === "open" ? "text-blue-400 border-blue-600/30 bg-blue-900/20" :
                      t.status === "replied" ? "text-emerald-400 border-emerald-600/30 bg-emerald-900/20" :
                      "text-muted-foreground border-white/10 bg-white/5"
                    }`}>{t.status}</span>
                  </div>
                  {t.admin_reply && (
                    <div className="mt-3 p-3 rounded-xl bg-gold/5 border border-gold/15">
                      <p className="text-gold text-[10px] font-bold uppercase tracking-widest mb-1">Admin Reply</p>
                      <p className="text-foreground text-xs">{t.admin_reply}</p>
                    </div>
                  )}
                  {t.attachment_url && (
                    <a href={t.attachment_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-gold text-xs hover:underline">
                      <Paperclip size={11} /> View Attachment
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
