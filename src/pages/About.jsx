import React from 'react';
import WaitlistTabs from '../components/WaitlistTabs';
import heroPhoto from '../assets/lee-campbell-31QfYo1h32o-unsplash.jpg';
import numbersPhoto from '../assets/brent-gorwin-vhQUnmnOLys-unsplash.jpg';
import loversPhoto from '../assets/jakub-kapusnak-2HWYiXdTKOQ-unsplash.jpg';
import shopsPhoto from '../assets/quan-le-GKnCGtuR4xs-unsplash.jpg';

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
  const isMobile = typeof window !== 'undefined' ? window.innerWidth < 900 : false;
  return (
    <div style={styles.gridRoot}>
      {/* Hero: фото и фейд на весь блок, текст поверх */}
      <div style={styles.heroGrid}>
        <div style={styles.heroBgWrap}>
          <img src={heroPhoto} alt="Cafe" style={styles.heroBgImg} />
          <div style={styles.heroBgFade}></div>
        </div>
        <div style={styles.heroContentWrap}>
          <div style={styles.heroTextCol}>
            <div style={styles.heroTextContent}>
              <h1 style={{
                ...styles.heroHeadline,
                textShadow: '0 4px 18px rgba(40,30,10,0.45)',
                color: '#f7e3c6'
              }}>Closer than you think, there’s a café that understands.</h1>
              <p style={styles.heroSubtext}>
                Wanna Coffee is a mobile-first discovery platform for independent cafés in NYC.<br />
                You’re here early — and that means something.
              </p>
              <a href="#waitlist" style={styles.heroBtn}>Join the Waitlist</a>
            </div>
          </div>
          <div style={styles.heroImgCol}></div>
        </div>
      </div>

      {/* NumbersBlock: только на десктопе сразу после hero */}
      {!isMobile
        ? <div style={styles.mainContent}><NumbersBlock /></div>
        : null}

      {/* Основной grid-контент */}
      {isMobile ? (
        <div style={styles.sectionsGrid}>
          <HighlightBlock>AI-verified café profiles, written with care.</HighlightBlock>
          <div style={styles.cardSection}>
            <h2 style={{...styles.sectionTitle, fontSize: window.innerWidth >= 900 ? '2rem' : '1.5rem'}}>Not another app. Not another feed.</h2>
            <div style={styles.sectionText}>
              Wanna Coffee helps you find cafés worth walking to.<br />
              We’ve verified over 1,200 specialty coffee shops across NYC and Long Island.<br />
              Each listing includes a short guide we call the Wanna Coffee Impression —<br />
              a mix of AI assistance and human insight.
            </div>
          </div>
          <HighlightBlock>Each café comes with a real review — not a rating.</HighlightBlock>
          <div style={styles.cardSection}>
            <h2 style={{...styles.sectionTitle, fontSize: window.innerWidth >= 900 ? '2rem' : '1.5rem'}}>What makes us different</h2>
            <ul style={styles.bulletList}>
              <li>1,200+ verified independent cafés</li>
              <li>No chains. No paid placements</li>
              <li>Real content. No spam. No ads.</li>
            </ul>
          </div>
          <HighlightBlock>
            Zero ads. Zero pay-to-play.<br />Just good coffee.
          </HighlightBlock>
        </div>
      ) : (
        <div style={styles.mainContent}>
          <div style={styles.sectionsGrid}>
            {/* 1-я строка: слева хайлайт, справа текст */}
            <div style={{...styles.highlightBlock, gridColumn: 1, gridRow: 1}}>AI-verified café profiles, written with care.</div>
            <div style={{...styles.cardSection, gridColumn: 2, gridRow: 1}}>
              <h2 style={{...styles.sectionTitle, fontSize: window.innerWidth >= 900 ? '2rem' : '1.5rem'}}>Not another app. Not another feed.</h2>
              <div style={styles.sectionText}>
                Wanna Coffee helps you find cafés worth walking to.<br />
                We’ve verified over 1,200 specialty coffee shops across NYC and Long Island.<br />
                Each listing includes a short guide we call the Wanna Coffee Impression —<br />
                a mix of AI assistance and human insight.
              </div>
            </div>
            {/* 2-я строка: слева текст, справа хайлайт */}
            <div style={{...styles.cardSection, gridColumn: 1, gridRow: 2}}>
              <h2 style={{...styles.sectionTitle, fontSize: window.innerWidth >= 900 ? '2rem' : '1.5rem'}}>What makes us different</h2>
              <ul style={styles.bulletList}>
                <li>1,200+ verified independent cafés</li>
                <li>No chains. No paid placements</li>
                <li>Real content. No spam. No ads.</li>
              </ul>
            </div>
            <div style={{...styles.highlightBlock, gridColumn: 2, gridRow: 2}}>Each café comes with a real review — not a rating.</div>
            {/* 3-я строка: слева хайлайт, справа текст */}
            <div style={{...styles.highlightBlock, gridColumn: 1, gridRow: 3}}>
              Zero ads. Zero pay-to-play. Just good coffee.
            </div>
            <div style={{...styles.cardSection, gridColumn: 2, gridRow: 3}}></div>
          </div>
        </div>
      )}

      {/* Split-блок: две карточки в ряд */}
      {!isMobile
        ? <div style={styles.mainContent}><div style={styles.splitGrid}>
        <div style={{...styles.splitPanel, ...styles.splitPanelWithBg, backgroundImage: `linear-gradient(180deg, rgba(40,25,10,0.82) 0%, rgba(40,25,10,0.45) 70%, rgba(40,25,10,0.08) 100%), url(${loversPhoto})`}}>
          <h3 style={{
            ...styles.splitTitle,
            fontSize: window.innerWidth >= 900 ? '2.4rem' : '1.8rem',
            color: '#f7e3c6',
            textShadow: '0 4px 18px rgba(40,30,10,0.45)'
          }}>For Coffee Lovers</h3>
          <ul style={{...styles.splitList, color: '#ffe7c2'}}>
            <li><b>Stay Curious.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>We’re building a new way to discover great cafés — made for people who care.</span></li>
            <li><b>Explore Early.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>Our guide already covers 1,200+ verified spots across NYC and Long Island.</span></li>
            <li><b>Support the Craft.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>Every visit helps independent coffee thrive — one cup at a time.</span></li>
            <li><b>Join the Journey.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>This is just the beginning. Be part of something grounded, local, and real.</span></li>
          </ul>
        </div>
        <div style={{...styles.splitPanel, ...styles.splitPanelWithBg, backgroundImage: `linear-gradient(180deg, rgba(40,25,10,0.82) 0%, rgba(40,25,10,0.45) 70%, rgba(40,25,10,0.08) 100%), url(${shopsPhoto})`}}>
          <h3 style={{
            ...styles.splitTitle,
            fontSize: window.innerWidth >= 900 ? '2.4rem' : '1.8rem',
            color: '#f7e3c6',
            textShadow: '0 4px 18px rgba(40,30,10,0.45)'
          }}>For Coffee Shops</h3>
          <ul style={{...styles.splitList, color: '#ffe7c2'}}>
            <li><b>We Notice Craft.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>We celebrate cafés that care — you’re the reason this platform exists.</span></li>
            <li><b>Let’s Get It Right.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>Already listed but something’s off? Let us know, we’ll fix it fast.</span></li>
            <li><b>Not on the Map Yet?</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>Reach out and we’ll make sure your shop gets included soon.</span></li>
            <li><b>No Portals. No Hassle. Just Real Contact.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>Send a DM, an email, even a photo — we’ll handle the rest.</span></li>
          </ul>
        </div>
      </div></div>
        : <div style={styles.splitGrid}>
        <div style={{...styles.splitPanel, ...styles.splitPanelWithBg, backgroundImage: `linear-gradient(180deg, rgba(40,25,10,0.82) 0%, rgba(40,25,10,0.45) 70%, rgba(40,25,10,0.08) 100%), url(${loversPhoto})`}}>
          <h3 style={{
            ...styles.splitTitle,
            fontSize: window.innerWidth >= 900 ? '2.4rem' : '1.8rem',
            color: '#f7e3c6',
            textShadow: '0 4px 18px rgba(40,30,10,0.45)'
          }}>For Coffee Lovers</h3>
          <ul style={{...styles.splitList, color: '#ffe7c2'}}>
            <li><b>Stay Curious.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>We’re building a new way to discover great cafés — made for people who care.</span></li>
            <li><b>Explore Early.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>Our guide already covers 1,200+ verified spots across NYC and Long Island.</span></li>
            <li><b>Support the Craft.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>Every visit helps independent coffee thrive — one cup at a time.</span></li>
            <li><b>Join the Journey.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>This is just the beginning. Be part of something grounded, local, and real.</span></li>
          </ul>
        </div>
        <div style={{...styles.splitPanel, ...styles.splitPanelWithBg, backgroundImage: `linear-gradient(180deg, rgba(40,25,10,0.82) 0%, rgba(40,25,10,0.45) 70%, rgba(40,25,10,0.08) 100%), url(${shopsPhoto})`}}>
          <h3 style={{
            ...styles.splitTitle,
            fontSize: window.innerWidth >= 900 ? '2.4rem' : '1.8rem',
            color: '#f7e3c6',
            textShadow: '0 4px 18px rgba(40,30,10,0.45)'
          }}>For Coffee Shops</h3>
          <ul style={{...styles.splitList, color: '#ffe7c2'}}>
            <li><b>We Notice Craft.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>We celebrate cafés that care — you’re the reason this platform exists.</span></li>
            <li><b>Let’s Get It Right.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>Already listed but something’s off? Let us know, we’ll fix it fast.</span></li>
            <li><b>Not on the Map Yet?</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>Reach out and we’ll make sure your shop gets included soon.</span></li>
            <li><b>No Portals. No Hassle. Just Real Contact.</b><br /><span style={{fontSize: '0.97em', fontWeight: 300}}>Send a DM, an email, even a photo — we’ll handle the rest.</span></li>
          </ul>
        </div>
      </div>}

      {/* NumbersBlock: на мобильной версии перед формой */}
      {isMobile && <NumbersBlock />}

      {/* CTA: широкая карточка */}
      {!isMobile
        ? <div style={styles.mainContent}><div style={styles.ctaCard} id="waitlist">
        <h2 style={{...styles.sectionTitle, fontSize: window.innerWidth >= 900 ? '2rem' : '1.5rem'}}>Ready to join?</h2>
        <div style={styles.sectionText}>
          Wanna Coffee is still taking shape. But if you’ve read this far, you’re probably the kind of person we’re building it for.
        </div>
        <div style={styles.finalFormWrap}>
          <WaitlistTabs />
          <div style={styles.finalFormNote}>
            No algorithms. No spam. Just honest updates and something good in the works.
          </div>
        </div>
      </div></div>
        : <div style={styles.ctaCard} id="waitlist">
        <h2 style={{...styles.sectionTitle, fontSize: window.innerWidth >= 900 ? '2rem' : '1.5rem'}}>Ready to join?</h2>
        <div style={styles.sectionText}>
          Wanna Coffee is still taking shape. But if you’ve read this far, you’re probably the kind of person we’re building it for.
        </div>
        <div style={styles.finalFormWrap}>
          <WaitlistTabs />
          <div style={styles.finalFormNote}>
            No algorithms. No spam. Just honest updates and something good in the works.
          </div>
        </div>
      </div>}
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
    gap: 24,
    padding: '0 16px 48px 16px',
    boxSizing: 'border-box',
  },
  heroGrid: {
    position: 'relative',
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
  },
  heroBgWrap: {
    display: 'block',
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
    pointerEvents: 'none',
  },
  heroBgImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 0,
  },
  heroBgFade: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
    pointerEvents: 'none',
    background: 'linear-gradient(90deg, rgba(40,25,10,0.92) 0%, rgba(40,25,10,0.85) 40%, rgba(40,25,10,0.01) 100%)',
  },
  heroContentWrap: {
    position: 'relative',
    zIndex: 2,
    display: 'grid',
    gridTemplateColumns: '1fr',
    width: '100%',
    height: '100%',
  },
  heroTextCol: {
    position: 'relative',
    padding: '2.2rem 1.2rem 1.2rem 1.2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    minHeight: 220,
    width: '100%',
    background: 'none',
    overflow: 'visible',
  },
  heroTextContent: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  heroImgCol: {
    display: 'none',
    width: '100%',
    height: '100%',
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
    margin: 0,
    minHeight: 180,
    border: '1.5px solid #e6c18a',
    boxShadow: '0 2px 16px 0 rgba(204,144,66,0.10), 0 0 0 2px #f7e3c6',
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
    paddingLeft: 0,
    paddingRight: 0,
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
    fontSize: '1.15rem',
    textAlign: 'left',
    maxWidth: '100%',
    marginLeft: 0,
    marginRight: 0,
    lineHeight: 1.7,
    fontWeight: 500,
    gap: '0.5em',
  },
  highlightBlock: {
    background: 'linear-gradient(90deg, #ffe7c2 0%, #f7e3c6 100%)',
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
    marginTop: 0,
    marginBottom: 0,
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
    marginTop: 16,
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
  splitPanelWithBg: {
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    position: 'relative',
    color: '#fff',
    textShadow: '0 2px 12px rgba(40,30,10,0.18)',
  },
  mainContent: {
    maxWidth: 1100,
    margin: '0 auto',
    width: '100%',
  },
};

// Desktop grid
if (typeof window !== 'undefined' && window.innerWidth >= 900) {
  styles.gridRoot.maxWidth = 1440;
  styles.gridRoot.gap = 32;
  styles.heroGrid.gridTemplateColumns = '1fr';
  styles.heroGrid.minHeight = 420;
  styles.heroBgWrap.display = 'block';
  styles.heroBgWrap.position = 'absolute';
  styles.heroBgWrap.left = 0;
  styles.heroBgWrap.top = 0;
  styles.heroBgWrap.width = '100%';
  styles.heroBgWrap.height = '100%';
  styles.heroBgWrap.zIndex = 0;
  styles.heroContentWrap.gridTemplateColumns = '1fr 1fr';
  styles.heroTextCol.padding = '3.5rem 2.5rem 2.5rem 2.5rem';
  styles.heroTextCol.minHeight = 320;
  styles.heroTextCol.alignItems = 'flex-start';
  styles.heroImgCol.display = 'block';
  styles.heroImgCol.width = '100%';
  styles.heroImgCol.height = '100%';
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
  styles.heroTextCol.background = 'none';
  styles.heroTextCol.overflow = 'visible';
  styles.numbersBlockWrap.margin = 0;
  styles.ctaCard.marginTop = 24;
}