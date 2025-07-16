import React, { useState } from 'react';
import CustomerWaitlistForm from './CustomerWaitlistForm';
import WaitlistForm from './WaitlistForm';

const WaitlistTabs = () => {
  const [activeTab, setActiveTab] = useState('customer');

  return (
    <div style={styles.tabsWrap}>
      <div style={styles.tabButtonsRow}>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'customer' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('customer')}
        >
          Coffee Lovers
        </button>
        <button
          style={{
            ...styles.tabButton,
            ...(activeTab === 'shop' ? styles.tabButtonActive : {})
          }}
          onClick={() => setActiveTab('shop')}
        >
          Coffee Shops
        </button>
      </div>
      <div style={styles.formContainer}>
        {activeTab === 'customer' ? <CustomerWaitlistForm /> : <WaitlistForm />}
      </div>
    </div>
  );
};

const styles = {
  tabsWrap: {
    width: '100%',
    maxWidth: 420,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  tabButtonsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 0,
    width: '100%',
    marginBottom: 24,
    borderRadius: 18,
    overflow: 'hidden',
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    background: 'rgba(255,255,255,0.7)',
  },
  tabButton: {
    flex: 1,
    padding: '1rem 0',
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#b87333',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.18s, color 0.18s',
    outline: 'none',
    borderRight: '1px solid rgba(204,144,66,0.10)',
  },
  tabButtonActive: {
    background: 'linear-gradient(90deg, #cc9042 60%, #b87333 100%)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(204,144,66,0.13)',
    borderRight: '1px solid rgba(204,144,66,0.10)',
  },
  formContainer: {
    width: '100%',
    margin: '0 auto',
    borderRadius: 18,
    background: 'rgba(255,255,255,0.85)',
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    padding: 0,
  },
};

export default WaitlistTabs; 