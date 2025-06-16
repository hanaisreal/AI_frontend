import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Button from './Button';
import NarrationPlayer from './NarrationPlayer';
import { Page, UserData } from '../types';

interface PersonaTransitionSlideProps {
  onNext: () => void;
  userData: UserData | null;
  caricatureUrl: string | null;
  talkingPhotoUrl: string | null;
  voiceId: string | null;
  script: string;
}

const PersonaTransitionSlide = forwardRef<any, PersonaTransitionSlideProps>(({
  onNext,
  userData,
  caricatureUrl,
  talkingPhotoUrl,
  voiceId,
  script,
}, ref) => {
  const [canContinue, setCanContinue] = useState(false);
  const narrationPlayerRef = useRef<any>(null);

  useEffect(() => {
    // Allows continuing after a short delay, to encourage listening
    const timer = setTimeout(() => {
      setCanContinue(true);
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, []);

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
      <div className="max-w-md mx-auto mb-8">
        {caricatureUrl && talkingPhotoUrl && voiceId ? (
          <NarrationPlayer
            ref={narrationPlayerRef}
            script={script}
            voiceId={voiceId}
            imageUrl={caricatureUrl}
            talkingImageUrl={talkingPhotoUrl}
            autoPlay={true}
            onEnd={() => setCanContinue(true)} // Enable continue button when narration ends
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

      <div className="flex justify-center">
        <Button
          onClick={handleNext}
          disabled={!canContinue}
          size="lg"
          variant="primary"
          className="transition-opacity duration-500"
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