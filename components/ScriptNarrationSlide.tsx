import React, { useState, useEffect } from 'react';
import Button from './Button';
import ContinueButton from './ContinueButton';
import * as apiService from '../services/apiService';

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
    
    const words = script.split(' ');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      if (currentIndex < words.length) {
        setDisplayedText(prev => prev + (currentIndex === 0 ? '' : ' ') + words[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 300); // Show one word every 300ms
    
    return () => clearInterval(interval);
  }, [script]);

  // Audio generation and playback
  useEffect(() => {
    if (voiceId && autoPlay) {
      generateAndPlayAudio();
    }
  }, [script, voiceId, autoPlay]);

  const generateAndPlayAudio = async () => {
    if (!voiceId) return;
    
    try {
      setIsPlaying(true);
      console.log('🎵 Generating narration for script-only slide...');
      
      const result = await apiService.generateNarration(script, voiceId);
      
      // Create audio from base64 data
      const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const audio = new Audio(audioUrl);
      setAudioElement(audio);
      
      audio.onended = () => {
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsPlaying(false);
      };
      
      await audio.play();
      console.log('✅ Audio playback started');
      
    } catch (error) {
      console.error('Failed to generate or play audio:', error);
      setIsPlaying(false);
    }
  };

  const handleReplay = () => {
    if (audioElement) {
      audioElement.currentTime = 0;
      audioElement.play();
      setIsPlaying(true);
    } else {
      generateAndPlayAudio();
    }
  };

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

      <div className="flex justify-center items-center space-x-4">
        {voiceId && (
          <Button 
            onClick={handleReplay} 
            variant="secondary" 
            size="md"
            disabled={isPlaying}
          >
            {isPlaying ? '재생 중...' : '다시 듣기'}
            <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          </Button>
        )}
        
        <ContinueButton 
          onClick={onNext}
          showAnimation={isComplete}
          text="계속하기"
        />
      </div>
    </div>
  );
};

export default ScriptNarrationSlide;