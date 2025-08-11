import React, { useState, useEffect } from 'react';
import { useAccount } from '../context/AccountContext';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Header = React.memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { profile, favorites, suggestions } = useAccount();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [avatarOk, setAvatarOk] = useState(true);
  useEffect(() => { setAvatarOk(true); }, [profile?.avatarUrl]);





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
              {/* Capsule button: burger + user icon */}
              <button
                className="wc-header-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Open menu"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '6px 10px',
                  borderRadius: 18,
                  background: '#fff',
                  border: '1px solid #e6e2dc',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  color: '#b87333'
                }}
              >
                <span className="wc-header-menu-icon" style={{ fontSize: 18 }}>{isMenuOpen ? '✕' : '☰'}</span>
                <span style={{ flex: 1 }} />
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '1px solid #e6e2dc',
                    background: '#fff',
                    color: '#b87333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    overflow: 'hidden',
                    alignSelf: 'center',
                    lineHeight: 0
                  }}
                >
                  {profile?.googleLinked && profile?.avatarUrl && avatarOk ? (
                    <img src={profile.avatarUrl} alt="avatar" referrerPolicy="no-referrer" onError={() => setAvatarOk(false)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : profile?.googleLinked ? (
                    ((profile?.nickname || profile?.name || '')
                      .trim()
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map(w => w[0]?.toUpperCase())
                      .join('')) || 'U'
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#b87333" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  )}
                </span>
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
                    <div style={{ borderTop: 'none', marginTop: 6, paddingTop: 10, display: 'flex', justifyContent: 'center' }}>
                      {profile?.googleLinked ? (
                        <Link to="/account" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#3B2F2F', fontWeight: 700, fontSize: '1.2rem', lineHeight: 1.2 }}>
                          <span
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              border: '1px solid #e6e2dc',
                              background: '#fff',
                              color: '#b87333',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '1rem',
                              overflow: 'hidden',
                              alignSelf: 'center',
                              lineHeight: 0
                            }}
                          >
                            {profile?.googleLinked && profile?.avatarUrl && avatarOk ? (
                              <img src={profile.avatarUrl} alt="avatar" referrerPolicy="no-referrer" onError={() => setAvatarOk(false)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              ((profile?.nickname || profile?.name || '')
                                .trim()
                                .split(' ')
                                .filter(Boolean)
                                .slice(0, 2)
                                .map(w => w[0]?.toUpperCase())
                                .join('')) || 'U'
                            )}
                          </span>
                          <span style={{ whiteSpace: 'nowrap' }}>
                            {(profile?.nickname || profile?.name || 'User').toString().trim() || 'User'}
                          </span>
                          <span style={{ color: '#bbb' }}>|</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#e74c3c" xmlns="http://www.w3.org/2000/svg">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                            {(favorites?.shops?.length || 0)}
                          </span>
                          <span style={{ color: '#bbb' }}>|</span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="#b87333" xmlns="http://www.w3.org/2000/svg">
                              <path d="M14.7 3.3a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4l-8.9 8.9a1 1 0 0 1-.5.3l-5.5 1.4a1 1 0 0 1-1.2-1.2l1.4-5.5a1 1 0 0 1 .3-.5l8.9-8.9ZM16 5l3 3l-1.8 1.8l-3-3L16 5ZM6.9 13.1l-0.9 3.6l3.6-0.9l6.8-6.8l-2.7-2.7l-6.8 6.8Z"/>
                            </svg>
                            {(suggestions?.length || 0)}
                          </span>
                        </div>
                      </Link>
                      ) : (
                        <Link to="/account" onClick={() => setIsMenuOpen(false)} style={{ textDecoration: 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#b87333', fontWeight: 700, fontSize: '1.1rem', padding: '8px 16px', border: '1px solid #e6e2dc', borderRadius: 12, background: '#fff' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#b87333" strokeWidth="2">
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                              <circle cx="12" cy="7" r="4"/>
                            </svg>
                            Sign In
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="wc-header-links" style={{ alignItems: 'center' }}>
              <Link to="/" className="wc-header-link">Home</Link>
              <Link to="/about" className="wc-header-link wc-header-accent">About</Link>
              <Link to="/contact" className="wc-header-link">Contact</Link>
              <Link
                to="/account"
                title="My account"
                style={{ marginLeft: 12, textDecoration: 'none' }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: '1px solid #e6e2dc',
                    background: '#fff',
                    color: '#b87333',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                    transition: 'box-shadow 0.2s ease',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 0 3px rgba(211,145,75,0.18), 0 4px 12px rgba(0,0,0,0.12)'}
                  onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.06)'}
                >
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    ((profile?.nickname || profile?.name || '')
                      .trim()
                      .split(' ')
                      .filter(Boolean)
                      .slice(0, 2)
                      .map(w => w[0]?.toUpperCase())
                      .join('')) || 'U'
                  )}
                </div>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
});

export default Header;