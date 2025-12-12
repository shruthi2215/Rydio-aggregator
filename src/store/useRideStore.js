import { create } from "zustand";
import { estimateFare, rideTypes } from "../utils/fare";
import { generateMockRoutes } from "../utils/routes";

const initialPickup = { label: "Home", placeId: "home", coords: { lat: 12.9716, lng: 77.5946 } };
const initialDrop = { label: "Airport T3", placeId: "airport", coords: { lat: 12.944, lng: 77.669 } };

const useRideStore = create((set, get) => ({
  pickup: initialPickup,
  drop: initialDrop,
  suggestedPlaces: ["Home", "Work", "Airport", "Tech Park", "Mall"],
  rideType: rideTypes[1], // Auto default
  routes: generateMockRoutes(initialPickup.coords, initialDrop.coords),
  selectedRouteId: "fastest",
  surge: 1.0,
  recentRides: [],
  savedLocations: ["Home", "Work", "Airport"],
  paymentMethods: [
    { brand: "UPI", last4: "gpay", primary: true },
    { brand: "Visa", last4: "4321", primary: false },
  ],
  referrals: [
    { code: "RIDEO2025", reward: "₹150", status: "Active" },
    { code: "BLUEWAVE", reward: "₹100", status: "Used" },
  ],
  setPickup: (place) =>
    set((state) => ({
      pickup: place,
      routes: generateMockRoutes(place.coords, state.drop.coords),
    })),
  setDrop: (place) =>
    set((state) => ({
      drop: place,
      routes: generateMockRoutes(state.pickup.coords, place.coords),
    })),
  setRideTypeById: (id) => {
    const next = rideTypes.find((r) => r.id === id) || rideTypes[0];
    set({ rideType: next });
  },
  selectRoute: (id) => set({ selectedRouteId: id }),
  setSurge: (value) => set({ surge: value }),
  addRecentRide: (ride) =>
    set((state) => ({
      recentRides: [ride, ...state.recentRides].slice(0, 6),
    })),
  fareForSelection: () => {
    const { routes, selectedRouteId, rideType, surge } = get();
    const route = routes.find((r) => r.id === selectedRouteId) || routes[0];
    return estimateFare(route.distanceKm, rideType, surge);
  },
}));

export default useRideStore;

