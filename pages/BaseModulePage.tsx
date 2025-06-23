import React, { useState, useEffect, useCallback, useRef } from 'react';
import Card from '../components/Card.tsx';
import NarrationPlayer from '../components/NarrationPlayer.tsx';
import QuizComponent from '../components/QuizComponent.tsx';
import PageLayout from '../components/PageLayout.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import ContinueButton from '../components/ContinueButton.tsx';
import ModuleProgressBar from '../components/ModuleProgressBar.tsx';
import { Page, ModuleStep, QuizQuestion, UserData } from '../types.ts';
import { QUIZZES, SCRIPTS, PLACEHOLDER_USER_IMAGE } from '../constants.tsx';
import * as apiService from '../services/apiService.ts';
import { preloadNarration } from '../utils/narrationPreloader.ts';

interface BaseModulePageProps {
  moduleTitle: string;
  steps: ModuleStep[];
  setCurrentPage: (page: Page) => void;
  onModuleComplete: () => void;
  userData: UserData | null;
  userImageUrl: string | null;
  caricatureUrl: string | null;
  talkingPhotoUrl: string | null;
  voiceId: string | null;
  moduleCompletionMessage: string;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const BaseModulePage: React.FC<BaseModulePageProps> = ({
  moduleTitle,
  steps,
  setCurrentPage,
  onModuleComplete,
  userData,
  userImageUrl,
  caricatureUrl,
  talkingPhotoUrl,
  voiceId,
  moduleCompletionMessage,
  currentStep: globalCurrentStep,
  setCurrentStep: setGlobalCurrentStep,
  onGoBack,
  canGoBack,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(globalCurrentStep || 0);
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [interactiveContent, setInteractiveContent] = useState<React.ReactNode | null>(null);
  const [currentView, setCurrentView] = useState<'personaTransition' | 'content'>('personaTransition');
  const [scriptForPersona, setScriptForPersona] = useState<string>("");
  const [isChangingStep, setIsChangingStep] = useState(false);
  const [preloadingNext, setPreloadingNext] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const personaTransitionRef = useRef<any>(null);

  // Reset module state when component mounts (switching between modules)
  useEffect(() => {
    console.log(`🔄 BaseModulePage mounted for module: ${moduleTitle}`);
    // Reset to first step when switching modules to prevent stale state
    if (globalCurrentStep >= steps.length) {
      console.log(`⚠️ Resetting out-of-bounds global step ${globalCurrentStep} to 0 for ${moduleTitle}`);
      setCurrentStepIndex(0);
      setGlobalCurrentStep(0);
    } else {
      setCurrentStepIndex(globalCurrentStep || 0);
    }
  }, [moduleTitle, steps.length]); // Reset when module changes

  const currentStep = steps[currentStepIndex];

  // Preload next step's narration for instant experience
  const preloadNextNarration = useCallback(async (currentStepIndex: number) => {
    const nextStepIndex = currentStepIndex + 1;
    if (nextStepIndex >= steps.length) {
      console.log(`🎵 No next step to preload (current: ${currentStepIndex}, total: ${steps.length})`);
      return; // No next step
    }
    
    const nextStep = steps[nextStepIndex];
    
    // Enhanced logic: preload narration for any step that has narrationScript
    if (!nextStep.narrationScript) {
      console.log(`🎵 Next step ${nextStep.id} (${nextStep.type}) has no narrationScript, skipping preload`);
      return;
    }
    
    if (!userData?.userId || !voiceId) {
      console.log(`🎵 Missing user data for preload: userId=${userData?.userId}, voiceId=${voiceId ? 'exists' : 'missing'}`);
      return;
    }
    
    try {
      setPreloadingNext(true);
      console.log(`🚀 Pre-loading narration for step ${nextStep.id} (${nextStep.type})`);
      console.log(`  - User ID: ${userData.userId}`);
      console.log(`  - Step ID: ${nextStep.id}`);
      console.log(`  - Step Type: ${nextStep.type}`);
      console.log(`  - Script: "${nextStep.narrationScript?.substring(0, 50)}..."`);
      console.log(`  - Voice ID: ${voiceId}`);
      
      // Use the new preloader utility for better coordination
      await preloadNarration(nextStep.narrationScript, voiceId);
      
      console.log(`✅ Pre-loaded narration for step ${nextStep.id} (${nextStep.type}) using preloader`);
    } catch (error) {
      console.error(`⚠️ Pre-load failed for step ${nextStep.id}:`, error);
      // Pre-load failure is non-critical, continue normally
    } finally {
      setPreloadingNext(false);
    }
  }, [steps, userData?.userId, voiceId]);

  // Sync local step with global step tracking (one-way sync to prevent loops)
  useEffect(() => {
    if (currentStepIndex !== globalCurrentStep) {
      console.log(`🔄 Syncing step: local ${currentStepIndex} → global ${globalCurrentStep}`);
      setGlobalCurrentStep(currentStepIndex);
    }
  }, [currentStepIndex, globalCurrentStep, setGlobalCurrentStep]);

  // Initialize local step from global step only once
  useEffect(() => {
    if (globalCurrentStep !== currentStepIndex && globalCurrentStep < steps.length && currentStepIndex === 0) {
      console.log(`🔄 Initializing local step from global: ${globalCurrentStep}`);
      setCurrentStepIndex(globalCurrentStep);
    } else if (globalCurrentStep >= steps.length && currentStepIndex === 0) {
      // Safety check: if global step is out of bounds for this module, reset to 0
      console.log(`⚠️ Global step ${globalCurrentStep} is out of bounds for module with ${steps.length} steps, resetting to 0`);
      setCurrentStepIndex(0);
    }
  }, [globalCurrentStep, steps.length]); // Removed currentStepIndex to prevent loop

  useEffect(() => {
    console.log(`🔄 Step changed to index ${currentStepIndex}: ${currentStep?.title || 'No step'}`);
    setInteractiveContent(null); 
    setStepError(null);

    if (!currentStep) {
      console.log('⚠️ No current step found');
      // Safety check: if step is out of bounds, reset to first step
      if (currentStepIndex >= steps.length && steps.length > 0) {
        console.log(`⚠️ Step index ${currentStepIndex} is out of bounds for module with ${steps.length} steps, resetting to 0`);
        setCurrentStepIndex(0);
      }
      return;
    }
    
    console.log(`🎨 Setting up step: ${currentStep.title} (type: ${currentStep.type})`);
    setIsLoadingStep(true);
    
    // Video case studies and some other types should skip persona transition
    // But info steps with narrationScript (like detection tips) should have persona transition
    if (currentStep.type === 'video_case_study' || 
        currentStep.type === 'faceswap_scenario' || 
        currentStep.type === 'voice_call_scenario' || 
        currentStep.type === 'video_call_scenario' ||
        currentStep.type === 'quiz') {
      console.log(`🔄 Skipping persona transition for ${currentStep.type} step`);
      setCurrentView('content');
    } else if (currentStep.type === 'info' && currentStep.narrationScript) {
      // Info steps with narrationScript (like detection tips) should have persona transition
      console.log(`🔄 Using persona transition for info step with script:`, currentStep.narrationScript?.substring(0, 50) + '...');
      setCurrentView('personaTransition');
      setScriptForPersona(currentStep.narrationScript || '');
    } else {
      console.log(`🔄 Using persona transition for ${currentStep.type} step with script:`, currentStep.narrationScript?.substring(0, 50) + '...');
      setCurrentView('personaTransition');
      // Use the narrationScript directly from the step
      setScriptForPersona(currentStep.narrationScript || '');
    }
    
    setIsLoadingStep(false); 

  }, [currentStepIndex, steps]); // Removed currentStep to prevent duplicate dependency

  // Reset video ended state when step changes
  useEffect(() => {
    setVideoEnded(false);
  }, [currentStepIndex]);

  // Preload next narration after current step content is ready
  useEffect(() => {
    if (!isLoadingStep && userData?.userId && voiceId) {
      // Universal preloading for ALL step types - ensures seamless audio experience
      console.log(`🎵 Setting up universal narration preload for step: ${currentStep?.id} (type: ${currentStep?.type})`);
      
      let preloadDelay = 3000; // Default delay
      
      // Adjust delay based on step type for optimal timing
      switch (currentStep?.type) {
        case 'narration':
          // For persona transition steps, preload after narration starts
          if (currentView === 'personaTransition') {
            preloadDelay = 3000; // Preload after 3 seconds of narration
          } else {
            preloadDelay = 1000; // Quick preload for pure narration steps
          }
          break;
          
        case 'video_case_study':
          preloadDelay = 2000; // Start preloading 2 seconds into video viewing
          break;
          
        case 'faceswap_scenario':
        case 'voice_call_scenario':
        case 'video_call_scenario':
          preloadDelay = 7000; // Allow time for scenario content to load/generate
          break;
          
        case 'quiz':
          preloadDelay = 8000; // Give user time to start engaging with quiz
          break;
          
        case 'info':
          if (currentStep?.narrationScript) {
            // Info steps with narration (like detection tips)
            preloadDelay = 4000; // Allow time to read content while narration plays
          } else {
            // Pure info steps without narration
            preloadDelay = 2000; // Quick preload since user is just reading
          }
          break;
          
        default:
          preloadDelay = 3000; // Safe default for any other step types
      }
      
      console.log(`🎵 Scheduling narration preload with ${preloadDelay}ms delay for ${currentStep?.type} step`);
      
      const preloadTimer = setTimeout(() => {
        preloadNextNarration(currentStepIndex);
      }, preloadDelay);
      
      return () => clearTimeout(preloadTimer);
    }
  }, [currentStepIndex, currentView, isLoadingStep, userData?.userId, voiceId, currentStep?.type, currentStep?.id, preloadNextNarration]);

  // Scenario processing functions
  const processFaceswapScenario = async (step: ModuleStep) => {
    try {
      console.log('🔍 Using pre-generated faceswap scenario:', {
        userData,
        step: {
          scenarioType: step.scenarioType,
          audioScript: step.audioScript
        }
      });

      // Debug: Check specific fields
      console.log('🔍 Debugging scenario URLs:', {
        scenarioType: step.scenarioType,
        hasLotteryUrl: !!userData?.lottery_video_url,
        lotteryUrl: userData?.lottery_video_url,
        hasCrimeUrl: !!userData?.crime_video_url,
        crimeUrl: userData?.crime_video_url,
        allUserDataKeys: userData ? Object.keys(userData) : 'no userData'
      });

      if (!userData) {
        console.error('❌ Missing user data:', { userData: !!userData });
        return <div className="text-red-500">사용자 데이터가 불완전합니다.</div>;
      }

      // Always use pre-generated content from database
      let talkingPhotoUrl = null;

      if (step.scenarioType === 'lottery' && userData.lottery_video_url) {
        console.log('✅ Using pre-generated lottery video:', userData.lottery_video_url);
        talkingPhotoUrl = userData.lottery_video_url;
      } else if (step.scenarioType === 'crime' && userData.crime_video_url) {
        console.log('✅ Using pre-generated crime video:', userData.crime_video_url);
        talkingPhotoUrl = userData.crime_video_url;
      } else {
        console.error(`❌ Pre-generated content not found for ${step.scenarioType} scenario`);
        return (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">
            <div className="font-medium">시나리오 영상을 찾을 수 없습니다.</div>
            <div className="text-sm mt-2">
              {step.scenarioType === 'lottery' ? '복권 당첨' : '범죄 용의자'} 시나리오가 아직 생성되지 않았습니다.
            </div>
          </div>
        );
      }

      // Download function
      const handleDownload = async () => {
        try {
          const response = await fetch(talkingPhotoUrl);
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${step.scenarioType === 'lottery' ? '복권당첨' : '범죄용의자'}_시나리오_${userData.name}.mp4`;
          link.target = '_blank'; // Prevent navigation
          link.rel = 'noopener noreferrer'; // Security
          link.style.display = 'none'; // Hide the link
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Download failed:', error);
          alert('다운로드에 실패했습니다. 다시 시도해주세요.');
        }
      };

      return (
        <div className="text-center">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-600">
              {step.scenarioType === 'lottery' ? '복권 당첨 시나리오' : '범죄 용의자 시나리오'}
            </h4>
            <div className="w-64 h-96 md:w-80 md:h-[30rem] mx-auto bg-gray-100 rounded-lg border-2 border-orange-500 overflow-hidden">
              <video 
                controls 
                autoPlay
                className="w-full h-full object-contain"
                src={talkingPhotoUrl} 
                playsInline
                preload="auto"
                disablePictureInPicture
                onLoadedData={() => {
                  console.log(`✅ Talking photo video loaded for ${step.scenarioType}`);
                  handleScenarioComplete();
                }}
                onEnded={handleVideoEnd}
              >
                <p>브라우저가 동영상을 지원하지 않습니다.</p>
              </video>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleDownload}
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200 flex items-center space-x-2 shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>영상 다운로드</span>
              </button>
            </div>
            <p className="text-sm text-slate-600 italic">
              이는 AI 기술을 사용해 생성된 영상입니다. 
            </p>
          </div>
        </div>
      );
    } catch (error) {
      console.error('❌ Error processing faceswap scenario:', error);
      
      // Show more specific error information
      let errorMessage = '시나리오 생성 중 오류가 발생했습니다.';
      if (error instanceof Error) {
        errorMessage += ` (${error.message})`;
      }
      
      return (
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          <div className="font-medium">{errorMessage}</div>
          <div className="text-sm mt-2">콘솔을 확인하여 자세한 오류 정보를 확인하세요.</div>
        </div>
      );
    }
  };

  const VoiceVisualization = () => (
    <div className="flex justify-center space-x-1">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="w-1 bg-green-400 rounded-full animate-pulse"
          style={{
            height: `${Math.random() * 20 + 10}px`,
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.8s'
          }}
        />
      ))}
    </div>
  );

  const processVoiceCallScenario = async (step: ModuleStep) => {
    try {
      if (!userData) {
        return <div className="text-red-500">사용자 데이터가 불완전합니다.</div>;
      }

      // Always use pre-generated audio from database
      let audioData = null;

      if (step.scenarioType === 'investment_call' && userData?.investment_call_audio_url) {
        console.log('✅ Using pre-generated investment call audio:', userData.investment_call_audio_url.substring(0, 100) + '...');
        console.log('📊 Audio URL type:', userData.investment_call_audio_url.startsWith('data:') ? 'Base64 Data URL' : 'Regular URL');
        audioData = userData.investment_call_audio_url;
      } else if (step.scenarioType === 'accident_call' && userData?.accident_call_audio_url) {
        console.log('✅ Using pre-generated accident call audio:', userData.accident_call_audio_url.substring(0, 100) + '...');
        console.log('📊 Audio URL type:', userData.accident_call_audio_url.startsWith('data:') ? 'Base64 Data URL' : 'Regular URL');
        audioData = userData.accident_call_audio_url;
      } else {
        console.error(`❌ Pre-generated audio not found for ${step.scenarioType}`);
        console.error('🔍 Available userData fields:', userData ? Object.keys(userData) : 'no userData');
        console.error('🔍 investment_call_audio_url:', userData?.investment_call_audio_url);
        console.error('🔍 accident_call_audio_url:', userData?.accident_call_audio_url);
        return (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">
            <div className="font-medium">시나리오 음성을 찾을 수 없습니다.</div>
            <div className="text-sm mt-2">
              {step.scenarioType === 'investment_call' ? '투자 사기' : '사고 신고'} 음성이 아직 생성되지 않았습니다.
            </div>
            <div className="text-xs mt-2 text-gray-500">
              디버그: scenarioType={step.scenarioType}, hasUserData={!!userData}
            </div>
          </div>
        );
      }

      return (
        <div className="text-center">
          <div className="bg-gray-900 text-white p-6 rounded-xl max-w-sm mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <p className="text-lg font-semibold">친구</p>
              
              {/* Voice visualization during call */}
              <div className="py-4">
                <VoiceVisualization />
                <p className="text-xs text-gray-400 mt-3">통화 중...</p>
              </div>
              
              <audio 
                controls 
                autoPlay
                className="w-full mt-4"
                src={audioData}
                onLoadedData={() => {
                  console.log(`✅ Voice call audio loaded for ${step.scenarioType}`);
                  handleScenarioComplete();
                }}
                onPlay={() => {
                  console.log(`🎵 Voice call audio started playing, triggering preload`);
                  setTimeout(() => preloadNextNarration(currentStepIndex), 2000);
                }}
                onError={(e) => {
                  console.error(`❌ Audio loading error for ${step.scenarioType}:`, e);
                  console.error('🔍 Audio src:', audioData?.substring(0, 200));
                  console.error('🔍 Error details:', e.currentTarget.error);
                }}
                onLoadStart={() => {
                  console.log(`🔄 Audio loading started for ${step.scenarioType}`);
                }}
              />
              <p className="text-xs text-gray-400">당신의 복제된 목소리로 재생됩니다</p>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error processing voice call scenario:', error);
      return <div className="text-red-500">음성 통화 시나리오 생성 중 오류가 발생했습니다.</div>;
    }
  };

  const processVideoCallScenario = async (step: ModuleStep) => {
    try {
      if (!userData) {
        return <div className="text-red-500">사용자 데이터가 불완전합니다.</div>;
      }

      // Always use pre-generated audio from database
      let audioData = null;

      if (step.scenarioType === 'investment_call' && userData?.investment_call_audio_url) {
        console.log('✅ Using pre-generated investment call audio:', userData.investment_call_audio_url.substring(0, 100) + '...');
        console.log('📊 Audio URL type:', userData.investment_call_audio_url.startsWith('data:') ? 'Base64 Data URL' : 'Regular URL');
        audioData = userData.investment_call_audio_url;
      } else if (step.scenarioType === 'accident_call' && userData?.accident_call_audio_url) {
        console.log('✅ Using pre-generated accident call audio:', userData.accident_call_audio_url.substring(0, 100) + '...');
        console.log('📊 Audio URL type:', userData.accident_call_audio_url.startsWith('data:') ? 'Base64 Data URL' : 'Regular URL');
        audioData = userData.accident_call_audio_url;
      } else {
        console.error(`❌ Pre-generated audio not found for ${step.scenarioType}`);
        console.error('🔍 Available userData fields:', userData ? Object.keys(userData) : 'no userData');
        console.error('🔍 investment_call_audio_url:', userData?.investment_call_audio_url);
        console.error('🔍 accident_call_audio_url:', userData?.accident_call_audio_url);
        return (
          <div className="text-red-500 p-4 bg-red-50 rounded-lg">
            <div className="font-medium">시나리오 음성을 찾을 수 없습니다.</div>
            <div className="text-sm mt-2">
              {step.scenarioType === 'investment_call' ? '투자 사기' : '사고 신고'} 음성이 아직 생성되지 않았습니다.
            </div>
            <div className="text-xs mt-2 text-gray-500">
              디버그: scenarioType={step.scenarioType}, hasUserData={!!userData}
            </div>
          </div>
        );
      }

      return (
        <div className="text-center">
          <div className="bg-gray-900 text-white p-6 rounded-xl max-w-sm mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <p className="text-lg font-semibold">가족</p>
              
              {/* Voice visualization during call */}
              <div className="py-4">
                <VoiceVisualization />
                <p className="text-xs text-gray-400 mt-3">통화 중...</p>
              </div>
              
              <audio 
                controls 
                autoPlay
                className="w-full mt-4"
                src={audioData}
                onLoadedData={() => {
                  console.log(`✅ Voice call audio loaded for ${step.scenarioType}`);
                  handleScenarioComplete();
                }}
                onPlay={() => {
                  console.log(`🎵 Voice call audio started playing, triggering preload`);
                  setTimeout(() => preloadNextNarration(currentStepIndex), 2000);
                }}
                onError={(e) => {
                  console.error(`❌ Audio loading error for ${step.scenarioType}:`, e);
                  console.error('🔍 Audio src:', audioData?.substring(0, 200));
                  console.error('🔍 Error details:', e.currentTarget.error);
                }}
                onLoadStart={() => {
                  console.log(`🔄 Audio loading started for ${step.scenarioType}`);
                }}
              />
              <p className="text-xs text-gray-400">당신의 복제된 목소리로 재생됩니다</p>
            </div>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error processing video call scenario:', error);
      return <div className="text-red-500">영상 통화 시나리오 생성 중 오류가 발생했습니다.</div>;
    }
  };

  useEffect(() => {
    if (currentView === 'content' && currentStep) {
        const processContentStep = async () => {
            setIsLoadingStep(true);
            setInteractiveContent(null);
            setStepError(null);

            if (currentStep.type === 'interactive' || (currentStep.type === 'caseStudy' && currentStep.requires && currentStep.requires.length > 0) ) {
                let personalizedContent = currentStep.content || "";
                if (typeof personalizedContent === 'string') {
                   personalizedContent = personalizedContent.replace(/\[Your Name\]/g, userData?.name || "사용자");
                }
                
                await new Promise(resolve => setTimeout(resolve, 300));


                // Interactive content - just show text content without API calls
                if (currentStep.type === 'interactive' && typeof personalizedContent === 'string') {
                     setInteractiveContent(<p className="text-slate-700 text-lg leading-relaxed">{personalizedContent}</p>);
                }
            }
            
            // Handle new scenario types
            if (currentStep.type === 'faceswap_scenario') {
                console.log('🔄 Processing faceswap scenario...');
                const processedContent = await processFaceswapScenario(currentStep);
                console.log('✅ Faceswap scenario processed:', { 
                  hasContent: !!processedContent, 
                  contentType: typeof processedContent 
                });
                setInteractiveContent(processedContent);
                console.log('✅ InteractiveContent set for faceswap');
            } else if (currentStep.type === 'voice_call_scenario') {
                const processedContent = await processVoiceCallScenario(currentStep);
                setInteractiveContent(processedContent);
            } else if (currentStep.type === 'video_call_scenario') {
                const processedContent = await processVideoCallScenario(currentStep);
                setInteractiveContent(processedContent);
            }
            
            setIsLoadingStep(false);
        };
        processContentStep();
    }
  }, [currentView, currentStep, userData, userImageUrl, caricatureUrl, voiceId]);

  const handleNext = useCallback(() => {
    if (isChangingStep) {
      console.log('⚠️ Step change already in progress, ignoring');
      return;
    }
    
    console.log(`🔄 handleNext called - Current step: ${currentStepIndex}, Total steps: ${steps.length}`);
    setIsChangingStep(true);
    
    // Small delay to prevent rapid step changes
    setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        console.log(`➡️ Advancing from step ${currentStepIndex} to ${currentStepIndex + 1}`);
        setCurrentStepIndex(prev => prev + 1);
      } else {
        console.log('✅ Module completed, returning to module selection');
        // Stop any playing audio before completing module
        if (personaTransitionRef.current && personaTransitionRef.current.stopAudio) {
          personaTransitionRef.current.stopAudio();
        }
        onModuleComplete();
        setCurrentPage(Page.ModuleSelection); 
      }
      setIsChangingStep(false);
    }, 300);
  }, [currentStepIndex, steps.length, onModuleComplete, setCurrentPage, isChangingStep]);

  const handleQuizComplete = (score: number, total: number) => {
    console.log(`${moduleTitle} 퀴즈 완료: ${total}점 만점에 ${score}점`);
    
    // Trigger immediate preload of next narration when quiz completes
    console.log(`🎵 Quiz completed, triggering immediate preload of next narration`);
    preloadNextNarration(currentStepIndex);
    
    handleNext(); 
  };

  // Enhanced video end handler - no preloading here since we do it proactively
  const handleVideoEnd = useCallback(() => {
    console.log(`🎬 Video ended for step: ${currentStep?.id}`);
    setVideoEnded(true);
    
    // Don't preload here - we already started preloading 2 seconds into video viewing
    // This ensures the narration is ready by the time user clicks next
  }, [currentStep?.id, currentStepIndex]);

  // Enhanced persona narration end handler with additional preloading
  const handlePersonaNarrationEnd = useCallback(() => {
    console.log('Persona narration ended for step:', currentStep?.id, 'type:', currentStep?.type, 'content:', currentStep?.content);
    
    // Trigger preload when persona narration ends (for steps that will show content)
    if (currentStep?.content && typeof currentStep.content !== 'string' || 
        (typeof currentStep.content === 'string' && currentStep.content.trim() !== '')) {
      console.log(`🎵 Persona narration ended, content will be shown, triggering preload`);
      setTimeout(() => preloadNextNarration(currentStepIndex), 1000); // Small delay before preload
    }
    
    // For pure narration steps with no additional content, go directly to next step
    if (currentStep?.type === 'narration' && (!currentStep.content || (typeof currentStep.content === 'string' && currentStep.content.trim() === ''))) {
      console.log('Pure narration step - advancing directly to next step');
      handleNext();
    } else if (currentStep?.id === 'fn_detection_tips' || currentStep?.id === 'it_detection_tips') {
      // For detection tips, content was already shown during persona transition, so go to next step
      console.log('Detection tips completed - advancing to next step');
      handleNext();
    } else {
      // For steps with content, show the content view
      console.log('Step has content - showing content view');
      setCurrentView('content');
    }
  }, [currentStep, handleNext, currentStepIndex, preloadNextNarration]);

  const handleReturnToModuleSelection = () => {
    console.log('Returning to module selection - stopping all audio first');
    // Stop any playing audio before navigating
    if (personaTransitionRef.current && personaTransitionRef.current.stopAudio) {
      personaTransitionRef.current.stopAudio();
    }
    setCurrentPage(Page.ModuleSelection);
  };
  
  if (!currentStep && currentView === 'content') { 
    return (
      <PageLayout title={moduleTitle}>
        <Card>
          <p className="text-center text-xl text-green-600">{moduleCompletionMessage}</p>
          <div className="mt-8 flex justify-center">
            {/* <Button onClick={handleReturnToModuleSelection} variant="primary" size="lg">
              모듈 선택으로 돌아가기
            </Button> */}
          </div>
        </Card>
      </PageLayout>
    );
  }

  // const getSectionTitle = (step: ModuleStep) => {
  //   if (!step) return "안내 중...";
    
  //   // Module 1 (Fake News) sections
  //   if (moduleTitle === "가짜 뉴스란?") {
  //     if (step.type === 'info' || step.type === 'narration') {
  //       return "1. 가짜 뉴스 개념";
  //     } else if (step.type === 'video_case_study') {
  //       return "2. 가짜 뉴스 사례";
  //     } else if (step.type === 'faceswap_scenario') {
  //       return "3. 가짜 뉴스 체험";
  //     } else if (step.type === 'quiz' || step.type === 'video_identification_quiz') {
  //       return "4. 가짜 뉴스 대응";
  //     }
  //   }
    
  //   // Module 2 (Identity Theft) sections
  //   if (moduleTitle === "신원 도용이란?") {
  //     if (step.type === 'info' || step.type === 'narration') {
  //       return "1. 신원도용 개념";
  //     } else if (step.type === 'video_case_study') {
  //       return "2. 신원도용 사례";
  //     } else if (step.type === 'voice_call_scenario' || step.type === 'video_call_scenario') {
  //       return "3. 신원도용 체험";
  //     } else if (step.type === 'quiz' || step.type === 'video_identification_quiz') {
  //       return "4. 신원도용 대응";
  //     }
  //   }
    
  //   return step.title;
  // };

  const getCurrentProgressSection = (step: ModuleStep) => {
    if (!step) return "개념";
    
    // Check step ID patterns to determine section
    const stepId = step.id;
    
    // Quiz sections are "퀴즈" (quiz) - includes quiz intro and conclusion steps
    if (stepId.includes('quiz') || stepId.includes('conclusion')) {
      return "퀴즈";
    }
    
    // Detection tips and wrap-up are part of "대응" (countermeasures)
    if (stepId.includes('detection') || stepId.includes('wrap_up')) {
      return "대응";
    }
    
    // Experience/scenario sections are "실습" (practice)
    if (stepId.includes('scenario') || stepId.includes('experience') || 
        step.type === 'faceswap_scenario' || step.type === 'voice_call_scenario' || step.type === 'video_call_scenario') {
      return "실습";
    }
    
    // Case study sections are "사례" (examples)
    if (stepId.includes('case') || step.type === 'video_case_study') {
      return "사례";
    }
    
    // Everything else (intro, concepts, definitions) are "개념" (concepts)
    return "개념";
  };

  const renderContentForStep = () => {
    if (!currentStep) return null;

    if (isLoadingStep) {
      return <div className="flex justify-center py-12"><LoadingSpinner text="로딩 중..." /></div>;
    }

    if (stepError) {
      return <p className="text-red-600 text-center text-lg p-4 bg-red-50 rounded-md border border-red-300">{stepError}</p>;
    }

    // For detection tips, show the content while narrator speaks
    if (currentStep.id === 'fn_detection_tips' || currentStep.id === 'it_detection_tips') {
      return (
        <div className="mt-4">
          <div dangerouslySetInnerHTML={{ __html: currentStep.content || '' }} />
        </div>
      );
    }

    // For case studies, show a more detailed heading
    if (currentStep.type === 'video_case_study') {
      return (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-orange-600">
            
          </h3>
          <div className="aspect-video bg-gray-100 rounded-lg border-2 border-orange-500 overflow-hidden">
            <video 
              controls 
              autoPlay
              className="w-full h-full object-cover"
              src={currentStep.videoUrl}
              playsInline
              preload="metadata"
              disablePictureInPicture
              onEnded={handleVideoEnd}
            >
              <p>브라우저가 동영상을 지원하지 않습니다.</p>
            </video>
          </div>
          <p className="text-sm text-slate-600 italic">
            이 영상은 AI 기술로 만들어진 가짜 영상입니다.
          </p>
        </div>
      );
    }

    // Handle other step types
    switch (currentStep.type) {
      case 'quiz':
        const quizQuestions = currentStep.quizId ? QUIZZES[currentStep.quizId] : null;
        if (!quizQuestions) return <p className="text-red-500 text-lg">퀴즈를 찾을 수 없습니다.</p>;
        return <QuizComponent 
          questions={quizQuestions} 
          onQuizComplete={handleQuizComplete} 
          voiceId={voiceId}
          onPrevious={currentStepIndex > 0 ? () => setCurrentStepIndex(prev => prev - 1) : undefined}
        />;
      
      case 'faceswap_scenario':
        console.log('🎭 Rendering faceswap_scenario:', { 
          hasInteractiveContent: !!interactiveContent, 
          isLoadingStep,
          interactiveContentType: typeof interactiveContent 
        });
        return (
          <div className="text-center">
            {interactiveContent ? interactiveContent : (
              <div className="text-slate-700 text-lg">
                <LoadingSpinner size="lg" />
                <p className="mt-4">AI 시나리오 생성 중...</p>
                <p className="text-sm text-slate-500 mt-2">이 작업은 최대 2분까지 소요될 수 있습니다.</p>
              </div>
            )}
          </div>
        );
      
      case 'voice_call_scenario':
        return (
          <div className="text-center">
            {interactiveContent ? interactiveContent : (
              <div className="bg-gray-900 text-white p-8 rounded-xl max-w-sm mx-auto">
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-lg font-semibold mt-4">음성 통화 시뮬레이션</p>
                  <p className="text-sm mt-2">음성 생성 중...</p>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'video_call_scenario':
        return (
          <div className="text-center">
            {interactiveContent ? interactiveContent : (
              <div className="bg-gray-900 text-white p-8 rounded-xl max-w-md mx-auto">
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-lg font-semibold mt-4">영상 통화 시뮬레이션</p>
                  <p className="text-sm mt-2">딥페이크 영상 생성 중...</p>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        // For other steps, show the content if available
        return currentStep.content ? (
          <div className="mt-4" dangerouslySetInnerHTML={{ __html: currentStep.content }} />
        ) : null;
    }
  };

  const showNextButtonForContent = currentView === 'content' && currentStep?.type !== 'quiz';

  // Enhanced continue button handler with preloading
  const handleContinueWithPreload = useCallback(() => {
    console.log(`🎵 Continue button clicked, triggering preload before advancing`);
    
    // Preload next narration immediately when user clicks continue
    preloadNextNarration(currentStepIndex);
    
    // Small delay to allow preload to start before advancing
    setTimeout(() => {
      handleNext();
    }, 100);
  }, [currentStepIndex, preloadNextNarration, handleNext]);

  // Scenario completion handler with preloading
  const handleScenarioComplete = useCallback(() => {
    console.log(`🎬 Scenario completed for step: ${currentStep?.id}`);
    
    // Trigger immediate preload when scenario completes
    console.log(`🎵 Scenario completed, triggering immediate preload of next narration`);
    preloadNextNarration(currentStepIndex);
  }, [currentStep?.id, currentStepIndex, preloadNextNarration]);

  return (
    <PageLayout
      title={moduleTitle}
      showAppTitle={false}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Module Progress Bar */}
        <ModuleProgressBar 
          currentSection={getCurrentProgressSection(currentStep)}
          moduleType={moduleTitle === "가짜 뉴스란?" ? 'fakeNews' : 'identityTheft'}
          className="mb-6"
        />
        
        <Card >
          
          {currentView === 'personaTransition' && currentStep ? (
            <>
              <PersonaTransitionSlide
                ref={personaTransitionRef}
                onNext={handlePersonaNarrationEnd}
                onPrevious={currentStepIndex > 0 ? () => setCurrentStepIndex(prev => prev - 1) : undefined}
                userData={userData}
                caricatureUrl={caricatureUrl}
                talkingPhotoUrl={talkingPhotoUrl}
                voiceId={voiceId}
                script={scriptForPersona}
                showScript={false}
                chunkedDisplay={true}
              />
              {/* For detection tips, show content during persona narration */}
              {(currentStep.id === 'fn_detection_tips' || currentStep.id === 'it_detection_tips') && (
                <div className="mt-8">
                  <div dangerouslySetInnerHTML={{ __html: currentStep.content || '' }} />
                </div>
              )}
            </>
          ) : currentView === 'content' && currentStep ? (
            <>
              <div className="min-h-[200px]">
                {renderContentForStep()}
              </div>
              {showNextButtonForContent && ( 
                <div className="mt-10 flex justify-center items-center space-x-4">
                  {/* {currentStepIndex > 0 && (
                    <BackButton
                      onClick={() => setCurrentStepIndex(prev => prev - 1)}
                      size="lg"
                      variant="primary"
                    />
                  )} */}
                  <ContinueButton 
                    onClick={handleContinueWithPreload} 
                    text={currentStepIndex === steps.length - 1 ? "모듈 완료" : "계속"}
                    showAnimation={videoEnded}
                  />
                </div>
              )}
            </>
          ) : (
               <div className="min-h-[200px] flex items-center justify-center">
                  <LoadingSpinner text="모듈 준비 중..." />
               </div>
          )}
        </Card>
         {/* <Button onClick={handleReturnToModuleSelection} variant="ghost" size="md" className="mt-8 mx-auto !text-slate-600 hover:!text-orange-600 hover:!bg-slate-200">
              모듈 선택으로 돌아가기
          </Button> */}
      </div>
    </PageLayout>
  );
};

export default BaseModulePage;
