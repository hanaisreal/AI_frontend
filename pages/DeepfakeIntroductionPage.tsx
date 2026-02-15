import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card.tsx';
import PageLayout from '../components/PageLayout.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import ContinueButton from '../components/ContinueButton.tsx';
import VideoDisplay from '../components/VideoDisplay.tsx';
import { Page, UserData } from '../types.ts';
import { SCRIPTS, DEEPFAKE_PEOPLE_DATA, DEEPFAKE_IDENTIFICATION_VIDEO_URL, UI_TEXT, isEnglish } from '../lang';
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
  refreshUserData: () => Promise<void>;
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
  refreshUserData,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(currentStep || 0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [userGuess, setUserGuess] = useState<'real' | 'fake' | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  
  // Track whether generation triggers have been called (prevent multiple calls)
  const [scenarioGenerationTriggered, setScenarioGenerationTriggered] = useState(false);
  const [voiceGenerationTriggered, setVoiceGenerationTriggered] = useState(false);

  // Sync local step with global step tracking
  useEffect(() => {
    if (currentStepIndex !== currentStep) {
      setCurrentStep(currentStepIndex);
    }
  }, [currentStepIndex, currentStep, setCurrentStep]);

  // Reset video ended state when step changes
  useEffect(() => {
    setVideoEnded(false);
    setUserGuess(null);
    setShowQuizResult(false);
  }, [currentStepIndex]);

  // Define steps array
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
      title: '딥페이크 기술이란?',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeConcept,
      requires: ['userCaricature'],
    },
    {
      id: 'deepvoice-concept',
      title: '딥보이스 기술이란?',
      type: 'narration',
      narrationScript: SCRIPTS.deepvoiceConcept,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-transition',
      title: '딥페이크는 어떻게 만들어질까요?',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeVideoIntro,
      requires: ['userCaricature'],
    },
    {
      id: 'concept-video',
      title: '딥페이크와 딥보이스 기술 영상',
      type: 'info',
      content: (
        <div className="text-center">
          <VideoDisplay 
            videoUrl={DEEPFAKE_IDENTIFICATION_VIDEO_URL}
            aspectRatio="16:9"
            unmuted={true}
            autoPlay={true}
            controls={true}
            onVideoEnd={() => setVideoEnded(true)}
          />
        </div>
      ),
    },
    {
      id: 'genv-ai-concept',
      title: 'AI가 가짜 사람을 만들어내요',
      type: 'narration',
      narrationScript: SCRIPTS.genAIConcept,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-wrapup',
      title: '빠르게 발전하는 딥페이크 기술',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeWrapup,
      requires: ['userCaricature'],
    },
    {
      id: 'quiz-intro-narration',
      title: '진짜인지 가짜인지 맞혀보세요!',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuizIntro,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-quiz-1',
      title: '영상 1: 딥페이크 영상일까요?',
      type: 'info',
      content: (
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">
            {isEnglish() ? 'Determine whether this video is real or AI-generated.' : '이 영상이 진짜인지 AI로 생성된 가짜 영상인지 판단해보세요.'}
          </p>
          <VideoDisplay 
            videoUrl={DEEPFAKE_PEOPLE_DATA[0].videoUrl}
            aspectRatio="16:9"
            unmuted={true}
            autoPlay={true}
            controls={true}
            onVideoEnd={() => setVideoEnded(true)}
          />
          
          {!userGuess && (
            <div className="mt-8 mb-8 p-6 bg-gradient-to-r from-blue-50 to-red-50 rounded-xl border-2 border-gray-200 shadow-lg">
              <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {isEnglish() ? 'Is this video real or fake?' : '이 영상이 진짜일까요, 가짜일까요?'}
              </h4>
              <p className="text-gray-600 text-center mb-6">
                {isEnglish() ? 'Watch and decide' : '영상을 보고 판단해보세요'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setUserGuess('real')}
                  className="px-12 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-xl font-bold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>✓</span>
                  <span>{isEnglish() ? 'Real' : '진짜'}</span>
                </button>
                <button
                  onClick={() => setUserGuess('fake')}
                  className="px-12 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-xl font-bold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>✗</span>
                  <span>{isEnglish() ? 'Fake' : '가짜'}</span>
                </button>
              </div>
            </div>
          )}

          {userGuess && (
            <div className="mt-6 mb-8 p-6 rounded-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-2xl">🤔</span>
                <p className="text-xl font-bold text-orange-800">
                  {isEnglish() ? 'Selection complete!' : '선택 완료!'}
                </p>
              </div>
              <p className="text-lg font-semibold text-center text-gray-700 mb-3">
                {isEnglish() ? 'Is it really ' : '과연 진짜 '}<span className={`px-3 py-1 rounded-lg font-bold text-white ${userGuess === 'fake' ? 'bg-red-500' : 'bg-blue-500'}`}>
                  {userGuess === 'fake' ? (isEnglish() ? 'fake' : '가짜') : (isEnglish() ? 'real' : '진짜')}
                </span>{isEnglish() ? '?' : ' 일까요?'}
              </p>
              <p className="text-base text-orange-700 text-center font-medium">{isEnglish() ? 'Press Continue to see the answer' : '정답을 확인하려면 계속하기를 눌러주세요'}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'quiz-feedback-1',
      title: 'AI가 만든 가짜 앵커였어요!',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuiz1,
      requires: ['userCaricature'],
    },
    {
      id: 'deepfake-quiz-2',
      title: '영상 2: 딥페이크 영상일까요?',
      type: 'info',
      content: (
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-6">
          {isEnglish() ? 'Observe the differences compared to the first video.' : '첫 번째 영상과 비교해서 어떤 차이점이 있는지 관찰해보세요.'}
          </p>
          <VideoDisplay 
            videoUrl={DEEPFAKE_PEOPLE_DATA[1].videoUrl}
            aspectRatio="16:9"
            unmuted={true}
            autoPlay={true}
            controls={true}
            onVideoEnd={() => setVideoEnded(true)}
          />
          
          {!userGuess && (
            <div className="mt-8 mb-8 p-6 bg-gradient-to-r from-blue-50 to-red-50 rounded-xl border-2 border-gray-200 shadow-lg">
              <h4 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {isEnglish() ? 'What do you think about this video?' : '이 영상은 어떻게 생각하세요?'}
              </h4>
              <p className="text-gray-600 text-center mb-6">
                {isEnglish() ? 'Compare with the first video and find the differences' : '첫 번째 영상과 비교하며 차이점을 찾아보세요'}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => setUserGuess('real')}
                  className="px-12 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-xl font-bold hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>✓</span>
                  <span>{isEnglish() ? 'Real' : '진짜'}</span>
                </button>
                <button
                  onClick={() => setUserGuess('fake')}
                  className="px-12 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl text-xl font-bold hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                  <span>✗</span>
                  <span>{isEnglish() ? 'Fake' : '가짜'}</span>
                </button>
              </div>
            </div>
          )}

          {userGuess && (
            <div className="mt-6 mb-8 p-6 rounded-xl border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50 shadow-lg">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <span className="text-2xl">🤔</span>
                <p className="text-xl font-bold text-orange-800">
                  {isEnglish() ? 'Selection complete!' : '선택 완료!'}
                </p>
              </div>
              <p className="text-lg font-semibold text-center text-gray-700 mb-3">
                {isEnglish() ? 'Is it really ' : '과연 진짜 '}<span className={`px-3 py-1 rounded-lg font-bold text-white ${userGuess === 'fake' ? 'bg-red-500' : 'bg-blue-500'}`}>
                  {userGuess === 'fake' ? (isEnglish() ? 'fake' : '가짜') : (isEnglish() ? 'real' : '진짜')}
                </span>{isEnglish() ? '?' : ' 일까요?'}
              </p>
              <p className="text-base text-orange-700 text-center font-medium">{isEnglish() ? 'Press Continue to see the answer' : '정답을 확인하려면 계속하기를 눌러주세요'}</p>
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'quiz-feedback-2',
      title: 'AI가 만든 가짜 유튜버였어요!',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuiz2,
      requires: ['userCaricature'],
    },
    {
      id: 'quiz-complete-narration',
      title: '딥페이크는 어떻게 악용될까요?',
      type: 'narration',
      narrationScript: SCRIPTS.deepfakeQuizComplete,
      requires: ['userCaricature'],
    },
  ];

  // Current step data
  const currentStepData = steps[currentStepIndex];

  // Handler functions
  const handleNext = () => {
    // 🎤 Debug voice generation trigger conditions
    if (currentStepIndex === 1) {
      console.log('🔍 DEBUG: On step 1, checking voice generation trigger conditions:');
      console.log(`   - voiceId: ${voiceId}`);
      console.log(`   - voiceGenerationTriggered: ${voiceGenerationTriggered}`);
      console.log(`   - investment_call_audio_url exists: ${!!userData?.investment_call_audio_url}`);
      console.log(`   - accident_call_audio_url exists: ${!!userData?.accident_call_audio_url}`);
    }
    
    // 🎤 Trigger voice generation when clicking SECOND next button (step 1→2 transition)
    // Step 1 is "딥페이크 기술이란?" so clicking next from there is the SECOND next button
    if (currentStepIndex === 1 && 
        voiceId && 
        !voiceGenerationTriggered &&
        !userData?.investment_call_audio_url && 
        !userData?.accident_call_audio_url) {
      console.log('🎤 SECOND NEXT BUTTON: Triggering voice generation (Step 1→2 transition)');
      console.log('🎤 From "딥페이크 기술이란?" to "딥보이스 기술이란?"');
      setVoiceGenerationTriggered(true);
      
      // Trigger voice generation in background
      const triggerVoiceGeneration = async () => {
        try {
          await apiService.startVoiceGeneration(voiceId);
          console.log('✅ Voice generation started successfully from next button');
        } catch (error) {
          console.error('⚠️ Failed to start voice generation from next button:', error);
        }
      };
      
      triggerVoiceGeneration();
    }
    
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
      // Reset states for new step
      setVideoEnded(false);
      setUserGuess(null);
    } else {
      // Go to module selection
      setCurrentPage(Page.ModuleSelection);
    }
  };

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      console.log(`Going back from step ${currentStepIndex} to step ${currentStepIndex - 1}`);
      setCurrentStepIndex(currentStepIndex - 1);
      // Reset states for new step
      setVideoEnded(false);
      setUserGuess(null);
    } else {
      // If at first step, use the global back function to go to previous page
      onGoBack();
    }
  };

  // Pre-cache module selection scripts
  const preCacheModuleSelectionScripts = useCallback(async () => {
    if (!voiceId) return;
    
    console.log('🎵 Pre-caching module selection scripts...');
    
    const scriptsToCache = [
      { name: 'fakeNewsDef', script: SCRIPTS.fakeNewsDef },
      { name: 'identityTheftIntro', script: SCRIPTS.identityTheftIntro }
    ];
    
    for (const { name, script } of scriptsToCache) {
      try {
        console.log(`🎵 Pre-caching ${name}...`);
        const result = await apiService.generateNarration(script, voiceId);
        
        const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        const scriptKey = `${script}-${voiceId}`;
        (window as any).narrationCache = (window as any).narrationCache || new Map();
        (window as any).narrationCache.set(scriptKey, audioUrl);
        
        console.log(`✅ Pre-cached ${name} successfully`);
      } catch (error) {
        console.error(`⚠️ Failed to pre-cache ${name}:`, error);
      }
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

  // Narration preloading and module selection pre-caching
  useEffect(() => {
    if (!userData?.userId || !voiceId) {
      return;
    }
    
    // ✅ NEW: Trigger scenario generation when user reaches the "AI, 얼마나 똑똑해졌을까요?" step (ONCE ONLY)
    if (currentStepData?.id === 'video-intro-narration' && 
        currentStepData?.title === 'AI, 얼마나 똑똑해졌을까요?' && 
        !scenarioGenerationTriggered &&
        !userData?.lottery_video_url && 
        !userData?.crime_video_url) {
      console.log('🚀 Reached trigger step for scenario generation:', currentStepData.title);
      console.log('🚀 Triggering scenario pre-generation in background...');
      
      // Mark as triggered to prevent multiple calls
      setScenarioGenerationTriggered(true);
      
      // Trigger scenario generation in background (non-blocking)
      const triggerScenarioGeneration = async () => {
        try {
          await apiService.startScenarioGeneration(voiceId);
          console.log('✅ Scenario generation started successfully');
          
          // Set up periodic refresh to check for completed scenario generation
          let refreshAttempts = 0;
          const maxRefreshAttempts = 20; // Check for up to 10 minutes
          
          const periodicRefresh = setInterval(async () => {
            refreshAttempts++;
            console.log(`🔄 Periodic refresh attempt ${refreshAttempts}/${maxRefreshAttempts} for scenario URLs...`);
            
            try {
              await refreshUserData();
              
              // Stop refreshing if we find scenario URLs or reach max attempts
              if (refreshAttempts >= maxRefreshAttempts) {
                console.log('⏰ Max refresh attempts reached, stopping periodic refresh');
                clearInterval(periodicRefresh);
              }
            } catch (error) {
              console.error('⚠️ Periodic refresh failed:', error);
              if (refreshAttempts >= maxRefreshAttempts) {
                clearInterval(periodicRefresh);
              }
            }
          }, 30000); // Refresh every 30 seconds
          
          // Clean up interval when component unmounts
          return () => {
            clearInterval(periodicRefresh);
          };
          
        } catch (error) {
          console.error('⚠️ Failed to start scenario generation:', error);
        }
      };
      
      triggerScenarioGeneration();
    } else if (currentStepData?.id === 'video-intro-narration' && 
               (scenarioGenerationTriggered || userData?.lottery_video_url || userData?.crime_video_url)) {
      console.log('🚀 Scenario generation skipped - already triggered or videos exist');
      console.log(`   - scenarioGenerationTriggered: ${scenarioGenerationTriggered}`);
      console.log(`   - lottery_video_url exists: ${!!userData?.lottery_video_url}`);
      console.log(`   - crime_video_url exists: ${!!userData?.crime_video_url}`);
    }
    
    // Voice generation now handled in handleNext() function instead of useEffect
    
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

    // Pre-generate module selection narration starting from the second quiz step
    if ((currentStepData?.id === 'deepfake-quiz-2' || currentStepData?.id === 'quiz-complete-narration') && voiceId) {
      console.log('🎵 Pre-generating module selection narration early for instant loading');
      const preloadTimer = setTimeout(async () => {
        try {
          console.log('🎵 Generating module selection narration early with user voice');
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
          
          // Also pre-cache other module selection scripts
          preCacheModuleSelectionScripts();
        } catch (error) {
          console.error('⚠️ Failed to pre-generate module selection narration:', error);
        }
      }, 2000); // Start pre-generation after 2 seconds
      
      return () => clearTimeout(preloadTimer);
    }
  }, [currentStepIndex, currentStepData?.type, currentStepData?.id, currentStepData?.narrationScript, currentStepData?.content, userData?.userId, voiceId, preloadNextNarration, preCacheModuleSelectionScripts]);

  const renderStepContent = () => {
    switch (currentStepData.type) {
      case 'narration':
        return (
          <Card>
            <div className="text-center">
              <PersonaTransitionSlide
                onNext={handleNext}
                onPrevious={currentStepIndex > 0 ? handlePrevious : undefined}
                userData={userData}
                caricatureUrl={caricatureUrl}
                voiceId={voiceId}
                talkingPhotoUrl={talkingPhotoUrl}
                script={currentStepData.narrationScript || ''}
                chunkedDisplay={true}
                showScript={true} // Set to true to show script for better comprehension
              />
            </div>
          </Card>
        );

      case 'info':
        return (
          <Card>
            <div className="text-center">
              {currentStepData.content}
              <div className="mt-8 flex justify-center items-center space-x-4">
                <ContinueButton 
                  onClick={handleNext} 
                  showAnimation={
                    // For quiz steps, only show animation when user has made a guess
                    (currentStepData.id === 'deepfake-quiz-1' || currentStepData.id === 'deepfake-quiz-2') 
                      ? !!userGuess 
                      : videoEnded
                  } 
                />
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
                <ContinueButton onClick={handleNext} text={isEnglish() ? 'Next' : '다음'} showAnimation={true} />
              </div>
            </div>
          </Card>
        );

      default:
        return (
          <Card>
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-orange-600">{currentStepData.title}</h3>
              <p className="text-gray-600 mb-6">{isEnglish() ? 'Step content is not ready.' : '단계 내용이 준비되지 않았습니다.'}</p>
              <ContinueButton onClick={handleNext} text={isEnglish() ? 'Next' : '다음'} showAnimation={true} />
            </div>
          </Card>
        );
    }
  };

  return (
    <PageLayout title={currentStepData?.title || "딥페이크 기술 소개"}>
      {renderStepContent()}
    </PageLayout>
  );
};

export default DeepfakeIntroductionPage;