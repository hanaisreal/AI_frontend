import React, { useEffect, useState, useCallback, useRef } from 'react';
import Button from './Button.tsx';
import Card from './Card.tsx';
import LoadingSpinner from './LoadingSpinner.tsx';
import { NarrationSpeed, VoiceGender } from '../types.ts';
import * as apiService from '../services/apiService.ts';
import { FaPlay, FaPause, FaVolumeUp } from 'react-icons/fa';

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

const NarrationPlayer: React.FC<NarrationPlayerProps> = ({ 
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
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastGeneratedScriptRef = useRef<string | null>(null);
  const generationHasStarted = useRef(false);

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
            completedCache.set(scriptKey, result.audioUrl);
            audioCache.delete(scriptKey); // Remove from pending cache
            return result.audioUrl;
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
          console.log(`NarrationPlayer: Audio generated successfully: ${audioUrl}`);
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
        // Removed auto-progression - user must click button to continue
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

  const handleStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (script && voiceId) {
      setError(null);
      // Re-trigger audio generation by clearing audioUrl
      setAudioUrl(null);
    }
  }, [script, voiceId]);

  // Auto-play when audio is ready
  useEffect(() => {
    if (audioUrl && autoPlay && !isPlaying && !isLoading) {
      console.log('NarrationPlayer: Auto-playing generated audio');
      setTimeout(() => handlePlayPause(), 100); // Small delay to ensure audio element is ready
    }
  }, [audioUrl, autoPlay, isPlaying, isLoading, handlePlayPause]);

  const handleAudioPlay = () => {
    setIsPlaying(true);
  };
  
  const handleAudioPauseOrEnd = () => {
    setIsPlaying(false);
    if (onNarrationComplete) {
      onNarrationComplete();
    }
  };
  
  const handleCanPlayThrough = () => {
    if (autoPlay && audioRef.current) {
        console.log("NarrationPlayer: Auto-playing generated audio");
        audioRef.current.play().catch(e => console.error("Autoplay was prevented:", e));
    }
  };

  if (!script || !showControls) return null;

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
        <>
          {/* Controls are removed as per user request */}
        </>
      )}
    </Card>
  );
};

export default NarrationPlayer;
