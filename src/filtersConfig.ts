export const filtersConfig = [
  {
    key: 'coffeeType',
    title: 'Coffee Type',
    type: 'checkbox',
    multi: true,
    default: ['blend'],
    options: [
      { value: 'blend', label: 'Blend' },
      { value: 'single_origin', label: 'Single Origin' },
      { value: 'microlot', label: 'Microlot' },
      { value: 'decaf', label: 'Decaf' },
      { value: 'experimental', label: 'Experimental Process' },
    ],
  },
  {
    key: 'roasting',
    title: 'Roasting',
    type: 'checkbox+select',
    multi: true,
    options: [
      { value: 'in_house', label: 'In-house roasting' },
      { value: 'local_roaster', label: 'Local roaster' },
    ],
    nested: {
      key: 'roast_level',
      title: 'Roast Level',
      type: 'select',
      options: [
        { value: 'light', label: 'Light Roast' },
        { value: 'medium', label: 'Medium Roast' },
        { value: 'dark', label: 'Dark Roast' },
      ],
    },
  },
  {
    key: 'brewMethods',
    title: 'Brew Methods',
    type: 'checkbox',
    multi: true,
    options: [
      { value: 'espresso', label: 'Espresso' },
      { value: 'v60', label: 'V60 / Kalita' },
      { value: 'aeropress', label: 'Aeropress' },
      { value: 'chemex', label: 'Chemex' },
      { value: 'cold_brew', label: 'Cold Brew' },
      { value: 'nitro', label: 'Nitro' },
      { value: 'moka_pot', label: 'Moka Pot' },
    ],
  },
  {
    key: 'barista',
    title: 'Barista',
    type: 'checkbox',
    multi: false,
    options: [
      { value: 'sca_certified', label: 'SCA Certified' },
    ],
  },
  {
    key: 'menu',
    title: 'Menu',
    type: 'checkbox',
    multi: true,
    options: [
      { value: 'food_available', label: 'Food & Dessert Available' },
      { value: 'drinks_only', label: 'Drinks Only' },
    ],
  },
  {
    key: 'recognition',
    title: 'Recognition',
    type: 'checkbox',
    multi: false,
    options: [
      { value: 'featured_guide', label: 'Featured in Coffee Guide' },
    ],
  },
]; 