import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WCBrewsLogo from '../assets/WC_BREWS.svg';
import WaitlistForm from '../components/WaitlistForm';
import CustomerWaitlistForm from '../components/CustomerWaitlistForm';

const faqsUsers = [
  {
    q: "Do the tickets expire?",
    a: "Yes. Each pack is valid for 24 months from the purchase date. We'll remind you at 30, 7, and 1 day before expiry — so you never miss a cup."
  },
  {
    q: "Can I use my tickets in any café?",
    a: "Tickets can be used at all participating cafés marked with the 'Wanna Tickets accepted' badge in the app. We're expanding quickly to cover more of the city."
  },
  {
    q: "Can I transfer my tickets to someone else?",
    a: "Yes! You can send tickets to friends or family directly from your Wallet — perfect as a surprise gift."
  },
  {
    q: "What if I lose my phone or reinstall the app?",
    a: "No worries — your account is tied to your phone number. Just log back in, and your tickets will be waiting for you."
  },
  {
    q: "What happens if a drink costs more than 1 ticket?",
    a: "Each café sets the number of tickets per drink — usually 1 for espresso or americano, 2 for cappuccino or latte, and 3 for complex or signature drinks. You'll always see the ticket price before redeeming."
  },
  {
    q: "Can I get a refund on unused tickets?",
    a: "Refunds aren't available, but your tickets are valid for two years — and you can always gift them to others."
  }
];

const faqsShops = [
  {
    q: "How do I start accepting tickets at my café?",
    a: "Apply through our Partner Portal. Once approved, you'll gain access to a web dashboard and scanner — no special hardware required."
  },
  {
    q: "Do I need to invest in any POS or tech upgrades?",
    a: "Not at all. Tickets can be redeemed via any smartphone, tablet, or laptop with a camera and browser. Manual code entry is also available."
  },
  {
    q: "When and how do I get paid?",
    a: "You'll receive 80% of the value from every ticket sold. Payouts are issued weekly via our payment partner directly to your business account."
  },
  {
    q: "What happens if I need to pause participation?",
    a: "You can pause at any time. Your café will be marked as 'temporarily not accepting tickets' in the app, and redemptions will be disabled until you resume."
  },
  {
    q: "Can I control how many tickets my drinks require?",
    a: "Yes. You define the ticket cost per item. We recommend: 1 ticket — basic drinks (espresso, americano); 2 tickets — standard milk drinks (latte, cappuccino); 3 tickets — signature or premium drinks. Clear pricing ensures a smooth experience for your guests."
  },
  {
    q: "What kind of analytics will I see?",
    a: "Your dashboard includes impressions (how many users saw your café), taps, favorites, routes built, redemptions, visit frequency, and customer rotation — all anonymized and exportable to support smarter planning and marketing."
  }
];

const loversBenefits = [
  {
    icon: "☕️",
    title: "Freedom to Explore",
    desc: "Use your tickets at any café with the 'Wanna Tickets accepted' badge. Whether it's your daily espresso or a weekend coffee crawl, you're covered citywide."
  },
  {
    icon: "⚡️",
    title: "Simple & Seamless",
    desc: "Buy once, sip anytime. Just show your QR code to redeem — no wallet, no app fumbling. It's modern, fast, and frictionless."
  },
  {
    icon: "🧮",
    title: "More Coffee, Less Math",
    desc: "Buying in packs lets you plan ahead and enjoy specialty coffee at a consistent value. One ticket = one cup, with clear tiers for more complex drinks."
  }
];

const shopBenefits = [
  {
    icon: "📈",
    title: "Reach the Right Guests",
    desc: "Our users are not random walk-ins — they've already paid for coffee and are looking for quality experiences. Appearing as a 'ticket partner' brings high-intent customers through your door."
  },
  {
    icon: "🔁",
    title: "Loyalty Built-In",
    desc: "A customer with 10 tickets is 10x more likely to return. The system creates natural habits and brand preference."
  },
  {
    icon: "🖥️",
    title: "No Tech Burden",
    desc: "Use any device with a camera to scan redemptions. No hardware, no POS integration, no IT headaches."
  },
  {
    icon: "💵",
    title: "Reliable Revenue & Smart Data",
    desc: "Get paid weekly through our payment partner, and track how customers discover and interact with your café — from map views to repeat visits."
  }
];

const howItWorksLovers = [
  {
    icon: "1",
    title: "Buy your ticket pack",
    desc: "Choose a bundle of 5, 10, 20, 45, or 100 tickets in the app. One secure payment via Apple Pay, Google Pay, or card — and you're set for weeks of coffee."
  },
  {
    icon: "2",
    title: "Explore and discover",
    desc: "Browse the map of participating cafés — each one marked with a 'Wanna Tickets accepted' badge. Try a favorite or discover something new."
  },
  {
    icon: "3",
    title: "Redeem with one tap",
    desc: "Order your drink, open the app, and tap 'Redeem.' A 90-second QR code appears — show it to the barista, and your ticket is instantly deducted."
  },
  {
    icon: "4",
    title: "Track and repeat",
    desc: "See your balance in the Wallet tab, earn badges as you sip, and reload your ticket pack when you're ready for more."
  }
];

const howItWorksShops = [
  {
    icon: "1",
    title: "Apply to join",
    desc: "Submit your café through the Partner Portal. Once approved, you'll appear in the app as a 'Ticket Partner' with a badge and boosted visibility."
  },
  {
    icon: "2",
    title: "Set up your ticket rules",
    desc: "In your dashboard, define how many tickets each drink requires — typically 1 for basics, 2–3 for premium drinks. You stay in control."
  },
  {
    icon: "3",
    title: "Accept redemptions easily",
    desc: "Use any phone, tablet, or laptop with a camera to scan ticket QR codes — or enter a 6-digit code manually. No hardware or POS changes needed."
  },
  {
    icon: "4",
    title: "Get paid & track insights",
    desc: "Receive 80% of each sale weekly through our payment partner. Monitor impressions, taps, redemptions, and customer return rates via your dashboard."
  }
];

const Couponator = () => {
  const [openFaqUser, setOpenFaqUser] = useState(null);
  const [openFaqShop, setOpenFaqShop] = useState(null);

  // Адаптивные стили через media queries
  const mobileStyles = `
  @media (max-width: 700px) {
    .couponator-hero-logo {
      height: 120px !important;
      max-width: 90vw !important;
      margin-bottom: 1.2rem !important;
    }
    .couponator-hero-title {
      font-size: 1.3rem !important;
      margin-bottom: 0.7rem !important;
    }
    .couponator-hero-desc {
      font-size: 1rem !important;
      padding: 0 0.5rem !important;
    }
    .couponator-roadmap-grid {
      display: flex !important;
      flex-direction: column !important;
      gap: 1.2rem !important;
      align-items: stretch !important;
    }
    .couponator-roadmap-step, .couponator-roadmap-final {
      min-width: 0 !important;
      max-width: 100% !important;
      width: 100% !important;
      padding: 1.2rem 0.7rem !important;
      font-size: 1rem !important;
    }
    .couponator-roadmap-final {
      margin-top: 0.5rem !important;
      padding: 1.5rem 0.7rem !important;
    }
    .couponator-faq-block {
      padding: 1rem 0.5rem !important;
      font-size: 1rem !important;
    }
    .couponator-section-narrow, .couponator-section {
      padding: 1.5rem 0.3rem 1.2rem 0.3rem !important;
    }
  }
  `;

  return (
    <>
      <style>{mobileStyles}</style>
      <div style={styles.container}>
        {/* Hero / Concept */}
        <div style={styles.hero}>
          <img src={WCBrewsLogo} alt="Wanna Coffee Brews Logo" className="hero-logo-unified" />
          <p style={styles.heroDesc} className="couponator-hero-desc">
            Wanna Coffee Brews isn't about discounts — it's about making coffee culture more open, sustainable, and rewarding for everyone. With a single purchase, you unlock a flexible digital wallet of coffee "Brews" that can be used at any participating café. It's a vote for local craft in your pocket — no punch cards, no small change, no guesswork.
          </p>
        </div>

        {/* For Coffee Lovers */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>For Coffee Lovers</h2>
          <div style={styles.benefitsGrid}>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>☕️</span>
              <h3 style={styles.benefitTitle}>Freedom to Explore, Power to Support</h3>
              <p style={styles.benefitDesc}>Use your Brews at any café with the 'Wanna Coffee Partner' badge. Each scan is not just a payment; it's a direct signal of support to the independent businesses that make our coffee scene vibrant. You're covered citywide.</p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>⚡️</span>
              <h3 style={styles.benefitTitle}>Simple & Seamless</h3>
              <p style={styles.benefitDesc}>Buy once, sip anytime. Just pull up our site on your phone to redeem — no app, no fumbling. It's modern, fast, and frictionless, letting you focus on the coffee, not the transaction.</p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>🧮</span>
              <h3 style={styles.benefitTitle}>A Smarter System for Everyone</h3>
              <p style={styles.benefitDesc}>Buying in packs lets you plan ahead and enjoy specialty coffee through a fairer, more intelligent value system. We've re-engineered the economics so that your consistent support allows our partners to thrive.</p>
            </div>
          </div>
        </section>

        {/* How It Works — For Coffee Lovers */}
        <section style={styles.roadmapSection}>
          <h2 style={styles.roadmapTitle}>☕️ How It Works — For Coffee Lovers</h2>
          <div style={styles.roadmapGrid34final} className="couponator-roadmap-grid">
            <div style={styles.roadmapStepCard2x2} className="couponator-roadmap-step">
              <div style={styles.roadmapStepIcon2x2}>1</div>
              <div style={styles.roadmapStepTitle2x2}>Fuel Up with a Brew Pack</div>
              <div style={styles.roadmapStepDesc2x2}>Choose a bundle of 5, 10, 20, 45, or 100 Brews on our site. One secure payment via Apple Pay, Google Pay, or card — and you're ready to fuel both your day and the local coffee economy.</div>
            </div>
            <div style={styles.roadmapStepCard2x2} className="couponator-roadmap-step">
              <div style={styles.roadmapStepIcon2x2}>2</div>
              <div style={styles.roadmapStepTitle2x2}>Explore and Discover</div>
              <div style={styles.roadmapStepDesc2x2}>Browse the map of our curated partner cafés. Try a trusted favorite or discover a new gem, knowing every spot is part of our mission-driven network.</div>
            </div>
            <div style={styles.roadmapStepCard2x2} className="couponator-roadmap-step">
              <div style={styles.roadmapStepIcon2x2}>3</div>
              <div style={styles.roadmapStepTitle2x2}>Redeem with One Tap</div>
              <div style={styles.roadmapStepDesc2x2}>Order your drink, open our site, and tap 'Redeem.' A 90-second QR code appears — show it to the barista, and your Brews are instantly transferred, strengthening the ecosystem.</div>
            </div>
            <div style={styles.roadmapStepCard2x2} className="couponator-roadmap-step">
              <div style={styles.roadmapStepIcon2x2}>4</div>
              <div style={styles.roadmapStepTitle2x2}>Track and Repeat</div>
              <div style={styles.roadmapStepDesc2x2}>See your balance in your Wallet, earn badges for your support, and reload your Brew pack when you're ready to continue making an impact.</div>
            </div>
            <div style={styles.roadmapFinalCard34} className="couponator-roadmap-final">
              <div style={styles.roadmapFinalTitle}>Coffee with a conscience, finally.</div>
              <div style={styles.roadmapFinalDesc}>Your Brew isn't just a way to pay — it's a statement. No stamps, no change, no awkward moments. Just real coffee, real people, and a smoother, more meaningful way to enjoy it all.<br/><br/>Use it your way. Refill when you're ready. Share with someone. Explore more. Supporting local has never felt this good.</div>
            </div>
          </div>
        </section>

        {/* Customer Waitlist Form */}
        <section style={{ 
          maxWidth: 900, 
          margin: '0 auto', 
          padding: '2.5rem 1rem 1.5rem 1rem',
          background: 'linear-gradient(135deg, #cc9042 60%, #b87333 100%)',
          borderRadius: '28px',
          marginTop: '2rem',
          marginBottom: '2rem',
          color: '#fff'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: '#fff', textAlign: 'center' }}>
            Ready to Experience Coffee Freedom?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '2rem', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 2rem auto', textAlign: 'center' }}>
            Join our waitlist to be the first to know when Wanna Coffee launches. Get early access to all our features including Coffee Pass, Shop, Events, and more.
          </p>
          <CustomerWaitlistForm onSubmit={(data) => {
            console.log('Coffee Pass customer waitlist submission:', data);
            // Здесь можно добавить логику отправки данных
          }} />
        </section>

        {/* For Coffee Shops */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>For Coffee Shops</h2>
          <div style={styles.benefitsGrid}>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>📈</span>
              <h3 style={styles.benefitTitle}>Connect with Committed Customers</h3>
              <p style={styles.benefitDesc}>Our users aren't just walk-ins; they are invested members of the local coffee community. They've pre-committed by purchasing Brews and are actively seeking quality independent cafés. Becoming a Wanna Coffee Partner puts you directly in the path of these high-intent, appreciative customers.</p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>🔁</span>
              <h3 style={styles.benefitTitle}>Build a More Resilient Business</h3>
              <p style={styles.benefitDesc}>A customer with a balance of Brews is a customer locked into the local ecosystem. Our platform fosters loyalty not just to us, but to the entire network of independent shops—creating a reliable, recurring customer base that is less susceptible to market fluctuations.</p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>🖥️</span>
              <h3 style={styles.benefitTitle}>Technology That Empowers, Not Complicates</h3>
              <p style={styles.benefitDesc}>Use any device with a camera to accept Brews. Our web-based system requires no new hardware, no POS integration, and no IT headaches. We handle the tech so you can focus on the craft.</p>
            </div>
            <div style={styles.benefitCard}>
              <span style={styles.benefitIcon}>💵</span>
              <h3 style={styles.benefitTitle}>Predictive Insights, Not Just Data</h3>
              <p style={styles.benefitDesc}>We offer more than just analytics. Our Foresight platform analyzes market-wide traffic patterns to give you actionable predictions on customer flow and demand. Stop guessing, start planning. This is data that helps you reduce waste, optimize staffing, and increase profitability.</p>
            </div>
          </div>
        </section>

        {/* How It Works — For Coffee Shops */}
        <section style={styles.roadmapSection}>
          <h2 style={styles.roadmapTitle}>🏪 How It Works — For Coffee Shops</h2>
          <div style={styles.roadmapGrid34final} className="couponator-roadmap-grid">
            <div style={styles.roadmapStepCard2x2} className="couponator-roadmap-step">
              <div style={styles.roadmapStepIcon2x2}>1</div>
              <div style={styles.roadmapStepTitle2x2}>Join the Network</div>
              <div style={styles.roadmapStepDesc2x2}>Apply through our Partner Portal. Once approved, you become a key part of our curated network, showcased to a community that values what you do.</div>
            </div>
            <div style={styles.roadmapStepCard2x2} className="couponator-roadmap-step">
              <div style={styles.roadmapStepIcon2x2}>2</div>
              <div style={styles.roadmapStepTitle2x2}>Set Your Fair Value</div>
              <div style={styles.roadmapStepDesc2x2}>In your dashboard, define how many Brews each drink requires. You have full control to reflect the value of your craft, typically with 1 Brew for basics and more for premium drinks.</div>
            </div>
            <div style={styles.roadmapStepCard2x2} className="couponator-roadmap-step">
              <div style={styles.roadmapStepIcon2x2}>3</div>
              <div style={styles.roadmapStepTitle2x2}>Accept Brews Seamlessly</div>
              <div style={styles.roadmapStepDesc2x2}>Use any phone, tablet, or laptop to scan customer QR codes. The process is instant, secure, and designed to fit perfectly into your existing workflow.</div>
            </div>
            <div style={styles.roadmapStepCard2x2} className="couponator-roadmap-step">
              <div style={styles.roadmapStepIcon2x2}>4</div>
              <div style={styles.roadmapStepTitle2x2}>Get Paid & Unlock Growth</div>
              <div style={styles.roadmapStepDesc2x2}>Receive consistent weekly payouts. But more importantly, use your dashboard to transform data into decisions. Monitor traffic forecasts, understand customer preferences, and discover new opportunities for growth.</div>
            </div>
            <div style={styles.roadmapFinalCard34} className="couponator-roadmap-final">
              <div style={styles.roadmapFinalTitle}>Built to Amplify What Makes You Unique.</div>
              <div style={styles.roadmapFinalDesc}>We know how hard it is for independent cafés to thrive. That's exactly why we're here. Wanna Coffee isn't just a platform; it's your strategic partner. We help showcase your individuality, attract the right audience, and turn every visit into a sustainable relationship — without changing your workflow or giving up control. You create the coffee, we help you build the future.</div>
            </div>
          </div>
        </section>

        {/* Call to Action with Form */}
        <section style={{ 
          maxWidth: 900, 
          margin: '0 auto', 
          padding: '2.5rem 1rem 1.5rem 1rem',
          background: 'linear-gradient(135deg, #cc9042 60%, #b87333 100%)',
          borderRadius: '28px',
          marginTop: '2rem',
          marginBottom: '2rem',
          color: '#fff'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: '#fff', textAlign: 'center' }}>
            Ready to Join the Coffee Pass Community?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '2rem', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 2rem auto', textAlign: 'center' }}>
            Whether you're a coffee shop owner looking to accept tickets, or a coffee lover wanting to explore the city with flexible coffee passes, join our waitlist to be the first to know when we launch our ticket system.
          </p>
          <WaitlistForm onSubmit={(data) => {
            console.log('Coffee Pass waitlist submission:', data);
            // Здесь можно добавить логику отправки данных
          }} />
        </section>
      </div>
    </>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
  },
  hero: {
    background: '#fff',
    color: '#cc9042',
    padding: '2.5rem 1rem 1.5rem 1rem',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 0,
  },
  heroLogo: {
    height: 240,
    width: 'auto',
    display: 'block',
    maxWidth: 640,
    marginBottom: 0,
  },
  heroSubtitle: {
    fontSize: '1.25rem',
    margin: '0 0 0.7rem 0',
    color: '#b87333',
    fontWeight: 500,
  },
  heroDesc: {
    color: '#3B2F2F',
    fontSize: '1.15rem',
    margin: '0 auto 1.5rem auto',
    maxWidth: 600,
    textAlign: 'center',
  },
  section: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '2.5rem 1rem 1.5rem 1rem',
  },
  sectionNarrow: {
    maxWidth: 700,
    margin: '0 auto',
    padding: '2.5rem 1rem 1.5rem 1rem',
  },
  sectionTitle: {
    fontSize: '1.7rem',
    fontWeight: 800,
    color: '#b87333',
    marginBottom: '1.2rem',
    textAlign: 'center',
  },
  benefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginTop: '2rem',
    marginBottom: '1.5rem',
  },
  benefitCard: {
    background: '#fffdfa',
    borderRadius: '18px',
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 120,
    transition: 'box-shadow 0.2s, transform 0.2s',
  },
  benefitIcon: {
    fontSize: '2.1rem',
    marginBottom: 8,
  },
  benefitTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#cc9042',
    marginBottom: 4,
    textAlign: 'center',
  },
  benefitDesc: {
    color: '#555',
    fontSize: '0.98rem',
    textAlign: 'center',
  },
  faqGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '1.2rem',
    marginTop: '1.2rem',
  },
  faqBlock: {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: '0 2px 8px rgba(204,144,66,0.07)',
    padding: '1.2rem 1.5rem',
  },
  faqQBtn: {
    background: 'none',
    border: 'none',
    color: '#b87333',
    fontWeight: 700,
    fontSize: '1.08rem',
    marginBottom: 6,
    textAlign: 'left',
    width: '100%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    outline: 'none',
    padding: 0,
  },
  faqArrow: {
    marginLeft: 10,
    fontSize: '1.1rem',
    color: '#cc9042',
    fontWeight: 700,
    userSelect: 'none',
    transition: 'transform 0.2s',
  },
  faqA: {
    color: '#3B2F2F',
    fontSize: '1.05rem',
    lineHeight: 1.7,
    marginLeft: 18,
    marginBottom: 0,
  },
  roadmapSection: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '2.5rem 1rem 1.5rem 1rem',
  },
  roadmapTitle: {
    fontSize: '1.35rem',
    fontWeight: 800,
    color: '#b87333',
    marginBottom: '1.2rem',
    textAlign: 'center',
  },
  roadmapGradientBox: {
    background: 'linear-gradient(90deg, #f3e0c7 0%, #fff8ed 100%)',
    borderRadius: '22px',
    boxShadow: '0 2px 16px rgba(204,144,66,0.09)',
    padding: '2rem 1.5rem',
    margin: '0 auto',
    maxWidth: 900,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  roadmapStepsGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1.2rem',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadmapStepCard: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 2px 8px rgba(204,144,66,0.07)',
    padding: '1.2rem 1.1rem',
    minWidth: 180,
    maxWidth: 220,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '1.01rem',
  },
  roadmapStepIcon: {
    width: 36,
    height: 36,
    borderRadius: '50%',
    background: '#cc9042',
    color: '#fff',
    fontWeight: 700,
    fontSize: '1.2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  roadmapStepTitle: {
    fontWeight: 700,
    color: '#b87333',
    fontSize: '1.08rem',
    marginBottom: 6,
  },
  roadmapStepDesc: {
    color: '#555',
    fontSize: '0.97rem',
  },
  roadmapArrow: {
    fontSize: '2.2rem',
    color: '#cc9042',
    margin: '0 0.5rem',
    userSelect: 'none',
    fontWeight: 700,
  },
  roadmapGrid34final: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: '1fr 1fr',
    gap: '1.5rem',
    width: '100%',
    maxWidth: 900,
    margin: '0 auto',
    alignItems: 'stretch',
    justifyItems: 'center',
    gridAutoRows: '1fr',
  },
  roadmapStepCard2x2: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(204,144,66,0.10)',
    padding: '1.5rem 1.2rem',
    minWidth: 220,
    maxWidth: 270,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: '1.05rem',
    transition: 'box-shadow 0.2s, transform 0.2s',
    border: '2px solid #f3e0c7',
  },
  roadmapStepIcon2x2: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #cc9042 60%, #b87333 100%)',
    color: '#fff',
    fontWeight: 800,
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    boxShadow: '0 2px 8px rgba(204,144,66,0.13)',
  },
  roadmapStepTitle2x2: {
    fontWeight: 800,
    color: '#b87333',
    fontSize: '1.13rem',
    marginBottom: 8,
  },
  roadmapStepDesc2x2: {
    color: '#444',
    fontSize: '1.01rem',
  },
  roadmapFinalCard34: {
    background: 'linear-gradient(120deg, #f8f5ee 60%, #f3e0c7 100%)',
    borderRadius: '20px',
    boxShadow: '0 4px 24px rgba(204,144,66,0.08)',
    padding: '2rem 1.5rem',
    minWidth: 220,
    maxWidth: 900,
    gridColumn: '2 / 4',
    gridRow: '2',
    border: '2px solid #e7d2b8',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  roadmapFinalTitle: {
    fontWeight: 800,
    color: '#b87333',
    fontSize: '1.18rem',
    marginBottom: 10,
  },
  roadmapFinalDesc: {
    color: '#6a4a1b',
    fontSize: '1.04rem',
    lineHeight: 1.6,
  },
};

export default Couponator; 