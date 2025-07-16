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

      <section style={styles.glassSection}>
        <h2 style={styles.sectionTitle}>Great Coffee Should Be for Everyone.</h2>
        <p style={styles.sectionText}>
          It's a simple idea, but one that gets lost in a world of complex choices and compromises. We started Wanna Coffee because we believe in the power of a great cup of coffee—not just as a drink, but as a cornerstone of community, craft, and daily ritual.<br/><br/>
          We saw a gap between the passionate local artisans who pour their hearts into every bean, and the people who want to enjoy their craft without it feeling like a luxury. We knew there had to be a smarter, fairer way for everyone to win.
        </p>
      </section>

      <section style={styles.glassSection}>
        <h2 style={styles.sectionTitle}>Our Vision: An Ecosystem, Not Just an App.</h2>
        <p style={styles.sectionText}>
          We are building a technology platform designed to rebalance the scales of the local coffee economy. Our vision is to create a seamless world where enjoying the best coffee is effortless for customers, and running a successful coffee business is more achievable for independent entrepreneurs.<br/><br/>
          We're moving beyond simple discounts or directory listings. We're creating a sustainable ecosystem where technology empowers connection, supports local businesses, and makes the simple pleasure of a great coffee more accessible than ever before.
        </p>
      </section>

      <section style={styles.glassSection}>
        <h2 style={styles.sectionTitle}>How We're Doing It: The Wanna Coffee Pass.</h2>
        <p style={styles.sectionText}>
          At the heart of our platform is the Wanna Coffee Pass—a single, digital key that unlocks the city's independent coffee scene.<br/><br/>
          It's a simple concept: pre-load your Pass and use it to seamlessly pay at a growing network of curated partner cafés. This isn't just a new way to pay; it's a new way to experience coffee. It's about freedom, discovery, and the confidence that you're always getting fair value while supporting the businesses that make our neighborhoods unique.
        </p>
      </section>

      <section style={{...styles.glassSection, ...styles.valueSection}}>
        <div style={styles.valueColumns}>
          <div style={styles.valueCol}>
            <h3 style={styles.valueTitle}>For Coffee Lovers:</h3>
            <ul style={styles.valueList}>
              <li><b>Freedom to Explore.</b> The Wanna Coffee Pass is your ticket to a city-wide coffee adventure.</li>
              <li><b>Discover:</b> Find hidden gems and support the passionate people behind the counter.</li>
              <li><b>Enjoy Seamlessly:</b> Forget fumbling for cards or cash. A simple scan is all it takes.</li>
              <li><b>Be Part of a Community:</b> Join a network of people who, like you, value quality, craft, and supporting local.</li>
            </ul>
          </div>
          <div style={styles.valueCol}>
            <h3 style={styles.valueTitle}>For Coffee Shops:</h3>
            <ul style={styles.valueList}>
              <li><b>Your Partner in Growth.</b> We know your focus is on making incredible coffee. Ours is on helping you build a thriving business.</li>
              <li><b>Connect with New Customers:</b> We bring a motivated, high-intent audience directly to your door.</li>
              <li><b>Unlock Actionable Insights:</b> Our partner dashboard provides valuable data to help you understand trends and make smarter decisions.</li>
              <li><b>A Platform for Your Brand:</b> We give you the tools to not only serve customers but to grow your brand, sell your products, and host your events.</li>
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
};

export default About;