import React, { useEffect, useState, useCallback, useRef, forwardRef, useImperativeHandle } from 'react';
import Button from './Button.tsx';
import Card from './Card.tsx';
import LoadingSpinner from './LoadingSpinner.tsx';
import * as apiService from '../services/apiService.ts';

// Global cache to prevent duplicate API calls
const audioCache = new Map<string, Promise<string>>();
const completedCache = new Map<string, string>();

interface NarrationPlayerProps {
  script: string | null;
  autoPlay?: boolean;
  voiceId?: string | null;
  onEnd?: () => void;
  onPlay?: () => void;
  onPause?: () => void;
  showControls?: boolean;
  imageUrl: string;
  talkingImageUrl: string;
  onNarrationComplete?: () => void;
  hideScript?: boolean; // Deprecated: use showScript instead
  showScript?: boolean; // New prop to control script visibility (default: true)
  chunkedDisplay?: boolean; // New prop for chunked text display
}

const NarrationPlayer = forwardRef<any, NarrationPlayerProps>(({ 
  script, 
  autoPlay = false, 
  voiceId, 
  onEnd,
  onPlay,
  onPause,
  showControls = true,
  imageUrl,
  talkingImageUrl,
  onNarrationComplete,
  hideScript = false,
  showScript = true,
  chunkedDisplay = false,
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryTrigger, setRetryTrigger] = useState(0); // Trigger for forcing retry
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastGeneratedScriptRef = useRef<string | null>(null);
  const hasAutoPlayed = useRef(false); // Track if auto-play has already happened
  
  // Chunked display state
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [chunks, setChunks] = useState<string[]>([]);
  const [chunkTimings, setChunkTimings] = useState<number[]>([]);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Replay functionality
  const [showReplayButton, setShowReplayButton] = useState(false);

  // Split script into chunks when script changes
  useEffect(() => {
    if (script && chunkedDisplay) {
      // Split by comma, period, or other natural pauses
      const scriptChunks = script.split(/[,.!?]/).map(chunk => chunk.trim()).filter(chunk => chunk.length > 0);
      setChunks(scriptChunks);
      setCurrentChunkIndex(0);
      
      // We'll calculate timing after we get the actual audio duration
      // For now, set empty timings
      setChunkTimings([]);
      
      console.log('NarrationPlayer: Created chunks:', scriptChunks);
    } else {
      setChunks([]);
      setChunkTimings([]);
      setCurrentChunkIndex(0);
    }
  }, [script, chunkedDisplay]);

  // Generate audio using ElevenLabs when script or voiceId changes
  useEffect(() => {
    let isCancelled = false;

    const generateAudio = async () => {
      if (!script?.trim()) {
        setAudioUrl(null);
        setError(null);
        setIsPlaying(false);
        lastGeneratedScriptRef.current = null;
        if (onEnd) {
          onEnd();
        }
        return;
      }

      if (!voiceId) {
        console.log('NarrationPlayer: No voiceId provided, skipping audio generation');
        setError('사용자 음성이 필요합니다. 음성 등록을 완료해주세요.');
        return;
      }

      // Check if we already have this audio cached
      const scriptKey = `${script}-${voiceId}`;
      console.log(`NarrationPlayer: Cache key: ${scriptKey.substring(0, 100)}...`);
      
      // Check completed cache first
      if (completedCache.has(scriptKey)) {
        console.log('NarrationPlayer: Using completed cache for script');
        const cachedUrl = completedCache.get(scriptKey)!;
        console.log(`NarrationPlayer: Cached URL: ${cachedUrl.substring(0, 50)}...`);
        setError(null); // Clear any previous errors
        setAudioUrl(cachedUrl);
        setIsLoading(false);
        return;
      }

      // Check global preload cache (from preloading)
      const globalCache = (window as any).narrationCache;
      if (globalCache && globalCache.has(scriptKey)) {
        console.log('NarrationPlayer: Using PRELOADED cache for script ⚡');
        const preloadedUrl = globalCache.get(scriptKey);
        console.log(`NarrationPlayer: Preloaded URL: ${preloadedUrl.substring(0, 50)}...`);
        setError(null);
        setAudioUrl(preloadedUrl);
        setIsLoading(false);
        // Also store in completedCache for future use
        completedCache.set(scriptKey, preloadedUrl);
        return;
      }

      // Check if we already generated audio for this component instance
      if (lastGeneratedScriptRef.current === scriptKey) {
        console.log('NarrationPlayer: Skipping duplicate generation for same script in this component');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Check if another component is already generating this audio
        if (audioCache.has(scriptKey)) {
          console.log('NarrationPlayer: Waiting for existing generation to complete');
          const existingPromise = audioCache.get(scriptKey)!;
          const audioUrl = await existingPromise;
          
          if (!isCancelled) {
            setError(null); // Clear any previous errors
            setAudioUrl(audioUrl);
            lastGeneratedScriptRef.current = scriptKey;
            console.log(`NarrationPlayer: Using cached audio: ${audioUrl}`);
          }
          return;
        }

        console.log(`NarrationPlayer: Generating audio with ElevenLabs for voiceId: ${voiceId}`);
        
        // Create promise and cache it immediately (using original working API)
        const generationPromise = apiService.generateNarration(script, voiceId)
          .then(result => {
            // Create blob URL from base64 data
            console.log('NarrationPlayer: Creating audio blob from result:', {
              audioType: result.audioType,
              audioDataLength: result.audioData?.length,
              audioDataPrefix: result.audioData?.substring(0, 50)
            });
            
            try {
              const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
              const audioUrl = URL.createObjectURL(audioBlob);
              console.log('NarrationPlayer: Audio blob created successfully:', {
                blobSize: audioBlob.size,
                blobType: audioBlob.type,
                audioUrl: audioUrl.substring(0, 50) + '...'
              });
              completedCache.set(scriptKey, audioUrl);
              audioCache.delete(scriptKey); // Remove from pending cache
              return audioUrl;
            } catch (blobError) {
              console.error('NarrationPlayer: Error creating audio blob:', blobError);
              throw new Error('Failed to create audio blob: ' );
            }
          })
          .catch(err => {
            audioCache.delete(scriptKey); // Remove from pending cache on error
            throw err;
          });
        
        audioCache.set(scriptKey, generationPromise);
        
        const audioUrl = await generationPromise;
        
        if (!isCancelled) {
          console.log(`NarrationPlayer: Setting new audioUrl: ${audioUrl.substring(0, 50)}...`);
          setError(null); // Clear any previous errors on successful generation
          setAudioUrl(audioUrl);
          lastGeneratedScriptRef.current = scriptKey;
          console.log(`NarrationPlayer: Audio generated successfully (blob URL)`);
        }
      } catch (err) {
        if (!isCancelled) {
          console.error('NarrationPlayer: Failed to generate narration:', err);
          setError('음성 생성에 실패했습니다. 다시 시도해주세요.');
          setAudioUrl(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    };

    generateAudio();

    // Cleanup function to cancel if component unmounts or effect re-runs
    return () => {
      isCancelled = true;
    };
  }, [script, voiceId, onEnd, retryTrigger]); // Added retryTrigger to force retry

  const handlePlayPause = useCallback(() => {
    if (!audioUrl || isLoading) return;
    
    // Always create a new audio element or update the source if URL changed
    if (!audioRef.current || audioRef.current.src !== audioUrl) {
      // Clean up previous audio element
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      
      console.log(`NarrationPlayer: Creating new audio element with URL: ${audioUrl.substring(0, 50)}...`);
      
      // Create new audio element with the current URL
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audio.loop = false; // Ensure no auto-replay
      audio.onplay = () => {
        console.log('NarrationPlayer: Audio started playing, duration:', audio.duration, 'chunks:', chunks.length);
        setError(null); // Clear any error when audio starts playing
        setIsPlaying(true);
        setShowReplayButton(false); // Hide replay button when audio starts
        if (onPlay) onPlay();
        
        // Start chunk timing tracking if chunked display is enabled
        if (chunkedDisplay && chunks.length > 0) {
          console.log('NarrationPlayer: Starting chunked timing with simple even distribution');
          // Reset to first chunk when starting
          setCurrentChunkIndex(0);
          // Start timing with simple even distribution
          startChunkTiming();
        }
      };
      audio.onpause = () => {
        setIsPlaying(false);
        if (onPause) onPause();
        
        // Stop chunk timing when paused
        stopChunkTiming();
      };
      audio.onended = () => {
        setIsPlaying(false);
        if (onPause) onPause(); // Call onPause when ended to switch back to static image
        
        // Stop chunk timing and show last chunk
        stopChunkTiming();
        if (chunkedDisplay && chunks.length > 0) {
          setCurrentChunkIndex(chunks.length - 1);
        }
        
        // Show replay button after narration ends
        setShowReplayButton(true);
        
        // Call onEnd to notify that narration is complete (for enabling continue button)
        if (onEnd) onEnd();
      };
      
      // Add loadedmetadata event for debugging
      audio.onloadedmetadata = () => {
        console.log('NarrationPlayer: Audio metadata loaded, duration:', audio.duration, 'chunkedDisplay:', chunkedDisplay, 'chunks:', chunks.length);
      };
      audio.onerror = (e) => {
        console.error('NarrationPlayer: Audio playback error:', e);
        console.error('Audio error details:', {
          error: e,
          audioSrc: audio.src,
          audioReadyState: audio.readyState,
          audioNetworkState: audio.networkState,
          audioError: audio.error
        });
        
        // Don't show error to user for now since backend is working correctly
        // Most "errors" are browser autoplay restrictions, not real failures
        console.log('NarrationPlayer: Audio error logged but not displayed to user');
      };
      audioRef.current = audio;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error('NarrationPlayer: Failed to play audio:', err);
        setError('음성 재생에 실패했습니다.');
      });
    }
  }, [audioUrl, isLoading, isPlaying, onEnd]);

  const handleRetry = useCallback(() => {
    if (script && voiceId) {
      console.log('NarrationPlayer: Retrying audio generation');
      setError(null);
      setAudioUrl(null);
      setIsPlaying(false);
      // Reset the last generated script ref to force regeneration
      lastGeneratedScriptRef.current = null;
      // Reset autoplay flag so it will autoplay after retry
      hasAutoPlayed.current = false;
      // Set loading state immediately to show progress
      setIsLoading(true);
      // Increment retry trigger to force useEffect to re-run
      setRetryTrigger(prev => prev + 1);
    }
  }, [script, voiceId]);

  // Track audioUrl changes for debugging and reset auto-play flag
  useEffect(() => {
    if (audioUrl) {
      console.log(`NarrationPlayer: audioUrl changed to: ${audioUrl.substring(0, 50)}...`);
      // Reset auto-play flag when audioUrl changes
      hasAutoPlayed.current = false;
      // Clear any previous errors when new audio is available
      setError(null);
    }
  }, [audioUrl]);

  // Auto-play when audio is ready (always auto-play, not just when autoPlay prop is true)
  useEffect(() => {
    if (audioUrl && !isPlaying && !isLoading && !hasAutoPlayed.current) {
      console.log('NarrationPlayer: Auto-playing generated audio');
      hasAutoPlayed.current = true;
      handlePlayPause(); // Play immediately without delay
    }
  }, [audioUrl, isPlaying, isLoading, handlePlayPause]);

  // Expose stop function for external control
  useEffect(() => {
    // Reset auto-play flag when script changes
    if (script) {
      hasAutoPlayed.current = false;
    }
  }, [script]);

  // We're using simple even distribution, so this is no longer needed
  
  // Chunk timing functions
  const startChunkTiming = useCallback(() => {
    if (!audioRef.current || chunks.length === 0) return;
    
    console.log('NarrationPlayer: Starting chunk timing with', chunks.length, 'chunks');
    
    const updateChunk = () => {
      if (!audioRef.current) return;
      
      const currentTime = audioRef.current.currentTime;
      const totalDuration = audioRef.current.duration;
      
      if (!totalDuration || chunks.length === 0 || audioRef.current.paused) return;
      
      let newChunkIndex = 0;
      
      // Simple even distribution - more reliable than character-based timing
      const timePerChunk = totalDuration / chunks.length;
      newChunkIndex = Math.min(Math.floor(currentTime / timePerChunk), chunks.length - 1);
      
      if (newChunkIndex !== currentChunkIndex && newChunkIndex < chunks.length) {
        //console.log(`NarrationPlayer: Switching to chunk ${newChunkIndex} at time ${currentTime.toFixed(2)}s / ${totalDuration.toFixed(2)}s: "${chunks[newChunkIndex]}"`);
        setCurrentChunkIndex(newChunkIndex);
      }
    };
    
    // Update chunk every 100ms
    timeUpdateIntervalRef.current = setInterval(updateChunk, 100);
  }, [currentChunkIndex, chunks]);
  
  const stopChunkTiming = useCallback(() => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  }, []);

  // Add stop method to component
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      if (onPause) onPause();
    }
    stopChunkTiming();
    if (chunkedDisplay) {
      setCurrentChunkIndex(0);
    }
  }, [onPause, stopChunkTiming, chunkedDisplay]);

  // Cleanup effect when script changes
  useEffect(() => {
    return () => {
      // Clean up audio element when script changes
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      setIsPlaying(false);
      stopChunkTiming();
    };
  }, [script, stopChunkTiming]); // This runs when script changes

  // Global cleanup effect when component unmounts
  useEffect(() => {
    return () => {
      // Clean up audio element when component unmounts completely
      if (audioRef.current) {
        console.log('NarrationPlayer: Cleaning up audio on component unmount');
        audioRef.current.pause();
        audioRef.current.src = '';
        audioRef.current = null;
      }
      setIsPlaying(false);
      stopChunkTiming();
    };
  }, [stopChunkTiming]); // Empty dependency array - runs only on mount/unmount

  // Replay function
  const handleReplay = useCallback(() => {
    if (audioRef.current) {
      console.log('NarrationPlayer: Replaying audio');
      audioRef.current.currentTime = 0;
      setShowReplayButton(false);
      setCurrentChunkIndex(0); // Reset to first chunk
      audioRef.current.play().catch(err => {
        console.error('NarrationPlayer: Failed to replay audio:', err);
        setError('음성 재생에 실패했습니다.');
      });
    }
  }, []);

  // Expose stopAudio method to parent components
  useImperativeHandle(ref, () => ({
    stopAudio,
    replay: handleReplay,
  }), [stopAudio, handleReplay]);


  // If no script and showControls is false, return null
  // If no script but showControls is true, show a continue button
  if (!script && !showControls) return null;
  
  // Auto-continue effect when there's no script but showControls is true
  useEffect(() => {
    if (!script && showControls && onEnd) {
      const timer = setTimeout(() => {
        onEnd();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [script, showControls, onEnd]);

  // If no script but showControls is true, show continue message
  if (!script && showControls) {
    return (
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 mt-8 shadow-lg border-0">
        <div className="text-center">
          <div className="text-xl text-gray-600 font-medium">계속 진행 중...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="mt-6">
      {isLoading && (
        <div className="flex items-center space-x-4 py-4">
          <LoadingSpinner size="sm" />
          <span className="text-lg text-gray-600 font-medium">사용자 음성으로 내레이션 생성 중...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-between py-4 bg-red-50 rounded-2xl px-4">
          <span className="text-lg text-red-600 font-medium">{error}</span>
          <Button onClick={handleRetry} variant="ghost" size="sm">
            다시 시도
          </Button>
        </div>
      )}
      
      {!isLoading && !error && audioUrl && (
        <div className="text-center">
          {/* Display talking video if available, otherwise static image */}
          <div className="my-6 relative">
            {talkingImageUrl && isPlaying ? (
              <div className="relative">
                <video 
                  src={talkingImageUrl}
                  className="rounded-3xl w-72 h-72 md:w-80 md:h-80 object-cover mx-auto"
                  autoPlay
                  muted
                  loop
                  preload="metadata"
                  playsInline
                  style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}
                />
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={imageUrl}
                  alt="AI 캐릭터"
                  className="rounded-3xl w-72 h-72 md:w-80 md:h-80 object-cover mx-auto"
                  onLoad={() => console.log('NarrationPlayer: Image loaded')}
                  style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)' }}
                />
                
                {/* Full Video Blur Replay Button */}
                {showReplayButton && (
                  <div 
                    className="absolute inset-0 flex items-center justify-center rounded-3xl"
                    style={{
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)', // 30% opacity
                    }}
                  >
                    <button
                      onClick={handleReplay}
                      className="group relative bg-white/20 hover:bg-white/40 
                               border border-white/50 rounded-2xl px-6 py-3 
                               transition-all duration-300 ease-out
                               hover:scale-105 hover:shadow-xl 
                               active:scale-95"
                      style={{
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15)',
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <svg 
                          className="w-6 h-6 text-gray-800 group-hover:text-orange-600 transition-colors" 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path 
                            fillRule="evenodd" 
                            d="M4 2a1 1 0 011 1v1.323l3.954 2.582 7.049 4.605a.5.5 0 010 .84l-7.049 4.605L5 17.677V19a1 1 0 11-2 0V3a1 1 0 011-1z" 
                            clipRule="evenodd" 
                          />
                        </svg>
                        <span className="text-gray-800 group-hover:text-orange-600 font-semibold text-base transition-colors">
                          다시듣기
                        </span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Script display - conditionally visible */}
          {(hideScript ? false : showScript) && (
            <div className="mt-6">
              {chunkedDisplay && chunks.length > 0 ? (
                <div className="w-full">
                  <div className="text-center">
                    {/* Text container with proper height and positioning */}
                    <div className="relative min-h-[5rem] sm:min-h-[4rem] flex items-center justify-center px-2 sm:px-4">
                      <div className="w-full max-w-none">
                        {chunks.map((chunk, index) => (
                          <p 
                            key={`chunk-${index}`}
                            className={`text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed font-medium transition-all duration-700 ease-in-out ${
                              index === currentChunkIndex 
                                ? 'opacity-100 transform translate-y-0 relative scale-100' 
                                : 'opacity-0 transform translate-y-3 absolute inset-0 scale-95'
                            }`}
                            style={{
                              textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                              wordBreak: 'keep-all',
                              overflowWrap: 'break-word',
                              whiteSpace: 'pre-wrap'
                            }}
                          >
                            {chunk}
                          </p>
                        ))}
                      </div>
                    </div>
                    
                    {/* Progress indicators */}
                    <div className="mt-6 flex justify-center items-center space-x-3">
                      {chunks.map((_, index) => (
                        <div
                          key={index}
                          className={`w-3 h-3 rounded-full transition-all duration-500 ${
                            index === currentChunkIndex 
                              ? 'bg-gradient-to-r from-orange-400 to-amber-400 scale-150 shadow-lg' 
                              : index < currentChunkIndex 
                                ? 'bg-gradient-to-r from-orange-300 to-amber-300 scale-110' 
                                : 'bg-gray-300 scale-100'
                          }`}
                        />
                      ))}
                    </div>
                    
                  </div>
                </div>
              ) : (
                <p className="text-lg sm:text-xl md:text-2xl text-gray-700 leading-relaxed font-medium text-center">
                  {script}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

NarrationPlayer.displayName = 'NarrationPlayer';

export default NarrationPlayer;
