import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Function to set JWT token for Google Auth
export const setGoogleJWT = (jwt) => {
  if (jwt) {
    supabase.auth.setSession({
      access_token: jwt,
      refresh_token: null
    });
  }
}

// Helper functions for data operations
export const supabaseService = {
  // User profiles
  async getProfile(userId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async upsertProfile(profile) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profile, { onConflict: 'id' })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Favorites
  async getFavorites(userId) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return data || []
  },

  async addFavorite(userId, shopId) {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, shop_id: shopId })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async removeFavorite(userId, shopId) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('shop_id', shopId)
    
    if (error) throw error
  },

  // Suggestions
  async getSuggestions(userId) {
    const { data, error } = await supabase
      .from('suggestions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async addSuggestion(suggestion) {
    const { data, error } = await supabase
      .from('suggestions')
      .insert(suggestion)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateSuggestion(id, updates) {
    const { data, error } = await supabase
      .from('suggestions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

    async deleteSuggestion(id) {
    const { error } = await supabase
      .from('suggestions')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  // Check if nickname is available
  async checkNicknameAvailability(nickname, excludeUserId = null) {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('nickname', nickname);
    
    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data.length === 0; // true if available
  }
}
