import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Button from './Button';
import BackButton from './BackButton';
import NarrationPlayer from './NarrationPlayer';
import ContinueButton from './ContinueButton';
import { Page, UserData } from '../types';

// CSS styles moved to ContinueButton component

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
  const [canContinue, setCanContinue] = useState(true); // Always allow continue
  const [narrationEnded, setNarrationEnded] = useState(false);
  const [narrationStarted, setNarrationStarted] = useState(false);
  const narrationPlayerRef = useRef<any>(null);

  useEffect(() => {
    // Allow continuing immediately for faster interaction
    setCanContinue(true);
    // Reset narration ended state when script changes
    setNarrationEnded(false);
    setNarrationStarted(false);
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

  // Expose stopAudio and replay methods to parent components
  useImperativeHandle(ref, () => ({
    stopAudio: () => {
      if (narrationPlayerRef.current && narrationPlayerRef.current.stopAudio) {
        narrationPlayerRef.current.stopAudio();
      }
    },
    replay: () => {
      if (narrationPlayerRef.current && narrationPlayerRef.current.replay) {
        narrationPlayerRef.current.replay();
      }
    },
  }), []);

  return (
    <div className="text-center">
      <div className="max-w-md mx-auto mb-8">
        {caricatureUrl && voiceId ? (
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
            onPlay={() => {
              // Track when narration starts
              setNarrationStarted(true);
              setNarrationEnded(false);
            }}
            hideScript={hideScript}
            showScript={showScript}
            chunkedDisplay={chunkedDisplay}
            showCharacter={!talkingPhotoUrl ? false : true}
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
        {/* {onPrevious && (
          <BackButton
            onClick={onPrevious}
            size="lg"
            variant="primary"
          />
        )} */}
        <ContinueButton
          onClick={handleNext}
          disabled={!canContinue}
          showAnimation={narrationEnded && canContinue}
        />
      </div>
    </div>
  );
});

PersonaTransitionSlide.displayName = 'PersonaTransitionSlide';

export default PersonaTransitionSlide;