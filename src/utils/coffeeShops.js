// Асинхронная функция для загрузки кофеен из JSON файла
export const fetchCoffeeShops = async () => {
  try {
    // Пробуем загрузить новый super_list.json, если не получится - fallback на старый
    let response = await fetch('/super_list.json');
    let dataSource = 'super_list.json';
    if (!response.ok) {
      console.log('super_list.json не найден, используем coffeeShops.json');
      response = await fetch('/coffeeShops.json');
      dataSource = 'coffeeShops.json';
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
      }
    } else {
      console.log('✅ Загружаем данные из super_list.json');
    }
    
    const data = await response.json();
    console.log(`📊 Загружено кофеен из ${dataSource}:`, data.length);
    
    // Преобразуем структуру для совместимости
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
        neighborhood: shop.borough || 'Unknown',
        // Добавляем новые поля из super_list.json
        wave: shop.ai_classification?.wave || 'not defined',
        description: shop.descriptionData?.description || shop.description || '',
        // Трансформируем ключи descriptionBlocks в нужный формат
        descriptionBlocks: shop.descriptionData?.descriptionBlocks ? {
          'Location & Atmosphere': shop.descriptionData.descriptionBlocks.locationAtmosphere,
          'Philosophy & Sourcing': shop.descriptionData.descriptionBlocks.philosophySourcing,
          'Equipment & Technique': shop.descriptionData.descriptionBlocks.equipmentTechnique,
          'Recommendation': shop.descriptionData.descriptionBlocks.recommendation
        } : {},
        descriptionAuthor: shop.descriptionAuthor || ''
      };
    });
    
    // Логируем первые несколько кофеен для проверки новых полей
    if (transformedData.length > 0) {
      console.log('🔍 Пример данных первой кофейни:', {
        name: transformedData[0].name,
        wave: transformedData[0].wave,
        hasDescription: !!transformedData[0].description,
        hasDescriptionBlocks: !!transformedData[0].descriptionBlocks,
        descriptionBlocksKeys: Object.keys(transformedData[0].descriptionBlocks || {}),
        descriptionAuthor: transformedData[0].descriptionAuthor
      });
    }
    
    return transformedData;
  } catch (error) {
    console.error('Ошибка загрузки кофеен:', error);
    // Возвращаем пустой массив в случае ошибки
    return [];
  }
};

// Экспортируем пустой массив для обратной совместимости
export const coffeeShops = [];