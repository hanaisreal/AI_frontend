import * as apiService from '../services/apiService';

/**
 * Preload narration audio one step ahead for instant experience
 * This function creates and caches audio blobs for immediate playback
 */
export const preloadNarration = async (script: string, voiceId: string): Promise<void> => {
  if (!script?.trim() || !voiceId) {
    console.log('⚠️ Preload skipped: missing script or voiceId');
    return;
  }

  const scriptKey = `${script}-${voiceId}`;
  
  // Check if already cached
  const globalCache = (window as any).narrationCache;
  if (globalCache && globalCache.has(scriptKey)) {
    console.log('✅ Narration already preloaded:', scriptKey.substring(0, 50) + '...');
    return;
  }

  try {
    console.log(`🚀 Pre-loading narration: "${script.substring(0, 50)}..."`);
    
    // Call original narration API to cache
    const result = await apiService.generateNarration(script, voiceId);
    
    // Store in the same cache format as NarrationPlayer
    const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Create global cache if it doesn't exist
    if (!(window as any).narrationCache) {
      (window as any).narrationCache = new Map();
    }
    
    (window as any).narrationCache.set(scriptKey, audioUrl);
    
    console.log(`✅ Narration pre-loaded successfully`);
  } catch (error) {
    console.error(`⚠️ Pre-load failed:`, error);
    // Pre-load failure is non-critical, continue normally
  }
};

/**
 * Schedule narration preloading with a delay
 * This is useful to preload the next step while the current step is playing
 */
export const scheduleNarrationPreload = (
  script: string, 
  voiceId: string, 
  delayMs: number = 3000
): NodeJS.Timeout => {
  return setTimeout(() => {
    preloadNarration(script, voiceId);
  }, delayMs);
};

/**
 * Preload multiple narrations in sequence
 * Useful for preloading several upcoming steps
 */
export const preloadMultipleNarrations = async (
  scripts: Array<{ script: string; voiceId: string }>,
  delayBetweenMs: number = 1000
): Promise<void> => {
  for (let i = 0; i < scripts.length; i++) {
    const { script, voiceId } = scripts[i];
    await preloadNarration(script, voiceId);
    
    // Add delay between preloads to avoid overwhelming the API
    if (i < scripts.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayBetweenMs));
    }
  }
};