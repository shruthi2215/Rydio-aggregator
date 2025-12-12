export const rideTypes = [
  {
    id: "bike",
    label: "Bike",
    base: 12,
    perKm: 6,
    eta: "4-6 min",
    availability: "High",
    accent: "from-cyan-400/80 to-emerald-400/70",
    icon: "bike",
  },
  {
    id: "auto",
    label: "Auto",
    base: 18,
    perKm: 9,
    eta: "6-8 min",
    availability: "High",
    accent: "from-primary/80 to-cyan-400/70",
    icon: "car",
  },
  {
    id: "mini",
    label: "Mini",
    base: 25,
    perKm: 12,
    eta: "8-10 min",
    availability: "Medium",
    accent: "from-amber-400/80 to-orange-400/70",
    icon: "car-front",
  },
  {
    id: "sedan",
    label: "Sedan",
    base: 35,
    perKm: 16,
    eta: "10-14 min",
    availability: "Medium",
    accent: "from-purple-500/80 to-indigo-500/80",
    icon: "car-taxi-front",
  },
];

export const estimateFare = (distanceKm = 10, rideType = rideTypes[1], surge = 1) => {
  const base = rideType.base || 20;
  const perKm = rideType.perKm || 10;
  const fare = (base + perKm * distanceKm) * surge;
  const serviceFee = fare * 0.08;
  return {
    fare: Math.round((fare + Number.EPSILON) * 10) / 10,
    serviceFee: Math.round((serviceFee + Number.EPSILON) * 10) / 10,
    total: Math.round((fare + serviceFee + Number.EPSILON) * 10) / 10,
  };
};

