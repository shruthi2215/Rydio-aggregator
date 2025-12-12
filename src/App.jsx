import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import BookRide from "./pages/BookRide";
import LiveRide from "./pages/LiveRide";
import DriverHome from "./pages/DriverHome";
import DriverEarnings from "./pages/DriverEarnings";

const App = () => {
  return (
    <div className="min-h-screen bg-midnight text-slate-100 antialiased selection:bg-primary/20 selection:text-white">
      <div className="pointer-events-none fixed inset-0 bg-hero-grid opacity-80" aria-hidden />
      <Navbar />
      <main className="relative z-10 px-4 pb-20 pt-20 md:px-8 lg:px-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<BookRide />} />
          <Route path="/live" element={<LiveRide />} />
          <Route path="/driver" element={<DriverHome />} />
          <Route path="/driver/earnings" element={<DriverEarnings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="relative z-10 border-t border-white/5 bg-slate-900/50 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-lg font-semibold text-white">RYDIO</p>
            <p className="text-sm text-slate-400">Ride smarter. Compare instantly.</p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="rounded-full bg-white/5 px-3 py-1">Glassmorphism UI</span>
            <span className="rounded-full bg-white/5 px-3 py-1">Real-time tracking</span>
            <span className="rounded-full bg-white/5 px-3 py-1">Safe by design</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

