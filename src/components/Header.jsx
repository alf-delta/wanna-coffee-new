import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';

const Header = () => (
  <header style={{ padding: '1rem', backgroundColor: '#f7f7f7' }}>
    <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
      <Link to="/">
        <img src={logo} alt="Wanna Coffee Logo" style={{ height: '40px' }} />
      </Link>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  </header>
);

export default Header;