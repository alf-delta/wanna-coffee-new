import React, { useEffect, useMemo, useState } from 'react';
import Modal from './Modal.jsx';

import { useAccount } from '../context/AccountContext';

export default function SuggestionModal({ open, onClose, shop, onSubmit, initialSectionKey, initialValues }) {
  const { profile, requestGoogleSignIn } = useAccount();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 700;
  const [helpOpen, setHelpOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [form, setForm] = useState({
    locationAtmosphere: { value: '', isExpanded: false },
    philosophySourcing: { value: '', isExpanded: false },
    equipmentTechnique: { value: '', isExpanded: false },
    recommendation: { value: '', isExpanded: false },
    workingHours: { value: '', isExpanded: false },
  });

  // Автораскрытие нужного раздела при открытии
  useEffect(() => {
    if (!open) return;
    if (!initialSectionKey) return;
    if (!(initialSectionKey in form)) return;
    setForm(prev => ({
      ...prev,
      [initialSectionKey]: {
        ...prev[initialSectionKey],
        isExpanded: true,
      },
    }));
  }, [open, initialSectionKey]);

  // Предзаполнение значениями для режима редактирования
  useEffect(() => {
    if (!open) return;
    if (!initialValues) return;
    setForm(prev => {
      const next = { ...prev };
      Object.entries(initialValues).forEach(([key, val]) => {
        if (key in next && typeof val === 'string') {
          next[key] = { value: val, isExpanded: true };
        }
      });
      return next;
    });
  }, [open, initialValues]);

  const styles = useMemo(() => ({
    title: { 
      margin: '0 0 10px 0', 
      fontWeight: 800, 
      fontSize: isMobile ? '1.4rem' : '1.6rem', 
      color: '#b87333',
      marginTop: isMobile ? '20px' : '24px'
    },
    helpBtn: { 
      position: 'absolute', 
      top: isMobile ? 8 : 12, 
      left: isMobile ? 8 : 12, 
      backgroundColor: 'rgba(245, 245, 245, 0.8)', 
      color: '#666',
      width: '18px !important',
      height: '18px !important',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '11px',
      fontWeight: 'bold',
      cursor: 'pointer',
      border: '1px solid rgba(224, 224, 224, 0.8)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
      opacity: 0.8,
      zIndex: 9,
      minWidth: '18px',
      minHeight: '18px',
      maxWidth: '18px',
      maxHeight: '18px'
    },
    section: { marginBottom: 8 },
    sectionHeader: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '8px 12px',
      backgroundColor: '#f8f6f3',
      borderRadius: 8,
      border: '1px solid #e6e2dc',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    sectionTitle: { 
      fontWeight: 600, 
      color: '#3B2F2F',
      fontSize: '0.95rem'
    },
    editBtn: { 
      color: '#b87333', 
      fontSize: '0.8rem',
      fontWeight: 500,
      cursor: 'pointer',
      padding: '2px 6px',
      borderRadius: 4,
      transition: 'background-color 0.2s'
    },
    textarea: { 
      width: '100%', 
      maxWidth: '100%',
      minHeight: 72, 
      border: '1px solid #e6e2dc', 
      borderRadius: 8, 
      padding: '8px 10px', 
      outline: 'none',
      resize: 'vertical',
      boxSizing: 'border-box',
      marginTop: 8
    },
    submitRow: { display: 'flex', gap: 8, marginTop: 12, justifyContent: 'flex-end' },
    btn: { background: '#fff', color: '#b87333', border: '1px solid #e6e2dc', borderRadius: 8, padding: '8px 12px', fontWeight: 700, cursor: 'pointer' },
    note: { color: '#6b5f5a', fontSize: '0.92rem' },
  }), [isMobile]);

  if (!open) return null;

  const setField = (key, patch) => setForm(prev => ({ ...prev, [key]: { ...prev[key], ...patch } }));

  const toggleSection = (key) => {
    setForm(prev => ({ 
      ...prev, 
      [key]: { 
        ...prev[key], 
        isExpanded: !prev[key].isExpanded 
      } 
    }));
  };

  const handleSubmit = () => {
    if (!profile?.googleLinked) {
      requestGoogleSignIn?.();
      return;
    }
    // Only include sections that have been expanded and have content
    const sections = Object.fromEntries(
      Object.entries(form)
        .filter(([k, v]) => v.isExpanded && v.value.trim())
        .map(([k, v]) => [k, { value: v.value.trim() }])
    );
    onSubmit({ shopId: shop.id, shopName: shop.name, sections });
    onClose();
  };

  const sections = [
    { key: 'locationAtmosphere', title: 'Location & Atmosphere', placeholder: 'Describe location, vibe, interior...' },
    { key: 'philosophySourcing', title: 'Philosophy & Sourcing', placeholder: 'Roasters, origins, sourcing approach...' },
    { key: 'equipmentTechnique', title: 'Equipment & Technique', placeholder: 'Machines, grinders, brewing methods...' },
    { key: 'recommendation', title: 'Our Recommendation', placeholder: 'What to try here...' },
    { key: 'workingHours', title: 'Working Hours', placeholder: 'Update if needed (free form)' }
  ];

  return (
    <Modal onClose={onClose}>
      <div style={{ position: 'relative', padding: isMobile ? '10px' : '16px', maxWidth: isMobile ? '96vw' : 520 }}>
        <button style={styles.helpBtn} onClick={() => setHelpOpen(v => !v)} aria-expanded={helpOpen}>
          ?
        </button>
        <h3 style={styles.title}>Suggest a correction — {shop?.name}</h3>

        {helpOpen && (
          <div style={{ background: '#fffdfa', border: '1px solid #f1e7da', borderRadius: 8, padding: 10, marginBottom: 10 }}>
            <div style={styles.note}>
              You can write in a free form — our AI Wanna Coffee Impression will fact-check your input and run a light profanity/censorship filter. If all good, we'll publish the update. Click "edit" to modify a section, or leave it as is.
            </div>
          </div>
        )}

        {sections.map(({ key, title, placeholder }) => (
          <div key={key} style={styles.section}>
            <div 
              style={styles.sectionHeader}
              onClick={() => toggleSection(key)}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0ede8'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f8f6f3'}
            >
              <div style={styles.sectionTitle}>{title}</div>
              <div 
                style={styles.editBtn}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0ede8'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {form[key].isExpanded ? 'cancel' : 'edit'}
              </div>
            </div>
            
            {form[key].isExpanded && (
              <textarea 
                style={styles.textarea} 
                value={form[key].value} 
                onChange={(e) => setField(key, { value: e.target.value })} 
                placeholder={placeholder}
              />
            )}
          </div>
        ))}

        <div style={styles.submitRow}>
          <button style={styles.btn} onClick={onClose}>Cancel</button>
          <button style={styles.btn} onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </Modal>
  );
}


