import { motion } from "framer-motion";
import { BarChart3, Star, Wallet } from "lucide-react";

const weekData = [
  { day: "Mon", amount: 980 },
  { day: "Tue", amount: 1120 },
  { day: "Wed", amount: 1340 },
  { day: "Thu", amount: 1220 },
  { day: "Fri", amount: 1480 },
  { day: "Sat", amount: 1680 },
  { day: "Sun", amount: 910 },
];

const ratings = [
  { label: "5★", value: 68 },
  { label: "4★", value: 22 },
  { label: "3★", value: 8 },
  { label: "2★", value: 2 },
];

const DriverEarnings = () => {
  const maxAmount = Math.max(...weekData.map((d) => d.amount));

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Driver analytics</p>
          <h2 className="text-2xl font-bold text-white">Earnings & ratings</h2>
        </div>
        <button className="pill bg-primary/15 text-primary">Weekly view</button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 card p-5"
        >
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-cyan-300" />
            <p className="text-sm font-semibold text-white">Weekly earnings</p>
          </div>
          <div className="mt-6 grid grid-cols-7 gap-3">
            {weekData.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-xl bg-primary/20"
                  style={{ height: `${(day.amount / maxAmount) * 180 + 40}px` }}
                >
                  <div className="h-full rounded-xl bg-gradient-to-t from-primary to-cyan-400 shadow-lg shadow-primary/30" />
                </div>
                <p className="text-xs text-slate-300">{day.day}</p>
                <p className="text-xs font-semibold text-white">₹{day.amount}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="card space-y-4 p-5"
        >
          <div className="flex items-center gap-2">
            <Star size={16} className="text-amber-300" />
            <p className="text-sm font-semibold text-white">Ratings</p>
          </div>
          <p className="text-3xl font-bold text-white">4.86</p>
          <div className="space-y-2 text-sm text-slate-200">
            {ratings.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/5">
                  <div className="h-2 rounded-full bg-gradient-to-r from-amber-300 to-orange-400" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <div className="flex items-center gap-2">
            <Wallet size={16} className="text-emerald-300" />
            <p className="text-sm font-semibold text-white">Payout summary</p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-200">
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Daily</p>
              <p className="text-lg font-semibold text-white">₹1,180</p>
              <p className="text-slate-400">Avg earnings</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-3">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Trips</p>
              <p className="text-lg font-semibold text-white">42</p>
              <p className="text-slate-400">This week</p>
            </div>
          </div>
        </div>

        <div className="card p-5 text-sm text-slate-200">
          <p className="text-sm font-semibold text-white">Tips to boost acceptance</p>
          <ul className="mt-3 space-y-2">
            <li className="rounded-2xl bg-white/5 px-3 py-2">Stay online near hotspots for high-value routes.</li>
            <li className="rounded-2xl bg-white/5 px-3 py-2">Respond within 15s to preserve priority rank.</li>
            <li className="rounded-2xl bg-white/5 px-3 py-2">Keep rating above 4.7 to unlock surge priority.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DriverEarnings;

