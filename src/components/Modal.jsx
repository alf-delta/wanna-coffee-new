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
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
  },
  modal: {
    background: '#fff',
    borderRadius: 16,
    maxWidth: 420,
    width: '90vw',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
    padding: '1.5rem 1rem 1rem 1rem',
    position: 'relative',
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
    top: 12,
    right: 16,
    background: 'none',
    border: 'none',
    fontSize: 28,
    color: '#888',
    cursor: 'pointer',
    zIndex: 10,
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
        <button style={modalStyles.closeBtn} onClick={onClose} aria-label="Close">×</button>
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