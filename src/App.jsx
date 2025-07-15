import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import EventsPage from './pages/EventsPage';
import Couponator from './pages/Couponator';
import Events from './pages/Events';
import CoffeeSubscription from './pages/CoffeeSubscription';
import Foresight from './pages/Foresight';
import GuideDemo from './pages/GuideDemo';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/couponator" element={<Couponator />} />
        <Route path="/subscription" element={<CoffeeSubscription />} />
        <Route path="/foresight" element={<Foresight />} />
        <Route path="/guide-demo" element={<GuideDemo />} />
      </Routes>
    </>
  );
};

export default App;