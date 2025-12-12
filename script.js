// ============================================
// RYDIO - State Management & Map Integration
// ============================================

// State object
const appState = {
  selectedProvider: null,
  selectedVehicle: 'auto',
  userAuth: null,
  captainAuth: null,
  pickupLocation: 'MG Road',
  destination: 'Airport T3',
  darkTheme: false,
  wireframe: false,
  etaCountdown: null,
  mapInstances: {},
  directionsServices: {},
  directionsRenderers: {}
};

// ============================================
// LocalStorage Persistence
// ============================================

const Storage = {
  save() {
    const stateToSave = {
      selectedProvider: appState.selectedProvider,
      selectedVehicle: appState.selectedVehicle,
      userAuth: appState.userAuth,
      captainAuth: appState.captainAuth,
      pickupLocation: appState.pickupLocation,
      destination: appState.destination,
      darkTheme: appState.darkTheme,
      wireframe: appState.wireframe
    };
    localStorage.setItem('rydio_state', JSON.stringify(stateToSave));
  },

  load() {
    const saved = localStorage.getItem('rydio_state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        Object.assign(appState, state);
        return true;
      } catch (e) {
        console.error('Failed to load state:', e);
      }
    }
    return false;
  },

  clear() {
    localStorage.removeItem('rydio_state');
  }
};

// ============================================
// Google Maps SDK Integration
// ============================================

const MapService = {
  apiKey: 'YOUR_API_KEY', // Replace with your Google Maps API key
  isLoaded: false,

  init() {
    if (typeof google !== 'undefined' && google.maps) {
      this.isLoaded = true;
      this.initializeMaps();
      return true;
    }
    return false;
  },

  initializeMaps() {
    // Initialize booking map
    const bookingMapEl = document.getElementById('bookingMapContainer');
    if (bookingMapEl && !appState.mapInstances.booking) {
      appState.mapInstances.booking = new google.maps.Map(bookingMapEl, {
        zoom: 13,
        center: { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
        mapTypeId: 'roadmap',
        disableDefaultUI: true,
        zoomControl: true,
        styles: this.getMapStyles()
      });
      appState.directionsServices.booking = new google.maps.DirectionsService();
      appState.directionsRenderers.booking = new google.maps.DirectionsRenderer({
        map: appState.mapInstances.booking,
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#0F0F0F',
          strokeWeight: 6
        }
      });
    }

    // Initialize tracking map
    const trackingMapEl = document.getElementById('trackingMapContainer');
    if (trackingMapEl && !appState.mapInstances.tracking) {
      appState.mapInstances.tracking = new google.maps.Map(trackingMapEl, {
        zoom: 14,
        center: { lat: 12.9716, lng: 77.5946 },
        mapTypeId: 'roadmap',
        disableDefaultUI: true,
        zoomControl: true,
        styles: this.getMapStyles()
      });
    }
  },

  getMapStyles() {
    return [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ];
  },

  async fetchETAs(pickup, destination) {
    if (!this.isLoaded) {
      // Fallback to mock data
      return this.getMockETAs();
    }

    try {
      const service = appState.directionsServices.booking;
      if (!service) return this.getMockETAs();

      const request = {
        origin: pickup,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING
      };

      return new Promise((resolve) => {
        service.route(request, (result, status) => {
          if (status === 'OK' && result) {
            const route = result.routes[0];
            const leg = route.legs[0];
            const baseDuration = leg.duration.value; // seconds
            const baseDistance = leg.distance.value; // meters

            // Simulate different providers with variations
            const providers = [
              {
                name: 'Uber',
                color: '#0F0F0F',
                duration: baseDuration + Math.floor(Math.random() * 60),
                price: (baseDistance / 1000 * 1.2).toFixed(2)
              },
              {
                name: 'Ola',
                color: '#38A169',
                duration: baseDuration + Math.floor(Math.random() * 120),
                price: (baseDistance / 1000 * 1.1).toFixed(2)
              },
              {
                name: 'Rapido',
                color: '#F4B400',
                duration: baseDuration + Math.floor(Math.random() * 180),
                price: (baseDistance / 1000 * 0.9).toFixed(2)
              }
            ];

            resolve(providers);
          } else {
            resolve(this.getMockETAs());
          }
        });
      });
    } catch (e) {
      console.error('Error fetching ETAs:', e);
      return this.getMockETAs();
    }
  },

  getMockETAs() {
    return [
      { name: 'Uber', color: '#0F0F0F', duration: 360, price: '9.20' },
      { name: 'Ola', color: '#38A169', duration: 420, price: '8.70' },
      { name: 'Rapido', color: '#F4B400', duration: 540, price: '6.40' }
    ];
  },

  updateRoutes(providers) {
    const routes = document.querySelectorAll('.route');
    providers.forEach((provider, index) => {
      const route = routes[index];
      if (route) {
        route.dataset.provider = provider.name;
        route.dataset.price = `$${provider.price}`;
        route.dataset.eta = provider.duration;
        route.dataset.etaDisplay = `${Math.floor(provider.duration / 60)} min`;
        route.style.background = provider.color;
      }
    });
  }
};

// ============================================
// ETA Countdown Timer
// ============================================

const ETACountdown = {
  interval: null,
  start(seconds, element) {
    this.stop();
    let remaining = seconds;
    const updateDisplay = () => {
      if (remaining <= 0) {
        element.textContent = '0 min';
        element.dataset.countdown = '0';
        this.stop();
        return;
      }
      const minutes = Math.floor(remaining / 60);
      const secs = remaining % 60;
      element.textContent = minutes > 0 ? `${minutes} min` : `${secs}s`;
      element.dataset.countdown = remaining.toString();
      remaining--;
    };
    updateDisplay();
    this.interval = setInterval(updateDisplay, 1000);
  },

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
};

// ============================================
// Driver Pin Animation
// ============================================

const DriverAnimation = {
  intervals: {},

  animatePin(pinId, routeElement) {
    const pin = document.getElementById(pinId);
    if (!pin || !routeElement) return;

    // Stop existing animation
    this.stopPin(pinId);

    // Get route position
    const rect = routeElement.getBoundingClientRect();
    const parentRect = routeElement.parentElement.getBoundingClientRect();
    
    // Calculate animation path
    const startX = rect.left - parentRect.left;
    const startY = rect.top - parentRect.top;
    const endX = rect.right - parentRect.left;
    const endY = rect.top - parentRect.top;

    let progress = 0;
    const duration = 10000; // 10 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const animate = () => {
      progress += 1 / steps;
      if (progress > 1) progress = 0; // Loop

      const x = startX + (endX - startX) * progress;
      const y = startY + (endY - startY) * progress;

      pin.style.left = `${x}px`;
      pin.style.top = `${y}px`;
      pin.style.transform = 'translate(-50%, -50%)';
    };

    this.intervals[pinId] = setInterval(animate, stepDuration);
    pin.dataset.animating = 'true';
  },

  stopPin(pinId) {
    if (this.intervals[pinId]) {
      clearInterval(this.intervals[pinId]);
      delete this.intervals[pinId];
    }
    const pin = document.getElementById(pinId);
    if (pin) {
      pin.dataset.animating = 'false';
    }
  },

  stopAll() {
    Object.keys(this.intervals).forEach(pinId => this.stopPin(pinId));
  }
};

// ============================================
// Dark Theme
// ============================================

const ThemeManager = {
  init() {
    const darkToggle = document.getElementById('darkThemeToggle');
    if (darkToggle) {
      darkToggle.checked = appState.darkTheme;
      darkToggle.addEventListener('change', (e) => {
        appState.darkTheme = e.target.checked;
        this.applyTheme();
        Storage.save();
      });
    }
    this.applyTheme();
  },

  applyTheme() {
    if (appState.darkTheme) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }
};

// ============================================
// Form Persistence
// ============================================

const FormManager = {
  init() {
    // User login/register
    this.setupForm('userLoginEmail', 'userLoginPassword', 'userLoginBtn', 'user');
    this.setupForm('userRegisterName', 'userRegisterEmail', 'userRegisterPhone', 'userRegisterBtn', 'user');

    // Captain login/register
    this.setupForm('captainLoginPhone', 'captainLoginOTP', 'captainLoginBtn', 'captain');
    this.setupForm('captainRegisterName', 'captainRegisterVehicle', 'captainRegisterLicense', 'captainRegisterBtn', 'captain');

    // Load saved form data
    this.loadFormData();
  },

  setupForm(...fields) {
    const buttonId = fields[fields.length - 1];
    const button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', () => {
        fields.slice(0, -1).forEach(fieldId => {
          const field = document.getElementById(fieldId);
          if (field && field.value) {
            const key = `${fieldId}_value`;
            localStorage.setItem(key, field.value);
          }
        });
        Storage.save();
      });
    }

    // Auto-save on input
    fields.slice(0, -1).forEach(fieldId => {
      const field = document.getElementById(fieldId);
      if (field) {
        field.addEventListener('input', () => {
          if (field.value) {
            localStorage.setItem(`${fieldId}_value`, field.value);
          }
        });
      }
    });
  },

  loadFormData() {
    // Load all form fields
    document.querySelectorAll('input[id]').forEach(input => {
      const saved = localStorage.getItem(`${input.id}_value`);
      if (saved) {
        input.value = saved;
      }
    });
  }
};

// ============================================
// Provider Selection & State Management
// ============================================

const ProviderManager = {
  init() {
    // Route click handlers
    const routes = document.querySelectorAll('.route.clickable');
    routes.forEach(route => {
      route.addEventListener('click', () => {
        this.selectProvider(route);
      });
    });

    // Vehicle selection
    const vehicleChips = document.querySelectorAll('[data-vehicle]');
    vehicleChips.forEach(chip => {
      chip.addEventListener('click', () => {
        vehicleChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        appState.selectedVehicle = chip.dataset.vehicle;
        Storage.save();
      });
    });

    // Load saved provider
    if (appState.selectedProvider) {
      const savedRoute = document.querySelector(`[data-provider="${appState.selectedProvider}"]`);
      if (savedRoute) {
        this.selectProvider(savedRoute);
      }
    }
  },

  selectProvider(routeElement) {
    const provider = routeElement.dataset.provider;
    const price = routeElement.dataset.price;
    const eta = routeElement.dataset.eta;

    appState.selectedProvider = provider;

    // Update bottom sheet
    const providerEl = document.getElementById('bs-provider');
    const priceEl = document.getElementById('bs-price');
    const etaEl = document.getElementById('bs-eta');

    if (providerEl) providerEl.textContent = provider;
    if (priceEl) priceEl.textContent = price;
    if (etaEl) {
      const etaSeconds = parseInt(eta) || 360;
      etaEl.textContent = routeElement.dataset.etaDisplay || `${Math.floor(etaSeconds / 60)} min`;
      etaEl.dataset.countdown = etaSeconds.toString();
      
      // Start countdown
      ETACountdown.start(etaSeconds, etaEl);
    }

    Storage.save();
  }
};

// ============================================
// Location Input Handlers
// ============================================

const LocationManager = {
  init() {
    const pickupInput = document.getElementById('pickupInput');
    const destinationInput = document.getElementById('destinationInput');

    if (pickupInput) {
      pickupInput.addEventListener('change', () => {
        appState.pickupLocation = pickupInput.value;
        Storage.save();
        this.updateRoutes();
      });
    }

    if (destinationInput) {
      destinationInput.addEventListener('change', () => {
        appState.destination = destinationInput.value;
        Storage.save();
        this.updateRoutes();
      });
    }

    // Initialize with saved locations
    if (pickupInput && appState.pickupLocation) {
      pickupInput.value = appState.pickupLocation;
    }
    if (destinationInput && appState.destination) {
      destinationInput.value = appState.destination;
    }
  },

  async updateRoutes() {
    const pickup = appState.pickupLocation || 'MG Road, Bangalore';
    const destination = appState.destination || 'Airport T3, Bangalore';

    const providers = await MapService.fetchETAs(pickup, destination);
    MapService.updateRoutes(providers);
    
    // Update countdown if provider is selected
    if (appState.selectedProvider) {
      const selectedRoute = document.querySelector(`[data-provider="${appState.selectedProvider}"]`);
      if (selectedRoute) {
        ProviderManager.selectProvider(selectedRoute);
      }
    }
  }
};

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Load saved state
  Storage.load();

  // Initialize wireframe toggle
  const wireframeToggle = document.getElementById('wireframeToggle');
  if (wireframeToggle) {
    wireframeToggle.checked = appState.wireframe;
    wireframeToggle.addEventListener('change', (e) => {
      appState.wireframe = e.target.checked;
      document.body.classList.toggle('wireframe', e.target.checked);
      Storage.save();
    });
    if (appState.wireframe) {
      document.body.classList.add('wireframe');
    }
  }

  // Initialize theme
  ThemeManager.init();

  // Initialize forms
  FormManager.init();

  // Initialize provider selection
  ProviderManager.init();

  // Initialize location manager
  LocationManager.init();

  // Initialize Map SDK (if available)
  if (typeof google !== 'undefined' && google.maps) {
    MapService.init();
  } else {
    // Wait for Google Maps to load
    window.initMap = () => {
      MapService.init();
      LocationManager.updateRoutes();
    };
  }

  // Initialize driver pin animations
  const driverPins = document.querySelectorAll('.pin.driver.animated');
  driverPins.forEach(pin => {
    const route = pin.closest('.map')?.querySelector('.route');
    if (route) {
      DriverAnimation.animatePin(pin.id, route);
    }
  });

  // Sorting chips
  const sortChips = document.querySelectorAll('.sort-row .chip');
  sortChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sortChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });

  // Book ride button
  const bookRideBtn = document.getElementById('bookRideBtn');
  if (bookRideBtn) {
    bookRideBtn.addEventListener('click', () => {
      if (appState.selectedProvider) {
        alert(`Booking ${appState.selectedProvider} ride...`);
        Storage.save();
      } else {
        alert('Please select a provider first');
      }
    });
  }
});
