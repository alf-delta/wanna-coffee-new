import React from 'react';
import PropTypes from 'prop-types';

const Modal = ({ children, onClose }) => {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  const overlayStyles = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
  };

  const modalStyles = {
    background: 'rgba(255,255,255,0.45)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: isMobile ? 12 : 16,
    maxWidth: 420,
    width: isMobile ? '98vw' : '90vw',
    overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    padding: isMobile ? '1rem 0.5rem' : '1.5rem 1rem 1rem 1rem',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.3)',
  };

  return (
    <div style={overlayStyles} onClick={onClose}>
      <div
        style={modalStyles}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: isMobile ? 10 : 16,
            right: isMobile ? 10 : 18,
            background: 'rgba(255,255,255,0.85)',
            border: 'none',
            borderRadius: '50%',
            width: isMobile ? 36 : 40,
            height: isMobile ? 36 : 40,
            fontSize: isMobile ? '1.7rem' : '2rem',
            color: '#a97845',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(204,144,66,0.10)',
            zIndex: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.18s',
          }}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Modal; 