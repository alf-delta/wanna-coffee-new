import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Header from './components/Header';

const EventsPage = lazy(() => import('./pages/EventsPage'));

const App = () => {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={
          <Suspense fallback={<div>Loading...</div>}>
            <EventsPage />
          </Suspense>
        } />
      </Routes>
    </>
  );
};

export default App;