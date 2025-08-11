import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from '../context/AccountContext';
import SuggestionModal from '../components/SuggestionModal';
import SuggestCafeModal from '../components/SuggestCafeModal';
import { fetchCoffeeShops } from '../utils/coffeeShops';
import { promptGoogleId, decodeJwt, cancelGooglePrompt, loadGoogleScript } from '../services/googleIdentity';

const actionBtn = {
  background: '#fff',
  border: '1px solid #e6e2dc',
  color: '#b87333',
  borderRadius: 12,
  padding: '10px 14px',
  fontWeight: 700,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(204,144,66,0.08)'
};

export default function Account() {
  const { profile, setProfile, favorites, settings, setSettings, suggestions, updateSuggestionStatus, withdrawSuggestion, updateSuggestionContent, deleteSuggestion, submitCafeSuggestion, signInWithGoogle, signOut } = useAccount();
  const [shopsById, setShopsById] = useState({});
  const [stats, setStats] = useState({ favoritesCount: 0, suggestionsCount: 0 });

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 700;

  const styles = useMemo(() => ({
    page: { minHeight: '100vh', background: '#f8f9fa', padding: isMobile ? '1rem 0.75rem' : '2rem 1rem' },
    wrap: { maxWidth: 980, margin: '0 auto' },
    headerCard: {
      position: 'relative',
      background: 'linear-gradient(135deg, #fff9f2 0%, #ffffff 60%)',
      border: '1px solid #f1e7da',
      borderRadius: 18,
      boxShadow: '0 6px 24px rgba(204,144,66,0.12)',
      padding: isMobile ? 12 : 18,
      display: 'flex',
      alignItems: isMobile ? 'stretch' : 'center',
      flexDirection: isMobile ? 'column' : 'row',
      gap: isMobile ? 10 : 14,
      marginBottom: 14
    },
    avatar: {
      width: isMobile ? 54 : 64,
      height: isMobile ? 54 : 64,
      borderRadius: '50%',
      border: '2px solid #fff',
      boxShadow: '0 3px 12px rgba(0,0,0,0.12)',
      objectFit: 'cover',
      background: '#eee',
      color: '#b87333',
      fontWeight: 800,
      fontSize: isMobile ? 18 : 20,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: isMobile ? 'center' : 'auto'
    },
    headerInfo: { display: 'flex', flexDirection: 'column', gap: 2, textAlign: isMobile ? 'center' : 'left' },
    headerName: { fontSize: isMobile ? '1.2rem' : '1.4rem', fontWeight: 800, color: '#b87333', lineHeight: 1.2 },
    headerEmail: { color: '#6b5f5a', fontSize: isMobile ? '0.95rem' : '1rem' },
    headerActions: { marginLeft: isMobile ? 0 : 'auto', display: 'flex', gap: 8, alignItems: 'center', justifyContent: isMobile ? 'center' : 'flex-end', width: isMobile ? '100%' : 'auto' },
    googleBtn: {
      display: 'inline-flex', alignItems: 'center', gap: 8,
      background: '#fff', color: '#3b3b3b', border: '1px solid #e6e2dc',
      padding: '10px 12px', borderRadius: 12, cursor: 'pointer', fontWeight: 700,
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      width: isMobile ? '100%' : 'auto',
      justifyContent: 'center'
    },
    statsRow: {
      display: 'flex', alignItems: 'center', gap: 10,
      flexWrap: 'wrap', marginTop: 6,
      justifyContent: isMobile ? 'center' : 'flex-start'
    },
    statPill: { display: 'inline-block', background: '#fff', border: '1px solid #f1e7da', color: '#b87333', borderRadius: 12, padding: '6px 10px', fontWeight: 700 },
    grid: { display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0,1fr))', gap: 12 },
    card: { background: '#fff', borderRadius: 16, boxShadow: '0 4px 16px rgba(204,144,66,0.08)', padding: isMobile ? 14 : 18 },
    label: { display: 'block', color: '#3B2F2F', fontWeight: 600, marginBottom: 6 },
    input: { width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #e6e2dc', outline: 'none', fontSize: '1rem' },
    saveBtn: { ...actionBtn, width: isMobile ? '100%' : 'auto' },
    badge: { display: 'inline-block', background: '#fffdfa', border: '1px solid #f1e7da', color: '#b87333', borderRadius: 12, padding: '6px 10px', fontWeight: 700 },
  }), [isMobile]);

  useEffect(() => {
    (async () => {
      const shops = await fetchCoffeeShops();
      const map = Object.fromEntries(shops.map(s => [s.id, s]));
      setShopsById(map);
    })();
  }, []);

  useEffect(() => {
    const favCount = (favorites.shops?.length || 0);
    const suggCount = suggestions?.length || 0;
    setStats(prev => ({ ...prev, favoritesCount: favCount, suggestionsCount: suggCount }));
  }, [favorites, suggestions]);


  const handleProfileSave = () => {
    setProfile(profile);
    alert('Profile saved');
  };

  const handleSettingsSave = () => {
    setSettings(settings);
    alert('Settings saved');
  };

  const initials = profile?.googleLinked ? 
    (profile?.name || '').trim()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(w => w[0]?.toUpperCase())
      .join('')
      .slice(0, 2) || 'U' : 
    '?';

  const handleGoogleLinkToggle = () => {
    if (profile.googleLinked) {
      signOut();
      return;
    }
    // Фолбэк: явное окно One Tap, если кнопка GIS не отрисовалась
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    cancelGooglePrompt();
    promptGoogleId({
      clientId,
      onCredential: (cred) => {
        const decoded = decodeJwt(cred);
        signInWithGoogle(decoded, cred);
      }
    }).catch(err => console.error('Google sign-in failed', err));
  };

  // Google button rendering (более стабильный путь, чем prompt)
  const gsiBtnRef = React.useRef(null);
  useEffect(() => {
    let mounted = true;
    if (profile.googleLinked) return;
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) return;
    (async () => {
      try {
        await loadGoogleScript();
        if (!mounted || !gsiBtnRef.current) return;
        // Initialize once; callback запишет профиль
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (response?.credential) {
              const decoded = decodeJwt(response.credential);
              signInWithGoogle(decoded, response.credential);
            }
          },
          auto_select: false,
          context: 'signin',
        });
        // Render official button
        window.google.accounts.id.renderButton(gsiBtnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          shape: 'pill',
          logo_alignment: 'left',
          text: 'signin_with',
        });
      } catch (e) {
        console.warn('Failed to render Google button', e);
      }
    })();
    return () => { mounted = false; };
  }, [profile.googleLinked]);

  const [editModal, setEditModal] = useState({ open: false, suggestionId: null });
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [suggestCafeOpen, setSuggestCafeOpen] = useState(false);
  const openEdit = (sugg) => {
    setEditModal({ open: true, suggestionId: sugg.id, shopId: sugg.shopId, shopName: sugg.shopName, values: Object.fromEntries(Object.entries(sugg.sections || {}).map(([k, v]) => [k, v?.value || ''])) });
  };
  const closeEdit = () => setEditModal({ open: false, suggestionId: null });
  const submitEdit = (payload) => {
    // payload.sections: { key: { value } }
    const flat = Object.fromEntries(Object.entries(payload.sections || {}).map(([k, v]) => [k, v?.value || '']));
    updateSuggestionContent(editModal.suggestionId, flat);
    closeEdit();
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        {/* Header/Identity */}
        <div style={styles.headerCard}>
          {profile.googleLinked && profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="Avatar" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = 'none'; }} style={styles.avatar} />
          ) : (
            <div style={styles.avatar}>{initials}</div>
          )}
          <div style={styles.headerInfo}>
            <div style={styles.headerName}>{profile.googleLinked ? (profile.name?.trim() || 'Guest') : 'Guest'}</div>
            <div style={styles.headerEmail}>{profile.googleLinked ? (profile.email?.trim() || 'Signed in') : 'Sign in to access all features'}</div>
            {/* stats removed for now */}
          </div>
          <div style={styles.headerActions}>
            {profile.googleLinked ? (
              <button
                style={{
                  ...styles.googleBtn,
                  color: '#e74c3c'
                }}
                onClick={handleGoogleLinkToggle}
                title="Log Out"
              >
                Log Out
              </button>
            ) : (
              <div ref={gsiBtnRef} style={{ width: isMobile ? '100%' : 'auto' }} />
            )}
          </div>
        </div>

        {/* Dashboard grid */}
        <div style={styles.grid}>
          <div style={styles.card}>
            <div
              onClick={() => setFavoritesOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', userSelect: 'none', marginTop: 0, marginBottom: favoritesOpen ? 8 : 0
              }}
            >
              <h3 style={{ margin: 0, color: '#b87333' }}>Saved coffee shops</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: 28, height: 24, padding: '0 8px', borderRadius: 12,
                  background: '#fffdfa', border: '1px solid #f1e7da', color: '#b87333', fontWeight: 700
                }}>{favorites.shops?.length || 0}</span>
                <span style={{ color: '#b87333', fontWeight: 700 }}>{favoritesOpen ? '▲' : '▼'}</span>
              </div>
            </div>
            {favoritesOpen && (profile.googleLinked && favorites.shops?.length ? (
              <div style={{ 
                maxHeight: '280px', // Примерно 4 элемента по 70px каждый
                overflowY: 'auto',
                marginTop: 8,
                paddingRight: 4 // Место для скроллбара
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0,1fr))', gap: 10 }}>
                  {favorites.shops.map((id) => (
                    <div key={id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', border: '1px solid #f1e7da', borderRadius: 12, background: '#fffdfa', minHeight: '60px' }}>
                      <div>
                        <div style={{ fontWeight: 800, color: '#b87333' }}>{shopsById[id]?.name || `Shop #${id}`}</div>
                        <div style={{ color: '#6b5f5a', fontSize: '0.95rem' }}>{shopsById[id]?.address || ''}</div>
                      </div>
                      <Link to="/" style={{ color: '#d3914b', textDecoration: 'none', fontWeight: 700 }}>Open →</Link>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ color: '#666', marginTop: 8 }}>No favorites yet</div>
            ))}
            <div style={{ marginTop: 14 }}>
              <Link to="/" style={{ color: '#d3914b', textDecoration: 'none', fontWeight: 700 }}>Go to map →</Link>
            </div>
          </div>
          <div style={styles.card}>
            <div
              onClick={() => setSuggestionsOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', userSelect: 'none', marginTop: 0, marginBottom: suggestionsOpen ? 8 : 0
              }}
            >
              <h3 style={{ margin: 0, color: '#b87333' }}>Suggestions</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  minWidth: 28, height: 24, padding: '0 8px', borderRadius: 12,
                  background: '#fffdfa', border: '1px solid #f1e7da', color: '#b87333', fontWeight: 700
                }}>{suggestions?.length || 0}</span>
                <span style={{ color: '#b87333', fontWeight: 700 }}>{suggestionsOpen ? '▲' : '▼'}</span>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                style={{ ...styles.saveBtn, padding: '8px 12px' }}
                onClick={() => setSuggestCafeOpen(true)}
              >
                Suggest a cafe
              </button>
            </div>
            {suggestionsOpen && (profile.googleLinked && suggestions?.length ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 10, marginTop: 8 }}>
                {suggestions.map(s => (
                  <div key={s.id} style={{ border: '1px solid #f1e7da', borderRadius: 12, padding: 12, background: '#fffdfa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, color: '#b87333' }}>{s.shopName}</div>
                      <span style={{
                        background: s.status === 'done' ? '#d4edda' : s.status === 'withdrawn' ? '#f8d7da' : s.status === 'in_progress' ? '#fff3cd' : '#e2e3e5',
                        color: s.status === 'done' ? '#155724' : s.status === 'withdrawn' ? '#721c24' : s.status === 'in_progress' ? '#856404' : '#383d41',
                        borderRadius: 12,
                        padding: '4px 10px',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}>
                        {s.status === 'done' ? 'Done' : s.status === 'withdrawn' ? 'Withdrawn' : s.status === 'in_progress' ? 'In progress' : 'Pending'}
                      </span>
                    </div>
                    {/* Render sections structured */}
                    <div style={{ color: '#3B2F2F', marginTop: 6 }}>
                      <div><b>Location & Atmosphere:</b> {s.sections?.locationAtmosphere?.leaveAsIs ? 'Leave as is' : (s.sections?.locationAtmosphere?.value || '—')}</div>
                      <div><b>Philosophy & Sourcing:</b> {s.sections?.philosophySourcing?.leaveAsIs ? 'Leave as is' : (s.sections?.philosophySourcing?.value || '—')}</div>
                      <div><b>Equipment & Technique:</b> {s.sections?.equipmentTechnique?.leaveAsIs ? 'Leave as is' : (s.sections?.equipmentTechnique?.value || '—')}</div>
                      <div><b>Our Recommendation:</b> {s.sections?.recommendation?.leaveAsIs ? 'Leave as is' : (s.sections?.recommendation?.value || '—')}</div>
                      <div><b>Working Hours:</b> {s.sections?.workingHours?.leaveAsIs ? 'Leave as is' : (s.sections?.workingHours?.value || '—')}</div>
                    </div>
                    <div style={{ color: '#6b5f5a', fontSize: '0.9rem', marginTop: 8 }}>
                      Last update by: <b>{s.authorName || 'Anonymous'}</b> on {new Date(s.updatedAt).toLocaleString()}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
                      <button
                        style={styles.saveBtn}
                        onClick={() => deleteSuggestion(s.id)}
                      >
                        Withdraw
                      </button>
                      <button
                        style={styles.saveBtn}
                        disabled={s.status !== 'pending'}
                        title={s.status !== 'pending' ? 'Available only while pending' : ''}
                        onClick={() => openEdit(s)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ color: '#666', marginTop: 8 }}>No suggestions yet</div>
            ))}
          </div>
          {editModal.open && (
            <SuggestionModal
              open={editModal.open}
              onClose={closeEdit}
              onSubmit={submitEdit}
              shop={{ id: editModal.shopId, name: editModal.shopName }}
              initialValues={editModal.values}
            />
          )}
          {suggestCafeOpen && (
            <SuggestCafeModal
              open={suggestCafeOpen}
              onClose={() => setSuggestCafeOpen(false)}
              onSubmit={submitCafeSuggestion}
            />
          )}
        </div>

        {/* Profile form only */}
        {profile.googleLinked && (
          <div style={{ ...styles.card, marginTop: 12 }}>
            <h3 style={{ marginTop: 0, color: '#b87333' }}>Profile</h3>
            <div style={styles.grid}>
              <div>
                <label style={styles.label}>Nickname (used in guides)</label>
                <input style={styles.input} value={profile.nickname || ''} onChange={(e) => setProfile({ ...profile, nickname: e.target.value })} placeholder="Nickname shown in updates" />
                <div style={{ color: '#6b5f5a', fontSize: '0.9rem', marginTop: 6 }}>This name will be displayed in guides when your suggestion is published.</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <button style={styles.saveBtn} onClick={handleProfileSave}>Save profile</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


