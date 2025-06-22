import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import PageLayout from '../components/PageLayout.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import BackButton from '../components/BackButton.tsx';
import { Page, UserData } from '../types.ts';
import { SCRIPTS, DEEPFAKE_PEOPLE_DATA, DEEPFAKE_IDENTIFICATION_VIDEO_URL } from '../constants.tsx';
import * as apiService from '../services/apiService.ts';
import { scheduleNarrationPreload } from '../utils/narrationPreloader.ts';

interface DeepfakeIntroductionPageProps {
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

const DeepfakeIntroductionPage: React.FC<DeepfakeIntroductionPageProps> = ({
  setCurrentPage,
  userData,
  caricatureUrl,
  voiceId,
  talkingPhotoUrl,
  currentStep,
  setCurrentStep,
  onGoBack,
  canGoBack,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(currentStep || 0);
  const [preloadingNext, setPreloadingNext] = useState(false);

  // Sync local step with global step tracking
  useEffect(() => {
    if (currentStepIndex !== currentStep) {
      setCurrentStep(currentStepIndex);
    }
  }, [currentStepIndex, currentStep, setCurrentStep]);

  const steps = [
    {
      id: 'video-intro-narration',
      title: 'AI와 딥페이크 기술 소개',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeIntroStart,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-concept',
      title: '딥페이크란 무엇인가요?',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeConcept,
      requires: ['userCaricature'],
    },
    {
      id: 'deepvoice-concept',
      title: '딥보이스란 무엇인가요?',
      type: 'narration',
      narrationScript: SCRIPTS.deepvoiceConcept,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-transition',
      title: '딥페이크, 어떻게 만들어지나요?',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeVideoIntro,
      requires: ['userCaricature'],
    },
    {
      id: 'concept-video',
      type: 'info',
      content: (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6 text-orange-600">딥페이크와 딥보이스 기술이란?</h3>
          <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
            <video 
              controls 
              className="w-full h-full rounded-lg"
              src={DEEPFAKE_IDENTIFICATION_VIDEO_URL}
            >
              <p>브라우저가 동영상을 지원하지 않습니다.</p>
            </video>
          </div>
          <p className="text-gray-600 text-lg">
            위 영상을 통해 딥페이크와 딥보이스 기술이 어떻게 작동하는지 확인하세요.
          </p>
        </div>
      ),
    },
    {
      id: 'deepfake-transition',
      title: '딥페이크와 딥보이스의 위험성',
      type: 'narration',
      narrationScript: SCRIPTS.genAIConcept,
      requires: ['userCaricature'],
    },
    {
      id: 'quiz-intro-narration',
      title: '퀴즈 소개',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuizIntro,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-quiz-1',
      title: '딥페이크 식별 퀴즈 1',
      type: 'info',
      content: (
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">
            다음 영상을 주의 깊게 관찰해주세요. 이 영상이 진짜인지 AI로 생성된 가짜 영상인지 판단해보세요.
          </p>
          <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
            <video 
              controls 
              className="w-full h-full rounded-lg"
              src={DEEPFAKE_PEOPLE_DATA[0].videoUrl}
            >
              <p>브라우저가 동영상을 지원하지 않습니다.</p>
            </video>
          </div>
          <p className="text-gray-600 text-lg">
            눈, 입의 움직임, 목소리 톤 등을 자세히 살펴보세요.
          </p>
        </div>
      ),
    },
    {
      id: 'quiz-feedback-1',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuiz1,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-quiz-2',
      title: '딥페이크 식별 퀴즈 2',
      type: 'info',
      content: (
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">
            이번에는 두 번째 영상을 봐볼까요? 이 영상은 어떨까요?
          </p>
          <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
            <video 
              controls 
              className="w-full h-full rounded-lg"
              src={DEEPFAKE_PEOPLE_DATA[1].videoUrl}
            >
              <p>브라우저가 동영상을 지원하지 않습니다.</p>
            </video>
          </div>
          <p className="text-gray-600 text-lg">
            첫 번째 영상과 비교해서 어떤 차이점이 있는지 관찰해보세요.
          </p>
        </div>
      ),
    },
    {
      id: 'quiz-feedback-2',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuiz2,
      requires: ['userCaricature'],
    },
    {
      id: 'quiz-complete-narration',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuizComplete,
      requires: ['userCaricature'],
    },
  ];

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Go to module selection
      setCurrentPage(Page.ModuleSelection);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      console.log(`Going back from step ${currentStepIndex} to step ${currentStepIndex - 1}`);
      setCurrentStepIndex(currentStepIndex - 1);
    } else {
      // If at first step, use the global back function to go to previous page
      onGoBack();
    }
  };

  // Preload next step's narration using the new utility
  const preloadNextNarration = useCallback((currentStepIndex: number) => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex >= steps.length) return; // No next step
    
    const nextStep = steps[nextStepIndex];
    if (nextStep.type !== 'narration' || !nextStep.narrationScript) return;
    
    if (!userData?.userId || !voiceId) return;
    
    console.log(`🎵 Scheduling preload for step ${nextStep.id}`);
    return scheduleNarrationPreload(nextStep.narrationScript, voiceId, 2000);
  }, [steps, userData?.userId, voiceId]);

  const currentStepData = steps[currentStepIndex];

  // Preload next narration after current step content is ready
  useEffect(() => {
    if (userData?.userId && voiceId) {
      // Preload for narration steps
      if (currentStepData?.type === 'narration' && currentStepData?.narrationScript) {
        console.log(`🎵 Scheduling voice preload from narration: ${currentStepData.id}`);
        const preloadTimer = preloadNextNarration(currentStepIndex);
        return () => {
          if (preloadTimer) clearTimeout(preloadTimer);
        };
      }
      
      // Preload for info steps with video content (concept video, quiz videos)
      if (currentStepData?.type === 'info' && currentStepData?.content) {
        console.log(`🎵 Scheduling voice preload from info/video step: ${currentStepData.id}`);
        const preloadTimer = preloadNextNarration(currentStepIndex);
        return () => {
          if (preloadTimer) clearTimeout(preloadTimer);
        };
      }
    }
  }, [currentStepIndex, preloadNextNarration, userData?.userId, voiceId, currentStepData]); // Updated dependencies

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case 'narration':
        return (
          <Card>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-orange-600">{currentStepData.title}</h3>
              <PersonaTransitionSlide
                onNext={handleNext}
                onPrevious={currentStepIndex > 0 ? handlePrevious : undefined}
                userData={userData}
                caricatureUrl={caricatureUrl}
                voiceId={voiceId}
                talkingPhotoUrl={talkingPhotoUrl}
                script={currentStepData.narrationScript || ''}
                chunkedDisplay={true}
                showScript={false} // Set to false to hide script and show only talking photo
              />
            </div>
          </Card>
        );

      case 'info':
        return (
          <Card>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-orange-600">{currentStepData.title}</h3>
              {currentStepData.content}
              <div className="mt-8 flex justify-center items-center space-x-4">
                {/* {currentStepIndex > 0 && (
                  <BackButton onClick={handlePrevious} size="lg" variant="primary" />
                )} */}
                <Button onClick={handleNext} variant="primary" size="lg">
                  다음
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'quiz':
        return (
          <Card>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6 text-orange-600">{currentStepData.title}</h3>
              {currentStepData.content}
              <div className="mt-8 flex justify-center items-center space-x-4">
                {/* {currentStepIndex > 0 && (
                  <BackButton onClick={handlePrevious} size="lg" variant="primary" />
                )} */}
                <Button onClick={handleNext} variant="primary" size="lg">
                  다음
                </Button>
              </div>
            </div>
          </Card>
        );

      default:
        return (
          <Card>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-orange-600">{currentStepData.title}</h3>
              <p className="text-gray-600 mb-6">단계 내용이 준비되지 않았습니다.</p>
              <Button onClick={handleNext} variant="primary">
                다음
              </Button>
            </div>
          </Card>
        );
    }
  };

  return (
    <PageLayout >
      {/* Back Button */}
      {/* {(canGoBack || currentStepIndex > 0) && currentStepData.type !== 'narration' && (
        <div className="mb-6">
          <BackButton onClick={handlePrevious} />
        </div>
      )} */}

      

      {renderStepContent()}
    </PageLayout>
  );
};

export default DeepfakeIntroductionPage;