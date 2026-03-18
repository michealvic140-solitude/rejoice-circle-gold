import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LogOut, User, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const { currentUser, isLoggedIn, notifications, markNotificationsRead, setCurrentUser } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate("/");
    setMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card-static border-b border-gold/10 px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group" onClick={() => setMenuOpen(false)}>
          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center shadow-lg animate-glow-pulse">
            <span className="text-obsidian font-cinzel font-black text-sm">RA</span>
          </div>
          <div>
            <span className="gold-gradient-text text-lg font-cinzel font-bold tracking-wide leading-none block">
              Rejoice Ajo
            </span>
            <span className="text-muted-foreground text-[10px] tracking-widest uppercase">Luxury Savings</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={`nav-link text-sm ${isActive("/") ? "active" : ""}`}>Home</Link>
          <Link to="/groups" className={`nav-link text-sm ${isActive("/groups") ? "active" : ""}`}>Groups</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className={`nav-link text-sm ${isActive("/dashboard") ? "active" : ""}`}>Dashboard</Link>
              {currentUser?.role === "admin" && (
                <Link to="/admin" className={`nav-link text-sm ${isActive("/admin") ? "active" : ""}`}>Admin</Link>
              )}
            </>
          ) : null}
        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markNotificationsRead(); }}
                  className="relative p-2 rounded-full glass-card border-0 hover:bg-gold/10 transition-all"
                >
                  <Bell size={18} className="text-gold" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {unread}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-12 w-80 glass-card-static border border-gold/20 rounded-xl p-2 animate-scale-in">
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

              {/* Profile */}
              <Link to="/profile" className="flex items-center gap-2 glass-card px-3 py-1.5 rounded-full text-sm">
                <div className="w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center">
                  <User size={12} className="text-obsidian" />
                </div>
                <span className="text-foreground/80 font-medium">{currentUser?.username}</span>
              </Link>

              {/* Logout */}
              <button onClick={handleLogout} className="btn-glass px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link text-sm px-4 py-2">Login</Link>
              <Link to="/register" className="btn-gold px-5 py-2 rounded-lg text-sm">Register</Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden p-2 text-gold" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 border-t border-gold/10 pt-4 space-y-3 animate-fade-up">
          <Link to="/" className="block nav-link text-sm py-2" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/groups" className="block nav-link text-sm py-2" onClick={() => setMenuOpen(false)}>Groups</Link>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="block nav-link text-sm py-2" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              {currentUser?.role === "admin" && (
                <Link to="/admin" className="block nav-link text-sm py-2" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <Link to="/profile" className="block nav-link text-sm py-2" onClick={() => setMenuOpen(false)}>Profile</Link>
              <button onClick={handleLogout} className="btn-glass w-full px-4 py-2 rounded-lg text-sm mt-2">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="block nav-link text-sm py-2" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn-gold block text-center px-5 py-2 rounded-lg text-sm" onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
