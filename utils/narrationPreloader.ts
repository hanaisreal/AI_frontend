import * as apiService from '../services/apiService';

// Use the same cache as NarrationPlayer for better coordination
declare global {
  interface Window {
    narrationCache: Map<string, string>;
    preloadingPromises: Map<string, Promise<void>>;
  }
}

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
  
  // Initialize caches if they don't exist
  if (!window.narrationCache) {
    window.narrationCache = new Map();
  }
  if (!window.preloadingPromises) {
    window.preloadingPromises = new Map();
  }
  
  // Check if already cached
  if (window.narrationCache.has(scriptKey)) {
    console.log('✅ Narration already preloaded:', scriptKey.substring(0, 50) + '...');
    return;
  }

  // Check if already being preloaded by another instance
  if (window.preloadingPromises.has(scriptKey)) {
    console.log('⏳ Narration already being preloaded, waiting...:', scriptKey.substring(0, 50) + '...');
    await window.preloadingPromises.get(scriptKey);
    return;
  }

  try {
    console.log(`🚀 Pre-loading narration: "${script.substring(0, 50)}..."`);
    
    // Create and store the preloading promise
    const preloadPromise = (async () => {
    // Call original narration API to cache
    const result = await apiService.generateNarration(script, voiceId);
    
    // Store in the same cache format as NarrationPlayer
    const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
    const audioUrl = URL.createObjectURL(audioBlob);
    
      // Store in global cache
      window.narrationCache.set(scriptKey, audioUrl);
      
      console.log(`✅ Narration pre-loaded successfully: "${script.substring(0, 30)}..."`);
    })();

    // Store the promise so other instances can wait for it
    window.preloadingPromises.set(scriptKey, preloadPromise);
    
    // Wait for completion
    await preloadPromise;
    
    // Clean up the promise from the pending map
    window.preloadingPromises.delete(scriptKey);
    
  } catch (error) {
    console.error(`⚠️ Pre-load failed for "${script.substring(0, 30)}...":`, error);
    // Clean up the promise from the pending map on error
    window.preloadingPromises.delete(scriptKey);
    // Pre-load failure is non-critical, continue normally
  }
};

/**
 * Check if narration is already cached or being preloaded
 */
export const isNarrationCachedOrPreloading = (script: string, voiceId: string): boolean => {
  if (!script?.trim() || !voiceId) return false;
  
  const scriptKey = `${script}-${voiceId}`;
  
  // Check if cached
  if (window.narrationCache?.has(scriptKey)) {
    return true;
  }
  
  // Check if being preloaded
  if (window.preloadingPromises?.has(scriptKey)) {
    return true;
  }
  
  return false;
};

/**
 * Wait for narration to be available (either from cache or preloading)
 */
export const waitForNarration = async (script: string, voiceId: string): Promise<string | null> => {
  if (!script?.trim() || !voiceId) return null;
  
  const scriptKey = `${script}-${voiceId}`;
  
  // Check if already cached
  if (window.narrationCache?.has(scriptKey)) {
    return window.narrationCache.get(scriptKey)!;
  }
  
  // Wait for preloading to complete if in progress
  if (window.preloadingPromises?.has(scriptKey)) {
    try {
      await window.preloadingPromises.get(scriptKey);
      return window.narrationCache?.get(scriptKey) || null;
    } catch (error) {
      console.error('Failed to wait for preloading:', error);
      return null;
    }
  }
  
  return null;
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