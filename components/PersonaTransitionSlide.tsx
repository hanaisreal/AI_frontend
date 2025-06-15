import React, { useState, useEffect } from 'react';
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

const PersonaTransitionSlide: React.FC<PersonaTransitionSlideProps> = ({
  onNext,
  userData,
  caricatureUrl,
  talkingPhotoUrl,
  voiceId,
  script,
}) => {
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    // Allows continuing after a short delay, to encourage listening
    const timer = setTimeout(() => {
      setCanContinue(true);
    }, 4000); // 4 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">이제, AI 아바타가 되어 교육을 진행합니다.</h2>
      <p className="text-lg text-slate-600 mb-8">
        생성된 AI 아바타가 여러분의 목소리로 교육 내용을 설명합니다.
      </p>

      <div className="max-w-md mx-auto mb-8">
        {caricatureUrl && talkingPhotoUrl && voiceId && (
          <NarrationPlayer
            script={script}
            voiceId={voiceId}
            imageUrl={caricatureUrl}
            talkingImageUrl={talkingPhotoUrl}
            autoPlay={true}
            onNarrationComplete={() => setCanContinue(true)}
          />
        )}
      </div>

      <Button
        onClick={onNext}
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
  );
};

export default PersonaTransitionSlide;