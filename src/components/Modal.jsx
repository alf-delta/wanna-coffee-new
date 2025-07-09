import React from 'react';
import PropTypes from 'prop-types';

const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.35)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
  },
  modal: {
    background: 'rgba(255,255,255,0.9)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: 16,
    maxWidth: 420,
    width: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    padding: '1.5rem 1rem 1rem 1rem',
    position: 'relative',
    border: '1px solid rgba(255,255,255,0.2)',
    '@media (max-width: 768px)': {
      width: '98vw',
      minHeight: '60vh',
      maxHeight: '95vh',
      borderRadius: 12,
      padding: '1rem 0.5rem',
    },
  },
  closeBtn: {
    position: 'absolute',
    top: -12,
    right: -12,
    background: 'rgba(255, 255, 255, 0.95)',
    border: '1px solid #e0e0e0',
    borderRadius: '50%',
    width: '28px',
    height: '28px',
    fontSize: '18px',
    color: '#666',
    cursor: 'pointer',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    '@media (max-width: 768px)': {
      top: -8,
      right: -8,
      width: '24px',
      height: '24px',
      fontSize: '16px',
    },
  },
};

const Modal = ({ children, onClose }) => {
  React.useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [onClose]);

  return (
    <div style={modalStyles.overlay} onClick={onClose}>
      <div
        style={modalStyles.modal}
        onClick={e => e.stopPropagation()}
      >
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