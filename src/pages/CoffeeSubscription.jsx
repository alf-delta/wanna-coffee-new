import React from 'react';
import WCShopLogo from '../assets/WC_SHOP.svg';
import WaitlistForm from '../components/WaitlistForm';
import CustomerWaitlistForm from '../components/CustomerWaitlistForm';

const categories = [
  { icon: '☕', title: 'Coffee', desc: 'Whole beans, ground coffee, single origin, blends, cold brew, drip bags, and more' },
  { icon: '🛠️', title: 'Brewing Equipment', desc: 'Filters, grinders, drippers, kettles, and more' },
  { icon: '🍶', title: 'Coffee Tableware', desc: 'Mugs, cups, pour-over sets, and more' },
  { icon: '🎁', title: 'Coffee Gift Sets', desc: 'Curated coffee kits and gift boxes' },
  { icon: '🛍️', title: 'Merch & Souvenirs', desc: 'Tote bags, shirts, stickers, and more from our partner cafés' },
];

const subscriptionOptions = [
  'Drip coffee',
  'Freshly ground beans',
  'Whole beans for espresso machines',
];

const howItWorks = [
  {
    step: '1',
    title: 'Shop by Your Favorite Café',
    desc: 'Browse and order directly from local roasters and coffee shops.'
  },
  {
    step: '2',
    title: 'Easy Checkout',
    desc: 'Add products to your cart and complete your order in one place.'
  },
  {
    step: '3',
    title: 'Direct Delivery',
    desc: 'Your order is shipped directly from the coffee shop to your door.'
  },
  {
    step: '4',
    title: 'Enjoy & Discover',
    desc: 'Taste new coffees and support local businesses!'
  },
];

const businessBenefits = [
  {
    icon: '🚀',
    title: 'Grow Your Audience',
    desc: 'Reach new coffee lovers in New York and beyond through our curated platform.'
  },
  {
    icon: '🛒',
    title: 'Easy Product Management',
    desc: 'Add, edit, and manage your products with a simple merchant dashboard.'
  },
  {
    icon: '📦',
    title: 'You Ship, You Earn',
    desc: 'Handle fulfillment your way and keep more of your profits.'
  },
  {
    icon: '🤝',
    title: 'Community & Support',
    desc: 'Join a network of independent coffee shops and get dedicated support.'
  },
];

const CoffeeSubscription = () => (
  <div style={styles.page}>
    {/* Верхняя часть для клиентов */}
    <section style={styles.heroSection}>
      <div style={styles.heroTitleRow}>
        <img src={WCShopLogo} alt="Wanna Coffee Shop Logo" className="hero-logo-unified" />
      </div>
      <p style={styles.heroSubtitle}>A curated specialty coffee marketplace</p>
      <p style={styles.heroDesc}>
        Wanna Coffee Shop is a curated specialty coffee store hosted directly on our website, designed to connect coffee lovers with the finest local roasters and coffee shops in New York and beyond. Our mission is to provide a seamless and beautiful way for independent coffee shops to showcase and sell their products, while offering customers an easy, inspiring shopping experience.
      </p>
    </section>

    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>🛍️ What You'll Find Inside</h2>
      <div style={styles.categoriesGrid}>
        {categories.map(cat => (
          <div key={cat.title} style={styles.categoryCard}>
            <span style={styles.categoryIcon}>{cat.icon}</span>
            <div>
              <h3 style={styles.categoryTitle}>{cat.title}</h3>
              <p style={styles.categoryDesc}>{cat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    <section style={styles.subscriptionSection}>
      <div style={styles.subscriptionCardWide}>
        <div style={styles.subscriptionIconRow}>
          <span style={styles.subscriptionIcon}>☕️</span>
          <span style={styles.subscriptionTitle}>Coffee Subscription</span>
        </div>
        <div style={styles.subscriptionSubtitle}>The most convenient way to enjoy your favorite coffee.</div>
        <div style={styles.subscriptionDivider}>⸻</div>
        <div style={styles.subscriptionBlockTitle}>📦 Where it comes from</div>
        <div style={styles.subscriptionDesc}>
          Directly from your favorite coffee shop — the one you already trust and love.<br/>
          Each delivery is prepared with care by the baristas and roasters you know.
        </div>
        <div style={styles.subscriptionDivider}>⸻</div>
        <div style={styles.subscriptionBlockTitle}>🔁 How it works</div>
        <div style={styles.subscriptionDesc}>
          Set up a recurring delivery on your terms: weekly, bi-weekly, or monthly.<br/>
          Stay stocked without lifting a finger. Flexible. Reliable. Always fresh.
        </div>
        <div style={styles.subscriptionDivider}>⸻</div>
        <div style={styles.subscriptionBlockTitle}>☕ What you get</div>
        <div style={styles.subscriptionDesc}>
          Pick the exact format you prefer:<br/>
          Drip bags, ground coffee, whole beans, or something special and unique your café is known for.
        </div>
        <div style={styles.subscriptionDivider}>⸻</div>
        <div style={styles.subscriptionBlockTitle}>✨ Final thought</div>
        <div style={styles.subscriptionDesc}>
          Is this even real?<br/>
          Yes. Absolutely.
        </div>
      </div>
    </section>

    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>⚙️ How It Works</h2>
      <div style={styles.howItWorksGrid}>
        {howItWorks.map(step => (
          <div key={step.step} style={styles.howItWorksCard}>
            <div style={styles.howItWorksStep}>{step.step}</div>
            <h4 style={styles.howItWorksTitle}>{step.title}</h4>
            <p style={styles.howItWorksDesc}>{step.desc}</p>
          </div>
        ))}
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
        Ready to Shop Specialty Coffee?
      </h2>
      <p style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '2rem', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 2rem auto', textAlign: 'center' }}>
        Join our waitlist to be the first to know when our coffee marketplace launches. Discover fresh beans, brewing equipment, and curated coffee products from the best local roasters.
      </p>
      <CustomerWaitlistForm onSubmit={(data) => {
        console.log('Shop customer waitlist submission:', data);
        // Здесь можно добавить логику отправки данных
      }} />
    </section>

    {/* Нижняя часть для бизнеса */}
    <section style={styles.businessSectionWrapper}>
      <div style={styles.businessWaveContainer}>
        <svg width="100%" height="100" viewBox="0 0 900 100" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
          <path d="M0,60 Q225,100 450,60 Q675,20 900,60 L900,100 L0,100 Z" fill="#cc9042" />
        </svg>
      </div>
      <div style={styles.businessSectionNarrow}>
        <h2 style={styles.businessTitle}>For Coffee Shops & Roasters</h2>
        <p style={styles.businessDesc}>
          Wanna Coffee Shop is more than a marketplace—it's a community. We help independent coffee shops and roasters grow their audience, manage products easily, and connect with new customers.
        </p>
        <div style={styles.businessBenefitsGrid}>
          <div style={styles.businessBenefitCard}>
            <span style={styles.businessBenefitIcon}>🚀</span>
            <h4 style={styles.businessBenefitTitle}>Grow Your Audience</h4>
            <p style={styles.businessBenefitDesc}>Reach new coffee lovers in New York and beyond through our curated platform.</p>
          </div>
          <div style={styles.businessBenefitCard}>
            <span style={styles.businessBenefitIcon}>🛒</span>
            <h4 style={styles.businessBenefitTitle}>Easy Product Management</h4>
            <p style={styles.businessBenefitDesc}>Add, edit, and manage your products with a simple merchant dashboard.</p>
          </div>
          <div style={styles.businessBenefitCard}>
            <span style={styles.businessBenefitIcon}>📦</span>
            <h4 style={styles.businessBenefitTitle}>You Ship, You Earn</h4>
            <p style={styles.businessBenefitDesc}>Handle fulfillment your way and keep more of your profits.</p>
          </div>
          <div style={styles.businessBenefitCardFull}>
            <span style={styles.businessBenefitIcon}>🤝</span>
            <h4 style={styles.businessBenefitTitle}>Community & Support</h4>
            <p style={styles.businessBenefitDesc}>Join a network of independent coffee shops and get dedicated support.</p>
          </div>
        </div>
        <div style={styles.businessHowItWorks}>
          <h3 style={styles.businessHowItWorksTitle}>How It Works for Partners</h3>
          <ol style={styles.businessHowItWorksList}>
            <li><b>Coffee Shops List Their Products:</b> Add items to the marketplace through your merchant dashboard.</li>
            <li><b>Customer Places an Order:</b> Shoppers select items and complete checkout via the shared platform.</li>
            <li><b>You Ship the Order:</b> Each seller handles packaging and shipping directly to the customer.</li>
            <li><b>Everyone Wins:</b> The buyer enjoys fresh, specialty coffee—while you grow your business!</li>
          </ol>
        </div>
        <div style={styles.partnerCtaWrapper}>
          <WaitlistForm onSubmit={(data) => {
            console.log('Shop waitlist submission:', data);
            // Здесь можно добавить логику отправки данных
          }} />
        </div>
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
    marginBottom: '0.5rem',
    flexWrap: 'wrap',
  },
  heroLogoLarge: {
    height: 180,
    width: 'auto',
    display: 'block',
    marginRight: 0,
    marginBottom: 0,
    maxWidth: 400,
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    color: '#b87333',
    marginBottom: '1.5rem',
    fontWeight: 600,
  },
  heroDesc: {
    fontSize: '1.1rem',
    color: '#444',
    maxWidth: 700,
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
  sectionDesc: {
    color: '#555',
    marginBottom: '1rem',
    fontSize: '1.05rem',
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
  },
  categoryCard: {
    background: '#fff',
    borderRadius: '18px',
    boxShadow: '0 2px 12px rgba(204,144,66,0.07)',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    minHeight: 120,
  },
  categoryIcon: {
    fontSize: '2rem',
    marginTop: 2,
  },
  categoryTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#cc9042',
    marginBottom: 4,
  },
  categoryDesc: {
    color: '#555',
    fontSize: '0.98rem',
  },
  subscriptionSection: {
    maxWidth: 900,
    margin: '0 auto',
    padding: '2.5rem 1rem 1.5rem 1rem',
    display: 'flex',
    justifyContent: 'center',
  },
  subscriptionCardWide: {
    background: 'linear-gradient(135deg, #fff8ed 60%, #f3e0c7 100%)',
    borderRadius: '28px',
    boxShadow: '0 4px 32px rgba(204,144,66,0.13)',
    padding: '2.5rem 2rem',
    maxWidth: 900,
    width: '100%',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2px solid #cc9042',
  },
  subscriptionIconRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1.2rem',
  },
  subscriptionIcon: {
    fontSize: '2.2rem',
  },
  subscriptionTitle: {
    fontSize: '1.5rem',
    fontWeight: 800,
    color: '#cc9042',
    letterSpacing: '0.5px',
  },
  subscriptionSubtitle: {
    fontSize: '1.1rem',
    color: '#b87333',
    fontWeight: 600,
    marginBottom: '1.1rem',
  },
  subscriptionDesc: {
    color: '#444',
    fontSize: '1.05rem',
    marginBottom: '1.1rem',
    lineHeight: 1.7,
  },
  subscriptionDivider: {
    color: '#cc9042',
    fontSize: '1.5rem',
    margin: '1.2rem 0',
    letterSpacing: '0.2em',
    textAlign: 'center',
    fontWeight: 400,
  },
  subscriptionBlockTitle: {
    fontWeight: 700,
    color: '#b87333',
    fontSize: '1.08rem',
    marginBottom: 6,
    marginTop: 6,
    textAlign: 'center',
  },
  howItWorksGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
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
  howItWorksDesc: {
    color: '#555',
    fontSize: '0.97rem',
  },
  businessSectionWrapper: {
    marginTop: '3rem',
    background: 'none',
  },
  businessWaveContainer: {
    maxWidth: 900,
    margin: '0 auto',
  },
  businessSectionNarrow: {
    background: 'linear-gradient(180deg, #cc9042 0%, #e7b87a 100%)',
    borderRadius: '0 0 36px 36px',
    margin: '0 auto',
    maxWidth: 900,
    marginTop: -4,
    padding: '3.5rem 1.5rem 2.5rem 1.5rem',
    color: '#fff',
    position: 'relative',
    boxShadow: '0 8px 32px rgba(204,144,66,0.13)',
  },
  businessTitle: {
    fontSize: '2rem',
    fontWeight: 800,
    marginBottom: '1rem',
    color: '#fff',
    textAlign: 'center',
  },
  businessDesc: {
    fontSize: '1.1rem',
    color: '#fff',
    maxWidth: 700,
    margin: '0 auto 2.5rem auto',
    textAlign: 'center',
    lineHeight: 1.7,
  },
  businessBenefitsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2.5rem',
  },
  businessBenefitCard: {
    background: 'rgba(255,255,255,0.10)',
    borderRadius: '16px',
    padding: '1.2rem',
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  },
  businessBenefitIcon: {
    fontSize: '2rem',
    marginBottom: 6,
    display: 'block',
  },
  businessBenefitTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    marginBottom: 4,
    color: '#fff',
  },
  businessBenefitDesc: {
    color: '#f7f7f7',
    fontSize: '0.98rem',
  },
  businessHowItWorks: {
    margin: '2.5rem auto 1.5rem auto',
    maxWidth: 700,
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '14px',
    padding: '1.5rem',
  },
  businessHowItWorksTitle: {
    fontSize: '1.15rem',
    fontWeight: 700,
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
  },
  businessHowItWorksList: {
    color: '#fff',
    fontSize: '1rem',
    lineHeight: 1.7,
    marginLeft: 18,
  },
  partnerCtaWrapper: {
    textAlign: 'center',
    marginTop: '2rem',
  },
  businessBenefitCardFull: {
    background: 'rgba(255,255,255,0.10)',
    borderRadius: '16px',
    padding: '1.2rem',
    textAlign: 'center',
    color: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    gridColumn: '1 / -1',
    marginTop: '1rem',
  },
};

export default CoffeeSubscription; 