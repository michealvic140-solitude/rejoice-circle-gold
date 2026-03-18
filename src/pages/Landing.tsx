import { Link } from "react-router-dom";
import { ArrowRight, Shield, Trophy, Users, Zap, Star, TrendingUp } from "lucide-react";
import { useApp } from "@/context/AppContext";
import GroupCard from "@/components/GroupCard";
import ParticleBackground from "@/components/ParticleBackground";
import heroBg from "@/assets/hero-bg.jpg";

const features = [
  { icon: Shield, title: "Secure & Trusted", desc: "Every transaction is verified by admin before approval. Full audit trail." },
  { icon: Users, title: "Community Circles", desc: "Join savings groups with like-minded contributors. Build together." },
  { icon: TrendingUp, title: "Structured Payouts", desc: "Receive your full cycle payout according to your assigned slot order." },
  { icon: Zap, title: "Daily Tracking", desc: "Automated monitoring with real-time notifications for every activity." },
];

const steps = [
  { n: "01", title: "Create Account", desc: "Register with your details for a fully verified, trusted profile." },
  { n: "02", title: "Choose Your Group", desc: "Browse active savings circles and pick the one that fits your goal." },
  { n: "03", title: "Select Your Slot", desc: "Pick your seat number. Your role number determines your payout order." },
  { n: "04", title: "Contribute & Receive", desc: "Contribute on schedule. Receive your full payout when your slot arrives." },
];

export default function Landing() {
  const { groups, leaderboard } = useApp();

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />

      {/* ===================== HERO ===================== */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/40 to-background" />

        {/* Gold glow orb */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse,rgba(234,179,8,0.06)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 glass-card-static px-4 py-2 rounded-full mb-8 animate-fade-up">
            <div className="w-5 h-5 rounded-full bg-gold-gradient" />
            <span className="text-gold text-xs font-semibold tracking-widest uppercase">Rejoice Ajo Platform</span>
          </div>

          <h1 className="gold-gradient-text text-5xl md:text-7xl font-cinzel font-black mb-6 leading-tight animate-fade-up delay-100">
            Rejoice Ajo
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground font-light mb-4 max-w-3xl mx-auto leading-relaxed animate-fade-up delay-200">
            Join trusted savings circles and build financial discipline through structured rotating contributions.
          </p>

          <p className="text-sm text-muted-foreground/70 mb-10 max-w-xl mx-auto animate-fade-up delay-300">
            The premier luxury rotating savings (Ajo/ROSCA) platform for Nigerians who take their financial future seriously.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up delay-400">
            <Link to="/register" className="btn-gold px-8 py-4 rounded-xl text-base font-bold flex items-center gap-2 justify-center">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/groups" className="btn-glass px-8 py-4 rounded-xl text-base font-semibold flex items-center gap-2 justify-center">
              Explore Groups <Users size={18} />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16 animate-fade-up delay-500">
            {[
              { val: "₦2.4B+", label: "Total Saved" },
              { val: "1,200+", label: "Active Members" },
              { val: "98%", label: "Payout Rate" },
            ].map(s => (
              <div key={s.label} className="glass-card-static p-4 rounded-xl text-center">
                <p className="gold-gradient-text text-2xl font-cinzel font-bold">{s.val}</p>
                <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== ACTIVE GROUPS ===================== */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Live Opportunities</p>
            <h2 className="gold-gradient-text text-3xl md:text-4xl font-cinzel font-bold">Active Savings Groups</h2>
            <p className="text-muted-foreground mt-3 max-w-md mx-auto text-sm">Choose a circle that matches your contribution capacity and savings goals.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {groups.slice(0, 4).map(g => <GroupCard key={g.id} group={g} />)}
          </div>
          <div className="text-center mt-10">
            <Link to="/groups" className="btn-glass px-8 py-3 rounded-xl text-sm inline-flex items-center gap-2">
              View All Groups <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="py-20 px-4 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.03)_0%,transparent_70%)]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="gold-gradient-text text-3xl md:text-4xl font-cinzel font-bold">How Rejoice Ajo Works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.n} className="glass-card p-6 text-center" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center mx-auto mb-4">
                  <span className="text-obsidian font-cinzel font-black text-sm">{s.n}</span>
                </div>
                <h3 className="gold-text font-cinzel font-bold text-base mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Platform Features</p>
            <h2 className="gold-gradient-text text-3xl md:text-4xl font-cinzel font-bold">Built for Trust</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map(f => (
              <div key={f.title} className="glass-card p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
                  <f.icon size={20} className="text-gold" />
                </div>
                <div>
                  <h3 className="text-foreground font-semibold mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== LEADERBOARD ===================== */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Hall of Trust</p>
            <h2 className="gold-gradient-text text-3xl md:text-4xl font-cinzel font-bold">Top Contributors</h2>
            <p className="text-muted-foreground mt-3 text-sm">Our most consistent and trusted savings circle members.</p>
          </div>
          <div className="glass-card-static rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-gold/10 flex items-center gap-2">
              <Trophy size={16} className="text-gold" />
              <span className="gold-text font-cinzel text-sm font-bold">LEADERBOARD</span>
            </div>
            {leaderboard.map((u, i) => (
              <div
                key={u.id}
                className={`flex items-center gap-4 px-5 py-4 border-b border-gold/5 last:border-0 ${i === 0 ? "bg-gold/5" : "hover:bg-gold/3 transition-colors"}`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-cinzel font-bold shrink-0 ${
                  i === 0 ? "bg-gold text-obsidian" :
                  i === 1 ? "bg-muted text-foreground/80" :
                  i === 2 ? "bg-amber-900/40 text-amber-400" :
                  "bg-muted/50 text-muted-foreground"
                }`}>{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-semibold text-sm">@{u.username}</span>
                    {u.isVip && <span className="vip-badge">VIP ✦</span>}
                  </div>
                  <p className="text-muted-foreground text-xs">{u.firstName} {u.lastName}</p>
                </div>
                <div className="text-right">
                  <p className="gold-text font-bold text-sm">₦{u.totalPaid.toLocaleString()}</p>
                  <p className="text-muted-foreground text-xs">total paid</p>
                </div>
                {i === 0 && <Star size={16} className="text-gold animate-glow-pulse" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== CTA ===================== */}
      <section className="py-24 px-4 text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.05)_0%,transparent_60%)]" />
        <div className="relative max-w-2xl mx-auto glass-card-static p-12 rounded-3xl">
          <p className="text-gold text-xs font-semibold tracking-widest uppercase mb-4">Start Today</p>
          <h2 className="gold-gradient-text text-3xl md:text-4xl font-cinzel font-bold mb-4">Ready to Build Wealth Together?</h2>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
            Join thousands of Nigerians who trust Rejoice Ajo for their rotating savings. Discipline. Trust. Community.
          </p>
          <Link to="/register" className="btn-gold px-10 py-4 rounded-xl text-base font-bold inline-flex items-center gap-2">
            Create Free Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gold/10 py-8 px-4 text-center">
        <p className="gold-gradient-text font-cinzel font-bold text-lg mb-1">Rejoice Ajo</p>
        <p className="text-muted-foreground text-xs">© 2025 Rejoice Ajo Luxury Savings Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}
