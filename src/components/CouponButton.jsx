import React from 'react';
import { Link } from 'react-router-dom';

const CouponButton = ({ to, children }) => (
  <Link to={to} style={{ textDecoration: 'none' }}>
    <div style={styles.wrapper}>
      <svg
        width="320"
        height="120"
        viewBox="0 0 320 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={styles.svg}
      >
        <path
          d="M40,0
            Q60,20 120,10
            Q160,0 200,10
            Q260,20 280,0
            Q320,40 320,60
            Q320,80 280,120
            Q260,100 200,110
            Q160,120 120,110
            Q60,100 40,120
            Q0,80 0,60
            Q0,40 40,0
            Z"
          fill="#cc9042"
          stroke="#b87333"
          strokeWidth="2"
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="2rem"
          fontWeight="bold"
          fill="#fff"
          style={{ fontFamily: 'inherit', letterSpacing: '1px' }}
        >
          {children}
        </text>
      </svg>
    </div>
  </Link>
);

const styles = {
  wrapper: {
    display: 'inline-block',
    transition: 'box-shadow 0.2s, transform 0.2s',
    boxShadow: '0 4px 16px rgba(204, 144, 66, 0.18)',
    cursor: 'pointer',
    margin: '0 1rem',
    position: 'relative',
    top: 0,
  },
  svg: {
    display: 'block',
    width: 320,
    height: 120,
    maxWidth: '100%',
    maxHeight: '100%',
  },
};

export default CouponButton; 