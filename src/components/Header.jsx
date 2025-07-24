import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="wc-header">
      <nav className="wc-header-nav">
        <Link to="/" className="logo-link">
          <img src={logo} alt="Wanna Coffee Logo" className="header-logo" />
        </Link>
        <div className="wc-header-right">
          {isMobile ? (
            <>
              <button
                className="wc-header-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span className="wc-header-menu-icon">{isMenuOpen ? '✕' : '☰'}</span>
                <span className="wc-header-burger-dot"></span>
              </button>
              {isMenuOpen && (
                <>
                  <div
                    className="wc-header-mobile-overlay"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="wc-header-mobile-menu">
                    <Link to="/" className="wc-header-mobile-link" onClick={() => setIsMenuOpen(false)}>Home</Link>
                    <Link to="/about" className="wc-header-mobile-link wc-header-mobile-accent" onClick={() => setIsMenuOpen(false)}>About</Link>
                    <Link to="/contact" className="wc-header-mobile-link" onClick={() => setIsMenuOpen(false)}>Contact</Link>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="wc-header-links">
              <Link to="/" className="wc-header-link">Home</Link>
              <Link to="/about" className="wc-header-link wc-header-accent">About</Link>
              <Link to="/contact" className="wc-header-link">Contact</Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;