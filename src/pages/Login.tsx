import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { mockUser } from "@/context/AppContext";
import ParticleBackground from "@/components/ParticleBackground";

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

    // Demo login
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
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 relative">
      <ParticleBackground />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(234,179,8,0.05)_0%,transparent_60%)]" />

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center animate-glow-pulse">
              <span className="text-obsidian font-cinzel font-black">RA</span>
            </div>
          </Link>
          <h1 className="gold-gradient-text text-3xl font-cinzel font-bold">Welcome Back</h1>
          <p className="text-muted-foreground text-sm mt-2">Sign in to your Rejoice Ajo account</p>
        </div>

        {/* Card */}
        <div className="glass-card-static p-8 rounded-2xl border border-gold/20">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="luxury-label">Email or Username</label>
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="Enter email or username"
                className="luxury-input"
                required
              />
            </div>
            <div>
              <label className="luxury-label">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="luxury-input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gold transition-colors"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="status-declined text-center py-2 rounded-lg text-xs">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <Link to="/forgot-password" className="text-gold/70 hover:text-gold transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <><span>Sign In</span><ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gold/10 text-center">
            <p className="text-muted-foreground text-sm">
              Don't have an account?{" "}
              <Link to="/register" className="text-gold hover:text-gold/80 font-semibold transition-colors">
                Create one free
              </Link>
            </p>
          </div>

          {/* Demo hint */}
          <div className="mt-4 p-3 rounded-lg bg-gold/5 border border-gold/15 text-xs text-muted-foreground">
            <p className="font-semibold text-gold mb-1">Demo credentials:</p>
            <p>User: <span className="text-foreground">goldmember</span> / <span className="text-foreground">password123</span></p>
            <p>Admin: <span className="text-foreground">admin</span> / <span className="text-foreground">admin123</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
