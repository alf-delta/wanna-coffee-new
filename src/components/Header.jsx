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
    <header style={styles.header}>
      <nav style={styles.nav}>
        <Link to="/" style={styles.logoLink}>
          <img src={logo} alt="Wanna Coffee Logo" style={styles.logo} />
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
              </button>
              {isMenuOpen && (
                <div style={styles.mobileMenu}>
                  <Link to="/" style={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>Home</Link>
                  <Link to="/events" style={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>Events</Link>
                  <Link to="/about" style={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>About</Link>
                  <Link to="/contact" style={styles.mobileMenuLink} onClick={() => setIsMenuOpen(false)}>Contact</Link>
                </div>
              )}
            </>
          ) : (
            <div style={styles.links}>
              <Link to="/" style={styles.link}>Home</Link>
              <Link to="/events" style={styles.link}>Events</Link>
              <Link to="/about" style={styles.link}>About</Link>
              <Link to="/contact" style={styles.link}>Contact</Link>
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
      height: '38px',
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
};

export default Header;