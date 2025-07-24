import React from 'react';
import WaitlistTabs from '../components/WaitlistTabs';
import heroPhoto from '../assets/jakub-kapusnak-2HWYiXdTKOQ-unsplash.jpg';
import numbersPhoto from '../assets/brent-gorwin-vhQUnmnOLys-unsplash.jpg';

function HighlightBlock({ children }) {
  return <div style={styles.highlightBlock}><span style={styles.highlightText}>{children}</span></div>;
}

function NumbersBlock() {
  return (
    <div style={styles.numbersBlockWrap}>
      <img src={numbersPhoto} alt="Cafe" style={styles.numbersBgImg} />
      <div style={styles.numbersBgFade}></div>
      <div style={styles.numbersBlock}>
        <div style={styles.numberItem}>
          <div style={styles.numberValue}>1,200+</div>
          <div style={styles.numberLabel}>Verified cafés in NYC</div>
        </div>
        <div style={styles.numberItem}>
          <div style={styles.numberValue}>100%</div>
          <div style={styles.numberLabel}>Independent. No chains.</div>
        </div>
        <div style={styles.numberItem}>
          <div style={styles.numberValue}>0$</div>
          <div style={styles.numberLabel}>Cost for cafés to be listed</div>
        </div>
        <div style={styles.numberItem}>
          <div style={styles.numberValue}>Real</div>
          <div style={styles.numberLabel}>AI + human-curated content</div>
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <div style={styles.gridRoot}>
      {/* Hero: две колонки */}
      <div style={styles.heroGrid}>
        <div style={styles.heroTextCol}>
          <h1 style={styles.heroHeadline}>Closer than you think, there’s a café that understands.</h1>
          <p style={styles.heroSubtext}>
            Wanna Coffee is a mobile-first discovery platform for independent cafés in NYC.<br />
            You’re here early — and that means something.
          </p>
          <a href="#waitlist" style={styles.heroBtn}>Join the Waitlist</a>
        </div>
        <div style={styles.heroImgCol}>
          <img src={heroPhoto} alt="Cafe" style={styles.heroImg} />
        </div>
      </div>

      {/* NumbersBlock: 4 колонки */}
      <NumbersBlock />

      {/* Основной grid-контент */}
      <div style={styles.sectionsGrid}>
        <HighlightBlock>AI-verified café profiles, written with care.</HighlightBlock>
        <div style={styles.cardSection}>
          <h2 style={styles.sectionTitle}>Not another app. Not another feed.</h2>
          <div style={styles.sectionText}>
            Wanna Coffee helps you find cafés worth walking to.<br />
            We’ve verified over 1,200 specialty coffee shops across NYC and Long Island.<br />
            Each listing includes a short guide we call the Wanna Coffee Impression —<br />
            a mix of AI assistance and human insight.
          </div>
        </div>
        <HighlightBlock>Each café comes with a real review — not a rating.</HighlightBlock>
        <div style={styles.cardSection}>
          <h2 style={styles.sectionTitle}>What makes us different</h2>
          <ul style={styles.bulletList}>
            <li>1,200+ verified independent cafés</li>
            <li>No chains. No paid placements</li>
            <li>Real content. No spam. No ads.</li>
          </ul>
        </div>
        <HighlightBlock>Zero ads. Zero pay-to-play. Just good coffee.</HighlightBlock>
      </div>

      {/* Split-блок: две карточки в ряд */}
      <div style={styles.splitGrid}>
        <div style={styles.splitPanel}>
          <h3 style={styles.splitTitle}>For Coffee Lovers</h3>
          <ul style={styles.splitList}>
            <li><b>Stay Curious.</b><br />We’re building a new way to discover great cafés — made for people who care.</li>
            <li><b>Explore Early.</b><br />Our guide already covers 1,200+ verified spots across NYC and Long Island.</li>
            <li><b>Support the Craft.</b><br />Every visit helps independent coffee thrive — one cup at a time.</li>
            <li><b>Join the Journey.</b><br />This is just the beginning. Be part of something grounded, local, and real.</li>
          </ul>
        </div>
        <div style={styles.splitPanel}>
          <h3 style={styles.splitTitle}>For Coffee Shops</h3>
          <ul style={styles.splitList}>
            <li><b>We Notice Craft.</b><br />We celebrate cafés that care — you’re the reason this platform exists.</li>
            <li><b>Let’s Get It Right.</b><br />Already listed but something’s off? Let us know, we’ll fix it fast.</li>
            <li><b>Not on the Map Yet?</b><br />Reach out and we’ll make sure your shop gets included soon.</li>
            <li><b>No Portals. No Hassle. Just Real Contact.</b><br />Send a DM, an email, even a photo — we’ll handle the rest.</li>
          </ul>
        </div>
      </div>

      {/* CTA: широкая карточка */}
      <div style={styles.ctaCard} id="waitlist">
        <h2 style={styles.sectionTitle}>Ready to join?</h2>
        <div style={styles.sectionText}>
          Wanna Coffee is still taking shape. But if you’ve read this far, you’re probably the kind of person we’re building it for.
        </div>
        <div style={styles.finalFormWrap}>
          <WaitlistTabs />
          <div style={styles.finalFormNote}>
            No algorithms. No spam. Just honest updates and something good in the works.
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  gridRoot: {
    width: '100%',
    maxWidth: 1440,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 40,
    padding: '0 16px 48px 16px',
    boxSizing: 'border-box',
  },
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 0,
    borderRadius: 24,
    overflow: 'hidden',
    background: '#fff8f0',
    boxShadow: '0 4px 24px rgba(204,144,66,0.10)',
    minHeight: 320,
    marginTop: 24,
    marginBottom: 0,
    position: 'relative',
  },
  heroTextCol: {
    padding: '2.2rem 1.2rem 1.2rem 1.2rem',
    zIndex: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(120,80,40,0.92) 0%, rgba(100,65,30,0.96) 50%, rgba(80,50,20,0.99) 100%)',
  },
  heroImgCol: {
    display: 'none',
  },
  heroImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    minHeight: 220,
  },
  heroHeadline: {
    fontSize: '2.1rem',
    fontWeight: 800,
    color: '#fff',
    marginBottom: '0.5rem',
    textAlign: 'left',
    lineHeight: 1.18,
    letterSpacing: '-0.5px',
    textShadow: '0 2px 12px rgba(40,30,10,0.18)',
  },
  heroSubtext: {
    fontSize: '1.15rem',
    color: '#fff',
    marginBottom: '1.2rem',
    textAlign: 'left',
    lineHeight: 1.6,
    fontWeight: 500,
    textShadow: '0 2px 12px rgba(40,30,10,0.18)',
  },
  heroBtn: {
    display: 'inline-block',
    background: 'linear-gradient(90deg, #cc9042 60%, #b87333 100%)',
    color: '#fff',
    fontWeight: 700,
    borderRadius: 22,
    padding: '0.9rem 2.2rem',
    fontSize: '1.13rem',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(204,144,66,0.12)',
    marginTop: '0.7rem',
    border: 'none',
    transition: 'box-shadow 0.18s, transform 0.18s',
    textAlign: 'center',
  },
  numbersBlockWrap: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    margin: '1.2rem 0',
    minHeight: 180,
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    background: '#fff',
  },
  numbersBgImg: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
    pointerEvents: 'none',
  },
  numbersBgFade: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
    background: 'linear-gradient(180deg, rgba(255,248,240,0.82) 0%, rgba(247,227,198,0.88) 100%)',
  },
  numbersBlock: {
    position: 'relative',
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.7rem',
    padding: '1.1rem 0.7rem',
    textAlign: 'center',
    maxWidth: 380,
    marginLeft: 'auto',
    marginRight: 'auto',
    minHeight: 180,
    alignItems: 'center',
    background: 'none',
  },
  numberItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  numberValue: {
    fontSize: '2.1rem',
    fontWeight: 800,
    color: '#b87333',
    lineHeight: 1.1,
    letterSpacing: '-1px',
  },
  numberLabel: {
    fontSize: '1.01rem',
    color: '#6a4a24',
    fontWeight: 600,
    marginTop: 2,
    lineHeight: 1.2,
  },
  sectionsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 24,
    margin: '0 auto',
    width: '100%',
    maxWidth: 900,
  },
  cardSection: {
    background: '#fff',
    borderRadius: 16,
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    padding: '1.2rem 1.2rem 1.1rem 1.2rem',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  sectionTitle: {
    fontSize: '1.25rem',
    fontWeight: 800,
    color: '#a97845',
    marginBottom: '0.5rem',
    textAlign: 'left',
    lineHeight: 1.18,
    letterSpacing: '-0.5px',
  },
  sectionText: {
    fontSize: '1.15rem',
    color: '#6a4a24',
    lineHeight: 1.45,
    marginBottom: '0.2rem',
    textAlign: 'left',
    fontWeight: 500,
  },
  bulletList: {
    listStyle: 'disc inside',
    padding: 0,
    margin: '0.7rem 0 0 0',
    color: '#6a4a24',
    fontSize: '1.08rem',
    textAlign: 'left',
    maxWidth: 420,
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.7,
    fontWeight: 500,
  },
  highlightBlock: {
    background: 'linear-gradient(90deg, #ffe7c2 0%, #fff8f0 60%, #f7e3c6 100%)',
    color: '#b87333',
    borderRadius: 18,
    boxShadow: '0 2px 16px 0 rgba(204,144,66,0.10), 0 0 0 2px #f7e3c6',
    border: '1.5px solid #e6c18a',
    padding: '1.3rem 1.2rem',
    margin: 0,
    textAlign: 'center',
    letterSpacing: '0.01em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 64,
    position: 'relative',
    overflow: 'hidden',
  },
  highlightText: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#b87333',
    lineHeight: 1.22,
    letterSpacing: '-0.5px',
    textShadow: '0 2px 8px rgba(204,144,66,0.07)',
    width: '100%',
    display: 'block',
  },
  splitGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: 24,
    width: '100%',
    maxWidth: 900,
    margin: '0 auto',
  },
  splitPanel: {
    flex: 1,
    minWidth: 160,
    background: '#fff8f0',
    borderRadius: 14,
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    padding: '1.1rem 1rem',
    textAlign: 'left',
    margin: 0,
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  splitTitle: {
    color: '#b87333',
    fontSize: '1.22rem',
    fontWeight: 800,
    marginBottom: '0.7rem',
    textAlign: 'left',
  },
  splitList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    color: '#6a4a24',
    fontSize: '1.08rem',
    lineHeight: 1.35,
    fontWeight: 500,
    textAlign: 'left',
  },
  ctaCard: {
    background: '#fff8f0',
    borderRadius: 20,
    boxShadow: '0 4px 24px rgba(204,144,66,0.10)',
    padding: '2.2rem 1.2rem 1.5rem 1.2rem',
    maxWidth: 700,
    margin: '0 auto',
    textAlign: 'left',
    marginTop: 24,
  },
  finalFormWrap: {
    margin: '1.2rem auto 0 auto',
    maxWidth: 400,
  },
  finalFormNote: {
    fontSize: '0.95rem',
    color: '#b87333',
    marginTop: '1.1rem',
    opacity: 0.85,
    textAlign: 'left',
    fontStyle: 'italic',
  },
};

// Desktop grid
if (typeof window !== 'undefined' && window.innerWidth >= 900) {
  styles.gridRoot.maxWidth = 1440;
  styles.gridRoot.gap = 56;
  styles.heroGrid.gridTemplateColumns = '1fr 1fr';
  styles.heroGrid.minHeight = 420;
  styles.heroTextCol.padding = '3.5rem 2.5rem 2.5rem 2.5rem';
  styles.heroImgCol.display = 'block';
  styles.heroImg.minHeight = 320;
  styles.numbersBlock.gridTemplateColumns = 'repeat(4, 1fr)';
  styles.numbersBlock.maxWidth = 1100;
  styles.numbersBlock.padding = '2.2rem 1.5rem';
  styles.sectionsGrid.gridTemplateColumns = 'repeat(2, 1fr)';
  styles.sectionsGrid.gap = 40;
  styles.cardSection.padding = '2.2rem 2.5rem 1.7rem 2.5rem';
  styles.cardSection.maxWidth = 520;
  styles.highlightBlock.fontSize = '1.55rem';
  styles.highlightBlock.padding = '2rem 2.5rem';
  styles.splitGrid.gridTemplateColumns = '1fr 1fr';
  styles.splitGrid.gap = 40;
  styles.splitPanel.maxWidth = 420;
  styles.splitPanel.padding = '2rem 1.5rem';
  styles.ctaCard.maxWidth = 900;
  styles.ctaCard.padding = '3rem 2.5rem 2.5rem 2.5rem';
  styles.finalFormWrap.maxWidth = 480;
  styles.finalFormNote.fontSize = '1.08rem';
}