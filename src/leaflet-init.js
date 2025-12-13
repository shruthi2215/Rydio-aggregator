// Leaflet initialization + single-route with three provider overlays (Uber / Ola / Rapido).
// This module draws a shared path, creates three colored polylines, and exposes UI integration:
// - listens for provider selection events to highlight overlays
// - updates fare/ETA mock data based on route distance
// - map click sets pickup/destination text fields (lat,lng) and fits the route
//
// Drop this file at /src/leaflet-init.js and ensure index.html includes leaflet CSS/JS.
//
// NOTE: This implementation uses mocked route coordinates and mock pricing logic.
// Replace routing + fare calculation with your backend/provider APIs for production.

const UBER_COLOR = '#000000';
const OLA_COLOR = '#E53935';
const RAPIDO_COLOR = '#D4A017';

const providerConfigs = {
  uber: { color: UBER_COLOR, base: 50, per_km: 12, rating: 4.8 },
  ola: { color: OLA_COLOR, base: 40, per_km: 10, rating: 4.6 },
  rapido: { color: RAPIDO_COLOR, base: 20, per_km: 6, rating: 4.4 }
};

function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const toRad = v => v * Math.PI / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function formatPrice(n) { return '₹ ' + Math.round(n); }
function formatETA(mins) { return `${Math.round(mins)}m`; }

(function initMap() {
  // Default route coordinates (mock) - a gentle curved path in Bengaluru for demo.
  let routeCoords = [
    [12.9716, 77.5946],
    [12.9660, 77.6020],
    [12.9580, 77.6100],
    [12.9480, 77.6150],
    [12.9352, 77.6245]
  ];

  // map setup
  const map = L.map('leaflet-map', { zoomControl: true }).setView(routeCoords[0], 13);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
  }).addTo(map);

  // markers for start & end
  let startMarker = L.marker(routeCoords[0], { title: 'Pickup' }).addTo(map);
  let endMarker = L.marker(routeCoords[routeCoords.length - 1], { title: 'Destination' }).addTo(map);

  // Shared base polyline (invisible thin gray to show common path if needed)
  const baseLine = L.polyline(routeCoords, { color: '#9fb5c8', weight: 6, opacity: 0.18 }).addTo(map);

  // Provider polylines (drawn on same coordinates)
  const uberLine = L.polyline(routeCoords, { color: UBER_COLOR, weight: 12, opacity: 0.98, lineCap: 'round' }).addTo(map);
  const olaLine = L.polyline(routeCoords, { color: OLA_COLOR, weight: 10, opacity: 0.6, lineCap: 'round' }).addTo(map);
  const rapidoLine = L.polyline(routeCoords, { color: RAPIDO_COLOR, weight: 10, opacity: 0.6, lineCap: 'round' }).addTo(map);

  const providerLines = { uber: uberLine, ola: olaLine, rapido: rapidoLine };

  // Fit map to route bounds
  map.fitBounds(baseLine.getBounds().pad(0.2));

  // compute route distance (approx)
  function routeDistanceKm(coords) {
    let d = 0;
    for (let i = 1; i < coords.length; i++) {
      d += haversineDistance(coords[i-1], coords[i]);
    }
    return d;
  }

  function computeMockOffers(distanceKm) {
    // For each provider compute price and ETA (mock)
    const offers = {};
    Object.keys(providerConfigs).forEach(k => {
      const cfg = providerConfigs[k];
      const price = cfg.base + cfg.per_km * distanceKm;
      // ETA roughly proportional to distance and a provider speed factor
      const speedFactor = (k === 'rapido') ? 1.1 : (k === 'uber') ? 0.95 : 1.0;
      const etaMins = Math.max(6, distanceKm / 0.7 * speedFactor); // 0.7 km/min ~ 42 km/h average in-city
      offers[k] = {
        price: Math.round(price),
        eta: Math.round(etaMins),
        rating: cfg.rating
      };
    });
    return offers;
  }

  function updateUIForOffers(offers) {
    // Update left panel chips and provider meta
    const prices = Object.values(offers).map(o => o.price);
    const minP = Math.min(...prices), maxP = Math.max(...prices);
    document.getElementById('price-chip').innerText = `Price: ₹ ${minP} — ₹ ${maxP}`;

    // driver avg
    const avgRating = (offers.uber.rating + offers.ola.rating + offers.rapido.rating) / 3;
    document.getElementById('driver-chip').innerText = `Driver avg: ${avgRating.toFixed(1)}★`;

    // ETA: show best ETA
    const etas = Object.values(offers).map(o => o.eta);
    const bestETA = Math.min(...etas);
    document.getElementById('eta-chip').innerText = `ETA: ${bestETA}m`;
    document.getElementById('trip-time').innerText = `Est. ${bestETA}–${bestETA + 6} min`;

    // provider list
    document.getElementById('uber-meta').innerText = `Price ₹ ${offers.uber.price} • ETA ${offers.uber.eta}m`;
    document.getElementById('ola-meta').innerText = `Price ₹ ${offers.ola.price} • ETA ${offers.ola.eta}m`;
    document.getElementById('rapido-meta').innerText = `Price ₹ ${offers.rapido.price} • ETA ${offers.rapido.eta}m`;

    document.getElementById('uber-rating').innerText = `• ${offers.uber.rating}★`;
    document.getElementById('ola-rating').innerText = `• ${offers.ola.rating}★`;
    document.getElementById('rapido-rating').innerText = `• ${offers.rapido.rating}★`;
  }

  // highlight logic: increases weight & opacity of selected provider, dims others
  function highlightProvider(provider) {
    Object.keys(providerLines).forEach(p => {
      const line = providerLines[p];
      if (!line) return;
      if (p === provider) {
        line.setStyle({ weight: 18, opacity: 1.0 });
        line.bringToFront();
      } else {
        line.setStyle({ weight: 8, opacity: 0.22 });
      }
    });

    // reflect selection in left panel buttons' aria-pressed
    document.querySelectorAll('.service-btn[data-provider]').forEach(btn => {
      btn.setAttribute('aria-pressed', btn.dataset.provider === provider ? 'true' : 'false');
    });
  }

  // initial offers
  const distanceKm = routeDistanceKm(routeCoords);
  const offers = computeMockOffers(distanceKm);
  updateUIForOffers(offers);
  highlightProvider('uber');

  // event: UI selects provider -> we highlight on map
  window.addEventListener('rydio:select-provider', (ev) => {
    const provider = ev.detail && ev.detail.provider;
    if (provider && providerLines[provider]) {
      highlightProvider(provider);
      // optional: center the map on the route and show popup for provider
      providerLines[provider].openPopup?.();
    }
  });

  // clicking on a provider item in the providers list scrolls / highlights
  document.querySelectorAll('[data-provider]').forEach(el => {
    el.addEventListener('click', () => {
      const provider = el.dataset.provider;
      if (provider && providerLines[provider]) highlightProvider(provider);
    });
  });

  // map click: toggle setting pickup / destination points (simple UX)
  let clickCount = 0;
  map.on('click', (e) => {
    clickCount++;
    const latlng = e.latlng;
    if (clickCount % 2 === 1) {
      // set pickup
      startMarker.setLatLng(latlng);
      document.getElementById('from').value = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;
    } else {
      // set destination
      endMarker.setLatLng(latlng);
      document.getElementById('to').value = `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;

      // For demo: create a new simple straight route between start and end with 5 interpolated points
      const s = startMarker.getLatLng();
      const t = endMarker.getLatLng();
      const interpolated = [];
      const steps = 6;
      for (let i = 0; i <= steps; i++) {
        interpolated.push([ s.lat + (t.lat - s.lat) * (i/steps), s.lng + (t.lng - s.lng) * (i/steps) ]);
      }

      // update polylines
      baseLine.setLatLngs(interpolated);
      Object.values(providerLines).forEach(line => line.setLatLngs(interpolated));

      // recompute offers & UI
      const dkm = routeDistanceKm(interpolated);
      const newOffers = computeMockOffers(dkm);
      updateUIForOffers(newOffers);

      // fit to bounds
      map.fitBounds(L.polyline(interpolated).getBounds().pad(0.2));
    }
  });

  // provider booking buttons (left panel) - emit a map-centered highlight before booking
  document.querySelectorAll('.provider-book').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const provider = btn.dataset.provider;
      highlightProvider(provider);
      alert(`Mock booking started for ${provider}. This is a placeholder — integrate authentication, provider-backend, and payment flow.`);
    });
  });

  // Quick selection buttons (choose-uber/ola/rapido)
  ['select-uber', 'select-ola', 'select-rapido'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        const provider = el.dataset.provider;
        highlightProvider(provider);
      });
    }
  });

  // "Confirm & Pay" just demonstrates where you'd call payment flow
  const confirmBtn = document.getElementById('confirm');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      alert('Proceed to payment — implement UPI / Razorpay / Gateway here and confirm booking on success.');
    });
  }

  // Expose for debugging
  window._rydio = {
    map, routeCoords, providerLines, highlightProvider, computeMockOffers
  };
})();
