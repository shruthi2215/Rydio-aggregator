import { motion } from "framer-motion";
import { CreditCard, Clock3, MapPin, Gift } from "lucide-react";

const DashboardCards = ({ recentRides, savedLocations, paymentMethods, referrals }) => {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4"
      >
        <div className="flex items-center gap-2">
          <Clock3 size={16} className="text-primary" />
          <p className="text-sm font-semibold text-white">Ride history</p>
        </div>
        <div className="mt-3 space-y-3 text-sm text-slate-200">
          {recentRides.length === 0 && <p className="text-slate-500">No rides yet. Book your first ride.</p>}
          {recentRides.map((ride) => (
            <div key={ride.id} className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
              <div>
                <p className="font-semibold">{ride.route}</p>
                <p className="text-xs text-slate-400">{ride.type} · {ride.time}</p>
              </div>
              <p className="font-semibold text-white">₹{ride.total}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4"
      >
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-cyan-400" />
          <p className="text-sm font-semibold text-white">Saved places</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {savedLocations.map((place) => (
            <span key={place} className="pill">{place}</span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4"
      >
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-emerald-400" />
          <p className="text-sm font-semibold text-white">Payments</p>
        </div>
        <div className="mt-3 grid gap-2 text-sm text-slate-200">
          {paymentMethods.map((method) => (
            <div key={method.brand} className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
              <div>
                <p className="font-semibold">{method.brand}</p>
                <p className="text-xs text-slate-400">{method.last4}</p>
              </div>
              {method.primary && <span className="pill bg-emerald-500/15 text-emerald-200">Primary</span>}
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-4"
      >
        <div className="flex items-center gap-2">
          <Gift size={16} className="text-amber-400" />
          <p className="text-sm font-semibold text-white">Referrals</p>
        </div>
        <div className="mt-3 grid gap-2 text-sm text-slate-200">
          {referrals.map((ref) => (
            <div key={ref.code} className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
              <div>
                <p className="font-semibold">{ref.code}</p>
                <p className="text-xs text-slate-400">Reward {ref.reward}</p>
              </div>
              <span className="pill">{ref.status}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCards;

