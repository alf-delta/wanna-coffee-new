import React from 'react';
import WCForesightLogo from '../assets/WC_FORESIGHT.svg';
import WaitlistForm from '../components/WaitlistForm';

const coreBenefits = [
  {
    icon: '🧲',
    title: 'Grow Your Customer Base',
    desc: 'Gain access to our exclusive network of coffee lovers, attracted by our unique True Cost pricing model. We convert the thousands of people walking past your door into paying customers who are eager to discover quality independent cafés.'
  },
  {
    icon: '📈',
    title: 'Increase Profit Per Customer',
    desc: 'Our model is built for profitability. We bring customers to your counter for a low-margin "hook" product, then provide you with the tools and insights to upsell them high-margin items like pastries, retail beans, and event tickets.'
  },
  {
    icon: '🔮',
    title: 'Reduce Waste & Inefficiency',
    desc: 'Stop guessing. Our groundbreaking Foresight™ platform analyzes city-wide traffic data and user patterns to give you accurate predictions on customer flow and demand, helping you optimize inventory and staffing to cut costs.'
  },
  {
    icon: '🛒',
    title: 'Launch Your Digital Storefront',
    desc: 'Instantly open an e-commerce channel through our integrated marketplace. Sell your roasted beans, branded merchandise, and brewing equipment to our entire user base, creating a new, significant revenue stream.'
  },
];

const howItWorks = [
  {
    step: '1',
    title: 'Onboard in Minutes',
    subtitle: 'Easy Setup, No Upfront Cost.',
    desc: 'Create your business profile and list your core offerings on our platform. Our team will guide you through a quick and simple setup process.'
  },
  {
    step: '2',
    title: 'Welcome New Customers',
    subtitle: 'We Bring Them to Your Door.',
    desc: 'Our users, or "Brewers," will visit your shop to redeem their Brews for coffee. Our simple web-based POS tool allows any staff member to securely scan customer QR codes with any smartphone or tablet. No new hardware required.'
  },
  {
    step: '3',
    title: 'Leverage Data to Grow',
    subtitle: 'Your Business, Powered by Foresight™.',
    desc: 'Access your private merchant dashboard. See real-time analytics, get actionable traffic forecasts, understand what your customers want, and make data-driven decisions that boost your bottom line.'
  },
  {
    step: '4',
    title: 'You Control Your Business',
    subtitle: 'You Ship, You Serve, You Earn.',
    desc: 'You retain full control over your operations, your brand, and your customer service. We provide the technology and the traffic; you provide the excellent coffee and experience that makes them come back.'
  },
];

const advantages = [
  {
    icon: '🤝',
    title: 'A True Partnership Model',
    desc: 'Our revenue share is designed to be fair. We focus on creating a sustainable ecosystem where True Cost pricing drives traffic, and our upsell tools drive your profit.'
  },
  {
    icon: '⚡',
    title: 'Proprietary Technology',
    desc: 'Our Foresight™ predictive analytics engine is a game-changer, available exclusively to our partners. This is technology that was previously only accessible to enterprise-level corporations.'
  },
  {
    icon: '👥',
    title: 'A Curated & Engaged Community',
    desc: 'You\'re not just getting "users," you\'re getting access to a community of genuine specialty coffee enthusiasts who are actively looking to support local businesses like yours.'
  },
  {
    icon: '🎓',
    title: 'Dedicated Support & Resources',
    desc: 'From onboarding assistance to insights from our Wanna Coffee Academy, our team is dedicated to helping you get the most out of the platform.'
  },
];

const Foresight = () => (
  <div style={styles.page}>
    {/* Hero Section */}
    <section style={styles.heroSection}>
      <div style={styles.heroTitleRow}>
        <img src={WCForesightLogo} alt="Wanna Coffee Foresight Logo" className="hero-logo-unified" />
      </div>
      <h1 style={styles.heroTitle}>Your Growth Partner in Specialty Coffee</h1>
      <p style={styles.heroDesc}>
        WannaCoffee is a technology platform designed to solve the two biggest challenges for independent coffee shops: acquiring new customers and increasing operational profitability. We're not another delivery app or discount service. We are a dedicated growth engine, connecting you with a new, motivated audience and providing you with proprietary data tools to make smarter business decisions. Join us to turn foot traffic into loyal customers and data into profit.
      </p>
    </section>

    {/* Core Value Proposition */}
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>🎯 How We Help You Thrive</h2>
      <div style={styles.benefitsGrid}>
        {coreBenefits.map(benefit => (
          <div key={benefit.title} style={styles.benefitCard}>
            <span style={styles.benefitIcon}>{benefit.icon}</span>
            <div>
              <h3 style={styles.benefitTitle}>{benefit.title}</h3>
              <p style={styles.benefitDesc}>{benefit.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* How It Works */}
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>⚙️ A Simple & Powerful Partnership</h2>
      <div style={styles.howItWorksGrid}>
        {howItWorks.map(step => (
          <div key={step.step} style={styles.howItWorksCard}>
            <div style={styles.howItWorksStep}>{step.step}</div>
            <h4 style={styles.howItWorksTitle}>{step.title}</h4>
            <p style={styles.howItWorksSubtitle}>{step.subtitle}</p>
            <p style={styles.howItWorksDesc}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Why Partner With Us */}
    <section style={styles.advantagesSection}>
      <h2 style={styles.advantagesTitle}>🌟 The WannaCoffee Advantage</h2>
      <p style={styles.advantagesIntro}>
        We succeed only when you succeed. Our entire model is built around a fair, transparent, and mutually beneficial partnership.
      </p>
      <div style={styles.advantagesGrid}>
        {advantages.map(advantage => (
          <div key={advantage.title} style={styles.advantageCard}>
            <span style={styles.advantageIcon}>{advantage.icon}</span>
            <h4 style={styles.advantageTitle}>{advantage.title}</h4>
            <p style={styles.advantageDesc}>{advantage.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* Call to Action */}
    <section style={styles.ctaSection}>
      <div style={styles.ctaCard}>
        <h2 style={styles.ctaTitle}>Ready to Grow Your Coffee Business?</h2>
        <p style={styles.ctaDesc}>
          Join the network of New York's most forward-thinking coffee shops. Let's build the future of specialty coffee, together.
        </p>
        <WaitlistForm onSubmit={(data) => {
          console.log('Waitlist submission:', data);
          // Здесь можно добавить логику отправки данных
        }} />
      </div>
    </section>
  </div>
);

const styles = {
  page: {
    background: '#faf8f4',
    minHeight: '100vh',
    fontFamily: 'inherit',
  },
  heroSection: {
    padding: '3rem 1rem 2rem 1rem',
    textAlign: 'center',
    background: '#fff',
  },
  heroTitleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '1.2rem',
    marginBottom: '1rem',
    flexWrap: 'wrap',
  },
  heroTitle: {
    fontSize: '2.2rem',
    fontWeight: 800,
    color: '#b87333',
    marginBottom: '1.5rem',
    lineHeight: 1.2,
  },
  heroDesc: {
    fontSize: '1.1rem',
    color: '#444',
    maxWidth: 800,
    margin: '0 auto',
    lineHeight: 1.7,
  },
  section: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '2.5rem 1rem 1.5rem 1rem',
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#b87333',
    marginBottom: '1.5rem',
    textAlign: 'left',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  benefitCard: {
    background: '#fff',
    borderRadius: '18px',
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    minHeight: 140,
  },
  benefitIcon: {
    fontSize: '2.2rem',
    marginTop: 2,
  },
  benefitTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#cc9042',
    marginBottom: 8,
  },
  benefitDesc: {
    color: '#555',
    fontSize: '0.98rem',
    lineHeight: 1.6,
  },
  howItWorksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.2rem',
    marginTop: '1.5rem',
  },
  howItWorksCard: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    padding: '1.2rem',
    textAlign: 'center',
  },
  howItWorksStep: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#cc9042',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.1rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  howItWorksTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    color: '#b87333',
    marginBottom: 4,
  },
  howItWorksSubtitle: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#cc9042',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  howItWorksDesc: {
    color: '#555',
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
  advantagesSection: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '2.5rem 1rem 1.5rem 1rem',
    background: 'linear-gradient(135deg, #fff8ed 60%, #f3e0c7 100%)',
    borderRadius: '28px',
    marginTop: '2rem',
    marginBottom: '2rem',
  },
  advantagesTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#b87333',
    marginBottom: '1rem',
    textAlign: 'center',
  },
  advantagesIntro: {
    fontSize: '1.1rem',
    color: '#555',
    textAlign: 'center',
    marginBottom: '2rem',
    maxWidth: 700,
    margin: '0 auto 2rem auto',
    lineHeight: 1.6,
  },
  advantagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
  },
  advantageCard: {
    background: '#fff',
    borderRadius: '16px',
    padding: '1.2rem',
    textAlign: 'center',
    boxShadow: '0 2px 8px rgba(204,144,66,0.08)',
  },
  advantageIcon: {
    fontSize: '2rem',
    marginBottom: 8,
    display: 'block',
  },
  advantageTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    marginBottom: 6,
    color: '#b87333',
  },
  advantageDesc: {
    color: '#555',
    fontSize: '0.95rem',
    lineHeight: 1.5,
  },
  ctaSection: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '2.5rem 1rem 1.5rem 1rem',
    display: 'flex',
    justifyContent: 'center',
  },
  ctaCard: {
    background: 'linear-gradient(135deg, #cc9042 60%, #b87333 100%)',
    borderRadius: '28px',
    boxShadow: '0 4px 32px rgba(204,144,66,0.13)',
    padding: '2.5rem 2rem',
    maxWidth: 900,
    width: '100%',
    textAlign: 'center',
    color: '#fff',
  },
  ctaTitle: {
    fontSize: '1.8rem',
    fontWeight: 800,
    marginBottom: '1rem',
    color: '#fff',
  },
  ctaDesc: {
    fontSize: '1.1rem',
    color: '#fff',
    marginBottom: '2rem',
    lineHeight: 1.6,
    maxWidth: 600,
    margin: '0 auto 2rem auto',
  },
};

export default Foresight; 