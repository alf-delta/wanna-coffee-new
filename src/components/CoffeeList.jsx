import React from 'react';
import styles from './CoffeeList.module.css';

const CoffeeList = ({ shops }) => {
  if (!shops || shops.length === 0) return null;

  return (
    <div className={styles.listWrapper}>
      <h3>Nearby Coffee Shops</h3>
      <ul>
        {shops.map((shop, index) => (
          <li key={index}>
            {shop.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CoffeeList;
