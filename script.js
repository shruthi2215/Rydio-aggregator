document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('wireframeToggle');
  if (toggle) {
    toggle.addEventListener('change', () => {
      document.body.classList.toggle('wireframe', toggle.checked);
    });
  }

  // Route segment interactions
  const routes = document.querySelectorAll('.route.clickable');
  const providerEl = document.getElementById('bs-provider');
  const priceEl = document.getElementById('bs-price');
  const etaEl = document.getElementById('bs-eta');
  routes.forEach(route => {
    route.addEventListener('click', () => {
      const provider = route.dataset.provider;
      const price = route.dataset.price;
      const eta = route.dataset.eta;
      if (providerEl) providerEl.textContent = provider;
      if (priceEl) priceEl.textContent = price;
      if (etaEl) etaEl.textContent = eta;
    });
  });

  // Sorting chips (visual only)
  const sortChips = document.querySelectorAll('.sort-row .chip');
  sortChips.forEach(chip => {
    chip.addEventListener('click', () => {
      sortChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
    });
  });
});

