import React, { useState } from 'react';
import { submitToFormspree } from '../services/emailService';

const WaitlistForm = ({ onSubmit }) => {
  const [email, setEmail] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !businessName) {
      setError('Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Отправляем данные через Formspree
      await submitToFormspree({ email, businessName });
      
      // Вызываем callback если передан
      if (onSubmit) {
        onSubmit({ email, businessName });
      }
      
      setIsSubmitted(true);
      setEmail('');
      setBusinessName('');
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div style={styles.successMessage}>
        <div style={styles.successIcon}>✅</div>
        <h3 style={styles.successTitle}>Thank you for joining!</h3>
        <p style={styles.successDesc}>
          We've added you to our waitlist. We'll be in touch soon with updates about Wanna Coffee Foresight.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputGroup}>
        <label htmlFor="businessName" style={styles.label}>Business Name</label>
        <input
          id="businessName"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          placeholder="Your coffee shop name"
          style={styles.input}
          disabled={isSubmitting}
        />
      </div>
      
      <div style={styles.inputGroup}>
        <label htmlFor="email" style={styles.label}>Email Address</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          style={styles.input}
          disabled={isSubmitting}
        />
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <button 
        type="submit" 
        style={{
          ...styles.submitButton,
          ...(isSubmitting && styles.submitButtonDisabled)
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Joining...' : 'Join Waitlist'}
      </button>
      <p style={styles.disclaimer}>
        We'll notify you when we launch our business features. No spam, just updates about Wanna Coffee for partners.
      </p>
    </form>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    background: 'linear-gradient(90deg, #cc9042 60%, #b87333 100%)',
    borderRadius: '18px',
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    padding: '2rem 1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '0.5rem',
    textShadow: '0 1px 2px rgba(0,0,0,0.3)',
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: '2px solid rgba(255,255,255,0.3)',
    background: 'rgba(255,255,255,0.95)',
    color: '#333',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    '&:focus': {
      outline: 'none',
      borderColor: '#cc9042',
      background: '#fff',
      boxShadow: '0 4px 16px rgba(204,144,66,0.2)',
    },
    '&::placeholder': {
      color: '#999',
    },
  },
  error: {
    color: '#d32f2f',
    fontSize: '0.9rem',
    textAlign: 'center',
    padding: '0.75rem',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '8px',
    border: '1px solid #ffcdd2',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontWeight: 500,
  },
  submitButton: {
    width: '100%',
    background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
    color: '#cc9042',
    fontWeight: 700,
    fontSize: '1.1rem',
    border: '2px solid rgba(255,255,255,0.3)',
    borderRadius: '24px',
    padding: '0.75rem 2rem',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    marginTop: '1rem',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 24px rgba(0,0,0,0.2)',
      background: 'linear-gradient(135deg, #fff 0%, #fff 100%)',
    },
  },
  submitButtonDisabled: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  successMessage: {
    textAlign: 'center',
    padding: '2rem',
    maxWidth: '400px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  successIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  successTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#cc9042',
    marginBottom: '1rem',
  },
  successDesc: {
    fontSize: '1rem',
    color: '#555',
    lineHeight: 1.6,
  },
  disclaimer: {
    fontSize: '0.85rem',
    color: 'rgba(80,60,20,0.7)',
    textAlign: 'center',
    marginTop: '1rem',
    lineHeight: 1.4,
    fontStyle: 'italic',
  },
};

export default WaitlistForm; 