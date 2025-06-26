import React from 'react';
import { Link } from 'react-router-dom';

const LoyaltyProgram = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>Loyalty Program</h1>
          <p style={styles.subtitle}>Earn points, unlock rewards, and enjoy exclusive benefits</p>
          <div style={styles.comingSoon}>
            <span style={styles.comingSoonBadge}>Coming Soon</span>
          </div>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.features}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🏆</div>
            <h3 style={styles.featureTitle}>Points System</h3>
            <p style={styles.featureDescription}>
              Earn points with every purchase and redeem them for free drinks
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎯</div>
            <h3 style={styles.featureTitle}>Tier Benefits</h3>
            <p style={styles.featureDescription}>
              Unlock exclusive perks as you climb through Bronze, Silver, and Gold tiers
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🎉</div>
            <h3 style={styles.featureTitle}>Special Events</h3>
            <p style={styles.featureDescription}>
              Access to member-only events, tastings, and coffee workshops
            </p>
          </div>
        </div>

        <div style={styles.demoSection}>
          <h2 style={styles.sectionTitle}>Preview Dashboard</h2>
          <div style={styles.demoCard}>
            <div style={styles.demoHeader}>
              <h3 style={styles.demoTitle}>Your Loyalty Status</h3>
              <span style={styles.demoBadge}>Gold Member</span>
            </div>
            <div style={styles.loyaltyContent}>
              <div style={styles.pointsSection}>
                <h4 style={styles.pointsTitle}>Current Points</h4>
                <div style={styles.pointsDisplay}>
                  <span style={styles.pointsNumber}>2,450</span>
                  <span style={styles.pointsLabel}>points</span>
                </div>
                <div style={styles.progressBar}>
                  <div style={styles.progressFill}></div>
                </div>
                <p style={styles.progressText}>550 points to next reward</p>
              </div>
              
              <div style={styles.rewardsSection}>
                <h4 style={styles.rewardsTitle}>Available Rewards</h4>
                <div style={styles.rewardItem}>
                  <span style={styles.rewardName}>Free Coffee</span>
                  <span style={styles.rewardCost}>500 pts</span>
                </div>
                <div style={styles.rewardItem}>
                  <span style={styles.rewardName}>Pastry + Coffee</span>
                  <span style={styles.rewardCost}>800 pts</span>
                </div>
                <div style={styles.rewardItem}>
                  <span style={styles.rewardName}>Premium Drink</span>
                  <span style={styles.rewardCost}>1200 pts</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>Join the Waitlist</h2>
          <p style={styles.ctaDescription}>
            Be among the first to experience our loyalty program when it launches
          </p>
          <div style={styles.emailSignup}>
            <input 
              type="email" 
              placeholder="Enter your email address"
              style={styles.emailInput}
            />
            <button style={styles.signupButton}>
              Join Waitlist
            </button>
          </div>
        </div>

        <div style={styles.backLink}>
          <Link to="/" style={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  hero: {
    background: 'linear-gradient(135deg, #d3914b 0%, #b87333 100%)',
    color: 'white',
    padding: '4rem 2rem',
    textAlign: 'center',
  },
  heroContent: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  title: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    margin: '0 0 1rem 0',
    '@media (max-width: 768px)': {
      fontSize: '2.5rem',
    },
  },
  subtitle: {
    fontSize: '1.25rem',
    margin: '0 0 2rem 0',
    opacity: 0.9,
  },
  comingSoon: {
    marginTop: '2rem',
  },
  comingSoonBadge: {
    background: 'rgba(255,255,255,0.2)',
    padding: '0.5rem 1.5rem',
    borderRadius: '25px',
    fontSize: '1rem',
    fontWeight: '600',
    border: '2px solid rgba(255,255,255,0.3)',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '4rem',
  },
  featureCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.2s',
    ':hover': {
      transform: 'translateY(-4px)',
    },
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
  },
  featureTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#333',
  },
  featureDescription: {
    color: '#666',
    lineHeight: '1.6',
  },
  demoSection: {
    marginBottom: '4rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    textAlign: 'center',
    margin: '0 0 2rem 0',
    color: '#333',
  },
  demoCard: {
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    overflow: 'hidden',
  },
  demoHeader: {
    background: '#f8f9fa',
    padding: '1.5rem',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  demoTitle: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#333',
  },
  demoBadge: {
    background: '#ffd700',
    color: '#333',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  loyaltyContent: {
    padding: '1.5rem',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  pointsSection: {
    textAlign: 'center',
  },
  pointsTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
  },
  pointsDisplay: {
    marginBottom: '1rem',
  },
  pointsNumber: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#d3914b',
    display: 'block',
  },
  pointsLabel: {
    fontSize: '1rem',
    color: '#666',
  },
  progressBar: {
    width: '100%',
    height: '8px',
    background: '#eee',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  progressFill: {
    width: '75%',
    height: '100%',
    background: '#d3914b',
    borderRadius: '4px',
  },
  progressText: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#666',
  },
  rewardsSection: {
    background: '#f8f9fa',
    padding: '1rem',
    borderRadius: '8px',
  },
  rewardsTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#333',
  },
  rewardItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #eee',
    ':last-child': {
      borderBottom: 'none',
    },
  },
  rewardName: {
    fontSize: '1rem',
    color: '#333',
  },
  rewardCost: {
    fontSize: '0.9rem',
    color: '#d3914b',
    fontWeight: '600',
  },
  ctaSection: {
    textAlign: 'center',
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
  },
  ctaTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    margin: '0 0 1rem 0',
    color: '#333',
  },
  ctaDescription: {
    fontSize: '1.1rem',
    color: '#666',
    margin: '0 0 2rem 0',
  },
  emailSignup: {
    display: 'flex',
    gap: '1rem',
    maxWidth: '500px',
    margin: '0 auto',
    '@media (max-width: 768px)': {
      flexDirection: 'column',
    },
  },
  emailInput: {
    flex: 1,
    padding: '0.75rem 1rem',
    border: '2px solid #eee',
    borderRadius: '8px',
    fontSize: '1rem',
    ':focus': {
      outline: 'none',
      borderColor: '#d3914b',
    },
  },
  signupButton: {
    background: '#d3914b',
    color: 'white',
    border: 'none',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    ':hover': {
      background: '#b87333',
    },
  },
  backLink: {
    textAlign: 'center',
  },
  backButton: {
    color: '#d3914b',
    textDecoration: 'none',
    fontSize: '1.1rem',
    fontWeight: '600',
    ':hover': {
      textDecoration: 'underline',
    },
  },
};

export default LoyaltyProgram; 