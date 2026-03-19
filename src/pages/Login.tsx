import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, MessageSquare, Settings } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { mockUser } from "@/context/AppContext";
import ParticleBackground from "@/components/ParticleBackground";

// Floating coin component
const Coin = ({ style }: { style: React.CSSProperties }) => (
  <div
    className="absolute w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl font-black animate-float-coin select-none pointer-events-none"
    style={{
      background: "radial-gradient(circle at 35% 35%, hsl(45,100%,72%), hsl(38,92%,40%), hsl(30,85%,25%))",
      boxShadow: "0 4px 20px rgba(234,179,8,0.5), inset 0 1px 2px rgba(255,255,255,0.3)",
      color: "hsl(45,93%,30%)",
      ...style,
    }}
  >
    ₦
  </div>
);

const COINS = [
  { top: "4%",  left: "2%",  animDelay: "0s",   scale: 1.1 },
  { top: "12%", left: "10%", animDelay: "0.4s",  scale: 0.85 },
  { top: "25%", left: "3%",  animDelay: "0.8s",  scale: 1.2 },
  { top: "55%", left: "1%",  animDelay: "1.2s",  scale: 0.9 },
  { top: "72%", left: "6%",  animDelay: "0.2s",  scale: 1.0 },
  { top: "85%", left: "2%",  animDelay: "1.5s",  scale: 1.15 },
  { top: "5%",  right: "3%", animDelay: "0.6s",  scale: 1.05 },
  { top: "18%", right: "8%", animDelay: "1.0s",  scale: 0.8 },
  { top: "35%", right: "2%", animDelay: "0.3s",  scale: 1.3 },
  { top: "60%", right: "5%", animDelay: "0.9s",  scale: 0.95 },
  { top: "78%", right: "2%", animDelay: "1.4s",  scale: 1.1 },
  { top: "40%", left: "14%", animDelay: "0.7s",  scale: 0.75 },
  { top: "48%", right: "14%",animDelay: "1.1s",  scale: 0.85 },
  { top: "90%", left: "20%", animDelay: "0.5s",  scale: 1.0  },
  { top: "88%", right: "15%",animDelay: "1.3s",  scale: 0.9 },
];

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setCurrentUser } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));

    if ((identifier === "goldmember" || identifier === "rejoice@example.com") && password === "password123") {
      setCurrentUser({ ...mockUser });
      navigate("/dashboard");
    } else if (identifier === "admin" && password === "admin123") {
      setCurrentUser({ ...mockUser, role: "admin", username: "admin" });
      navigate("/admin");
    } else {
      setError("Invalid credentials. Try: goldmember / password123");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at center, #1a1200 0%, #0a0a0a 60%, #000 100%)" }}
    >
      <ParticleBackground />

      {/* Gold network lines bg */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(234,179,8,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(234,179,8,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating coins */}
      {COINS.map((c, i) => (
        <Coin
          key={i}
          style={{
            top: c.top,
            left: (c as any).left,
            right: (c as any).right,
            transform: `scale(${c.scale})`,
            animationDelay: c.animDelay,
            zIndex: 1,
          }}
        />
      ))}

      {/* Version bottom-left */}
      <div className="absolute bottom-6 left-6 z-10">
        <span className="text-muted-foreground/60 text-xs font-mono tracking-wider">V1.05</span>
      </div>

      {/* Bottom icon buttons */}
      <div className="absolute bottom-6 right-6 flex gap-2 z-10">
        {[User, MessageSquare, Settings].map((Icon, i) => (
          <button
            key={i}
            className="w-10 h-10 rounded-xl border border-gold/20 bg-black/40 backdrop-blur-sm flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold/50 transition-all"
          >
            <Icon size={15} />
          </button>
        ))}
      </div>

      {/* Main glass card */}
      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        <div
          className="rounded-2xl p-8 md:p-10 border border-white/10"
          style={{
            background: "rgba(10,10,10,0.75)",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            boxShadow: "0 0 60px rgba(234,179,8,0.08), 0 32px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* Top-left logo mark */}
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
              <span className="text-obsidian font-cinzel font-black text-xs">RA</span>
            </div>
            <span className="gold-gradient-text font-cinzel font-bold text-sm tracking-widest">RTA</span>
          </div>

          {/* Big heading */}
          <div className="text-center mb-8 mt-4">
            <h1
              className="font-cinzel font-black text-3xl md:text-4xl leading-tight mb-2"
              style={{
                background: "linear-gradient(135deg, #d4a017, #f0c040, #c8860a, #eab308)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                letterSpacing: "0.05em",
              }}
            >
              REJOICE TRUST
            </h1>
            <h2
              className="font-cinzel font-black text-3xl md:text-4xl leading-tight"
              style={{
                background: "linear-gradient(135deg, #d4a017, #f0c040, #c8860a, #eab308)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
                letterSpacing: "0.05em",
              }}
            >
              AJO PLATFORM
            </h2>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Email"
                className="w-full px-4 py-3.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "hsl(45,100%,90%)",
                  outline: "none",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(234,179,8,0.5)"; e.target.style.background = "rgba(255,255,255,0.09)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                required
              />
            </div>

            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3.5 pr-12 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "hsl(45,100%,90%)",
                  outline: "none",
                }}
                onFocus={e => { e.target.style.borderColor = "rgba(234,179,8,0.5)"; e.target.style.background = "rgba(255,255,255,0.09)"; }}
                onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.12)"; e.target.style.background = "rgba(255,255,255,0.06)"; }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors p-1"
              >
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {error && (
              <div className="text-center py-2 px-3 rounded-lg bg-red-900/20 border border-red-600/30 text-red-400 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm tracking-widest disabled:opacity-60 transition-all mt-2"
              style={{
                background: loading ? "rgba(234,179,8,0.5)" : "linear-gradient(135deg, hsl(45,93%,47%), hsl(38,92%,42%))",
                color: "#0a0a0a",
                boxShadow: loading ? "none" : "0 4px 20px rgba(234,179,8,0.4)",
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>
          </form>

          {/* Links */}
          <div className="flex items-center justify-center gap-4 mt-5 text-xs text-muted-foreground">
            <Link to="/forgot-password" className="hover:text-gold transition-colors">Forgot Password?</Link>
            <span className="text-muted-foreground/30">|</span>
            <Link to="/register" className="hover:text-gold transition-colors">
              Don't have an account? <span className="text-gold font-semibold">Register</span>
            </Link>
          </div>

          {/* Demo hint */}
          <div className="mt-5 p-3 rounded-xl border border-gold/10 bg-gold/3 text-xs text-muted-foreground">
            <p className="text-gold font-semibold mb-1">Demo:</p>
            <p>User: <span className="text-foreground">goldmember / password123</span></p>
            <p>Admin: <span className="text-foreground">admin / admin123</span></p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-coin {
          0%   { transform: translateY(0) rotate(0deg) scale(var(--coin-scale, 1)); opacity: 0.9; }
          25%  { transform: translateY(-18px) rotate(8deg) scale(var(--coin-scale, 1)); }
          50%  { transform: translateY(-6px) rotate(-4deg) scale(var(--coin-scale, 1)); opacity: 1; }
          75%  { transform: translateY(-22px) rotate(10deg) scale(var(--coin-scale, 1)); }
          100% { transform: translateY(0) rotate(0deg) scale(var(--coin-scale, 1)); opacity: 0.9; }
        }
        .animate-float-coin {
          animation: float-coin 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
