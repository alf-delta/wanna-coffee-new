export const filtersConfig = [
  // Favorites filter
  {
    key: 'favoritesFilter',
    title: 'Saved',
    type: 'checkbox-single',
    multi: false,
    options: [
      { value: 'saved', label: 'Only saved' },
    ],
  },
  {
    key: 'favoritesFilterNot',
    title: 'Others',
    type: 'checkbox-single',
    multi: false,
    options: [
      { value: 'not_saved', label: 'Only not saved' },
    ],
  },
]; 