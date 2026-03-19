import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, User, LayoutDashboard, Shield } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const { currentUser, isLoggedIn, notifications, markNotificationsRead, setCurrentUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path || (path !== "/" && location.pathname.startsWith(path));

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card-static border-b border-gold/10 px-4 md:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 flex-wrap">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg animate-glow-pulse">
            <span className="text-obsidian font-cinzel font-black text-sm">RA</span>
          </div>
          <div className="hidden sm:block">
            <span className="gold-gradient-text text-base font-cinzel font-bold tracking-wide leading-none block">
              Rejoice Ajo
            </span>
            <span className="text-muted-foreground text-[9px] tracking-widest uppercase">Trust Platform</span>
          </div>
        </Link>

        {/* All nav items — inline, no hamburger */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isActive("/") && location.pathname === "/"
                ? "bg-gold/15 border-gold/40 text-gold"
                : "bg-transparent border-gold/10 text-muted-foreground hover:text-gold hover:border-gold/30 hover:bg-gold/5"
            }`}
          >
            Home
          </Link>
          <Link
            to="/groups"
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isActive("/groups")
                ? "bg-gold/15 border-gold/40 text-gold"
                : "bg-transparent border-gold/10 text-muted-foreground hover:text-gold hover:border-gold/30 hover:bg-gold/5"
            }`}
          >
            Groups
          </Link>

          {isLoggedIn && (
            <>
              <Link
                to="/dashboard"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                  isActive("/dashboard")
                    ? "bg-gold/15 border-gold/40 text-gold"
                    : "bg-transparent border-gold/10 text-muted-foreground hover:text-gold hover:border-gold/30 hover:bg-gold/5"
                }`}
              >
                <LayoutDashboard size={11} />
                Dashboard
              </Link>

              {currentUser?.role === "admin" && (
                <Link
                  to="/admin"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                    isActive("/admin")
                      ? "bg-gold/15 border-gold/40 text-gold"
                      : "bg-transparent border-gold/10 text-muted-foreground hover:text-gold hover:border-gold/30 hover:bg-gold/5"
                  }`}
                >
                  <Shield size={11} />
                  Admin
                </Link>
              )}
            </>
          )}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markNotificationsRead(); }}
                  className="relative p-2 rounded-lg border border-gold/15 bg-gold/5 hover:bg-gold/10 hover:border-gold/30 transition-all"
                >
                  <Bell size={15} className="text-gold" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {unread}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 glass-card-static border border-gold/20 rounded-xl p-2 animate-scale-in z-50 shadow-2xl">
                    <p className="gold-text text-xs font-cinzel px-3 py-2 border-b border-gold/10 mb-1">NOTIFICATIONS</p>
                    {notifications.length === 0 ? (
                      <p className="text-muted-foreground text-sm p-3">No notifications</p>
                    ) : notifications.map(n => (
                      <div key={n.id} className={`px-3 py-2 rounded-lg mb-1 text-xs ${n.read ? "text-muted-foreground" : "text-foreground bg-gold/5"}`}>
                        {n.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Profile chip */}
              <Link
                to="/profile"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-gold/20 bg-gold/5 hover:bg-gold/10 hover:border-gold/35 transition-all"
              >
                <div className="w-5 h-5 rounded-full bg-gold-gradient flex items-center justify-center shrink-0">
                  <User size={10} className="text-obsidian" />
                </div>
                <span className="text-foreground/80 font-medium text-xs hidden sm:block max-w-[80px] truncate">{currentUser?.username}</span>
              </Link>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg text-xs font-bold border border-red-600/30 bg-red-900/10 text-red-400 hover:bg-red-900/25 hover:border-red-500/50 transition-all flex items-center gap-1.5"
              >
                <LogOut size={11} />
                <span className="hidden sm:inline">SIGN OUT</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-lg text-xs font-bold border border-gold/30 bg-gold/10 text-gold hover:bg-gold/20 hover:border-gold/50 transition-all"
              >
                SIGN IN
              </Link>
              <Link
                to="/register"
                className="btn-gold px-4 py-1.5 rounded-lg text-xs font-bold"
              >
                SIGN UP
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
