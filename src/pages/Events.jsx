import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Events.module.css';
// Можно добавить фирменную иконку/логотип для Events, если появится

const Events = () => {
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
      <style>{mobileStyles}</style>
      <div className={styles.container}>
        {/* Hero / Concept */}
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>☕️ Events — Beyond the Cup</h1>
          <p className={styles.heroDesc}>
            Wanna Coffee is more than a ticket — it's a gateway to the city's most vibrant coffee culture.<br/><br/>
            From latte art throwdowns to cupping nights and pop-up brew labs, our Events section connects you to the real pulse of New York's specialty scene. Whether you're a curious newcomer or a die-hard coffee geek, there's always something happening — and your ticket might just be your invite.
          </p>
        </div>

        {/* Раздел для кофелюбов */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>🎟 For Coffee Lovers</h2>
          <ul className={styles.bulletList}>
            <li>Discover local café events directly in the app</li>
            <li>RSVP with one tap, get reminders, and bring a friend</li>
            <li>Some events offer bonus perks for ticket holders</li>
          </ul>
        </section>

        {/* Раздел для кофеен */}
        <section className={styles.sectionAlt}>
          <h2 className={styles.sectionTitle}>�� For Coffee Shops</h2>
          <ul className={styles.bulletList}>
            <li>Promote your in-house events to a relevant audience</li>
            <li>Get visibility on the city's coffee map — not just as a café, but as a cultural hub</li>
            <li>Drive deeper engagement, community, and brand loyalty</li>
          </ul>
        </section>

        {/* CTA / Для бизнеса */}
        <section className={styles.sectionNarrow}>
          <div className={styles.ctaBlock}>
            <span className={styles.ctaText}>
              Want to host an event? Let us help you turn ideas into community moments — just reach out through your Partner Dashboard.
            </span>
          </div>
        </section>

        <div className={styles.backLink}>
          <Link to="/" className={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default Events; 