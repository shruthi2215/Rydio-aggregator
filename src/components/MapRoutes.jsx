import { useMemo } from "react";
import { GoogleMap, Polyline, Marker, useJsApiLoader } from "@react-google-maps/api";
import { motion } from "framer-motion";
import { formatDistance, formatDuration } from "../utils/maps";

const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "24px",
};

const MapRoutes = ({ routes, selectedRouteId, onRouteSelect, pickup, drop }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey || "",
    libraries: ["places", "routes", "geometry"],
  });

  const center = useMemo(() => {
    if (!pickup || !drop) return { lat: 12.9716, lng: 77.5946 };
    return {
      lat: (pickup.coords.lat + drop.coords.lat) / 2,
      lng: (pickup.coords.lng + drop.coords.lng) / 2,
    };
  }, [pickup, drop]);

  const fallback = (
    <div className="map-fallback relative h-[360px] w-full overflow-hidden rounded-3xl border border-white/5 shadow-2xl shadow-black/30">
      <div className="absolute inset-0 grid-hero opacity-50" aria-hidden />
      <div className="absolute inset-0">
        {routes.map((route, idx) => (
          <motion.div
            key={route.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`absolute left-10 right-10 h-1.5 rounded-full`}
            style={{
              top: `${35 + idx * 18}%`,
              background: route.color,
              boxShadow: "0 0 24px rgba(255,255,255,0.08)",
              opacity: selectedRouteId === route.id ? 1 : 0.45,
            }}
            onClick={() => onRouteSelect(route.id)}
          />
        ))}
      </div>
      <div className="absolute left-6 right-6 bottom-4 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-slate-900/80 p-3 text-xs text-slate-200 shadow-inner shadow-black/50 backdrop-blur-xl">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => onRouteSelect(route.id)}
            className={`flex flex-1 items-center justify-between rounded-xl px-3 py-2 text-left transition ${
              selectedRouteId === route.id ? "bg-white/10 text-white" : "bg-white/5 text-slate-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-6 rounded-full" style={{ background: route.color }} />
              {route.label}
            </span>
            <span className="text-xs text-slate-300">
              {formatDistance(route.distanceKm)} · {formatDuration(route.durationMin)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  if (!isLoaded) return fallback;

  return (
    <div className="relative h-[380px] overflow-hidden rounded-3xl border border-white/5 shadow-2xl shadow-black/30">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={13} options={{ styles: [], disableDefaultUI: true }}>
        {routes.map((route) => (
          <Polyline
            key={route.id}
            path={route.path.map((p) => ({ lat: p.lat, lng: p.lng }))}
            options={{
              strokeColor: route.color,
              strokeOpacity: selectedRouteId === route.id ? 0.9 : 0.45,
              strokeWeight: selectedRouteId === route.id ? 6 : 4,
              clickable: true,
            }}
            onClick={() => onRouteSelect(route.id)}
          />
        ))}
        {pickup?.coords && <Marker position={pickup.coords} label="P" />}
        {drop?.coords && <Marker position={drop.coords} label="D" />}
      </GoogleMap>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" aria-hidden />
      <div className="absolute left-4 right-4 bottom-4 flex flex-wrap gap-3 rounded-2xl border border-white/10 bg-slate-900/85 p-3 text-xs text-slate-200 shadow-inner shadow-black/50 backdrop-blur-xl">
        {routes.map((route) => (
          <button
            key={route.id}
            onClick={() => onRouteSelect(route.id)}
            className={`flex flex-1 items-center justify-between rounded-xl px-3 py-2 text-left transition ${
              selectedRouteId === route.id ? "bg-white/10 text-white" : "bg-white/5 text-slate-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <span className="h-2 w-6 rounded-full" style={{ background: route.color }} />
              {route.label}
            </span>
            <span className="text-xs text-slate-300">
              {formatDistance(route.distanceKm)} · {formatDuration(route.durationMin)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapRoutes;

