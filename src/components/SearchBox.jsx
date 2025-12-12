import { useState } from "react";
import { MapPin, Navigation2, LocateFixed } from "lucide-react";
import { motion } from "framer-motion";
import useRideStore from "../store/useRideStore";

const presetPlaces = [
  { label: "Home", coords: { lat: 12.9716, lng: 77.5946 } },
  { label: "Work", coords: { lat: 12.9352, lng: 77.6245 } },
  { label: "Airport", coords: { lat: 12.944, lng: 77.669 } },
];

const SearchBox = () => {
  const { pickup, drop, setPickup, setDrop } = useRideStore();
  const [pickupInput, setPickupInput] = useState(pickup.label);
  const [dropInput, setDropInput] = useState(drop.label);

  const updatePlace = (type, value) => {
    const place = {
      label: value,
      placeId: value.toLowerCase().replace(/\s/g, "-"),
      coords: presetPlaces.find((p) => p.label === value)?.coords || { lat: 12.97, lng: 77.59 },
    };
    if (type === "pickup") setPickup(place);
    else setDrop(place);
  };

  return (
    <div className="grid gap-3 rounded-3xl border border-white/5 bg-slate-900/60 p-4 shadow-xl shadow-black/30 backdrop-blur-xl lg:grid-cols-[2fr_2fr_auto]">
      <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <LocateFixed size={18} />
        </span>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Pickup</p>
          <input
            value={pickupInput}
            onChange={(e) => {
              setPickupInput(e.target.value);
              updatePlace("pickup", e.target.value);
            }}
            placeholder="Enter pickup or drop a pin"
            className="w-full bg-transparent text-base font-semibold text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
          <Navigation2 size={18} />
        </span>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Drop</p>
          <input
            value={dropInput}
            onChange={(e) => {
              setDropInput(e.target.value);
              updatePlace("drop", e.target.value);
            }}
            placeholder="Where to?"
            className="w-full bg-transparent text-base font-semibold text-white placeholder:text-slate-500 focus:outline-none"
          />
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        className="neumorphic flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-semibold text-white shadow-primary/40"
        onClick={() => {
          updatePlace("pickup", pickupInput);
          updatePlace("drop", dropInput);
        }}
      >
        Find routes
      </motion.button>

      <div className="col-span-full flex flex-wrap gap-2">
        {presetPlaces.map((place) => (
          <motion.button
            key={place.label}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-200"
            onClick={() => {
              setPickup(place);
              setDrop(presetPlaces[2]); // Airport
              setPickupInput(place.label);
              setDropInput(presetPlaces[2].label);
            }}
          >
            <MapPin size={14} />
            {place.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SearchBox;

