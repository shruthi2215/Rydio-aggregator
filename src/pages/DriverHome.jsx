import { motion } from "framer-motion";
import { ToggleLeft, ToggleRight, Navigation, Phone } from "lucide-react";

const requests = [
  { id: 1, platform: "Uber", pickup: "MG Road", distance: "1.2 km", earnings: "₹210", eta: "5 min" },
  { id: 2, platform: "Bolt", pickup: "Tech Park", distance: "2.0 km", earnings: "₹260", eta: "6 min" },
  { id: 3, platform: "InDrive", pickup: "City Mall", distance: "1.5 km", earnings: "₹190", eta: "4 min" },
];

const DriverHome = () => {
  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Driver hub</p>
          <h2 className="text-2xl font-bold text-white">Stay online, accept smarter</h2>
        </div>
        <button className="pill bg-emerald-500/15 text-emerald-200">
          <ToggleRight size={14} />
          Online
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {requests.map((req, idx) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
              className="card flex flex-col gap-3 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-white">{req.platform} request</p>
                <span className="pill">{req.eta} ETA</span>
              </div>
              <p className="text-lg font-semibold text-white">Pickup: {req.pickup}</p>
              <p className="text-sm text-slate-300">Distance to user: {req.distance}</p>
              <div className="flex flex-wrap gap-2">
                <span className="pill bg-emerald-500/10 text-emerald-200">Earnings {req.earnings}</span>
                <span className="pill bg-white/5 text-slate-200">Auto-accept window 20s</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="btn-ghost rounded-2xl px-4 py-2 text-sm">Reject</button>
                <button className="btn-primary rounded-2xl px-4 py-2 text-sm">Accept ride</button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="card p-4">
            <div className="flex items-center gap-2">
              <ToggleLeft size={16} className="text-amber-300" />
              <p className="text-sm font-semibold text-white">Status</p>
            </div>
            <p className="mt-2 text-sm text-slate-300">Switch online/offline with a neumorphic toggle.</p>
            <div className="mt-4 rounded-2xl bg-white/5 p-4 text-sm text-slate-200">
              <p>Navigation preview + OTP + call user after accepting.</p>
              <div className="mt-3 flex items-center gap-2">
                <Navigation size={14} />
                Turn-by-turn starts automatically after accept.
              </div>
            </div>
          </div>

          <div className="card p-4">
            <div className="flex items-center gap-2">
              <Phone size={16} className="text-cyan-300" />
              <p className="text-sm font-semibold text-white">Call user</p>
            </div>
            <p className="mt-2 text-sm text-slate-300">
              Masked calls, quick replies, and arrival button built-in for driver UX.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverHome;

