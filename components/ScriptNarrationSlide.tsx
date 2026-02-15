import React, { useState, useEffect } from 'react';
import Button from './Button';
import ContinueButton from './ContinueButton';
import * as apiService from '../services/apiService';
import { isEnglish } from '../lang';

interface ScriptNarrationSlideProps {
  script: string;
  onNext: () => void;
  title?: string;
  voiceId?: string | null;
  autoPlay?: boolean;
  onNarrationComplete?: () => void; // Callback for when narration finishes
}

const ScriptNarrationSlide: React.FC<ScriptNarrationSlideProps> = ({
  script,
  onNext,
  title,
  voiceId,
  autoPlay = true
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  // Chunked text display effect
  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    
    if (!script || typeof script !== 'string') {
      setDisplayedText('Script not available');
      setIsComplete(true);
      return;
    }
    
    const words = script.split(' ');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        const currentWord = words[currentIndex];
        // Only add the word if it's not undefined, null, or empty
        if (currentWord != null && currentWord.trim() !== '') {
          setDisplayedText(prev => {
            const needsSpace = prev.length > 0;
            return prev + (needsSpace ? ' ' : '') + currentWord;
          });
        }
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 300); // Show one word every 300ms
    
    return () => clearInterval(interval);
  }, [script]);

  // Audio playback using pre-cached audio
  useEffect(() => {
    if (voiceId && autoPlay) {
      playPreCachedAudio();
    }
  }, [script, voiceId, autoPlay]);

  const playPreCachedAudio = async () => {
    if (!voiceId) return;
    
    try {
      setIsPlaying(true);
      
      // Check for pre-cached audio
      const scriptKey = `${script}-${voiceId}`;
      const globalCache = (window as any).narrationCache;
      
      if (globalCache && globalCache.has(scriptKey)) {
        const audioUrl = globalCache.get(scriptKey);
        
        const audio = new Audio(audioUrl);
        setAudioElement(audio);
        
        audio.onended = () => {
          setIsPlaying(false);
        };
        
        audio.onerror = (e) => {
          setIsPlaying(false);
        };
        
        await audio.play();
      } else {
        setIsPlaying(false);
      }
      
    } catch (error) {
      setIsPlaying(false);
    }
  };

  // Removed handleReplay function - no longer needed

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = '';
      }
    };
  }, [audioElement]);

  return (
    <div className="text-center max-w-2xl mx-auto">
      {title && (
        <h2 className="text-2xl font-bold text-orange-600 mb-8">{title}</h2>
      )}
      
      <div className="bg-slate-50 rounded-lg p-8 mb-8 border-2 border-slate-200">
        <div className="text-lg text-slate-800 leading-relaxed min-h-[120px] flex items-center justify-center">
          {displayedText}
          {!isComplete && <span className="animate-pulse">|</span>}
        </div>
      </div>

      <div className="flex justify-center items-center">
        <ContinueButton
          onClick={onNext}
          showAnimation={isComplete}
          text={isEnglish() ? 'Continue' : '계속하기'}
        />
      </div>
    </div>
  );
};

export default ScriptNarrationSlide;