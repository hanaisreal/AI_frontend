import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import NarrationPlayer from '../components/NarrationPlayer.tsx';
import VideoIdentificationQuiz from '../components/VideoIdentificationQuiz.tsx';
import PageLayout from '../components/PageLayout.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import BackButton from '../components/BackButton.tsx';
import { SCRIPTS, DEEPFAKE_IDENTIFICATION_VIDEO_URL, DEEPFAKE_PEOPLE_DATA, PLACEHOLDER_USER_IMAGE } from '../constants.tsx';
import { Page, ModuleStep, UserAnswerForVideoQuiz, UserData } from '../types.ts';

const INTRO_STEPS: ModuleStep[] = [
  {
    id: 'intro_explanation',
    title: "딥페이크 기술 이해하기",
    type: 'info',
    content: "딥페이크 기술이 어떻게 작동하는지 이해해보겠습니다. 이 기술이 얼마나 정교해질 수 있는지 확인해보세요.",
    narrationScript: SCRIPTS.introDeepfake, 
  },
  {
    id: 'intro_video_quiz_challenge',
    title: "딥페이크 탐지 챌린지",
    type: 'video_identification_quiz',
    videoUrl: DEEPFAKE_IDENTIFICATION_VIDEO_URL,
    videoQuizData: DEEPFAKE_PEOPLE_DATA,
    narrationScript: SCRIPTS.videoQuizIntro, 
  },
];

interface IntroductionEducationPageProps {
  setCurrentPage: (page: Page) => void;
  userData: UserData | null;
  caricatureUrl: string | null;
  voiceId: string | null;
  talkingPhotoUrl: string | null;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const IntroductionEducationPage: React.FC<IntroductionEducationPageProps> = ({ 
  setCurrentPage,
  userData,
  caricatureUrl,
  voiceId,
  talkingPhotoUrl,
  currentStep: globalCurrentStep,
  setCurrentStep: setGlobalCurrentStep,
  onGoBack,
  canGoBack
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(globalCurrentStep || 0);
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  // const [keyForContentNarration, setKeyForContentNarration] = useState(0); // Not currently used.
  const [quizCompletedForCurrentStep, setQuizCompletedForCurrentStep] = useState(false);
  const [currentView, setCurrentView] = useState<'personaTransition' | 'content'>('personaTransition');
  const [scriptForPersona, setScriptForPersona] = useState<string>("");

  const currentStep = INTRO_STEPS[currentStepIndex];

  // Sync local step with global step tracking
  useEffect(() => {
    if (currentStepIndex !== globalCurrentStep) {
      setGlobalCurrentStep(currentStepIndex);
    }
  }, [currentStepIndex, globalCurrentStep, setGlobalCurrentStep]);

  // Sync global step changes to local step
  useEffect(() => {
    if (globalCurrentStep !== currentStepIndex && globalCurrentStep < INTRO_STEPS.length) {
      setCurrentStepIndex(globalCurrentStep);
    }
  }, [globalCurrentStep, currentStepIndex]);

  useEffect(() => {
    if (!currentStep) return;

    setIsLoadingStep(true);
    setQuizCompletedForCurrentStep(false); 
    
    let personaScript = SCRIPTS.personaIntroDefault || "다음 내용을 살펴보겠습니다.";
    if (currentStep.narrationScript) {
      personaScript = currentStep.narrationScript;
    } else if (currentStep.type === 'video_identification_quiz') {
      personaScript = SCRIPTS.videoQuizIntro; // Already specific
    } else if (currentStep.type === 'info') {
      personaScript = SCRIPTS.personaIntroInfo || "다음 정보를 살펴보겠습니다.";
    }
    
    setScriptForPersona(personaScript);
    setCurrentView('personaTransition'); 
    
    // setKeyForContentNarration(prev => prev + 1); 
    setIsLoadingStep(false);

  }, [currentStepIndex, currentStep]);

  const handlePersonaNarrationEnd = useCallback(() => {
    setCurrentView('content');
  }, []); // Empty dependency array as setCurrentView is stable

  const handleNext = () => {
    setQuizCompletedForCurrentStep(false);
    if (currentStepIndex < INTRO_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setCurrentPage(Page.ModuleSelection);
    }
  };
  
  const handleVideoQuizComplete = (score: number, total: number, answers: UserAnswerForVideoQuiz[]) => {
    console.log(`Intro Video Identification Quiz Complete: Score ${score}/${total}`, answers);
    setQuizCompletedForCurrentStep(true); 
  };
  
  const renderContentStep = () => {
    if (isLoadingStep || !currentStep) {
      return <div className="flex justify-center py-12"><LoadingSpinner text="로딩 중..." /></div>;
    }
    
    switch (currentStep.type) {
      case 'info':
        return <div className="text-slate-700 text-lg leading-relaxed space-y-4">{currentStep.content}</div>;
      case 'caseStudy':
        // Legacy case study support - now handled by 'info' type
        return <div className="text-slate-700 text-lg leading-relaxed space-y-4">{currentStep.content}</div>;
      case 'video_identification_quiz':
        if (!currentStep.videoUrl || !currentStep.videoQuizData) {
          return <p className="text-red-500 text-lg">비디오 퀴즈 데이터가 설정되지 않았습니다.</p>;
        }
        return (
          <VideoIdentificationQuiz
            videoUrl={currentStep.videoUrl}
            peopleData={currentStep.videoQuizData}
            onQuizComplete={handleVideoQuizComplete}
            title={currentStep.title} 
          />
        );
      default:
        return <p className="text-yellow-500 text-lg">알 수 없는 단계 유형입니다.</p>;
    }
  };


  if (!currentStep) {
    return <PageLayout title="기술 이해하기"><Card><p>소개 로딩 중...</p></Card></PageLayout>;
  }

  const showNextButton = currentView === 'content' && (currentStep.type !== 'video_identification_quiz' || quizCompletedForCurrentStep);

  return (
    <PageLayout title="기술 이해하기" showAppTitle={true}>
      <Card title={currentStep.title}>
        {/* Back Button */}
        {canGoBack && (
          <div className="mb-6">
            <BackButton onClick={onGoBack} />
          </div>
        )}
        
        {currentView === 'personaTransition' ? (
          <PersonaTransitionSlide
            caricatureUrl={caricatureUrl}
            voiceId={voiceId}
            talkingPhotoUrl={talkingPhotoUrl}
            script={scriptForPersona}
            onNext={handlePersonaNarrationEnd}
            userData={userData}
          />
        ) : (
          <>
            <div className="min-h-[250px] flex flex-col justify-center">
              {renderContentStep()}
            </div>
            
            {showNextButton && (
              <div className="mt-10">
                <Button onClick={handleNext} variant="primary" size="lg">
                  이해했으며, 계속 진행합니다
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </PageLayout>
  );
};

export default IntroductionEducationPage;
