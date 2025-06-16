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
    narrationScript: SCRIPTS.deepfakeIntroStart, 
  },
  {
    id: 'intro_video_quiz_challenge',
    title: "무엇이 딥페이크 영상일까요?",
    type: 'video_identification_quiz',
    videoUrl: DEEPFAKE_IDENTIFICATION_VIDEO_URL,
    videoQuizData: DEEPFAKE_PEOPLE_DATA,
    narrationScript: SCRIPTS.deepfakeQuizIntro, 
  },
  {
    id: 'intro_quiz_results',
    title: "퀴즈 결과",
    type: 'info',
    content: `
      <div class="text-center space-y-6">
        <h3 class="text-2xl font-bold text-orange-600">퀴즈 결과</h3>
        <p class="text-lg">놀랍게도 <strong>모든 영상이 AI로 생성된 가짜 영상</strong>이었습니다!</p>
        <div class="bg-orange-50 p-6 rounded-lg border border-orange-200">
          <p class="text-gray-700">이처럼 딥페이크 기술은 매우 정교해져서 실제와 구분하기 어려워졌습니다.</p>
          <p class="text-gray-600 mt-3">이제 딥페이크 기술이 어떻게 악용될 수 있는지 알아보겠습니다.</p>
        </div>
      </div>
    `,
    narrationScript: SCRIPTS.deepfakeQuizComplete,
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

  // Sync local step with global step tracking (one-way sync to prevent loops)
  useEffect(() => {
    if (currentStepIndex !== globalCurrentStep) {
      console.log(`🔄 Syncing step: local ${currentStepIndex} → global ${globalCurrentStep}`);
      setGlobalCurrentStep(currentStepIndex);
    }
  }, [currentStepIndex, globalCurrentStep, setGlobalCurrentStep]);

  // Initialize local step from global step only once
  useEffect(() => {
    if (globalCurrentStep !== currentStepIndex && globalCurrentStep < INTRO_STEPS.length && currentStepIndex === 0) {
      console.log(`🔄 Initializing local step from global: ${globalCurrentStep}`);
      setCurrentStepIndex(globalCurrentStep);
    }
  }, [globalCurrentStep, INTRO_STEPS.length]); // Removed currentStepIndex to prevent loop

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
    // If this is the quiz results step, go directly to module selection after narration
    if (currentStep?.id === 'intro_quiz_results') {
      setCurrentPage(Page.ModuleSelection);
    } else {
      setCurrentView('content');
    }
  }, [currentStep?.id, setCurrentPage]); // Added dependencies

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

  const handleReviewVideos = () => {
    // Go back to the video quiz step
    setCurrentStepIndex(1);
    setQuizCompletedForCurrentStep(false);
  };
  
  const renderContentStep = () => {
    if (isLoadingStep || !currentStep) {
      return <div className="flex justify-center py-12"><LoadingSpinner text="로딩 중..." /></div>;
    }
    
    switch (currentStep.type) {
      case 'info':
        // Special handling for quiz results page
        if (currentStep.id === 'intro_quiz_results') {
          return (
            <div className="space-y-6">
              <div dangerouslySetInnerHTML={{ __html: currentStep.content || "" }} />
            </div>
          );
        }
        
        // Regular info content
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
              <div className="mt-10 flex justify-center">
                <Button onClick={handleNext} variant="primary" size="lg">
                  계속하기
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
