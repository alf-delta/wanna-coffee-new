import React, { useMemo, useState } from 'react';
import { useAccount } from '../context/AccountContext';
import Modal from './Modal.jsx';

export default function SuggestCafeModal({ open, onClose, onSubmit }) {
  const { profile, requestGoogleSignIn } = useAccount();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 700;
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const styles = useMemo(() => ({
    title: { margin: '0 0 10px 0', fontWeight: 800, fontSize: isMobile ? '1.35rem' : '1.5rem', color: '#b87333', marginTop: isMobile ? '18px' : '22px' },
    label: { display: 'block', color: '#3B2F2F', fontWeight: 600, marginBottom: 6 },
    input: { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e6e2dc', outline: 'none', fontSize: '1rem' },
    note: { color: '#6b5f5a', fontSize: '0.92rem', marginTop: 6 },
    row: { marginTop: 10 },
    actions: { display: 'flex', gap: 8, marginTop: 14, justifyContent: 'flex-end' },
    btn: { background: '#fff', color: '#b87333', border: '1px solid #e6e2dc', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' }
  }), [isMobile]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!profile?.googleLinked) {
      requestGoogleSignIn?.();
      return;
    }
    if (!name.trim() || !address.trim()) {
      alert('Please fill in both name and address');
      return;
    }
    try {
      setSubmitting(true);
      await onSubmit({ name: name.trim(), address: address.trim() });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div style={{ position: 'relative', padding: isMobile ? '10px' : '16px', maxWidth: isMobile ? '96vw' : 520 }}>
        <h3 style={styles.title}>Suggest a new coffee shop</h3>
        <div style={styles.row}>
          <label style={styles.label}>Name</label>
          <input style={styles.input} value={name} onChange={e => setName(e.target.value)} placeholder="Coffee shop name" />
        </div>
        <div style={styles.row}>
          <label style={styles.label}>Address</label>
          <input style={styles.input} value={address} onChange={e => setAddress(e.target.value)} placeholder="Street, City" />
        </div>
        <div style={styles.note}>We will verify details and add it to the map if eligible.</div>
        <div style={styles.actions}>
          <button style={styles.btn} onClick={onClose} disabled={submitting}>Cancel</button>
          <button style={styles.btn} onClick={handleSubmit} disabled={submitting}>{submitting ? 'Submitting…' : 'Submit'}</button>
        </div>
      </div>
    </Modal>
  );
}


