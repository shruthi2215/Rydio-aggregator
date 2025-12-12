import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, PhoneCall, Menu, X } from "lucide-react";
import useUIStore from "../store/useUIStore";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/book", label: "Book Ride" },
  { to: "/live", label: "Live Ride" },
  { to: "/driver", label: "Driver" },
  { to: "/driver/earnings", label: "Earnings" },
];

const Navbar = () => {
  const { theme, toggleTheme } = useUIStore();
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-slate-900/70 px-4 py-3 shadow-lg shadow-black/40 backdrop-blur-2xl md:px-6">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-inner shadow-primary/40">
            🚗
          </span>
          <div className="leading-none">
            <p>RYDIO</p>
            <span className="text-xs text-slate-400">Ride aggregator</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-semibold text-slate-200 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 transition ${
                  isActive ? "bg-white/10 text-white shadow-lg shadow-primary/30" : "hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white shadow-inner shadow-black/50 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-primary/30"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link
            to="/book"
            className="hidden items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/40 transition hover:-translate-y-0.5 hover:bg-primary/90 md:flex"
          >
            <PhoneCall size={16} />
            Book now
          </Link>
          <button
            onClick={() => setOpen((p) => !p)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white shadow-inner shadow-black/50 transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-primary/30 md:hidden"
            aria-label="Toggle navigation"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mx-auto mt-3 flex max-w-6xl flex-col gap-2 rounded-3xl border border-white/10 bg-slate-900/90 px-4 py-4 shadow-2xl shadow-black/40 backdrop-blur-2xl md:hidden"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={`rounded-2xl px-3 py-3 text-sm font-semibold ${
                  location.pathname === item.to ? "bg-white/10 text-white" : "text-slate-200 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30"
            >
              <PhoneCall size={16} />
              Book a ride
            </Link>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;

