import { motion } from "framer-motion";
import { useMemo } from "react";
import { rideTypes, estimateFare } from "../utils/fare";
import useRideStore from "../store/useRideStore";

const RideOptions = () => {
  const { selectedRouteId, routes, rideType, setRideTypeById, surge } = useRideStore();

  const fares = useMemo(() => {
    const route = routes.find((r) => r.id === selectedRouteId) || routes[0];
    return rideTypes.map((type) => ({
      ...type,
      ...estimateFare(route.distanceKm, type, surge),
      duration: route.durationMin,
    }));
  }, [routes, selectedRouteId, surge]);

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {fares.map((option, idx) => (
        <motion.button
          key={option.id}
          whileHover={{ y: -6 }}
          whileTap={{ scale: 0.98 }}
          transition={{ delay: idx * 0.03 }}
          className={`gradient-border relative min-w-[200px] flex-1 rounded-3xl p-[1px] ${
            rideType.id === option.id ? "opacity-100" : "opacity-80"
          }`}
          onClick={() => setRideTypeById(option.id)}
        >
          <div className="glass h-full rounded-3xl p-4 text-left">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">{option.label}</p>
              <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
                {option.availability}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-white">₹{option.total}</p>
            <p className="text-sm text-slate-400">
              ETA {option.eta} · {Math.round(option.duration)} min route
            </p>
            <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
              <span>Base ₹{option.base}</span>
              <span>Per km ₹{option.perKm}</span>
              <span>Surge x{surge.toFixed(1)}</span>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default RideOptions;

