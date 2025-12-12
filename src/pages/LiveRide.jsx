import { motion } from "framer-motion";
import DriverCard from "../components/DriverCard";
import { Share2, BellRing, PhoneCall } from "lucide-react";

const LiveRide = () => {
  const driver = {
    name: "Ravi Sharma",
    rating: 4.86,
    experience: 5,
    vehicle: "Honda Dio · Bike",
    number: "KA 09 AB 1234",
    eta: "4 min",
    distance: "0.9 km away",
    photo: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&h=200&auto=format&fit=crop",
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Live ride</p>
          <h2 className="text-2xl font-bold text-white">Track your captain in real time</h2>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost rounded-2xl px-4 py-2 text-sm">
            <Share2 size={14} />
            Share trip
          </button>
          <button className="btn-primary rounded-2xl px-4 py-2 text-sm">
            <BellRing size={14} />
            SOS
          </button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="relative h-[420px] overflow-hidden rounded-3xl border border-white/5 bg-hero-grid shadow-2xl shadow-black/40">
          <div className="absolute inset-0 map-fallback" />
          <motion.div
            initial={{ x: -40 }}
            animate={{ x: ["-10%", "70%"] }}
            transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
            className="absolute left-10 top-1/3 flex h-10 w-16 items-center justify-center rounded-full bg-white/90 text-slate-900 shadow-xl shadow-primary/30"
          >
            🚗
          </motion.div>
          <div className="absolute left-8 right-8 bottom-6 grid gap-3 rounded-2xl bg-slate-900/80 p-4 text-sm text-slate-200 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">ETA</span>
              <span className="font-semibold text-white">4 min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Distance</span>
              <span className="font-semibold text-white">0.9 km</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              Live updates every 10s
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <DriverCard driver={driver} />
          <div className="card p-4 text-sm text-slate-200">
            <p className="font-semibold text-white">Actions</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button className="btn-ghost rounded-2xl px-4 py-2">
                <PhoneCall size={14} />
                Call captain
              </button>
              <button className="btn-ghost rounded-2xl px-4 py-2">
                <Share2 size={14} />
                Share live
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRide;

