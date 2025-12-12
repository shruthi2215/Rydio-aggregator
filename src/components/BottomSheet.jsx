import { AnimatePresence, motion } from "framer-motion";
import { ShieldCheck, CheckCircle2, AlertTriangle } from "lucide-react";
import useRideStore from "../store/useRideStore";
import useUIStore from "../store/useUIStore";
import { formatDistance, formatDuration } from "../utils/maps";

const BottomSheet = () => {
  const checklistItems = ["Helmet / Seatbelt ready", "Share trip with trusted contact", "OTP verification on pickup"];
  const { isSheetOpen, closeSheet, safetyChecklist = [], toggleSafetyItem } = useUIStore();
  const { routes, selectedRouteId, rideType, fareForSelection } = useRideStore();
  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];
  const fare = fareForSelection();
  const allChecked = checklistItems.every((_, idx) => safetyChecklist[idx]);

  return (
    <AnimatePresence>
      {isSheetOpen && (
        <motion.div
          initial={{ y: 420 }}
          animate={{ y: 0 }}
          exit={{ y: 420 }}
          transition={{ type: "spring", stiffness: 180, damping: 22 }}
          className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-b from-slate-900/70 via-slate-950 to-slate-950/95 backdrop-blur-2xl"
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
            <div className="mx-auto h-1 w-14 rounded-full bg-white/20" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{currentRoute.label} route</p>
                <h3 className="text-2xl font-bold text-white">{rideType.label}</h3>
                <p className="text-sm text-slate-300">
                  {formatDistance(currentRoute.distanceKm)} · {formatDuration(currentRoute.durationMin)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Est. total</p>
                <p className="text-3xl font-bold text-white">₹{fare.total}</p>
                <p className="text-xs text-amber-300">Surge applied if demand spikes</p>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              <div className="glass rounded-2xl p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Fare</p>
                <p className="text-lg font-semibold text-white">₹{fare.fare}</p>
                <p className="text-xs text-slate-400">Includes platform charges</p>
              </div>
              <div className="glass rounded-2xl p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Service</p>
                <p className="text-lg font-semibold text-white">₹{fare.serviceFee}</p>
                <p className="text-xs text-slate-400">Taxes & safety fee</p>
              </div>
              <div className="glass rounded-2xl p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">ETA</p>
                <p className="text-lg font-semibold text-white">{formatDuration(currentRoute.durationMin)}</p>
                <p className="text-xs text-slate-400">Live tracking enabled</p>
              </div>
            </div>

            <div className="glass rounded-2xl p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck size={16} />
                Safety checklist
              </div>
              <div className="mt-3 grid gap-2 text-sm text-slate-200 md:grid-cols-3">
                {checklistItems.map((item, idx) => (
                  <label key={item} className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-white/20 bg-slate-800 text-primary focus:ring-primary"
                      checked={!!safetyChecklist[idx]}
                      onChange={(e) => toggleSafetyItem(idx, e.target.checked)}
                    />
                    {item}
                  </label>
                ))}
              </div>
              {!allChecked && (
                <p className="mt-2 flex items-center gap-2 text-xs text-amber-300">
                  <AlertTriangle size={14} />
                  Please acknowledge safety before confirming.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <button onClick={closeSheet} className="btn-ghost rounded-2xl px-5 py-3 text-sm">
                Close
              </button>
              <button
                disabled={!allChecked}
                className="btn-primary flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              >
                <CheckCircle2 size={16} />
                Confirm booking
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;

