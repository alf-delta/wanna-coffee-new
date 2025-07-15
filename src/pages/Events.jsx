import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import WCEventsLogo from '../assets/WC_EVENTS.svg';
import WaitlistForm from '../components/WaitlistForm';
import CustomerWaitlistForm from '../components/CustomerWaitlistForm';
// Можно добавить фирменную иконку/логотип для Events, если появится

// Блоки преимуществ для гостей
const guestsBenefits = [
  {
    icon: "🤝",
    title: "Discover real community",
    desc: "Go beyond your daily cup and meet others who share your passion."
  },
  {
    icon: "🎓",
    title: "Learn from the source",
    desc: "Attend tastings, cuppings, and brewing workshops led by pros."
  },
  {
    icon: "🎉",
    title: "Celebrate coffee culture",
    desc: "From latte art throwdowns to bean launches — this is where it happens."
  },
  {
    icon: "🔎",
    title: "Find hidden gems",
    desc: "Some of the city's best moments in coffee happen quietly. We surface them."
  }
];

// Блоки преимуществ для бизнеса
const businessBenefits = [
  {
    icon: "📢",
    title: "Put your event in front of the right audience",
    desc: "Thousands of locals using Wanna Coffee are looking not just for cafés — but for real experiences."
  },
  {
    icon: "🚶",
    title: "Drive foot traffic",
    desc: "Whether you're running a tasting, releasing a new origin, or hosting a DJ in your courtyard, this section helps you reach the people who care."
  },
  {
    icon: "📝",
    title: "Easy and free to submit",
    desc: "Just use the form — we review and publish relevant events weekly."
  },
  {
    icon: "🌟",
    title: "Build your brand's presence",
    desc: "The right event can elevate your café from a place to grab coffee to a place people talk about."
  }
];

// FAQ
const faqs = [
  {
    q: "What is Wanna Coffee?",
    a: "Wanna Coffee is a curated guide to New York City's best specialty coffee spots — from iconic names to under-the-radar neighborhood gems. We don't list every café. We highlight the ones that care about the craft."
  },
  {
    q: "What qualifies as a 'specialty coffee' shop?",
    a: "We focus on cafés that serve high-quality beans, prioritize brewing methods (pour-over, espresso, cold brew, etc.), and offer a thoughtful, intentional customer experience. Independent ownership, barista skill, and transparency in sourcing all matter."
  },
  {
    q: "How do you choose which cafés to feature?",
    a: "Every café is hand-picked. We combine local knowledge, barista feedback, and in-person visits to make sure the map reflects real quality, not hype or ad budgets."
  },
  {
    q: "Can I suggest a café that's missing?",
    a: "Yes — and we encourage it! Just use our suggestion form. We'll take a look and add it if it fits the criteria."
  },
  {
    q: "Is this app free to use?",
    a: "Yes. No ads, no subscriptions, no tracking. We built this out of love for the culture — not for profit."
  },
  {
    q: "I'm a café owner — how do I get listed or featured?",
    a: "You can apply via the Feature Request form. We'll review your shop and follow up. Events can also be submitted directly to the Featured Events section, even if your shop isn't yet on the map."
  },
  {
    q: "Do you only cover Manhattan?",
    a: "We currently cover Manhattan, Brooklyn, and Queens. Other boroughs and cities are on our roadmap — stay tuned."
  },
  {
    q: "How often is everything updated?",
    a: "New cafés and events are added weekly. We also re-verify all listings every 2–3 months to keep the information fresh."
  },
  {
    q: "Who's behind Wanna Coffee?",
    a: "We're a small team of independent creators — designers, developers, and longtime coffee lovers. We're not funded, not sponsored, and not chasing trends. We just care about spotlighting places that deserve attention."
  }
];

const Events = () => {
  const [openFaq, setOpenFaq] = useState(null);

  // Адаптивные стили для мобильных
  const mobileStyles = `
  @media (max-width: 700px) {
    .events-hero-title {
      font-size: 1.3rem !important;
      margin-bottom: 0.7rem !important;
    }
    .events-hero-desc {
      font-size: 1rem !important;
      padding: 0 0.5rem !important;
    }
    .events-section, .events-section-narrow {
      padding: 1.5rem 0.7rem 1.2rem 0.7rem !important;
    }
  }
  `;

  return (
    <>
      <style>{mobileStyles + `\n@media (max-width: 700px) { .events-hero-logo { max-height: 100px !important; } }`}</style>
      <div style={{ minHeight: '100vh', background: '#f8f9fa' }}>
        {/* Hero / Concept */}
        <div style={{ background: '#fff', color: '#b87333', padding: '2.5rem 1rem 1.5rem 1rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <img src={WCEventsLogo} alt="Wanna Coffee Events Logo" className="hero-logo-unified" />
          <p style={{ color: '#3B2F2F', fontSize: '1.15rem', margin: '0 auto 1.5rem auto', maxWidth: 600, textAlign: 'center' }}>
            Step deeper into New York's specialty coffee culture.<br/><br/>
            The Featured Events section is your front-row seat to what's happening across the city's third-wave coffee community. It's more than just a calendar — it's a curated hub for the people who care about coffee as a craft, a culture, and a connection point.<br/><br/>
            Whether you're a curious newcomer or a dedicated enthusiast, you'll find events that let you experience coffee in fresh, surprising, and social ways.
          </p>
        </div>

        {/* For Coffee Lovers */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1rem 1.5rem 1rem' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#b87333', marginBottom: '1.2rem', textAlign: 'center' }}>🎉 For Coffee Lovers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem', marginBottom: '1.5rem' }}>
            {guestsBenefits.map(b => (
              <div key={b.title} style={{ background: '#fffdfa', borderRadius: '18px', boxShadow: '0 2px 12px rgba(204,144,66,0.07)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 120, transition: 'box-shadow 0.2s, transform 0.2s' }}>
                <span style={{ fontSize: '2.1rem', marginBottom: 8 }}>{b.icon}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#cc9042', marginBottom: 4, textAlign: 'center' }}>{b.title}</h3>
                <p style={{ color: '#555', fontSize: '0.98rem', textAlign: 'center' }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* For Business */}
        <section style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1rem 1.5rem 1rem' }}>
          <h2 style={{ fontSize: '1.7rem', fontWeight: 800, color: '#b87333', marginBottom: '1.2rem', textAlign: 'center' }}>📢 For Café Owners, Roasters & Organizers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '2rem', marginBottom: '1.5rem' }}>
            {businessBenefits.map(b => (
              <div key={b.title} style={{ background: '#fffdfa', borderRadius: '18px', boxShadow: '0 2px 12px rgba(204,144,66,0.07)', padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 120, transition: 'box-shadow 0.2s, transform 0.2s' }}>
                <span style={{ fontSize: '2.1rem', marginBottom: 8 }}>{b.icon}</span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#cc9042', marginBottom: 4, textAlign: 'center' }}>{b.title}</h3>
                <p style={{ color: '#555', fontSize: '0.98rem', textAlign: 'center' }}>{b.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ 
            textAlign: 'center', 
            marginTop: '2.5rem',
            background: 'linear-gradient(135deg, #cc9042 60%, #b87333 100%)',
            borderRadius: '28px',
            padding: '2rem 1.5rem',
            color: '#fff'
          }}>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: '#fff', textAlign: 'center' }}>
              Stay Updated on Coffee Events
            </h3>
            <p style={{ fontSize: '1rem', color: '#fff', marginBottom: '1.5rem', lineHeight: 1.6, maxWidth: 500, margin: '0 auto 1.5rem auto', textAlign: 'center' }}>
              Join our waitlist to be notified when our events platform launches. Discover tastings, workshops, and coffee culture events across the city.
            </p>
            <CustomerWaitlistForm onSubmit={(data) => {
              console.log('Events submission waitlist:', data);
              // Здесь можно добавить логику отправки данных
            }} />
          </div>
        </section>

        {/* FAQ */}
        <section style={{ maxWidth: 700, margin: '0 auto', padding: '2.5rem 1rem 1.5rem 1rem' }}>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 700, marginBottom: '1.1rem', color: '#b87333', letterSpacing: '-0.5px', textAlign: 'center' }}>❓ Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem', marginTop: '1.2rem' }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '14px', boxShadow: '0 2px 8px rgba(204,144,66,0.07)', padding: '1.2rem 1.5rem' }}>
                <button
                  style={{ background: 'none', border: 'none', color: '#b87333', fontWeight: 700, fontSize: '1.08rem', marginBottom: 6, textAlign: 'left', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', outline: 'none', padding: 0 }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  {faq.q}
                  <span style={{ marginLeft: 10, fontSize: '1.1rem', color: '#cc9042', fontWeight: 700, userSelect: 'none', transition: 'transform 0.2s' }}>{openFaq === i ? '▲' : '▼'}</span>
                </button>
                {openFaq === i && (
                  <div style={{ color: '#3B2F2F', fontSize: '1.05rem', lineHeight: 1.7, marginLeft: 18, marginBottom: 0 }}>{faq.a}</div>
                )}
              </div>
            ))}
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
            Ready to Join the Coffee Community?
          </h2>
          <p style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '2rem', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 2rem auto', textAlign: 'center' }}>
            Whether you're a coffee shop owner looking to host events, or a coffee lover wanting to stay updated on the latest happenings, join our waitlist to be the first to know when we launch our events platform.
          </p>
          <WaitlistForm onSubmit={(data) => {
            console.log('Events waitlist submission:', data);
            // Здесь можно добавить логику отправки данных
          }} />
        </section>

        <div style={{ textAlign: 'center', margin: '2.5rem 0' }}>
          <Link to="/" style={{ color: '#d3914b', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 600 }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Events; 