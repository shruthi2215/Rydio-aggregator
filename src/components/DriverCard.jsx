import { motion } from "framer-motion";
import { Phone, MessageCircle, Shield, Share2, BellRing } from "lucide-react";

const DriverCard = ({ driver }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-3xl p-5 shadow-xl shadow-black/30"
    >
      <div className="flex items-center gap-3">
        <img
          src={driver.photo}
          alt={driver.name}
          className="h-14 w-14 rounded-2xl border border-white/10 object-cover shadow-lg"
        />
        <div>
          <p className="text-sm text-slate-400">Your captain</p>
          <p className="text-lg font-semibold text-white">{driver.name}</p>
          <p className="text-sm text-emerald-300">★ {driver.rating} · {driver.experience} yrs</p>
        </div>
        <span className="ml-auto rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-300">Arriving</span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 rounded-2xl bg-white/5 p-3 text-sm text-slate-200">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Vehicle</p>
          <p className="font-semibold">{driver.vehicle}</p>
          <p className="text-slate-400">{driver.number}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">ETA</p>
          <p className="font-semibold">{driver.eta}</p>
          <p className="text-slate-400">{driver.distance}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <button className="btn-ghost flex items-center justify-center gap-2 rounded-2xl">
          <Phone size={16} />
          Call
        </button>
        <button className="btn-ghost flex items-center justify-center gap-2 rounded-2xl">
          <MessageCircle size={16} />
          Chat
        </button>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
        <button className="btn-ghost flex items-center justify-center gap-2 rounded-2xl">
          <Share2 size={14} />
          Share live
        </button>
        <button className="btn-ghost flex items-center justify-center gap-2 rounded-2xl">
          <Shield size={14} />
          Safety
        </button>
        <button className="btn-primary flex items-center justify-center gap-2 rounded-2xl">
          <BellRing size={14} />
          SOS
        </button>
      </div>
    </motion.div>
  );
};

export default DriverCard;

