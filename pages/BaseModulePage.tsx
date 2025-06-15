import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import NarrationPlayer from '../components/NarrationPlayer.tsx';
import QuizComponent from '../components/QuizComponent.tsx';
import PageLayout from '../components/PageLayout.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import InstagramEmbed from '../components/InstagramEmbed.tsx';
import { Page, ModuleStep, CaseStudy, QuizQuestion } from '../types.ts';
import { CASE_STUDIES, QUIZZES, SCRIPTS, MOCK_FACESWAP_IMAGE_URL, MOCK_TALKING_PHOTO_URL, PLACEHOLDER_USER_IMAGE } from '../constants.tsx';
import * as apiService from '../services/apiService.ts';

interface BaseModulePageProps {
  moduleTitle: string;
  steps: ModuleStep[];
  setCurrentPage: (page: Page) => void;
  onModuleComplete: () => void;
  userData: { name: string } | null;
  userImageUrl: string | null;
  caricatureUrl: string | null;
  voiceId: string | null;
  moduleCompletionMessage: string;
}

const BaseModulePage: React.FC<BaseModulePageProps> = ({
  moduleTitle,
  steps,
  setCurrentPage,
  onModuleComplete,
  userData,
  userImageUrl,
  caricatureUrl,
  voiceId,
  moduleCompletionMessage,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [stepError, setStepError] = useState<string | null>(null);
  const [interactiveContent, setInteractiveContent] = useState<React.ReactNode | null>(null);
  const [currentView, setCurrentView] = useState<'personaTransition' | 'content'>('personaTransition');
  const [scriptForPersona, setScriptForPersona] = useState<string>("");

  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    setInteractiveContent(null); 
    setStepError(null);

    if (!currentStep) return;
    
    setIsLoadingStep(true);
    setCurrentView('personaTransition');

    let personaScript = currentStep.narrationScript || SCRIPTS.personaIntroDefault || `다음 단계는 '${currentStep.title}'입니다.`;
    if (currentStep.type === 'caseStudy' && currentStep.caseStudyId) {
        const cs = CASE_STUDIES[currentStep.caseStudyId];
        personaScript = `${SCRIPTS.personaIntroCaseStudy || "다음 사례 연구는"} "${cs?.title || '사례 연구'}"에 관한 것입니다. ${cs?.narrationScript || ""}`;
    } else if (currentStep.type === 'quiz') {
        personaScript = SCRIPTS.personaIntroQuizGeneral || `이제 '${currentStep.title}' 퀴즈를 풀어보겠습니다.`;
    } else if (currentStep.type === 'interactive') {
        personaScript = SCRIPTS.personaIntroInteractive || `다음 대화형 예제를 살펴보겠습니다: '${currentStep.title}'.`;
    } else if (currentStep.type === 'info' && currentStep.narrationScript) {
        // For info steps with explicit narrationScript, persona can introduce it or say it directly.
        // If persona says it directly, the content display might not need it again.
        // For now, let's assume persona introduces it:
        personaScript = `${SCRIPTS.personaIntroInfo || "다음 정보를 안내해 드리겠습니다:"} "${currentStep.title}"`;
    } else if (currentStep.type === 'info' && typeof currentStep.content === 'string' && currentStep.content.length < 150) { // Keep intro short
        personaScript = `${SCRIPTS.personaIntroInfo || "다음 내용을 살펴보겠습니다:"} ${currentStep.title}.`;
    } else if (currentStep.type === 'narration' && currentStep.narrationScript) {
        personaScript = currentStep.narrationScript; // Persona directly says the narration content
    }


    setScriptForPersona(personaScript);
    setIsLoadingStep(false); 

  }, [currentStepIndex, steps, currentStep]);


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

                if (currentStep.requires?.includes('userImage') && userImageUrl && currentStep.type === 'caseStudy') {
                    try {
                         await apiService.generateFaceswapImage(MOCK_FACESWAP_IMAGE_URL, userImageUrl); 
                         const cs = CASE_STUDIES[currentStep.caseStudyId!];
                         setInteractiveContent(
                            <div className="text-center my-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="text-slate-700 text-base mb-3">{cs.description}</div>
                                <img src={MOCK_FACESWAP_IMAGE_URL} alt="개인화된 콘텐츠" className="rounded-md my-4 w-full max-w-sm mx-auto shadow-lg border-2 border-orange-400" />
                                <p className="text-sm text-slate-500 italic">(이것은 당신의 모습을 사용했을 수 있는 시뮬레이션된 이미지입니다. 이 예제는 페르소나가 소개했습니다.)</p>
                            </div>
                         );
                    } catch (e) { console.error("Error in interactive content image generation", e); setStepError("대화형 이미지 예제를 불러올 수 없습니다.");}
                } else if (currentStep.requires?.includes('userCaricature') && displayCaricature && currentStep.requires?.includes('userVoice') && voiceId && currentStep.type === 'interactive') {
                     try {
                        const interactiveScript = `이것은 당신의 캐리커처와 목소리를 사용한 개인화된 시나리오 메시지입니다: ${personalizedContent}`;
                        await apiService.generateTalkingPhoto(displayCaricature, voiceId, "대화형 콘텐츠를 위한 짧은 음성입니다.");
                         setInteractiveContent(
                            <div className="text-center my-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                <div className="text-slate-700 text-lg mb-4">{personalizedContent}</div>
                                <img src={displayCaricature} alt="개인화된 캐리커처" className="rounded-md my-4 w-48 h-48 mx-auto shadow-lg border-2 border-orange-400" />
                                <NarrationPlayer script={interactiveScript} voiceId={voiceId} autoPlay={false} showControls={true}/>
                                <p className="text-sm text-slate-500 italic mt-3">(페르소나가 이 시나리오를 소개한 후, 당신의 캐리커처가 위 메시지를 목소리로 전달한다고 상상해보세요.)</p>
                            </div>
                        );
                    } catch (e) { console.error("Error in interactive content talking photo generation", e); setStepError("대화형 말하는 콘텐츠 예제를 불러올 수 없습니다.");}
                } else if (currentStep.type === 'interactive' && !interactiveContent && typeof personalizedContent === 'string') {
                     setInteractiveContent(<p className="text-slate-700 text-lg leading-relaxed">{personalizedContent}</p>);
                }
            }
            setIsLoadingStep(false);
        };
        processContentStep();
    }
  }, [currentView, currentStep, userData, userImageUrl, caricatureUrl, voiceId]);

  const handlePersonaNarrationEnd = useCallback(() => {
    setCurrentView('content');
  }, []); // Empty dependency array as setCurrentView is stable

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      onModuleComplete();
      setCurrentPage(Page.ModuleSelection); 
    }
  };

  const handleQuizComplete = (score: number, total: number) => {
    console.log(`${moduleTitle} 퀴즈 완료: ${total}점 만점에 ${score}점`);
    handleNext(); 
  };
  
  if (!currentStep && currentView === 'content') { 
    return (
      <PageLayout title={moduleTitle}>
        <Card>
          <p className="text-center text-xl text-green-600">{moduleCompletionMessage}</p>
          <div className="mt-8 flex justify-center">
            <Button onClick={() => setCurrentPage(Page.ModuleSelection)} variant="primary" size="lg">
              모듈 선택으로 돌아가기
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }


  const renderContentForStep = () => {
    if (isLoadingStep || !currentStep) { 
      return <div className="flex justify-center py-12"><LoadingSpinner text="단계 로딩 중..." /></div>;
    }
    if (stepError) {
      return <p className="text-red-600 text-center text-lg p-4 bg-red-50 rounded-md border border-red-300">{stepError}</p>;
    }

    // Determine if content has its own narration, different from persona's intro
    let contentSpecificNarration: string | null = null;
    if (currentStep.type === 'info' && currentStep.narrationScript && scriptForPersona !== currentStep.narrationScript) {
        contentSpecificNarration = currentStep.narrationScript;
    } else if (currentStep.type === 'caseStudy' && currentStep.caseStudyId) {
        const cs = CASE_STUDIES[currentStep.caseStudyId];
        // Only provide narration if it's different or more detailed than what persona said
        if (cs?.narrationScript && !scriptForPersona.includes(cs.narrationScript)) {
            contentSpecificNarration = cs.narrationScript;
        }
    }


    const mainContent = (() => {
        switch (currentStep.type) {
        case 'info':
        case 'narration': 
            return <div className="text-slate-700 text-lg leading-relaxed space-y-4">{typeof currentStep.content === 'string' ? currentStep.content.split('\n').map((para, i) => <p key={i}>{para}</p>) : currentStep.content}</div>;
        case 'caseStudy':
            const cs = currentStep.caseStudyId ? CASE_STUDIES[currentStep.caseStudyId] : null;
            if (!cs) return <p className="text-red-500 text-lg">사례 연구를 찾을 수 없습니다.</p>;
            return (
            <div>
                {interactiveContent ? interactiveContent : (
                    <>
                        {cs.type === 'instagram' && cs.instagramUrl && (
                            <InstagramEmbed 
                                instagramUrl={cs.instagramUrl} 
                                caption="실제 소셜미디어 사례 - 교육 목적으로 제공됩니다"
                            />
                        )}
                        {cs.type === 'image' && cs.contentUrl && (
                            <img src={cs.contentUrl} alt={cs.title} className="rounded-lg mb-4 w-full max-w-md mx-auto shadow-md border border-slate-200" />
                        )}
                        <div className="text-slate-700 text-base leading-relaxed">{typeof cs.description === 'string' ? cs.description : cs.description}</div>
                    </>
                )}
            </div>
            );
        case 'quiz':
            const quizQuestions = currentStep.quizId ? QUIZZES[currentStep.quizId] : null;
            if (!quizQuestions) return <p className="text-red-500 text-lg">퀴즈를 찾을 수 없습니다.</p>;
            return <QuizComponent questions={quizQuestions} onQuizComplete={handleQuizComplete} voiceId={voiceId} />;
        case 'interactive':
            return interactiveContent || <div className="text-slate-700 text-lg leading-relaxed">{currentStep.content || "대화형 콘텐츠 로딩 중..."}</div>;
        default:
            return <p className="text-yellow-500 text-lg">알 수 없는 단계 유형입니다.</p>;
        }
    })();

    return (
        <>
            {mainContent}
            {contentSpecificNarration && (
                 <NarrationPlayer 
                    script={contentSpecificNarration} 
                    voiceId={voiceId} 
                    autoPlay={false} // Should not autoplay if persona already introduced the topic
                    showControls={true} 
                />
            )}
        </>
    );
  };

  const showNextButtonForContent = currentView === 'content' && currentStep?.type !== 'quiz';

  return (
    <PageLayout title={moduleTitle} showAppTitle={false}>
      <Card title={currentView === 'content' && currentStep ? `${currentStep.title} (${steps.length}단계 중 ${currentStepIndex + 1}단계)` : "안내 중..."}>
        {currentView === 'personaTransition' && currentStep ? (
          <PersonaTransitionSlide
            caricatureUrl={caricatureUrl}
            voiceId={voiceId}
            script={scriptForPersona}
            onNarrationEnd={handlePersonaNarrationEnd}
            userName={userData?.name}
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
       <Button onClick={() => setCurrentPage(Page.ModuleSelection)} variant="ghost" size="md" className="mt-8 mx-auto !text-slate-600 hover:!text-orange-600 hover:!bg-slate-200">
            모듈 선택으로 돌아가기
        </Button>
    </PageLayout>
  );
};

export default BaseModulePage;
