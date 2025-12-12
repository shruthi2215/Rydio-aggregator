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
    try {
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
    } catch (e) {
      console.error('Failed to save state:', e);
      // Handle quota exceeded error
      if (e.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Clearing old data...');
        this.clear();
      }
    }
  },

  load() {
    try {
      const saved = localStorage.getItem('rydio_state');
      if (saved) {
        const state = JSON.parse(saved);
        Object.assign(appState, state);
        return true;
      }
    } catch (e) {
      console.error('Failed to load state:', e);
      // Clear corrupted data
      this.clear();
    }
    return false;
  },

  clear() {
    try {
      localStorage.removeItem('rydio_state');
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
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

// ============================================
// Input Validation Utilities
// ============================================

const Validator = {
  email(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  phone(phone) {
    const re = /^[0-9]{10}$/;
    return re.test(phone.replace(/\D/g, ''));
  },

  otp(otp) {
    const re = /^[0-9]{4}$/;
    return re.test(otp);
  },

  showError(input, message) {
    input.setCustomValidity(message);
    input.reportValidity();
  },

  clearError(input) {
    input.setCustomValidity('');
  }
};

// ============================================
// Debounce Utility
// ============================================

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// ============================================
// Form Persistence
// ============================================

const FormManager = {
  init() {
    // Setup form handlers
    this.setupFormHandlers();
    this.loadFormData();
  },

  setupFormHandlers() {
    // User login form
    const userLoginForm = document.getElementById('userLoginForm');
    if (userLoginForm) {
      userLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validateForm(userLoginForm)) {
          this.handleLogin('user', userLoginForm);
        }
      });
    }

    // User register form
    const userRegisterForm = document.getElementById('userRegisterForm');
    if (userRegisterForm) {
      userRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validateForm(userRegisterForm)) {
          this.handleRegister('user', userRegisterForm);
        }
      });
    }

    // Captain login form
    const captainLoginForm = document.getElementById('captainLoginForm');
    if (captainLoginForm) {
      captainLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validateForm(captainLoginForm)) {
          this.handleLogin('captain', captainLoginForm);
        }
      });
    }

    // Captain register form
    const captainRegisterForm = document.getElementById('captainRegisterForm');
    if (captainRegisterForm) {
      captainRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (this.validateForm(captainRegisterForm)) {
          this.handleRegister('captain', captainRegisterForm);
        }
      });
    }

    // Auto-save on input with debouncing
    const debouncedSave = debounce((input) => {
      try {
        if (input.value) {
          localStorage.setItem(`${input.id}_value`, input.value);
        }
      } catch (e) {
        console.warn('Failed to save form data:', e);
      }
    }, 500);

    document.querySelectorAll('input[id]').forEach(input => {
      input.addEventListener('input', () => {
        Validator.clearError(input);
        debouncedSave(input);
      });
    });
  },

  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required]');

    inputs.forEach(input => {
      if (!input.value.trim()) {
        Validator.showError(input, 'This field is required');
        isValid = false;
      } else if (input.type === 'email' && !Validator.email(input.value)) {
        Validator.showError(input, 'Please enter a valid email address');
        isValid = false;
      } else if (input.type === 'tel' && !Validator.phone(input.value)) {
        Validator.showError(input, 'Please enter a valid 10-digit phone number');
        isValid = false;
      } else if (input.id.includes('OTP') && !Validator.otp(input.value)) {
        Validator.showError(input, 'Please enter a valid 4-digit OTP');
        isValid = false;
      } else {
        Validator.clearError(input);
      }
    });

    return isValid;
  },

  handleLogin(type, form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
      appState[`${type}Auth`] = data;
      Storage.save();
      alert(`${type === 'user' ? 'User' : 'Captain'} login successful!`);
    } catch (e) {
      console.error('Login error:', e);
      alert('Login failed. Please try again.');
    }
  },

  handleRegister(type, form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    try {
      appState[`${type}Auth`] = data;
      Storage.save();
      alert(`${type === 'user' ? 'User' : 'Captain'} registration successful!`);
    } catch (e) {
      console.error('Registration error:', e);
      alert('Registration failed. Please try again.');
    }
  },

  loadFormData() {
    try {
      document.querySelectorAll('input[id]').forEach(input => {
        const saved = localStorage.getItem(`${input.id}_value`);
        if (saved) {
          input.value = saved;
        }
      });
    } catch (e) {
      console.warn('Failed to load form data:', e);
    }
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

    // Debounced update function
    const debouncedUpdate = debounce(() => {
      this.updateRoutes();
    }, 1000);

    if (pickupInput) {
      pickupInput.addEventListener('input', () => {
        appState.pickupLocation = pickupInput.value;
        Storage.save();
        debouncedUpdate();
      });
      
      pickupInput.addEventListener('change', () => {
        appState.pickupLocation = pickupInput.value;
        Storage.save();
        this.updateRoutes();
      });
    }

    if (destinationInput) {
      destinationInput.addEventListener('input', () => {
        appState.destination = destinationInput.value;
        Storage.save();
        debouncedUpdate();
      });
      
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
    try {
      const pickup = appState.pickupLocation || 'MG Road, Bangalore';
      const destination = appState.destination || 'Airport T3, Bangalore';

      if (!pickup.trim() || !destination.trim()) {
        console.warn('Pickup or destination is empty');
        return;
      }

      const providers = await MapService.fetchETAs(pickup, destination);
      MapService.updateRoutes(providers);
      
      // Update countdown if provider is selected
      if (appState.selectedProvider) {
        const selectedRoute = document.querySelector(`[data-provider="${appState.selectedProvider}"]`);
        if (selectedRoute) {
          ProviderManager.selectProvider(selectedRoute);
        }
      }
    } catch (e) {
      console.error('Error updating routes:', e);
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
        // In production, this would make an API call
        bookRideBtn.disabled = true;
        bookRideBtn.textContent = 'Booking...';
        
        setTimeout(() => {
          alert(`Booking ${appState.selectedProvider} ride...`);
          bookRideBtn.disabled = false;
          bookRideBtn.textContent = 'BOOK RIDE';
          Storage.save();
        }, 1000);
      } else {
        alert('Please select a provider first');
      }
    });
  }

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    ETACountdown.stop();
    DriverAnimation.stopAll();
  });
});

// Error handling for unhandled errors
window.addEventListener('error', (e) => {
  console.error('Unhandled error:', e.error);
  // In production, send to error tracking service
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
  console.error('Unhandled promise rejection:', e.reason);
  // In production, send to error tracking service
});
