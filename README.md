# RYDIO – Multi-Network Ride Aggregator

A modern, production-ready ride aggregator platform that compares Uber, Ola, and Rapido in real-time. Built with industry-standard practices, accessibility, and performance in mind.

## 🚀 Features

- **Multi-Network Comparison**: Compare prices and ETAs across Uber, Ola, and Rapido
- **Real-Time Map Integration**: Google Maps SDK integration with live route visualization
- **Dark Theme Support**: Toggle between light and dark themes
- **LocalStorage Persistence**: State management with automatic form data saving
- **Accessibility**: WCAG 2.1 AA compliant with proper ARIA labels and keyboard navigation
- **Responsive Design**: Mobile-first design that works on all devices
- **Driver Animations**: Animated driver pins with real-time tracking simulation
- **ETA Countdown**: Live countdown timers for estimated arrival times

## 📋 Screens Included

1. Landing page (hero CTA, three-network pitch)
2. User login / register (with form validation)
3. Captain login / register (with OTP support)
4. User ride booking (map + 3-colored routes, tappable segments, bottom sheet)
5. Price comparison (Uber | Ola | Rapido sortable chips)
6. Ride confirmation
7. Live ride tracking
8. Captain ride request dashboard
9. Captain ride acceptance (route to user + OTP)
10. Captain live navigation
11. Ride end summary
12. User profile + settings
13. Captain profile + settings

## 🛠️ Tech Stack

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern CSS with custom properties, animations, and responsive design
- **Vanilla JavaScript**: ES6+ with modular architecture
- **Google Maps API**: For real-time route calculation and visualization

## 🚦 Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3.x (for local development server)
- Google Maps API key (optional, for full functionality)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/shruthi2215/Rydio-aggregator.git
cd Rydio-aggregator
```

2. Add your Google Maps API key (optional):
   - Open `index.html`
   - Replace `YOUR_API_KEY` with your actual Google Maps API key
   - Or set up environment variables for production

3. Start the development server:
```bash
npm start
# or
python -m http.server 8000
```

4. Open your browser and navigate to:
```
http://localhost:8000
```

## 🎨 Design Tokens

- **Electric Blue**: `#2563eb` (Primary)
- **Black**: `#0f172a` (Text)
- **Green**: `#22c55e` (Ola)
- **Yellow**: `#fbbf24` (Rapido)
- **Grey**: `#e4e8f0` (Borders)
- **White**: `#ffffff` (Background)

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- Focus indicators
- Skip to main content link
- Proper ARIA labels and roles
- Reduced motion support

## 🔒 Security

- Input validation and sanitization
- XSS protection
- Secure localStorage handling
- Error boundary implementation
- Content Security Policy ready

## 📝 Code Standards

- Semantic HTML5
- BEM-like CSS naming conventions
- Modular JavaScript architecture
- Error handling and validation
- Performance optimizations
- Code comments and documentation

## 🐛 Known Issues

- Google Maps API key required for full functionality
- Mock data used when API key is not configured
- Some features require backend integration for production use

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- RYDIO Development Team

## 🙏 Acknowledgments

- Google Maps Platform
- Inter font family
- All contributors and testers

