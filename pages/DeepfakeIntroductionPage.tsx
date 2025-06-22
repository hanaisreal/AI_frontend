import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import PageLayout from '../components/PageLayout.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import BackButton from '../components/BackButton.tsx';
import ContinueButton from '../components/ContinueButton.tsx';
import { Page, UserData } from '../types.ts';
import { SCRIPTS, DEEPFAKE_PEOPLE_DATA, DEEPFAKE_IDENTIFICATION_VIDEO_URL, NARRATOR_VOICE_ID } from '../constants.tsx';
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
  const [videoEnded, setVideoEnded] = useState(false);

  // Sync local step with global step tracking
  useEffect(() => {
    if (currentStepIndex !== currentStep) {
      setCurrentStep(currentStepIndex);
    }
  }, [currentStepIndex, currentStep, setCurrentStep]);

  // Reset video ended state when step changes
  useEffect(() => {
    setVideoEnded(false);
  }, [currentStepIndex]);

  const steps = [
    {
      id: 'video-intro-narration',
      title: 'AI, 얼마나 똑똑해졌을까요?',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeIntroStart,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-concept',
      title: 'AI가 얼굴을 바꾸는 기술',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeConcept,
      requires: ['userCaricature'],
    },
    {
      id: 'deepvoice-concept',
      title: 'AI가 목소리를 흉내내요',
      type: 'narration',
      narrationScript: SCRIPTS.deepvoiceConcept,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-transition',
      title: '이런 영상은 어떻게 만들까요?',
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
              autoPlay
              className="w-full h-full rounded-lg"
              src={DEEPFAKE_IDENTIFICATION_VIDEO_URL}
              onEnded={() => setVideoEnded(true)}
            >
              <p>브라우저가 동영상을 지원하지 않습니다.</p>
            </video>
          </div>
          {/* <p className="text-gray-600 text-lg">
            위 영상을 통해 딥페이크와 딥보이스 기술이 어떻게 작동하는지 확인하세요.
          </p> */}
        </div>
      ),
    },
    {
      id: 'deepfake-transition',
      title: 'AI가 사람까지 만들어낸다고요?',
      type: 'narration',
      narrationScript: SCRIPTS.genAIConcept,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-transition',
      title: 'AI가 사람까지 만들어낸다고요?',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeWrapup,
      requires: ['userCaricature'],
    },
    {
      id: 'quiz-intro-narration',
      title: '진짜인지 맞혀보세요!',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuizIntro,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-quiz-1',
      title: '이 영상, 진짜일까요?',
      type: 'info',
      content: (
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">
            이 영상이 진짜인지 AI로 생성된 가짜 영상인지 판단해보세요.
          </p>
          <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
            <video 
              controls 
              autoPlay
              className="w-full h-full rounded-lg"
              src={DEEPFAKE_PEOPLE_DATA[0].videoUrl}
              onEnded={() => setVideoEnded(true)}
            >
              <p>브라우저가 동영상을 지원하지 않습니다.</p>
            </video>
          </div>
          {/* <p className="text-gray-600 text-lg">
            눈, 입의 움직임, 목소리 톤 등을 자세히 살펴보세요.
          </p> */}
        </div>
      ),
    },
    {
      id: 'quiz-feedback-1',
      title: 'AI가 만든 딥페이크 영상이에요!',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuiz1,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-quiz-2',
      title: '이번 영상은 어떨까요?',
      type: 'info',
      content: (
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">
          첫 번째 영상과 비교해서 어떤 차이점이 있는지 관찰해보세요.
          </p>
          <div className="aspect-video bg-gray-100 rounded-lg mb-6 flex items-center justify-center">
            <video 
              controls 
              autoPlay
              className="w-full h-full rounded-lg"
              src={DEEPFAKE_PEOPLE_DATA[1].videoUrl}
              onEnded={() => setVideoEnded(true)}
            >
              <p>브라우저가 동영상을 지원하지 않습니다.</p>
            </video>
          </div>
        </div>
      ),
    },
    {
      id: 'quiz-feedback-2',
      title: '이것도 AI가 만든 딥페이크 영상이에요!',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuiz2,
      requires: ['userCaricature'],
    },
    {
      id: 'quiz-complete-narration',
      title: '가짜 뉴스, 신원 도용에 악용 돼요!',
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

  // Start scenario generation when reaching the first step
  const startScenarioGeneration = useCallback(async () => {
    if (!voiceId) {
      console.log('⚠️ No voiceId available for scenario generation');
      return;
    }
    
    try {
      console.log('🚀 Starting scenario generation during deepfake introduction...');
      console.log(`   - Voice ID: ${voiceId}`);
      console.log(`   - Step: AI, 얼마나 똑똑해졌을까요?`);
      
      const result = await apiService.startScenarioGeneration(voiceId);
      console.log('✅ Scenario generation started successfully:', result);
    } catch (error) {
      console.error('❌ Failed to start scenario generation:', error);
      // Non-critical error, continue with the flow
    }
  }, [voiceId]);

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

  // Trigger scenario generation on first step and preload narrations
  useEffect(() => {
    if (userData?.userId && voiceId) {
      // Trigger scenario generation on the first step
      if (currentStepIndex === 0 && currentStepData?.id === 'video-intro-narration') {
        console.log('🎯 Reached first step - triggering scenario generation');
        startScenarioGeneration();
      }
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

      // Pre-generate module selection narration on the final step
      if (currentStepData?.id === 'quiz-complete-narration' && currentStepData?.type === 'narration') {
        console.log('🎵 Pre-generating module selection narration for final step');
        const preloadTimer = setTimeout(async () => {
          try {
            console.log('🎵 Generating module selection narration one step ahead with user voice');
            const result = await apiService.generateNarration(SCRIPTS.moduleSelection, voiceId);
            
            // Create audio blob and cache it
            const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
            const audioUrl = URL.createObjectURL(audioBlob);
            
            // Cache the audio for ModuleSelectionPage
            if (!(window as any).narrationCache) {
              (window as any).narrationCache = new Map();
            }
            const scriptKey = `${SCRIPTS.moduleSelection}-${voiceId}`;
            (window as any).narrationCache.set(scriptKey, audioUrl);
            
            console.log('✅ Module selection narration pre-generated and cached');
          } catch (error) {
            console.error('⚠️ Failed to pre-generate module selection narration:', error);
          }
        }, 3000); // Start pre-generation after 3 seconds
        
        return () => clearTimeout(preloadTimer);
      }
    }
  }, [currentStepIndex, preloadNextNarration, startScenarioGeneration, userData?.userId, voiceId, currentStepData]); // Updated dependencies

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
                <ContinueButton onClick={handleNext} showAnimation={videoEnded} />
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
                <ContinueButton onClick={handleNext} text="다음" showAnimation={true} />
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
              <ContinueButton onClick={handleNext} text="다음" showAnimation={true} />
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