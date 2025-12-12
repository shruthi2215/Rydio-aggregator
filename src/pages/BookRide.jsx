import { motion } from "framer-motion";
import SearchBox from "../components/SearchBox";
import MapRoutes from "../components/MapRoutes";
import RideOptions from "../components/RideOptions";
import BottomSheet from "../components/BottomSheet";
import useRideStore from "../store/useRideStore";
import useUIStore from "../store/useUIStore";
import { Shield, AlertTriangle, Navigation } from "lucide-react";
import { formatDistance, formatDuration } from "../utils/maps";

const BookRide = () => {
  const { routes, selectedRouteId, selectRoute, pickup, drop, rideType, setSurge } = useRideStore();
  const { openSheet } = useUIStore();
  const currentRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Booking flow</p>
          <h2 className="text-2xl font-bold text-white">Choose route · Pick ride · Confirm</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setSurge(1)} className="pill bg-white/10">
            Normal
          </button>
          <button onClick={() => setSurge(1.3)} className="pill bg-amber-500/15 text-amber-200">
            Surge x1.3
          </button>
        </div>
      </div>

      <SearchBox />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <MapRoutes
            routes={routes}
            selectedRouteId={selectedRouteId}
            onRouteSelect={selectRoute}
            pickup={pickup}
            drop={drop}
          />
          <RideOptions />
        </div>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-4"
          >
            <div className="flex items-center gap-2">
              <Navigation size={16} className="text-cyan-300" />
              <p className="text-sm font-semibold text-white">Selected</p>
            </div>
            <p className="mt-2 text-lg font-semibold text-white">{rideType.label}</p>
            <p className="text-sm text-slate-300">
              {formatDistance(currentRoute.distanceKm)} · {formatDuration(currentRoute.durationMin)}
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-200">
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                <span>Pickup</span>
                <span className="text-slate-300">{pickup.label}</span>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-white/5 px-3 py-2">
                <span>Drop</span>
                <span className="text-slate-300">{drop.label}</span>
              </div>
            </div>
            <button onClick={openSheet} className="btn-primary mt-4 w-full rounded-2xl px-4 py-3 text-sm">
              Continue to confirm
            </button>
          </motion.div>

          <div className="card space-y-3 p-4 text-sm text-slate-200">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-emerald-300" />
              Safety checklist
            </div>
            <p>Verify OTP on pickup, share trip link, wear helmet/seatbelt, and keep SOS handy.</p>
            <div className="flex items-center gap-2 rounded-2xl bg-amber-500/10 px-3 py-2 text-amber-200">
              <AlertTriangle size={14} />
              Surge may apply during peak hours.
            </div>
          </div>
        </div>
      </div>

      <BottomSheet />
    </div>
  );
};

export default BookRide;

