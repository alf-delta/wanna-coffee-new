import React from 'react';
import { useAccount } from '../context/AccountContext';

export default function FavoriteButton({ entityId, type = 'shop' }) {
  const { profile, favorites, toggleFavoriteShop, toggleFavoriteEvent, requestGoogleSignIn } = useAccount();

  const isActive = type === 'shop' ? favorites.shops.includes(entityId) : favorites.events.includes(entityId);
  const onToggle = () => {
    if (!profile?.googleLinked) {
      requestGoogleSignIn?.();
      return;
    }
    if (type === 'shop') toggleFavoriteShop(entityId);
    else toggleFavoriteEvent(entityId);
  };

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onToggle();
  };

  const stop = (e) => {
    e.stopPropagation();
  };

  return (
    <button
      onClick={handleClick}
      onMouseDown={stop}
      onPointerDown={stop}
      onTouchStart={stop}
      aria-pressed={isActive}
      title={isActive ? 'Remove from favorites' : 'Save to favorites'}
      style={{
        background: isActive ? '#e74c3c' : '#fff',
        color: isActive ? '#fff' : '#b87333',
        fontSize: '1rem',
        fontWeight: 600,
        borderRadius: '14px',
        padding: '2px 12px',
        marginRight: 0,
        marginLeft: 0,
        border: 'none',
        boxShadow: 'none',
        minWidth: 'auto',
        minHeight: 'auto',
        textAlign: 'center',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        lineHeight: 1.6,
        gap: '6px',
        transition: 'color 0.2s'
      }}
    >
      <svg 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill={isActive ? '#fff' : 'none'} 
        stroke={isActive ? '#fff' : '#b87333'} 
        strokeWidth="2"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>
      {isActive ? 'Saved' : 'Save'}
    </button>
  );
}


