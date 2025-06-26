import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.title}>About WannaCoffee</h1>
          <p style={styles.subtitle}>
            Your complete coffee discovery and loyalty platform
          </p>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.missionSection}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.missionText}>
            WannaCoffee is a personal project built by a solo coffee enthusiast with a mission: 
            to make the community of coffee lovers more connected and empowered to discover their favorite spots.
          </p>
          <p style={styles.missionText}>
            The platform helps you find specialty coffee shops nearby, explore the best brews, 
            and support local coffee culture. Built with love in New York City.
          </p>
        </div>

        <div style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Current & Upcoming Features</h2>
          
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🗺️</div>
              <h3 style={styles.featureTitle}>Coffee Map</h3>
              <p style={styles.featureDescription}>
                Discover coffee shops near you with our interactive map. 
                Filter by distance, ratings, and preferences.
              </p>
              <div style={styles.statusBadge}>
                <span style={styles.liveBadge}>Live</span>
              </div>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🎫</div>
              <h3 style={styles.featureTitle}>Couponator</h3>
              <p style={styles.featureDescription}>
                Exclusive deals and discounts for coffee lovers. 
                Daily offers, birthday rewards, and VIP access.
              </p>
              <div style={styles.statusBadge}>
                <span style={styles.comingSoonBadge}>Coming Soon</span>
              </div>
              <Link to="/couponator" style={styles.previewLink}>
                Preview Interface →
              </Link>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🏆</div>
              <h3 style={styles.featureTitle}>Loyalty Program</h3>
              <p style={styles.featureDescription}>
                Earn points with every purchase and unlock exclusive benefits. 
                Bronze, Silver, and Gold membership tiers.
              </p>
              <div style={styles.statusBadge}>
                <span style={styles.comingSoonBadge}>Coming Soon</span>
              </div>
              <Link to="/loyalty" style={styles.previewLink}>
                Preview Interface →
              </Link>
            </div>

            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>☕</div>
              <h3 style={styles.featureTitle}>Shop</h3>
              <p style={styles.featureDescription}>
                Fresh coffee delivered to your door, tailored to your taste. 
                Flexible delivery schedules and personalized blends.
              </p>
              <div style={styles.statusBadge}>
                <span style={styles.comingSoonBadge}>Coming Soon</span>
              </div>
              <Link to="/subscription" style={styles.previewLink}>
                Preview Interface →
              </Link>
            </div>
          </div>
        </div>

        <div style={styles.ctaSection}>
          <h2 style={styles.ctaTitle}>Stay Updated</h2>
          <p style={styles.ctaDescription}>
            Be the first to know when new features launch and get exclusive early access
          </p>
          <div style={styles.emailSignup}>
            <input 
              type="email" 
              placeholder="Enter your email address"
              style={styles.emailInput}
            />
            <button style={styles.signupButton}>
              Subscribe to Updates
            </button>
          </div>
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
    margin: 0,
    opacity: 0.9,
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  missionSection: {
    textAlign: 'center',
    marginBottom: '4rem',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontWeight: '600',
    margin: '0 0 2rem 0',
    color: '#333',
  },
  missionText: {
    fontSize: '1.1rem',
    lineHeight: '1.8',
    color: '#666',
    margin: '0 0 1.5rem 0',
    maxWidth: '800px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  featuresSection: {
    marginBottom: '4rem',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
  },
  featureCard: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
    transition: 'transform 0.2s',
    position: 'relative',
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
    marginBottom: '1.5rem',
  },
  statusBadge: {
    marginBottom: '1rem',
  },
  liveBadge: {
    background: '#28a745',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  comingSoonBadge: {
    background: '#ffc107',
    color: '#333',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.875rem',
    fontWeight: '600',
  },
  previewLink: {
    color: '#d3914b',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    ':hover': {
      textDecoration: 'underline',
    },
  },
  ctaSection: {
    textAlign: 'center',
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
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
};

export default About;