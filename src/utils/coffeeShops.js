// Асинхронная функция для загрузки кофеен из JSON файла
export const fetchCoffeeShops = async () => {
  try {
    const response = await fetch('/coffeeShops.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('Загружено кофеен:', data.length);
    
    // Преобразуем новую структуру в старую для совместимости
    const transformedData = data.map(shop => {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const today = days[new Date().getDay()];
      const todayHours = shop.workingHours?.[today];
      let hours = null;
      if (todayHours && todayHours !== 'null') {
        try {
          // Делим по любому тире: дефис, длинное тире, короткое тире
          const [openRaw, closeRaw] = todayHours.split(/\s*[–—-]\s*/);
          // Функция для преобразования времени в 24-часовой формат
          const convertTo24Hour = (timeStr) => {
            // Если уже 24-часовой формат (например, 07:00), возвращаем как есть
            if (/^\d{2}:\d{2}$/.test(timeStr.trim())) return timeStr.trim();
            // Если формат 7:00 AM или 8:00 PM
            const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*([AP]M)/i);
            if (!match) return null;
            let [_, h, m, period] = match;
            h = parseInt(h, 10);
            m = parseInt(m, 10);
            if (period.toUpperCase() === 'PM' && h !== 12) h += 12;
            if (period.toUpperCase() === 'AM' && h === 12) h = 0;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
          };
          const open24 = convertTo24Hour(openRaw);
          const close24 = convertTo24Hour(closeRaw);
          if (open24 && close24) {
            hours = `${open24}–${close24}`;
          } else {
            hours = null;
          }
        } catch (error) {
          console.warn('Ошибка парсинга часов для кофейни:', shop.name, todayHours);
          hours = null;
        }
      }
      return {
        ...shop,
        hours: hours,
        rating: shop.rating || 0,
        reviews: shop.reviews || 0,
        neighborhood: shop.borough || 'Unknown'
      };
    });
    
    return transformedData;
  } catch (error) {
    console.error('Ошибка загрузки кофеен:', error);
    // Возвращаем пустой массив в случае ошибки
    return [];
  }
};

// Экспортируем пустой массив для обратной совместимости
export const coffeeShops = [];