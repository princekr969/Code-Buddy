import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/Button";
import { Code2, Menu, X, User, LogOut, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import authService from "../../services/authService";

const NAV_LINKS = [
  { label: "Home",      to: "/" },
  { label: "Features",  to: "/features" },
  { label: "Languages", to: "/languages" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, setCurrentUser } = useAuthContext();

  const handleLogout = async () => {
    try {
      await authService.logout();
      setCurrentUser(null);
      navigate("/");
      setProfileMenuOpen(false);
      setMobileMenuOpen(false);
    } catch (error) {
      console.log("Error: logout");
    }
  };

  // A link is "active" if its pathname matches the current route
  const isActive = (to) => {
    const path = to.split("#")[0] || "/";
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl h-14 sm:h-16 flex items-center justify-between gap-4">

        <Link to="/" className="flex items-center gap-2 shrink-0 group">
          <Code2 className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-purple-400 transition-colors duration-200" />
          <span className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Code-Buddy
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                isActive(to)
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              {label}
              {isActive(to) && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gray-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          ))}
          {currentUser && (
            <Link
              to={`/dashboard/${currentUser._id}`}
              className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                location.pathname.startsWith("/dashboard")
                  ? "text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Dashboard
              {location.pathname.startsWith("/dashboard") && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-gray-500"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </Link>
          )}
        </nav>

        {/* ── Right side ── */}
        <div className="flex items-center gap-2">

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="hidden md:flex items-center">
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-semibold shrink-0 overflow-hidden ring-2 ring-white/10">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      currentUser.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />
                    )}
                  </div>
                  <span className="text-sm text-white hidden lg:inline max-w-30 truncate">
                    {currentUser.name}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900 border border-white/10 rounded-xl shadow-2xl py-1.5 overflow-hidden"
                    >
                      <div className="px-4 py-2 border-b border-white/5 mb-1">
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 shrink-0" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <LogOut className="w-4 h-4 shrink-0" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/auth?mode=login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 bg-white/5 hover:text-white border border-white/10 px-4 py-1.5 text-sm transition-all duration-200"
                  >
                    Log In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup">
                  <Button
                    size="sm"
                    className=" text-white  bg-purple-600 hover:bg-purple-500 border-0 px-4 py-1.5 text-sm transition-all duration-200"
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden overflow-hidden border-t border-white/10 bg-slate-950"
          >
            <div className="px-4 py-3 space-y-1">

              {/* User info strip */}
              {currentUser && (
                <div className="flex items-center gap-3 px-3 py-2.5 mb-2 bg-white/5 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm font-semibold shrink-0 overflow-hidden ring-2 ring-white/10">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      currentUser.name?.charAt(0).toUpperCase() || <User className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{currentUser.name}</p>
                    <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  </div>
                </div>
              )}

              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(to)
                      ? "bg-sky-500/10 text-white border border-sky-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {label}
                  {isActive(to) && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  )}
                </Link>
              ))}

              {currentUser && (
                <Link
                  to={`/dashboard/${currentUser._id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith("/dashboard")
                      ? "bg-sky-500/10 text-white border border-sky-500/20"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Dashboard
                  {location.pathname.startsWith("/dashboard") && (
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                  )}
                </Link>
              )}

              <div className="border-t border-white/10 pt-3 mt-3 space-y-2">
                {currentUser ? (
                  <>
                    <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start gap-2 bg-white/5 text-gray-200 hover:text-white hover:bg-white/10 border border-white/10"
                      >
                        <User className="w-4 h-4" />
                        Profile
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      onClick={handleLogout}
                      className="w-full justify-start gap-2 bg-transparent text-gray-400 hover:text-white border border-white/10 hover:bg-white/5"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link to="/auth?mode=login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full bg-white/5 text-gray-200 hover:text-white hover:bg-white/10 border border-white/10"
                      >
                        Log In
                      </Button>
                    </Link>
                    <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                      <Button
                        size="sm"
                        className="w-full bg-purple-600 text-white hover:bg-purple-500 border-0"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}