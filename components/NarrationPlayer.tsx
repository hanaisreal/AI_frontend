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
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastGeneratedScriptRef = useRef<string | null>(null);
  const hasAutoPlayed = useRef(false); // Track if auto-play has already happened

  // Generate audio using ElevenLabs when script or voiceId changes
  useEffect(() => {
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
    
    // Check completed cache first
    if (completedCache.has(scriptKey)) {
      console.log('NarrationPlayer: Using completed cache for script');
      setAudioUrl(completedCache.get(scriptKey)!);
      setIsLoading(false);
      return;
    }

    // Check if we already generated audio for this component instance
    if (lastGeneratedScriptRef.current === scriptKey) {
      console.log('NarrationPlayer: Skipping duplicate generation for same script in this component');
      return;
    }

    let isCancelled = false;

    const generateAudio = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check if another component is already generating this audio
        if (audioCache.has(scriptKey)) {
          console.log('NarrationPlayer: Waiting for existing generation to complete');
          const existingPromise = audioCache.get(scriptKey)!;
          const audioUrl = await existingPromise;
          
          if (!isCancelled) {
            setAudioUrl(audioUrl);
            lastGeneratedScriptRef.current = scriptKey;
            console.log(`NarrationPlayer: Using cached audio: ${audioUrl}`);
          }
          return;
        }

        console.log(`NarrationPlayer: Generating audio with ElevenLabs for voiceId: ${voiceId}`);
        
        // Create promise and cache it immediately
        const generationPromise = apiService.generateNarration(script, voiceId)
          .then(result => {
            // Create blob URL from base64 data
            const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
            const audioUrl = URL.createObjectURL(audioBlob);
            completedCache.set(scriptKey, audioUrl);
            audioCache.delete(scriptKey); // Remove from pending cache
            return audioUrl;
          })
          .catch(err => {
            audioCache.delete(scriptKey); // Remove from pending cache on error
            throw err;
          });
        
        audioCache.set(scriptKey, generationPromise);
        
        const audioUrl = await generationPromise;
        
        if (!isCancelled) {
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
  }, [script, voiceId]); // Removed onEnd from dependencies

  const handlePlayPause = useCallback(() => {
    if (!audioUrl || isLoading) return;
    
    if (!audioRef.current) {
      // Create audio element if it doesn't exist
      const audio = new Audio(audioUrl);
      audio.preload = 'auto';
      audio.loop = false; // Ensure no auto-replay
      audio.onplay = () => {
        setIsPlaying(true);
        if (onPlay) onPlay();
      };
      audio.onpause = () => {
        setIsPlaying(false);
        if (onPause) onPause();
      };
      audio.onended = () => {
        setIsPlaying(false);
        if (onPause) onPause(); // Call onPause when ended to switch back to static image
        // Auto-continue when audio finishes
        setTimeout(() => {
          if (onEnd) onEnd();
        }, 1000); // 1 second delay before auto-continuing
      };
      audio.onerror = (e) => {
        console.error('NarrationPlayer: Audio playback error:', e);
        setError('음성 재생에 실패했습니다.');
        setIsPlaying(false);
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
      setError(null);
      // Re-trigger audio generation by clearing audioUrl
      setAudioUrl(null);
    }
  }, [script, voiceId]);

  // Auto-play when audio is ready (always auto-play, not just when autoPlay prop is true)
  useEffect(() => {
    if (audioUrl && !isPlaying && !isLoading && !hasAutoPlayed.current) {
      console.log('NarrationPlayer: Auto-playing generated audio');
      hasAutoPlayed.current = true;
      setTimeout(() => handlePlayPause(), 100); // Small delay to ensure audio element is ready
    }
  }, [audioUrl, isPlaying, isLoading, handlePlayPause]);

  // Expose stop function for external control
  useEffect(() => {
    // Reset auto-play flag when script changes
    if (script) {
      hasAutoPlayed.current = false;
    }
  }, [script]);

  // Add stop method to component
  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      if (onPause) onPause();
    }
  }, [onPause]);

  // Expose stopAudio method to parent components
  useImperativeHandle(ref, () => ({
    stopAudio,
  }), [stopAudio]);


  // If no script and showControls is false, return null
  // If no script but showControls is true, show a continue button
  if (!script && !showControls) return null;
  
  // If no script but showControls is true, show continue button
  if (!script && showControls) {
    // Auto-continue when there's no script
    useEffect(() => {
      const timer = setTimeout(() => {
        if (onEnd) onEnd();
      }, 500);
      return () => clearTimeout(timer);
    }, [onEnd]);
    
    return (
      <Card className="bg-slate-100 p-4 mt-6 shadow-md">
        <div className="text-center">
          <div className="text-slate-600">계속 진행 중...</div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-100 p-4 mt-6 shadow-md">
      {isLoading && (
        <div className="flex items-center space-x-3 py-2">
          <LoadingSpinner size="sm" />
          <span className="text-sm text-slate-600">사용자 음성으로 내레이션 생성 중...</span>
        </div>
      )}
      
      {error && (
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-red-600">{error}</span>
          <Button onClick={handleRetry} variant="ghost" size="sm">
            다시 시도
          </Button>
        </div>
      )}
      
      {!isLoading && !error && audioUrl && (
        <div className="text-center">
          {/* Display talking video if available, otherwise static image */}
          <div className="my-4">
            {talkingImageUrl && isPlaying ? (
              <video 
                src={talkingImageUrl}
                className="rounded-lg w-64 h-64 object-cover mx-auto border-4 border-orange-500"
                autoPlay
                loop
                muted
              />
            ) : (
              <img 
                src={imageUrl}
                alt="AI 캐릭터"
                className="rounded-lg w-64 h-64 object-cover mx-auto border-4 border-gray-300"
              />
            )}
          </div>
          
          {/* Script display - always visible */}
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
            <p className="text-lg text-gray-700 leading-relaxed">
              {script}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
});

NarrationPlayer.displayName = 'NarrationPlayer';

export default NarrationPlayer;
