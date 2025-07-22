import React from 'react';
import logo from '../assets/logo.svg';
import WaitlistTabs from '../components/WaitlistTabs';

const About = () => {
  return (
    <div style={styles.pageBg}>
      <section style={styles.heroSection}>
        <img src={logo} alt="Wanna Coffee Logo" style={styles.logo} />
        <h1 style={styles.heroTitle}>About</h1>
        <p style={styles.heroSubtitle}>Vision & Mission Focused</p>
      </section>

      <section style={styles.earlyInfoBlock}>
        <p style={styles.earlyInfoText}>
          We're brewing something special for you, dear coffee lovers of New York City and specialty cafés.<br/>
          Below, you'll find a bit of early information — we can't reveal much just yet, but if you're eager to see us in action, subscribe at the bottom of this page.<br/>
          Whether you're a coffee enthusiast or a café owner, your support will help us move faster — and we hope to see you very soon.
        </p>
      </section>

      <section style={{
        ...styles.glassSection,
        background: 'linear-gradient(120deg, #fff8f0 60%, #f7e3c6 100%)',
        borderRadius: 24,
        boxShadow: '0 8px 32px rgba(204,144,66,0.13)',
        padding: '2.7rem 2.1rem',
      }}>
        <h2 style={styles.sectionTitle}>How can we help you right now? For now, it's all very simple…</h2>
        <p style={{
          ...styles.sectionText,
          color: '#6a4a24',
          fontWeight: 500,
        }}>
          We're currently testing everything we've built so far. Our database includes around 1,200 coffee shops, each with a short guide verified by our team using AI — we call it the WannaCoffee Impression.<br/><br/>
          You can explore great specialty cafés wherever you are across New York City and Long Island.<br/><br/>
          Please keep in mind that there may be occasional inaccuracies or outdated information — this project is created by a small group of enthusiasts for the residents and visitors of NYC, driven by a genuine love for the craft of true coffee making.<br/><br/>
          Thank you for your interest in our project. If you have any feedback, suggestions, or questions, feel free to reach out to the email listed in the Contact section.
        </p>
      </section>

      <section style={styles.glassSection}>
        <h2 style={styles.sectionTitle}>TrueCost coming soon.</h2>
        <p style={styles.sectionText}>
          We want to make coffee prices fair for coffee lovers — and we're confident that many cafés feel the same. But market realities often get in the way, because at the end of the day, it's still a business.<br/><br/>
          That's why we've developed a special economic model that bridges the gap: offering great coffee prices for customers while increasing margins for cafés. Our goal is to bring this community even closer together.<br/><br/>
          If we can gather enough subscriptions in a short time, we'll be able to show you everything we've been working on very soon.
        </p>
      </section>

      <section style={{...styles.glassSection, ...styles.valueSection}}>
        <div style={styles.valueColumns}>
          <div style={styles.valueCol}>
            <h3 style={styles.valueTitle}>For Coffee Lovers:</h3>
            <ul style={styles.valueList}>
              <li><b>Stay Curious.</b> We're building something new for New York's specialty coffee lovers — and it's just the beginning.</li>
              <li><b>Explore Early.</b> Our AI-verified guide already includes 1,200+ cafés across NYC and Long Island.</li>
              <li><b>Support the Craft.</b> Every visit helps keep independent coffee culture alive and thriving.</li>
              <li><b>Join the Journey.</b> Subscribe below to be among the first to know when we launch something exciting.</li>
            </ul>
          </div>
          <div style={styles.valueCol}>
            <h3 style={styles.valueTitle}>For Coffee Shops:</h3>
            <ul style={styles.valueList}>
              <li><b>We See You.</b> We care deeply about cafés that put heart into their craft — and we built this guide to celebrate exactly that.</li>
              <li><b>Help Us Get It Right.</b> If your café is already listed and something's off, just send us a quick note — we'd love to update it.</li>
              <li><b>Not Listed Yet?</b> Reach out and tell us about your shop — we'll make sure to include you soon.</li>
              <li><b>No Forms. No Fees. Just You.</b> Share your info however you like — email, a few lines, a photo, or even a DM. We'll take care of the rest.</li>
            </ul>
          </div>
        </div>
      </section>

      <section style={styles.glassSection}>
        <h2 style={styles.sectionTitle}>Founded on Passion.</h2>
        <p style={styles.sectionText}>
          Wanna Coffee was born from a genuine love for coffee culture and a deep respect for the entrepreneurs who build it. We're a team of thinkers, creators, and coffee drinkers dedicated to using technology as a force for good. We believe in building things that are not only smart and efficient but also human-centric and community-focused.<br/><br/>
          We're starting this journey by listening, learning, and collaborating with the very people we aim to serve.
        </p>
      </section>

      <section style={styles.ctaSection}>
        <h2 style={styles.sectionTitle}>The Future of Coffee is Collaborative.</h2>
        <p style={styles.sectionText}>
          This is more than a platform—it's a movement to build a more sustainable, connected, and vibrant local coffee culture. And it's just getting started.<br/>
          <b>Be the first to know what's brewing.</b>
        </p>
        <WaitlistTabs />
      </section>
    </div>
  );
};

const styles = {
  pageBg: {
    minHeight: '100vh',
    background: 'linear-gradient(120deg, #f7f7f7 0%, #e9e4df 100%)',
    paddingBottom: 40,
  },
  heroSection: {
    textAlign: 'center',
    padding: '3.5rem 1.5rem 2.5rem 1.5rem',
    background: 'linear-gradient(135deg, #fff8f0 60%, #f7e3c6 100%)',
    borderRadius: '0 0 32px 32px',
    boxShadow: '0 4px 32px rgba(204,144,66,0.08)',
    marginBottom: 32,
  },
  logo: {
    width: 180,
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: '2.8rem',
    fontWeight: 800,
    color: '#a97845',
    margin: 0,
    letterSpacing: '-1px',
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    color: '#b87333',
    margin: '0.5rem 0 0 0',
    fontWeight: 600,
    letterSpacing: '0.5px',
  },
  glassSection: {
    maxWidth: 900,
    margin: '2.5rem auto',
    background: 'rgba(255,255,255,0.65)',
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(204,144,66,0.10)',
    padding: '2.5rem 2rem',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#a97845',
    marginBottom: 18,
    textAlign: 'center',
  },
  sectionText: {
    fontSize: '1.15rem',
    color: '#3a2d1a',
    lineHeight: 1.7,
    textAlign: 'center',
    margin: 0,
  },
  valueSection: {
    padding: '2.5rem 1rem',
  },
  valueColumns: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  valueCol: {
    flex: '1 1 320px',
    minWidth: 260,
    maxWidth: 400,
    background: 'rgba(255,255,255,0.85)',
    borderRadius: 18,
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    padding: '1.5rem 1.2rem',
    margin: '0.5rem 0',
  },
  valueTitle: {
    fontSize: '1.2rem',
    color: '#b87333',
    fontWeight: 700,
    marginBottom: 12,
    textAlign: 'center',
  },
  valueList: {
    color: '#3a2d1a',
    fontSize: '1.05rem',
    lineHeight: 1.7,
    paddingLeft: 18,
    margin: 0,
    listStyle: 'disc',
  },
  ctaSection: {
    maxWidth: 500,
    margin: '2.5rem auto 3.5rem auto',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
    boxShadow: '0 8px 32px rgba(204,144,66,0.13)',
    padding: '2.5rem 2rem',
    textAlign: 'center',
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
  },
  earlyInfoBlock: {
    maxWidth: 700,
    margin: '0 auto 2.2rem auto',
    background: 'rgba(255,255,255,0.7)',
    borderRadius: 20,
    boxShadow: '0 4px 24px rgba(204,144,66,0.10)',
    padding: '1.7rem 1.3rem',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
  },
  earlyInfoText: {
    color: '#a97845',
    fontSize: '1.13rem',
    fontWeight: 500,
    lineHeight: 1.7,
    margin: 0,
  },
};

export default About;