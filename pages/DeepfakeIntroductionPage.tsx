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
      id: 'quiz-feedback-1',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuiz1,
      requires: ['userCaricature'],
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

  const currentStepData = steps[currentStepIndex];

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case 'narration':
        return (
          <Card>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">{currentStepData.title}</h3>
              <PersonaTransitionSlide
                onNext={handleNext}
                userData={userData}
                caricatureUrl={caricatureUrl}
                voiceId={voiceId}
                talkingPhotoUrl={talkingPhotoUrl}
                script={currentStepData.narrationScript || ''}
                chunkedDisplay={true}
                showScript={true} // Set to false to hide script and show only talking photo
              />
            </div>
          </Card>
        );

      case 'info':
        return (
          <Card>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-6">{currentStepData.title}</h3>
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
      {(canGoBack || currentStepIndex > 0) && currentStepData.type !== 'narration' && (
        <div className="mb-6">
          <BackButton onClick={handlePrevious} />
        </div>
      )}

      

      {renderStepContent()}
    </PageLayout>
  );
};

export default DeepfakeIntroductionPage;