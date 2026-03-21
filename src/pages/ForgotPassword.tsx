import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import ParticleBackground from "@/components/ParticleBackground";

export default function ForgotPassword() {
  const [identifier, setIdentifier] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Insert a forgot password request
    await supabase.from("forgot_password_requests").insert({ identifier });
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4"
      style={{ background: "radial-gradient(ellipse at center, #1a1200 0%, #0a0a0a 60%, #000 100%)" }}>
      <ParticleBackground />
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <div className="rounded-2xl p-8 border border-white/10"
          style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(32px)", boxShadow: "0 0 60px rgba(234,179,8,0.08)" }}>
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                <span className="text-obsidian font-cinzel font-black text-sm">RA</span>
              </div>
            </Link>
            <h1 className="gold-gradient-text font-cinzel font-bold text-2xl">Forgot Password</h1>
            <p className="text-muted-foreground text-xs mt-2">Enter your email or username and our admin will send you a new password.</p>
          </div>

          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-900/20 border border-emerald-600/30 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <h2 className="text-foreground font-bold text-lg">Request Submitted!</h2>
              <p className="text-muted-foreground text-sm">
                Your password reset request has been received. Our admin will manually generate a new password and send it to you via email or phone within 24 hours.
              </p>
              <div className="p-3 rounded-xl bg-gold/5 border border-gold/15 text-xs text-amber-400">
                📌 Please check your registered email and phone for your new password.
              </div>
              <Link to="/login" className="btn-gold w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center mt-4">
                Return to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="luxury-label">Email Address or Username</label>
                <input
                  type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                  placeholder="your@email.com or username"
                  className="luxury-input" required
                />
              </div>
              <div className="p-3 rounded-lg bg-gold/5 border border-gold/10 text-xs text-muted-foreground">
                ℹ️ Our admin will verify your identity and manually send your new password via email or SMS.
              </div>
              <button type="submit" disabled={loading}
                className="btn-gold w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <span className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" /> : "Request New Password"}
              </button>
              <Link to="/login" className="block text-center text-muted-foreground text-xs hover:text-gold transition-colors mt-2">
                ← Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
