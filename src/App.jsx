import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import EventsPage from './pages/EventsPage';
import Couponator from './pages/Couponator';
import LoyaltyProgram from './pages/LoyaltyProgram';
import CoffeeSubscription from './pages/CoffeeSubscription';
import Header from './components/Header';
import { SpeedInsights } from "@vercel/speed-insights/react";

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/couponator" element={<Couponator />} />
        <Route path="/loyalty" element={<LoyaltyProgram />} />
        <Route path="/subscription" element={<CoffeeSubscription />} />
      </Routes>
      <SpeedInsights />
    </>
  );
};

export default App;