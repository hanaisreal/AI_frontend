import React, { useState, useEffect, useCallback, useRef } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import NarrationPlayer from '../components/NarrationPlayer.tsx';
import QuizComponent from '../components/QuizComponent.tsx';
import PageLayout from '../components/PageLayout.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import BackButton from '../components/BackButton.tsx';
import { Page, ModuleStep, QuizQuestion, UserData } from '../types.ts';
import { QUIZZES, SCRIPTS, PLACEHOLDER_USER_IMAGE } from '../constants.tsx';
import * as apiService from '../services/apiService.ts';

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
  const personaTransitionRef = useRef<any>(null);

  const currentStep = steps[currentStepIndex];

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
    }
  }, [globalCurrentStep, steps.length]); // Removed currentStepIndex to prevent loop

  useEffect(() => {
    console.log(`🔄 Step changed to index ${currentStepIndex}: ${currentStep?.title || 'No step'}`);
    setInteractiveContent(null); 
    setStepError(null);

    if (!currentStep) {
      console.log('⚠️ No current step found');
      return;
    }
    
    console.log(`🎨 Setting up step: ${currentStep.title} (type: ${currentStep.type})`);
    setIsLoadingStep(true);
    setCurrentView('personaTransition');

    // Use the narrationScript directly from the step
    setScriptForPersona(currentStep.narrationScript || '');
    setIsLoadingStep(false); 

  }, [currentStepIndex, steps]); // Removed currentStep to prevent duplicate dependency

  // Scenario processing functions
  const processFaceswapScenario = async (step: ModuleStep) => {
    try {
      if (!userImageUrl || !userData || !voiceId) {
        return <div className="text-red-500">사용자 데이터가 불완전합니다.</div>;
      }

      // Select base image based on user gender
      const baseImage = userData.gender === 'male' ? step.baseImageMale : step.baseImageFemale;
      if (!baseImage) {
        return <div className="text-red-500">시나리오 이미지를 찾을 수 없습니다.</div>;
      }

      // Generate faceswap image
      console.log(`Generating faceswap for ${step.scenarioType} scenario`);
      const faceswapResult = await apiService.generateFaceswapImage(baseImage, userImageUrl);
      
      
      // Generate talking photo with scenario-specific audio script
      const talkingPhotoResult = await apiService.generateTalkingPhoto(faceswapResult.resultUrl, userData.name, voiceId, step.audioScript);

      return (
        <div className="text-center">
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-orange-600">
              {step.scenarioType === 'lottery' ? '복권 당첨 시나리오' : '범죄 용의자 시나리오'}
            </h4>
            <div className="aspect-video bg-gray-100 rounded-lg border-2 border-orange-500 overflow-hidden">
              <video 
                controls 
                autoPlay
                muted
                className="w-full h-full object-cover"
                src={talkingPhotoResult.videoUrl}
              >
                <p>브라우저가 동영상을 지원하지 않습니다.</p>
              </video>
            </div>
            <p className="text-sm text-slate-600 italic">
              이는 AI 기술을 사용해 생성된 영상입니다. 
            </p>
          </div>
        </div>
      );
    } catch (error) {
      console.error('Error processing faceswap scenario:', error);
      return <div className="text-red-500">시나리오 생성 중 오류가 발생했습니다.</div>;
    }
  };

  const processVoiceCallScenario = async (step: ModuleStep) => {
    try {
      if (!voiceId || !step.audioScript) {
        return <div className="text-red-500">음성 데이터가 불완전합니다.</div>;
      }

      // Generate voice with user's voice ID
      console.log(`Generating voice call scenario: ${step.scenarioType}`);
      const narrationResult = await apiService.generateNarration(step.audioScript, voiceId);

      return (
        <div className="text-center">
          <div className="bg-gray-900 text-white p-6 rounded-xl max-w-sm mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </div>
              <p className="text-lg font-semibold">투자 사기 전화</p>
              <div className="text-sm space-y-2">
                <p>"{step.audioScript}"</p>
              </div>
              <audio 
                controls 
                autoPlay
                className="w-full mt-4"
                src={`data:${narrationResult.audioType};base64,${narrationResult.audioData}`}
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
      if (!userImageUrl || !userData || !voiceId || !step.audioScript) {
        return <div className="text-red-500">비디오 통화 데이터가 불완전합니다.</div>;
      }

      // Select base video based on user gender
      const baseVideo = userData.gender === 'male' ? step.baseImageMale : step.baseImageFemale;
      if (!baseVideo) {
        return <div className="text-red-500">기본 비디오를 찾을 수 없습니다.</div>;
      }

      console.log(`Generating video call scenario: ${step.scenarioType}`);
      
      // TODO: Implement face swap video with voice dubbing when APIs are available
      // For now, use placeholder video and generate separate audio
      const narrationResult = await apiService.generateNarration(step.audioScript, voiceId);
      const placeholderVideoUrl = baseVideo; // Use base video as placeholder

      return (
        <div className="text-center">
          <div className="bg-gray-900 text-white p-6 rounded-xl max-w-md mx-auto">
            <div className="text-center space-y-4">
              <p className="text-lg font-semibold">긴급 상황 영상 통화</p>
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden">
                <video 
                  controls 
                  muted
                  className="w-full h-full object-cover"
                  src={placeholderVideoUrl}
                >
                  <p>브라우저가 동영상을 지원하지 않습니다.</p>
                </video>
              </div>
              <audio 
                controls 
                autoPlay
                className="w-full mt-2"
                src={`data:${narrationResult.audioType};base64,${narrationResult.audioData}`}
              />
              <div className="text-sm text-gray-300 space-y-1">
                <p>"{step.audioScript}"</p>
              </div>
              <p className="text-xs text-gray-400">당신의 목소리로 재생됩니다 (비디오는 플레이스홀더)</p>
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

                const displayCaricature = caricatureUrl || PLACEHOLDER_USER_IMAGE;

                if (currentStep.requires?.includes('userCaricature') && displayCaricature && currentStep.requires?.includes('userVoice') && voiceId && currentStep.type === 'interactive') {
                     try {
                        const interactiveScript = `이것은 당신의 캐리커처와 목소리를 사용한 개인화된 시나리오 메시지입니다: ${personalizedContent}`;
                        await apiService.generateTalkingPhoto(displayCaricature, voiceId, "대화형 콘텐츠를 위한 짧은 음성입니다.");
                         setInteractiveContent(
                            <div className="text-center my-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="text-slate-700 text-lg mb-4">{personalizedContent}</div>
                                <img src={displayCaricature} alt="개인화된 캐리커처" className="rounded-md my-4 w-48 h-48 mx-auto shadow-lg border-2 border-orange-400" />
                                <NarrationPlayer 
                                    script={interactiveScript} 
                                    voiceId={voiceId} 
                                    autoPlay={false} 
                                    showControls={true}
                                    imageUrl={displayCaricature}
                                    talkingImageUrl={talkingPhotoUrl || ""}
                                />
                                <p className="text-sm text-slate-500 italic mt-3">(페르소나가 이 시나리오를 소개한 후, 당신의 캐리커처가 위 메시지를 목소리로 전달한다고 상상해보세요.)</p>
                            </div>
                        );
                    } catch (e) { console.error("Error in interactive content talking photo generation", e); setStepError("대화형 말하는 콘텐츠 예제를 불러올 수 없습니다.");}
                } else if (currentStep.type === 'interactive' && !interactiveContent && typeof personalizedContent === 'string') {
                     setInteractiveContent(<p className="text-slate-700 text-lg leading-relaxed">{personalizedContent}</p>);
                }
            }
            
            // Handle new scenario types
            if (currentStep.type === 'faceswap_scenario') {
                const processedContent = await processFaceswapScenario(currentStep);
                setInteractiveContent(processedContent);
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

  const handlePersonaNarrationEnd = useCallback(() => {
    console.log('Persona narration ended');
    // For pure narration steps with no additional content, go directly to next step
    if (currentStep?.type === 'narration' && !currentStep.content) {
      console.log('Pure narration step - advancing directly to next step');
      handleNext();
    } else {
      // For steps with content, show the content view
      console.log('Step has content - showing content view');
      setCurrentView('content');
    }
  }, [currentStep, handleNext]);

  const handleQuizComplete = (score: number, total: number) => {
    console.log(`${moduleTitle} 퀴즈 완료: ${total}점 만점에 ${score}점`);
    handleNext(); 
  };

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
            <Button onClick={handleReturnToModuleSelection} variant="primary" size="lg">
              모듈 선택으로 돌아가기
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  const getSectionTitle = (step: ModuleStep) => {
    if (!step) return "안내 중...";
    
    // Module 1 (Fake News) sections
    if (moduleTitle === "가짜 뉴스란?") {
      if (step.type === 'info' || step.type === 'narration') {
        return "1. 가짜 뉴스 개념";
      } else if (step.type === 'video_case_study') {
        return "2. 가짜 뉴스 사례";
      } else if (step.type === 'faceswap_scenario') {
        return "3. 가짜 뉴스 체험";
      } else if (step.type === 'quiz' || step.type === 'video_identification_quiz') {
        return "4. 가짜 뉴스 대응";
      }
    }
    
    // Module 2 (Identity Theft) sections
    if (moduleTitle === "신원 도용이란?") {
      if (step.type === 'info' || step.type === 'narration') {
        return "1. 신원도용 개념";
      } else if (step.type === 'video_case_study') {
        return "2. 신원도용 사례";
      } else if (step.type === 'voice_call_scenario' || step.type === 'video_call_scenario') {
        return "3. 신원도용 체험";
      } else if (step.type === 'quiz' || step.type === 'video_identification_quiz') {
        return "4. 신원도용 대응";
      }
    }
    
    return step.title;
  };

  const renderContentForStep = () => {
    if (!currentStep) return null;

    if (isLoadingStep) {
      return <div className="flex justify-center py-12"><LoadingSpinner text="단계 로딩 중..." /></div>;
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
          <h3 className="text-lg font-semibold text-gray-700">
            {currentStep.title.includes('사례') ? 
              `이 영상은 ${currentStep.title.split(':')[1]?.trim() || currentStep.title}에 대한 실제 사례를 보여줍니다.` :
              currentStep.title
            }
          </h3>
          <div className="aspect-video bg-gray-100 rounded-lg border-2 border-orange-500 overflow-hidden">
            <video 
              controls 
              autoPlay
              muted
              className="w-full h-full object-cover"
              src={currentStep.videoUrl}
            >
              <p>브라우저가 동영상을 지원하지 않습니다.</p>
            </video>
          </div>
          <p className="text-sm text-slate-600 italic">
            이는 AI 기술을 사용한 교육용 시뮬레이션입니다.
          </p>
        </div>
      );
    }

    // Handle other step types
    switch (currentStep.type) {
      case 'quiz':
        const quizQuestions = currentStep.quizId ? QUIZZES[currentStep.quizId] : null;
        if (!quizQuestions) return <p className="text-red-500 text-lg">퀴즈를 찾을 수 없습니다.</p>;
        return <QuizComponent questions={quizQuestions} onQuizComplete={handleQuizComplete} voiceId={voiceId} />;
      
      case 'faceswap_scenario':
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

  return (
    <PageLayout
      title={moduleTitle}
      showAppTitle={false}
    >
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card title={currentStep ? getSectionTitle(currentStep) : "안내 중..."}>
          {/* Back Button */}
          {canGoBack && (
            <div className="mb-6">
              <BackButton onClick={onGoBack} />
            </div>
          )}
          
          {currentView === 'personaTransition' && currentStep ? (
            <PersonaTransitionSlide
              ref={personaTransitionRef}
              onNext={handlePersonaNarrationEnd}
              userData={userData}
              caricatureUrl={caricatureUrl}
              talkingPhotoUrl={talkingPhotoUrl}
              voiceId={voiceId}
              script={scriptForPersona}
            />
          ) : currentView === 'content' && currentStep ? (
            <>
              <div className="min-h-[200px]">
                {renderContentForStep()}
              </div>
              {showNextButtonForContent && ( 
                <div className="mt-10 flex justify-center">
                  <Button onClick={handleNext} variant="primary" size="lg">
                    {currentStepIndex === steps.length - 1 ? "모듈 완료" : "계속"}
                  </Button>
                </div>
              )}
            </>
          ) : (
               <div className="min-h-[200px] flex items-center justify-center">
                  <LoadingSpinner text="모듈 준비 중..." />
               </div>
          )}
        </Card>
         <Button onClick={handleReturnToModuleSelection} variant="ghost" size="md" className="mt-8 mx-auto !text-slate-600 hover:!text-orange-600 hover:!bg-slate-200">
              모듈 선택으로 돌아가기
          </Button>
      </div>
    </PageLayout>
  );
};

export default BaseModulePage;
