import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Button from './Button';
import BackButton from './BackButton';
import NarrationPlayer from './NarrationPlayer';
import { Page, UserData } from '../types';

// CSS for modern zoom animation
const pulseZoomStyles = `
  @keyframes pulse-zoom {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
  }
`;

interface PersonaTransitionSlideProps {
  onNext: () => void;
  onPrevious?: () => void; // Optional back button handler
  userData: UserData | null;
  caricatureUrl: string | null;
  talkingPhotoUrl: string | null;
  voiceId: string | null;
  script: string;
  hideScript?: boolean; // Deprecated: use showScript instead
  showScript?: boolean; // New prop to control script visibility (default: true)
  chunkedDisplay?: boolean; // New prop for chunked text display
}

const PersonaTransitionSlide = forwardRef<any, PersonaTransitionSlideProps>(({
  onNext,
  onPrevious,
  userData,
  caricatureUrl,
  talkingPhotoUrl,
  voiceId,
  script,
  hideScript = false,
  showScript = false,  //true would show the narration on screen
  chunkedDisplay = false,
}, ref) => {
  const [canContinue, setCanContinue] = useState(false);
  const [narrationEnded, setNarrationEnded] = useState(false);
  const narrationPlayerRef = useRef<any>(null);

  useEffect(() => {
    // Allow continuing immediately for faster interaction
    setCanContinue(true);
    // Reset narration ended state when script changes
    setNarrationEnded(false);
  }, [script]);

  const handleNext = () => {
    // Stop audio immediately when user clicks continue
    if (narrationPlayerRef.current && narrationPlayerRef.current.stopAudio) {
      narrationPlayerRef.current.stopAudio();
    }
    onNext();
  };

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (narrationPlayerRef.current && narrationPlayerRef.current.stopAudio) {
        console.log('PersonaTransitionSlide: Cleaning up audio on unmount');
        narrationPlayerRef.current.stopAudio();
      }
    };
  }, []);

  // Expose stopAudio method to parent components
  useImperativeHandle(ref, () => ({
    stopAudio: () => {
      if (narrationPlayerRef.current && narrationPlayerRef.current.stopAudio) {
        narrationPlayerRef.current.stopAudio();
      }
    },
  }), []);

  return (
    <div className="text-center">
      <style>{pulseZoomStyles}</style>
      <div className="max-w-md mx-auto mb-8">
        {caricatureUrl && talkingPhotoUrl && voiceId ? (
          <NarrationPlayer
            ref={narrationPlayerRef}
            script={script}
            voiceId={voiceId}
            imageUrl={caricatureUrl}
            talkingImageUrl={talkingPhotoUrl}
            autoPlay={true}
            onEnd={() => {
              setCanContinue(true);
              setNarrationEnded(true);
            }} // Enable continue button when narration ends
            hideScript={hideScript}
            showScript={showScript}
            chunkedDisplay={chunkedDisplay}
            // Note: Preloading is handled by the parent module pages
          />
        ) : (
          <div className="text-center">
            <div className="text-slate-600 mb-4">
              {script || "준비 중..."}
            </div>
            <div className="text-sm text-slate-500">
              캐릭터 데이터 로딩 중... (caricature: {caricatureUrl ? '✓' : '✗'}, talkingPhoto: {talkingPhotoUrl ? '✓' : '✗'}, voice: {voiceId ? '✓' : '✗'})
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center space-x-4">
        {onPrevious && (
          <BackButton
            onClick={onPrevious}
            size="lg"
            variant="primary"
          />
        )}
        <Button
          onClick={handleNext}
          disabled={!canContinue}
          size="lg"
          variant="primary"
          className={`transition-all duration-300 ${
            narrationEnded && canContinue 
              ? 'shadow-lg' 
              : 'transition-opacity duration-500'
          }`}
          style={narrationEnded && canContinue ? {
            animation: 'pulse-zoom 2s ease-in-out infinite',
          } : {}}
        >
          계속하기
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
          </svg>
        </Button>
      </div>
    </div>
  );
});

PersonaTransitionSlide.displayName = 'PersonaTransitionSlide';

export default PersonaTransitionSlide;