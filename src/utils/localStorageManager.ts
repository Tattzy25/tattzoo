/**
 * Local Storage Manager - Persistent data without backend
 */

const STORAGE_KEYS = {
  GENERATION_HISTORY: 'tattty_generation_history',
  USER_PREFERENCES: 'tattty_user_preferences',
  SAVED_DESIGNS: 'tattty_saved_designs',
  FAVORITES: 'tattty_favorites',
  RECENT_PROMPTS: 'tattty_recent_prompts'
} as const;

export interface GeneratedDesign {
  id: string;
  imageUrl: string;
  prompt: string;
  params: Record<string, any>;
  createdAt: number;
  isFavorite?: boolean;
}

export interface UserPreferences {
  defaultModel?: string;
  defaultStyle?: string;
  defaultPlacement?: string;
  defaultSize?: string;
  defaultColor?: string;
  theme?: 'dark' | 'light';
}

/**
 * Save a generated design to history
 */
export function saveGenerationToHistory(design: Omit<GeneratedDesign, 'id' | 'createdAt'>): GeneratedDesign {
  const newDesign: GeneratedDesign = {
    ...design,
    id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now()
  };
  
  const history = getGenerationHistory();
  history.unshift(newDesign);
  
  // Keep only last 50 designs
  const trimmedHistory = history.slice(0, 50);
  localStorage.setItem(STORAGE_KEYS.GENERATION_HISTORY, JSON.stringify(trimmedHistory));
  
  console.log('💾 Saved design to history:', newDesign.id);
  return newDesign;
}

/**
 * Get generation history
 */
export function getGenerationHistory(): GeneratedDesign[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.GENERATION_HISTORY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load generation history:', error);
    return [];
  }
}

/**
 * Clear generation history
 */
export function clearGenerationHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.GENERATION_HISTORY);
  console.log('🧹 Cleared generation history');
}

/**
 * Save user preferences
 */
export function saveUserPreferences(prefs: Partial<UserPreferences>): void {
  const current = getUserPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updated));
  console.log('💾 Saved user preferences');
}

/**
 * Get user preferences
 */
export function getUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load user preferences:', error);
    return {};
  }
}

/**
 * Toggle favorite on a design
 */
export function toggleFavorite(designId: string): boolean {
  const history = getGenerationHistory();
  const design = history.find(d => d.id === designId);
  
  if (design) {
    design.isFavorite = !design.isFavorite;
    localStorage.setItem(STORAGE_KEYS.GENERATION_HISTORY, JSON.stringify(history));
    console.log(`${design.isFavorite ? '❤️' : '🤍'} Toggled favorite for ${designId}`);
    return design.isFavorite;
  }
  
  return false;
}

/**
 * Get favorite designs
 */
export function getFavoriteDesigns(): GeneratedDesign[] {
  return getGenerationHistory().filter(d => d.isFavorite);
}

/**
 * Delete a design
 */
export function deleteDesign(designId: string): boolean {
  const history = getGenerationHistory();
  const filtered = history.filter(d => d.id !== designId);
  
  if (filtered.length < history.length) {
    localStorage.setItem(STORAGE_KEYS.GENERATION_HISTORY, JSON.stringify(filtered));
    console.log('🗑️ Deleted design:', designId);
    return true;
  }
  
  return false;
}

/**
 * Save a recent prompt
 */
export function saveRecentPrompt(prompt: string): void {
  if (!prompt.trim()) return;
  
  const prompts = getRecentPrompts();
  
  // Remove duplicate if exists
  const filtered = prompts.filter(p => p !== prompt);
  
  // Add to start
  filtered.unshift(prompt);
  
  // Keep only last 20
  const trimmed = filtered.slice(0, 20);
  
  localStorage.setItem(STORAGE_KEYS.RECENT_PROMPTS, JSON.stringify(trimmed));
}

/**
 * Get recent prompts
 */
export function getRecentPrompts(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_PROMPTS);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load recent prompts:', error);
    return [];
  }
}

/**
 * Export all user data (for backup)
 */
export function exportUserData(): string {
  const data = {
    generationHistory: getGenerationHistory(),
    userPreferences: getUserPreferences(),
    recentPrompts: getRecentPrompts(),
    exportedAt: new Date().toISOString()
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * Import user data (from backup)
 */
export function importUserData(jsonString: string): boolean {
  try {
    const data = JSON.parse(jsonString);
    
    if (data.generationHistory) {
      localStorage.setItem(STORAGE_KEYS.GENERATION_HISTORY, JSON.stringify(data.generationHistory));
    }
    
    if (data.userPreferences) {
      localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(data.userPreferences));
    }
    
    if (data.recentPrompts) {
      localStorage.setItem(STORAGE_KEYS.RECENT_PROMPTS, JSON.stringify(data.recentPrompts));
    }
    
    console.log('📥 Imported user data successfully');
    return true;
  } catch (error) {
    console.error('Failed to import user data:', error);
    return false;
  }
}

/**
 * Get storage usage statistics
 */
export function getStorageStats(): {
  used: number;
  total: number;
  percentage: number;
} {
  let used = 0;
  
  for (const key of Object.values(STORAGE_KEYS)) {
    const item = localStorage.getItem(key);
    if (item) {
      used += item.length * 2; // *2 for UTF-16 encoding
    }
  }
  
  // Rough estimate of 5MB limit
  const total = 5 * 1024 * 1024;
  const percentage = (used / total) * 100;
  
  return {
    used,
    total,
    percentage
  };
}
