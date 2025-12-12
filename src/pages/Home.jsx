import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, RouteIcon, Smartphone, Car, MapPinned } from "lucide-react";

const featureCards = [
  {
    title: "3 routes, color-coded",
    desc: "Fastest (green), balanced (blue), scenic (amber) with live ETA, fare, and surge.",
    icon: <RouteIcon size={18} />,
  },
  {
    title: "Glassmorphic UI",
    desc: "Soft shadows, rounded cards, and frosted panels inspired by 2025 mobility apps.",
    icon: <Sparkles size={18} />,
  },
  {
    title: "Safety-first",
    desc: "OTP on pickup, SOS, trip share, and pre-ride safety checklist baked in.",
    icon: <ShieldCheck size={18} />,
  },
];

const howItWorks = [
  { title: "Set pickup & drop", desc: "Autocomplete + drag pins; quick presets Home / Work / Airport." },
  { title: "Pick route + ride", desc: "Compare ETA, fare, surge. Horizontal cards for Bike, Auto, Mini, Sedan." },
  { title: "Track live", desc: "Animated vehicle, driver card, call/chat, SOS, share trip." },
];

const Home = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-16">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-primary">
            <Sparkles size={14} /> 2025 Launch UI
          </p>
          <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
            Compare · Choose · Go — Rydio brings every ride option to one clean map.
          </h1>
          <p className="text-lg text-slate-300">
            Inspired by Uber, Rapido, InDrive, and Bolt. Built for instant booking, safety-first flows, and futuristic motion design.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/book" className="btn-primary rounded-2xl px-5 py-3 text-sm">
              Start booking
            </Link>
            <Link to="/driver" className="btn-ghost rounded-2xl px-5 py-3 text-sm">
              Driver mode
            </Link>
          </div>
          <div className="flex gap-2 text-sm text-slate-300">
            <span className="pill">Glassmorphism</span>
            <span className="pill">Neumorphism</span>
            <span className="pill">Framer Motion</span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-2xl shadow-black/40 backdrop-blur-2xl"
        >
          <div className="absolute -left-6 -top-6 h-24 w-24 rounded-3xl bg-primary/30 blur-3xl" aria-hidden />
          <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-cyan-400/20 blur-3xl" aria-hidden />
          <div className="relative grid gap-3">
            <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Live map preview</p>
              <p className="text-lg font-semibold text-white">3 routes overlay</p>
              <div className="mt-4 h-56 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-3">
                <div className="h-full w-full rounded-2xl border border-white/5 bg-hero-grid">
                  <div className="relative h-full w-full">
                    <div className="absolute inset-8 rounded-xl border border-white/10 bg-slate-900/70 backdrop-blur-xl" />
                    <div className="absolute left-10 right-10 top-1/3 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.6)]" />
                    <div className="absolute left-10 right-10 top-1/2 h-1.5 rounded-full bg-blue-400/80 shadow-[0_0_30px_rgba(59,130,246,0.6)]" />
                    <div className="absolute left-10 right-10 top-2/3 h-1.5 rounded-full bg-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.6)]" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs text-slate-200">
              <div className="glass rounded-2xl p-3">
                <p className="text-slate-400">Fastest</p>
                <p className="text-lg font-semibold text-white">27 min</p>
                <p className="text-emerald-300">Green</p>
              </div>
              <div className="glass rounded-2xl p-3">
                <p className="text-slate-400">Balanced</p>
                <p className="text-lg font-semibold text-white">29 min</p>
                <p className="text-blue-300">Blue</p>
              </div>
              <div className="glass rounded-2xl p-3">
                <p className="text-slate-400">Scenic</p>
                <p className="text-lg font-semibold text-white">33 min</p>
                <p className="text-amber-300">Amber</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {featureCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            viewport={{ once: true }}
            className="card flex flex-col gap-3 p-5"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary">{card.icon}</div>
            <h3 className="text-lg font-semibold text-white">{card.title}</h3>
            <p className="text-sm text-slate-300">{card.desc}</p>
          </motion.div>
        ))}
      </section>

      <section className="rounded-3xl border border-white/5 bg-slate-900/60 p-6 shadow-xl shadow-black/30 backdrop-blur-2xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">How it works</p>
            <h3 className="text-2xl font-bold text-white">3-step booking flow</h3>
          </div>
          <div className="flex gap-2 text-sm text-slate-300">
            <span className="pill">Autocomplete</span>
            <span className="pill">Route picker</span>
            <span className="pill">Safety check</span>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {howItWorks.map((step, idx) => (
            <div key={step.title} className="glass rounded-2xl p-4">
              <p className="text-xs text-slate-400">Step {idx + 1}</p>
              <p className="text-lg font-semibold text-white">{step.title}</p>
              <p className="text-sm text-slate-300">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400" />
            <p className="text-sm font-semibold text-white">Safety commitment</p>
          </div>
          <p className="mt-3 text-sm text-slate-300">
            SOS button, encrypted calls, verified drivers, and pre-ride checklist. Share live location in one tap.
          </p>
          <div className="mt-4 space-y-2 text-sm text-slate-200">
            <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
              <MapPinned size={14} />
              Live location sharing
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
              <ShieldCheck size={14} />
              Driver KYC + rating guardrails
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-3 py-2">
              <Car size={14} />
              OTP on pickup, surge warning, driver arrival card
            </div>
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center gap-2">
            <Smartphone size={16} className="text-cyan-300" />
            <p className="text-sm font-semibold text-white">Download app CTA</p>
          </div>
          <p className="mt-3 text-sm text-slate-300">Scan to continue booking on mobile and get referral credits.</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <div className="h-28 w-28 rounded-2xl border border-dashed border-white/10 bg-white/5" />
            <div className="space-y-2 text-sm text-slate-200">
              <p className="font-semibold text-white">Rydio Mobile</p>
              <p>iOS & Android · Instant logins · Wallet/UPI</p>
              <div className="flex gap-2">
                <span className="pill">App Store</span>
                <span className="pill">Play Store</span>
              </div>
            </div>
          </div>
          <Link to="/book" className="btn-primary mt-4 inline-flex rounded-2xl px-4 py-2 text-sm">
            Continue in web
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

