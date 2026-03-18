import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Navigate } from "react-router-dom";
import { Camera, Lock, Mail, User, Shield } from "lucide-react";
import ParticleBackground from "@/components/ParticleBackground";

export default function Profile() {
  const { currentUser, isLoggedIn, setCurrentUser } = useApp();
  const [tab, setTab] = useState<"info" | "password" | "email">("info");
  const [saved, setSaved] = useState(false);

  if (!isLoggedIn || !currentUser) return <Navigate to="/login" replace />;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 relative">
      <ParticleBackground />
      <div className="max-w-3xl mx-auto relative">
        <div className="text-center mb-8 animate-fade-up">
          <p className="text-muted-foreground text-xs uppercase tracking-widest mb-2">Account</p>
          <h1 className="gold-gradient-text text-3xl font-cinzel font-bold">My Profile</h1>
        </div>

        {/* Profile Card */}
        <div className="glass-card-static rounded-2xl p-6 mb-6 animate-fade-up delay-100">
          <div className="flex items-center gap-5 flex-wrap">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gold-gradient flex items-center justify-center text-obsidian text-2xl font-cinzel font-black animate-glow-pulse">
                {currentUser.firstName[0]}{currentUser.lastName[0]}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gold flex items-center justify-center">
                <Camera size={11} className="text-obsidian" />
              </button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-foreground font-bold text-xl">{currentUser.firstName} {currentUser.lastName}</h2>
                {currentUser.isVip && <span className="vip-badge">VIP ✦</span>}
                {currentUser.role === "admin" && <span className="px-2 py-0.5 rounded-full bg-red-900/30 border border-red-600/30 text-red-400 text-xs font-bold">ADMIN</span>}
              </div>
              <p className="text-muted-foreground text-sm">@{currentUser.username}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{currentUser.email}</p>
            </div>
            <div className="text-right">
              <p className="text-muted-foreground text-xs uppercase tracking-widest">Total Paid</p>
              <p className="gold-gradient-text text-xl font-cinzel font-bold">₦{currentUser.totalPaid.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 animate-fade-up delay-200">
          {([
            { id: "info", icon: User, label: "Information" },
            { id: "password", icon: Lock, label: "Password" },
            { id: "email", icon: Mail, label: "Email" },
          ] as const).map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${tab === t.id ? "btn-gold" : "btn-glass"}`}
            >
              <t.icon size={14} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          ))}
        </div>

        <div className="glass-card-static rounded-2xl p-6 animate-fade-up delay-300">
          {tab === "info" && (
            <div className="space-y-4">
              <h3 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div><label className="luxury-label">First Name</label><input defaultValue={currentUser.firstName} className="luxury-input" /></div>
                <div><label className="luxury-label">Last Name</label><input defaultValue={currentUser.lastName} className="luxury-input" /></div>
                <div><label className="luxury-label">Username</label><input defaultValue={currentUser.username} className="luxury-input" /></div>
                <div><label className="luxury-label">Phone</label><input defaultValue={currentUser.phone} className="luxury-input" /></div>
              </div>
              <div className="p-3 rounded-lg bg-gold/5 border border-gold/15 text-xs text-muted-foreground flex items-start gap-2">
                <Shield size={14} className="text-gold shrink-0 mt-0.5" />
                For security reasons, you cannot view other users' profiles. Your full profile is visible only to you and admins.
              </div>
              <button onClick={handleSave} className={`btn-gold px-6 py-2.5 rounded-xl font-bold text-sm ${saved ? "bg-emerald-600" : ""}`}>
                {saved ? "✓ Saved!" : "Save Changes"}
              </button>
            </div>
          )}

          {tab === "password" && (
            <div className="space-y-4">
              <h3 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">Change Password</h3>
              <div><label className="luxury-label">Current Password</label><input type="password" placeholder="Enter current password" className="luxury-input" /></div>
              <div><label className="luxury-label">New Password</label><input type="password" placeholder="Enter new password" className="luxury-input" /></div>
              <div><label className="luxury-label">Confirm New Password</label><input type="password" placeholder="Repeat new password" className="luxury-input" /></div>
              <button onClick={handleSave} className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm">
                {saved ? "✓ Updated!" : "Update Password"}
              </button>
            </div>
          )}

          {tab === "email" && (
            <div className="space-y-4">
              <h3 className="gold-text font-cinzel font-bold text-sm uppercase tracking-widest mb-4">Update Email</h3>
              <div><label className="luxury-label">Current Email</label><input type="email" defaultValue={currentUser.email} className="luxury-input" /></div>
              <div><label className="luxury-label">New Email</label><input type="email" placeholder="Enter new email address" className="luxury-input" /></div>
              <div><label className="luxury-label">Confirm Password</label><input type="password" placeholder="Confirm with password" className="luxury-input" /></div>
              <button onClick={handleSave} className="btn-gold px-6 py-2.5 rounded-xl font-bold text-sm">
                {saved ? "✓ Updated!" : "Update Email"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
