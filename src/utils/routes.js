const routeColors = {
  fastest: "#22c55e",
  balanced: "#3b82f6",
  scenic: "#f59e0b",
};

const randomize = (base, variance) => {
  const delta = (Math.random() - 0.5) * variance;
  return Math.max(0, base + delta);
};

export const generateMockRoutes = (pickup, drop) => {
  const baseDistance = 12;
  return [
    {
      id: "fastest",
      label: "Fastest",
      color: routeColors.fastest,
      distanceKm: randomize(baseDistance, 2),
      durationMin: randomize(26, 5),
      fareMultiplier: 1.1,
    },
    {
      id: "balanced",
      label: "Balanced",
      color: routeColors.balanced,
      distanceKm: randomize(baseDistance + 1.5, 2),
      durationMin: randomize(28, 5),
      fareMultiplier: 1.0,
    },
    {
      id: "scenic",
      label: "Scenic",
      color: routeColors.scenic,
      distanceKm: randomize(baseDistance + 3, 3),
      durationMin: randomize(32, 5),
      fareMultiplier: 0.95,
    },
  ].map((route) => ({
    ...route,
    path: [
      pickup,
      { lat: (pickup.lat + drop.lat) / 2 + Math.random() * 0.1, lng: (pickup.lng + drop.lng) / 2 - Math.random() * 0.1 },
      drop,
    ],
  }));
};

export const routePalette = routeColors;

