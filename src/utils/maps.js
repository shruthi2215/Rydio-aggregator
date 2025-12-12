import { Loader } from "@googlemaps/js-api-loader";

export const loadGoogleMaps = async () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;
  try {
    const loader = new Loader({
      apiKey,
      libraries: ["places", "routes", "geometry"],
      version: "weekly",
    });
    await loader.load();
    return window.google;
  } catch (error) {
    console.warn("Google Maps failed to load, falling back to mock view", error);
    return null;
  }
};

export const formatDistance = (km = 0) => `${km.toFixed(1)} km`;
export const formatDuration = (minutes = 0) => `${Math.round(minutes)} min`;

