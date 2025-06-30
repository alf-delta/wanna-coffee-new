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

  const accentButton = {
    background: '#cc9042',
    color: '#fff',
    borderRadius: '22px',
    padding: '0.5rem 1.5rem',
    margin: '0 0.25rem',
    fontWeight: 600,
    boxShadow: '0 2px 8px rgba(204,144,66,0.12)',
    transition: 'background 0.2s, box-shadow 0.2s',
    textDecoration: 'none',
    border: '2px solid transparent',
    display: 'inline-block',
  };

  const soonBadge = {
    position: 'absolute',
    top: -16,
    right: -8,
    background: '#e53935',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 700,
    borderRadius: '12px',
    padding: '2px 10px',
    zIndex: 10,
    boxShadow: '0 2px 8px rgba(204,144,66,0.10)',
    opacity: 0.7,
    transition: 'top 0.2s, right 0.2s, opacity 0.2s',
    '@media (max-width: 768px)': {
      top: -8,
      right: 8,
      fontSize: '0.8rem',
      padding: '2px 8px',
    },
  };

  // Красная точка для мобильной версии
  const soonDot = {
    position: 'absolute',
    top: 2,
    right: 10,
    width: 14,
    height: 14,
    borderRadius: '50%',
    background: '#e53935',
    zIndex: 10,
    boxShadow: '0 1px 4px rgba(204,144,66,0.10)',
    border: '2px solid #fff',
    display: 'inline-block',
  };

  return (
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/" className="logo-link">
          <img src={logo} alt="Wanna Coffee Logo" className="header-logo" />
        </Link>
        <div style={styles.rightControls}>
          {isMobile ? (
            <>
              <button
                style={styles.menuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle menu"
              >
                <span style={styles.menuIcon}>{isMenuOpen ? '✕' : '☰'}</span>
                <span style={styles.burgerDot}></span>
              </button>
              {isMenuOpen && (
                <div style={styles.mobileMenu}>
                  <Link to="/" style={{ ...styles.mobileMenuLink, textAlign: 'center' }} onClick={() => setIsMenuOpen(false)}>Home</Link>
                  <Link to="/about" style={{ ...styles.mobileMenuLink, textAlign: 'center' }} onClick={() => setIsMenuOpen(false)}>About</Link>
                  <Link to="/contact" style={{ ...styles.mobileMenuLink, textAlign: 'center' }} onClick={() => setIsMenuOpen(false)}>Contact</Link>
                  <span style={{ position: 'relative', display: 'block' }}>
                    <Link to="/couponator" style={{ ...accentButton, ...styles.mobileAccentBtn }} onClick={() => setIsMenuOpen(false)}>Coffee Pass</Link>
                    <span style={soonDot}></span>
                  </span>
                  <span style={{ position: 'relative', display: 'block' }}>
                    <Link to="/events" style={{ ...accentButton, ...styles.mobileAccentBtn }} onClick={() => setIsMenuOpen(false)}>Events</Link>
                    <span style={soonDot}></span>
                  </span>
                  <span style={{ position: 'relative', display: 'block' }}>
                    <Link to="/subscription" style={{ ...accentButton, ...styles.mobileAccentBtn }} onClick={() => setIsMenuOpen(false)}>Shop</Link>
                    <span style={soonDot}></span>
                  </span>
                </div>
              )}
            </>
          ) : (
            <div style={styles.links}>
              <Link to="/" style={styles.link}>Home</Link>
              <Link to="/about" style={styles.link}>About</Link>
              <Link to="/contact" style={styles.link}>Contact</Link>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <Link to="/couponator" style={accentButton}>Coffee Pass</Link>
                <span style={soonBadge}>Soon</span>
              </span>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <Link to="/events" style={accentButton}>Events</Link>
                <span style={soonBadge}>Soon</span>
              </span>
              <span style={{ position: 'relative', display: 'inline-block' }}>
                <Link to="/subscription" style={accentButton}>Shop</Link>
                <span style={soonBadge}>Soon</span>
              </span>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    padding: '1rem',
    backgroundColor: '#f7f7f7',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    '@media (max-width: 768px)': {
      padding: '0.75rem 1rem',
    },
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 1001,
    height: 56,
  },
  logoLink: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flex: 'none',
    position: 'relative',
    zIndex: 2,
  },
  logo: {
    height: '64px',
    '@media (max-width: 768px)': {
      height: '32px',
    },
  },
  rightControls: {
    display: 'flex',
    alignItems: 'center',
    zIndex: 3,
    gap: '1rem',
    height: '100%',
    position: 'static',
  },
  links: {
    display: 'flex',
    gap: '1rem',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  linksOpen: {
    '@media (max-width: 768px)': {
      display: 'flex',
    },
  },
  link: {
    color: '#333',
    textDecoration: 'none',
    padding: '0.5rem',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    '@media (max-width: 768px)': {
      padding: '0.75rem',
      fontSize: '1.1rem',
    },
    '&:hover': {
      backgroundColor: '#eee',
    },
  },
  spacer: {
    flex: 1,
  },
  menuButton: {
    background: 'none',
    border: 'none',
    padding: '0.5rem',
    cursor: 'pointer',
    zIndex: 2002,
  },
  menuIcon: {
    fontSize: '1.5rem',
    color: '#333',
  },
  mobileMenu: {
    position: 'fixed',
    top: 64,
    right: 16,
    left: 16,
    background: '#fff',
    borderRadius: 12,
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    zIndex: 2001,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    padding: '0.5rem 0',
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  mobileMenuLink: {
    padding: '1rem',
    color: '#333',
    textDecoration: 'none',
    fontWeight: 500,
    fontSize: '1.1rem',
    borderBottom: '1px solid #eee',
    transition: 'background 0.2s',
    ':last-child': {
      borderBottom: 'none',
    },
    ':hover': {
      background: '#f7f7f7',
    },
  },
  '@media (max-width: 768px)': {
    logoLink: {
      maxWidth: '70vw',
    },
  },
  mobileAccentBtn: {
    width: 'calc(100% - 32px)',
    margin: '0.5rem 16px',
    display: 'block',
    textAlign: 'center',
    fontSize: '1.13rem',
    padding: '0.9rem 1.5rem',
    borderRadius: '18px',
    background: 'linear-gradient(90deg, #cc9042 60%, #b87333 100%)',
    color: '#fff',
    fontWeight: 700,
    boxShadow: '0 2px 8px rgba(204,144,66,0.13)',
    border: 'none',
  },
  burgerDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: '50%',
    background: '#e53935',
    boxShadow: '0 1px 4px rgba(204,144,66,0.10)',
    zIndex: 10,
    border: '2px solid #fff',
    display: 'inline-block',
    pointerEvents: 'none',
  },
};

export default Header;