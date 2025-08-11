import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getJsonFromStorage, setJsonToStorage } from '../utils/storage';
import { submitSuggestionRemote } from '../services/suggestions';
import { promptGoogleId, cancelGooglePrompt, decodeJwt } from '../services/googleIdentity';
import { supabase, supabaseService, setGoogleJWT } from '../services/supabase';

const AccountContext = createContext(null);

const STORAGE_KEYS = {
  profile: 'wc_profile',
  favoritesBase: 'wc_favorites',
  settings: 'wc_settings',
  suggestions: 'wc_suggestions',
};

// Generate alternative nicknames
const generateNicknameAlternatives = (nickname) => {
  const alternatives = [];
  const randomSuffixes = ['_', '1', '2', '2024', 'coffee', 'user'];
  
  // Add random suffixes
  randomSuffixes.forEach(suffix => {
    alternatives.push(`${nickname}${suffix}`);
  });
  
  // Add random numbers
  for (let i = 0; i < 3; i++) {
    alternatives.push(`${nickname}${Math.floor(Math.random() * 1000)}`);
  }
  
  return alternatives.slice(0, 5); // Return max 5 alternatives
};

function getFavoritesKey(userId) {
  return userId ? `${STORAGE_KEYS.favoritesBase}_${userId}` : STORAGE_KEYS.favoritesBase;
}

const defaultProfile = {
  name: '',
  email: '',
  avatarUrl: '',
  nickname: '',
  googleLinked: false,
  userId: null,
};

const defaultSettings = {
  radiusFeet: 1500,
  openNowOnly: false,
  preferredWaves: [],
  favoritesFilter: 'all', // 'all' | 'saved' | 'not_saved'
};

export function AccountProvider({ children }) {
  const [profile, setProfile] = useState(() => getJsonFromStorage(STORAGE_KEYS.profile, defaultProfile));
  
  // Инициализируем favorites в зависимости от статуса авторизации
  const [favorites, setFavorites] = useState(() => {
    const storedProfile = getJsonFromStorage(STORAGE_KEYS.profile, defaultProfile);
    if (storedProfile?.userId) {
      return getJsonFromStorage(getFavoritesKey(storedProfile.userId), { shops: [], events: [] });
    }
    return getJsonFromStorage(STORAGE_KEYS.favoritesBase, { shops: [], events: [] });
  });
  
  const [settings, setSettings] = useState(() => getJsonFromStorage(STORAGE_KEYS.settings, defaultSettings));
  
  // Инициализируем suggestions в зависимости от статуса авторизации
  const [suggestions, setSuggestions] = useState(() => {
    const storedProfile = getJsonFromStorage(STORAGE_KEYS.profile, defaultProfile);
    if (storedProfile?.userId) {
      return getJsonFromStorage(`${STORAGE_KEYS.suggestions}_${storedProfile.userId}`, []);
    }
    return getJsonFromStorage(STORAGE_KEYS.suggestions, []);
  });

  // persist profile
  useEffect(() => {
    if (profile?.userId) {
      // Сохраняем профиль под пользовательским ключом
      setJsonToStorage(`${STORAGE_KEYS.profile}_${profile.userId}`, profile);
      // Также сохраняем в основной ключ для совместимости
      setJsonToStorage(STORAGE_KEYS.profile, profile);
      
        // Sync profile to Supabase
  supabaseService.upsertProfile({
    id: profile.userId,
    name: profile.name,
    email: profile.email,
    avatar_url: profile.avatarUrl,
    nickname: profile.nickname,
    google_linked: profile.googleLinked
  }).catch(error => {
    console.error('Failed to sync profile to Supabase:', error);
    // Если ошибка уникальности, показать пользователю
    if (error.code === '23505' && error.message.includes('nickname')) {
      const alternatives = generateNicknameAlternatives(profile.nickname);
      alert(`Никнейм "${profile.nickname}" уже занят. Попробуйте: ${alternatives.join(', ')}`);
    }
  });
    } else {
      setJsonToStorage(STORAGE_KEYS.profile, profile);
    }
  }, [profile]);
  // Persist favorites under per-user key if user is authenticated
  useEffect(() => {
    const key = getFavoritesKey(profile?.userId);
    setJsonToStorage(key, favorites);
  }, [favorites, profile?.userId]);

  // When userId changes, load favorites from his namespace, migrate if needed
  useEffect(() => {
    // Неавторизованный пользователь — пустые избранные
    if (!profile?.userId) {
      setFavorites({ shops: [], events: [] });
      // также очищаем базовый ключ
      setJsonToStorage(STORAGE_KEYS.favoritesBase, { shops: [], events: [] });
      return;
    }
    // Авторизованный — грузим по namespace
    const key = getFavoritesKey(profile.userId);
    const namespacedFav = getJsonFromStorage(key, null);
    if (namespacedFav) {
      setFavorites(namespacedFav);
    } else {
      // если раньше сохраняли в базовый ключ — мигрируем и очищаем базу
      const base = getJsonFromStorage(STORAGE_KEYS.favoritesBase, null);
      if (base) {
        setFavorites(base);
        setJsonToStorage(key, base);
        setJsonToStorage(STORAGE_KEYS.favoritesBase, { shops: [], events: [] });
      }
    }
  }, [profile?.userId]);
  useEffect(() => setJsonToStorage(STORAGE_KEYS.settings, settings), [settings]);
  useEffect(() => {
    if (profile?.userId) {
      setJsonToStorage(`${STORAGE_KEYS.suggestions}_${profile.userId}`, suggestions);
    } else {
      setJsonToStorage(STORAGE_KEYS.suggestions, suggestions);
    }
  }, [suggestions, profile?.userId]);

  const addFavoriteShop = useCallback((shopId) => {
    setFavorites((prev) => {
      if (prev.shops.includes(shopId)) return prev;
      return { ...prev, shops: [...prev.shops, shopId] };
    });
  }, []);

  const removeFavoriteShop = useCallback((shopId) => {
    setFavorites((prev) => ({ ...prev, shops: prev.shops.filter((id) => id !== shopId) }));
  }, []);

  const toggleFavoriteShop = useCallback(async (shopId) => {
    const exists = favorites.shops.includes(shopId);
    
    if (exists) {
      // Remove from favorites
      setFavorites((prev) => ({ ...prev, shops: prev.shops.filter((id) => id !== shopId) }));
      
      // Sync to Supabase
      if (profile?.userId) {
        try {
          await supabaseService.removeFavorite(profile.userId, shopId);
        } catch (error) {
          console.error('Failed to remove favorite from Supabase:', error);
        }
      }
    } else {
      // Add to favorites
      setFavorites((prev) => ({ ...prev, shops: [...prev.shops, shopId] }));
      
      // Sync to Supabase
      if (profile?.userId) {
        try {
          await supabaseService.addFavorite(profile.userId, shopId);
        } catch (error) {
          console.error('Failed to add favorite to Supabase:', error);
        }
      }
    }
  }, [favorites.shops, profile?.userId]);

  const addFavoriteEvent = useCallback((eventId) => {
    setFavorites((prev) => {
      if (prev.events.includes(eventId)) return prev;
      return { ...prev, events: [...prev.events, eventId] };
    });
  }, []);

  const removeFavoriteEvent = useCallback((eventId) => {
    setFavorites((prev) => ({ ...prev, events: prev.events.filter((id) => id !== eventId) }));
  }, []);

  const toggleFavoriteEvent = useCallback((eventId) => {
    setFavorites((prev) => {
      const exists = prev.events.includes(eventId);
      return exists
        ? { ...prev, events: prev.events.filter((id) => id !== eventId) }
        : { ...prev, events: [...prev.events, eventId] };
    });
  }, []);

  const addSuggestion = async (arg1, arg2, arg3) => {
    // Backward compatible API: (shopId, shopName, text) OR ({ shopId, shopName, sections })
    let payload;
    if (typeof arg1 === 'object' && arg1 !== null && !Array.isArray(arg1)) {
      payload = arg1;
    } else {
      payload = {
        shopId: arg1,
        shopName: arg2,
        sections: {
          locationAtmosphere: { value: arg3 || '', leaveAsIs: !arg3 },
          philosophySourcing: { value: '', leaveAsIs: true },
          equipmentTechnique: { value: '', leaveAsIs: true },
          recommendation: { value: '', leaveAsIs: true },
          workingHours: { value: '', leaveAsIs: true },
        },
      };
    }
    const now = new Date().toISOString();
    const authorName = ((profile?.nickname || profile?.name || '').trim()) || 'Anonymous';
    
    try {
      // Add to Supabase first
      if (profile?.userId) {
        const dbSuggestion = await supabaseService.addSuggestion({
          user_id: profile.userId,
          shop_id: payload.shopId,
          shop_name: payload.shopName,
          sections: payload.sections,
          status: 'pending',
          author_name: authorName
        });
        
        // Add to local state
        const record = {
          id: dbSuggestion.id,
          shopId: payload.shopId,
          shopName: payload.shopName,
          sections: payload.sections,
          status: 'pending',
          authorName,
          createdAt: dbSuggestion.created_at,
          updatedAt: dbSuggestion.updated_at
        };
        setSuggestions(prev => [record, ...prev]);
        
        // попытка отправить на внешний webhook для админов
        try {
          await submitSuggestionRemote({
            id: dbSuggestion.id,
            shopId: payload.shopId,
            shopName: payload.shopName,
            authorName,
            createdAt: now,
            sections: payload.sections,
          });
        } catch (_) {}
      } else {
        // Fallback to local storage for non-authenticated users
        const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
        const record = { id, ...payload, status: 'pending', createdAt: now, updatedAt: now, authorName };
        setSuggestions(prev => [record, ...prev]);
        
        // попытка отправить на внешний webhook для админов
        try {
          await submitSuggestionRemote({
            id: record.id,
            shopId: payload.shopId,
            shopName: payload.shopName,
            authorName,
            createdAt: now,
            sections: payload.sections,
          });
        } catch (_) {}
      }
    } catch (error) {
      console.error('Failed to add suggestion:', error);
    }
  };

  const updateSuggestionStatus = (id, status) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s));
  };

  // submit new coffee shop suggestion (name, address)
  const submitCafeSuggestion = async ({ name, address }) => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();
    const authorName = (profile?.nickname || profile?.name || '').trim() || 'Anonymous';
    // локально не сохраняем в общий список предложений гайдов, это отдельный поток
    try {
      await submitSuggestionRemote({ type: 'new_cafe', id, name, address, authorName, createdAt: now });
    } catch (_) {}
  };

  // Позволяет клиенту отозвать предложение до принятия
  const withdrawSuggestion = (id) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, status: 'withdrawn', updatedAt: new Date().toISOString() } : s));
  };

  // Позволяет отредактировать содержимое предложения (перезапишет секции)
  const updateSuggestionContent = (id, sections) => {
    setSuggestions(prev => prev.map(s => s.id === id ? { ...s, sections, status: s.status === 'done' ? 'done' : 'pending', updatedAt: new Date().toISOString() } : s));
  };

  // Полное удаление предложения (по требованию заказчика)
  const deleteSuggestion = (id) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  // Supabase sync functions
  const syncToSupabase = useCallback(async () => {
    if (!profile?.userId) return;
    
    try {
      // Sync profile
      await supabaseService.upsertProfile({
        id: profile.userId,
        name: profile.name,
        email: profile.email,
        avatar_url: profile.avatarUrl,
        nickname: profile.nickname,
        google_linked: profile.googleLinked
      });

      // Sync favorites
      const currentFavorites = await supabaseService.getFavorites(profile.userId);
      const localShopIds = favorites.shops || [];
      
      // Add missing favorites
      for (const shopId of localShopIds) {
        if (!currentFavorites.find(f => f.shop_id === shopId)) {
          await supabaseService.addFavorite(profile.userId, shopId);
        }
      }

      // Sync suggestions
      const currentSuggestions = await supabaseService.getSuggestions(profile.userId);
      const localSuggestions = suggestions || [];
      
      // Add missing suggestions
      for (const suggestion of localSuggestions) {
        if (!currentSuggestions.find(s => s.id === suggestion.id)) {
          await supabaseService.addSuggestion({
            user_id: profile.userId,
            shop_id: suggestion.shopId,
            shop_name: suggestion.shopName,
            sections: suggestion.sections,
            status: suggestion.status,
            author_name: suggestion.authorName
          });
        }
      }
    } catch (error) {
      console.error('Failed to sync to Supabase:', error);
    }
  }, [profile, favorites, suggestions]);

  const loadFromSupabase = useCallback(async () => {
    if (!profile?.userId) return;
    
    try {
      // Load profile
      const dbProfile = await supabaseService.getProfile(profile.userId);
      if (dbProfile) {
        setProfile(prev => ({
          ...prev,
          name: dbProfile.name || prev.name,
          email: dbProfile.email || prev.email,
          avatarUrl: dbProfile.avatar_url || prev.avatarUrl,
          nickname: dbProfile.nickname || prev.nickname
        }));
      }

      // Load favorites
      const dbFavorites = await supabaseService.getFavorites(profile.userId);
      const shopIds = dbFavorites.map(f => f.shop_id);
      setFavorites({ shops: shopIds, events: [] });

      // Load suggestions
      const dbSuggestions = await supabaseService.getSuggestions(profile.userId);
      const formattedSuggestions = dbSuggestions.map(s => ({
        id: s.id,
        shopId: s.shop_id,
        shopName: s.shop_name,
        sections: s.sections,
        status: s.status,
        authorName: s.author_name,
        createdAt: s.created_at,
        updatedAt: s.updated_at
      }));
      setSuggestions(formattedSuggestions);
    } catch (error) {
      console.error('Failed to load from Supabase:', error);
    }
  }, [profile?.userId]);

  // Auth functions
  const signInWithGoogle = useCallback(async (decoded, jwt) => {
    if (!decoded) return;
    const newUserId = decoded.sub;
    
    // Set JWT token for Supabase
    if (jwt) {
      setGoogleJWT(jwt);
    }
    
    try {
      // Load data from Supabase first
      const dbProfile = await supabaseService.getProfile(newUserId);
      const dbFavorites = await supabaseService.getFavorites(newUserId);
      const dbSuggestions = await supabaseService.getSuggestions(newUserId);
      
      // Set profile with data from Supabase
      setProfile(prev => ({
        ...prev,
        name: dbProfile?.name || decoded.name || '',
        email: dbProfile?.email || decoded.email || '',
        avatarUrl: dbProfile?.avatar_url || decoded.picture || '',
        nickname: dbProfile?.nickname || prev.nickname || '',
        googleLinked: true,
        userId: newUserId,
      }));
      
      // Set favorites from Supabase
      const shopIds = dbFavorites.map(f => f.shop_id);
      setFavorites({ shops: shopIds, events: [] });
      
      // Set suggestions from Supabase
      const formattedSuggestions = dbSuggestions.map(s => ({
        id: s.id,
        shopId: s.shop_id,
        shopName: s.shop_name,
        sections: s.sections,
        status: s.status,
        authorName: s.author_name,
        createdAt: s.created_at,
        updatedAt: s.updated_at
      }));
      setSuggestions(formattedSuggestions);
      
    } catch (error) {
      console.error('Failed to load user data from Supabase:', error);
      
      // Fallback: set basic profile without data
      setProfile(prev => ({
        ...prev,
        name: decoded.name || '',
        email: decoded.email || '',
        avatarUrl: decoded.picture || '',
        googleLinked: true,
        userId: newUserId,
      }));
      setFavorites({ shops: [], events: [] });
      setSuggestions([]);
    }
  }, []);

  const signOut = useCallback(() => {
    // Выход: сбрасываем состояние авторизации, но сохраняем данные пользователя
    setProfile({ ...defaultProfile, googleLinked: false, userId: null });
    setFavorites({ shops: [], events: [] });
    setSuggestions([]);
    
    // Очищаем только основной ключ профиля, но не пользовательские данные
    setJsonToStorage(STORAGE_KEYS.profile, { ...defaultProfile, googleLinked: false, userId: null });
  }, []);

  const requestGoogleSignIn = useCallback(async () => {
    try {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (!clientId) return;
      cancelGooglePrompt();
      await promptGoogleId({
        clientId,
        onCredential: (cred) => {
          const decoded = decodeJwt(cred);
          if (decoded) {
            // Use the same logic as signInWithGoogle
            signInWithGoogle(decoded);
          }
        }
      });
    } catch (e) {
      console.warn('requestGoogleSignIn failed', e);
    }
  }, [signInWithGoogle]);

  const value = useMemo(() => ({
    profile,
    setProfile,
    signInWithGoogle,
    signOut,
    requestGoogleSignIn,
    favorites,
    addFavoriteShop,
    removeFavoriteShop,
    toggleFavoriteShop,
    addFavoriteEvent,
    removeFavoriteEvent,
    toggleFavoriteEvent,
    settings,
    setSettings,
    suggestions,
    addSuggestion,
    updateSuggestionStatus,
    withdrawSuggestion,
    updateSuggestionContent,
    deleteSuggestion,
    submitCafeSuggestion,
  }), [profile, favorites, settings, suggestions, signInWithGoogle, signOut, requestGoogleSignIn, addFavoriteShop, removeFavoriteShop, toggleFavoriteShop, addFavoriteEvent, removeFavoriteEvent, toggleFavoriteEvent]);

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error('useAccount must be used within AccountProvider');
  return ctx;
}


