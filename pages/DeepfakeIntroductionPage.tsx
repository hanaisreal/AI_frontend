import React, { useState, useEffect } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import PageLayout from '../components/PageLayout.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import BackButton from '../components/BackButton.tsx';
import VideoIdentificationQuiz from '../components/VideoIdentificationQuiz.tsx';
import { Page, UserData } from '../types.ts';
import { SCRIPTS, DEEPFAKE_PEOPLE_DATA, DEEPFAKE_IDENTIFICATION_VIDEO_URL } from '../constants.tsx';

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

  // Sync local step with global step tracking
  useEffect(() => {
    if (currentStepIndex !== currentStep) {
      setCurrentStep(currentStepIndex);
    }
  }, [currentStepIndex, currentStep, setCurrentStep]);

  const steps = [
    {
      id: 'video-intro-narration',
      title: '딥페이크 기술 소개',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeIntroStart,
      requires: ['userCaricature'],
    },
    {
      id: 'concept-video',
      title: '딥페이크 개념 영상',
      type: 'info',
      content: (
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-6">딥페이크와 딥보이스 기술이란?</h3>
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
      id: 'quiz-intro-narration',
      title: '퀴즈 소개',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuizIntro,
      requires: ['userCaricature'],
    },
    {
      id: 'video-identification-quiz',
      title: '진짜 vs 가짜 영상 퀴즈',
      type: 'video_identification_quiz',
      videoQuizData: DEEPFAKE_PEOPLE_DATA,
    },
    {
      id: 'quiz-complete-narration',
      title: '퀴즈 완료 및 모듈 전환',
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
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const currentStepData = steps[currentStepIndex];

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case 'narration':
        return (
          <PersonaTransitionSlide
            onNext={handleNext}
            userData={userData}
            caricatureUrl={caricatureUrl}
            voiceId={voiceId}
            talkingPhotoUrl={talkingPhotoUrl}
            script={currentStepData.narrationScript || ''}
          />
        );

      case 'info':
        return (
          <Card>
            <div className="text-center">
              {currentStepData.content}
              <div className="mt-8 flex justify-center space-x-4">
                {currentStepIndex > 0 && (
                  <Button onClick={handlePrevious} variant="secondary">
                    이전
                  </Button>
                )}
                <Button onClick={handleNext} variant="primary">
                  다음
                </Button>
              </div>
            </div>
          </Card>
        );

      case 'video_identification_quiz':
        return (
          <VideoIdentificationQuiz
            peopleData={currentStepData.videoQuizData || []}
            onQuizComplete={handleNext}
            onPrevious={currentStepIndex > 0 ? handlePrevious : undefined}
          />
        );

      default:
        return (
          <Card>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4">{currentStepData.title}</h3>
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
    <PageLayout title="딥페이크 기술 이해하기">
      {/* Back Button */}
      {canGoBack && currentStepData.type !== 'narration' && (
        <div className="mb-6">
          <BackButton onClick={onGoBack} />
        </div>
      )}

      {/* Progress indicator */}
      {currentStepData.type !== 'narration' && (
        <div className="mb-8">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>진행률</span>
            <span>{currentStepIndex + 1} / {steps.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {renderStepContent()}
    </PageLayout>
  );
};

export default DeepfakeIntroductionPage;