import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import PageLayout from '../components/PageLayout.tsx';
import * as apiService from '../services/apiService.ts'; 
import { Page } from '../types.ts';
import { SCRIPTS, NARRATOR_VOICE_ID, UI_TEXT, isEnglish } from '../lang';

interface CaricatureGenerationPageProps {
  setCurrentPage: (page: Page) => void;
  userImageUrl: string | null;
  caricatureUrl: string | null;
  setCaricatureUrl: (url: string) => void;
  voiceId: string | null;
  onGoBack: () => void;
  canGoBack: boolean;
}

const CaricatureGenerationPage: React.FC<CaricatureGenerationPageProps> = ({
  setCurrentPage,
  userImageUrl,
  caricatureUrl,
  setCaricatureUrl,
  voiceId,
  onGoBack,
  canGoBack,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState(isEnglish() ? "Analyzing image..." : "이미지 분석 중...");
  const [generatedCaricature, setGeneratedCaricature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasStartedGeneration = useRef(false);

  const generateCaricature = async () => {
    try {
      // Prevent multiple simultaneous generations
      if (hasStartedGeneration.current) {
        return;
      }

      hasStartedGeneration.current = true;
      setIsLoading(true);
      setError(null);
      setGeneratedCaricature(null);

      setStatusMessage(isEnglish() ? "Analyzing facial features from image..." : "이미지에서 얼굴 특징 분석 중...");
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (!userImageUrl) {
        throw new Error(isEnglish() ? "User image not found." : "사용자 이미지가 없습니다.");
      }

      const analysis = await apiService.analyzeFace(userImageUrl);

      setStatusMessage(isEnglish() ? "Creating character..." : "캐릭터 생성 중...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      const caricaturePrompt = `Create a vibrant full-color cartoon caricature portrait of a SINGLE PERSON ONLY. Disney-Pixar style with natural skin tones, exaggerated features, clean lines, bright colors, no background, solo portrait. Features: ${analysis.facialFeatures.uniqueFeatures?.join(', ') || 'as described'}. ONE PERSON PORTRAIT ONLY - no multiple people, no groups, just one individual with realistic skin color and vibrant appearance.`;
      const caricatureResult = await apiService.generateCaricature(analysis.facialFeatures, caricaturePrompt);
      
      // Set the result directly
      setGeneratedCaricature(caricatureResult.caricatureUrl);
      setCaricatureUrl(caricatureResult.caricatureUrl);
      setStatusMessage(SCRIPTS.caricatureGenerated);
      setIsLoading(false);
    } catch (err) {
      setError(isEnglish()
        ? "Failed to generate caricature. This may be due to network issues or backend service unavailability. Please try again or skip this step if possible."
        : "캐리커처 생성에 실패했습니다. 네트워크 문제 또는 백엔드 서비스 사용 불가 때문일 수 있습니다. 다시 시도하거나, 가능하다면 이 단계를 건너뛰세요.");
      setStatusMessage(isEnglish() ? "Error generating caricature." : "캐리커처 생성 중 오류 발생.");
    } finally {
      setIsLoading(false);
      hasStartedGeneration.current = false; // Reset the flag
    }
  };

  useEffect(() => {
    if (!userImageUrl) {
      setError(isEnglish()
        ? "User image not available. Please go back and upload an image."
        : "사용자 이미지를 사용할 수 없습니다. 뒤로 돌아가 이미지를 업로드해주세요.");
      setIsLoading(false);
      return;
    }

    // Pre-cache narration for TalkingPhotoGenerationIntro page using narrator voice
    const preCacheNextNarration = async () => {
      try {
        const narrationResult = await apiService.generateNarration(SCRIPTS.talkingPhotoGenerationStart, NARRATOR_VOICE_ID);
        const audioBlob = new Blob([Uint8Array.from(atob(narrationResult.audioData), c => c.charCodeAt(0))], { type: narrationResult.audioType });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Cache the audio with narrator voice ID
        if (!(window as any).narrationCache) {
          (window as any).narrationCache = new Map();
        }
        const scriptKey = `${SCRIPTS.talkingPhotoGenerationStart}-${NARRATOR_VOICE_ID}`;
        (window as any).narrationCache.set(scriptKey, audioUrl);
      } catch (error) {
        // Failed to pre-cache TalkingPhotoGenerationIntro narration
      }
    };

    // Start pre-caching in background
    preCacheNextNarration();

    // Check for ongoing caricature generation from onboarding
    const caricatureGenerationPromise = (window as any).caricatureGenerationPromise;
    if (caricatureGenerationPromise) {
      setStatusMessage(isEnglish() ? "Analyzing image..." : "이미지 분석 중...");
      setIsLoading(true);
      
      caricatureGenerationPromise
        .then((caricatureUrl: string) => {
          setGeneratedCaricature(caricatureUrl);
          setCaricatureUrl(caricatureUrl);
          setStatusMessage(SCRIPTS.caricatureGenerated);
          setIsLoading(false);
        })
        .catch((error: any) => {
          // Fall back to normal generation if background generation failed
          generateCaricature();
        })
        .finally(() => {
          // Clear the promise to avoid reuse
          delete (window as any).caricatureGenerationPromise;
        });
      return;
    }

    // If caricature already exists, show it instead of regenerating
    if (caricatureUrl) {
      setGeneratedCaricature(caricatureUrl);
      setStatusMessage(SCRIPTS.caricatureGenerated);
      setIsLoading(false);
      return;
    }

    // Only generate if we haven't started yet
    if (!hasStartedGeneration.current) {
      generateCaricature();
    }
  }, [userImageUrl]); // ✅ FIXED: Removed caricatureUrl from dependencies

 

  return (
    <PageLayout title={isEnglish() ? "Create Your Character" : "나만의 캐릭터 만들기"}>
      <Card>
        {/* Back Button
        {canGoBack && (
          <div className="mb-6">
            <BackButton onClick={onGoBack} />
          </div>
        )} */}

        {isLoading && (
          <div className="text-center py-10">
            <LoadingSpinner size="lg" />
            <p className="mt-6 text-xl text-orange-600">{statusMessage}</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="text-center py-10">
            <p className="text-red-600 text-2xl mb-4 font-semibold">{isEnglish() ? 'Error' : '오류'}</p>
            <p className="text-slate-700 text-lg mb-8">{error}</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => {
                hasStartedGeneration.current = false; // Reset flag for retry
                generateCaricature();
              }} variant="primary" size="lg">
                {isEnglish() ? 'Try Again' : '다시 시도'}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </Button>
              <Button onClick={() => setCurrentPage(Page.UserOnboarding)} variant="secondary" size="lg">
                {isEnglish() ? 'Back to Settings' : '설정으로 돌아가기'}
              </Button>
            </div>
          </div>
        )}
        {!isLoading && !error && generatedCaricature && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-orange-600 mb-6">{isEnglish() ? 'Character Ready!' : '캐릭터 준비 완료!'}</h2>
            <p className="text-slate-700 text-lg mb-8">{statusMessage}</p>
            <div className="my-8 p-3 bg-slate-100 inline-block rounded-xl shadow-lg border-2 border-slate-200">
                <img
                    src={generatedCaricature}
                    alt={isEnglish() ? "Generated caricature" : "생성된 캐리커처"}
                    className="rounded-lg w-72 h-72 md:w-80 md:h-80 object-contain mx-auto border-4 border-orange-500"
                />
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={() => {
                hasStartedGeneration.current = false; // Reset flag for manual regeneration
                generateCaricature();
              }} variant="secondary" size="lg">
                <span className="sm:hidden">{isEnglish() ? 'Retry' : '다시'}</span>
                <span className="hidden sm:inline">{isEnglish() ? 'Regenerate' : '다시 생성'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </Button>
              <Button onClick={() => {
                // Start talking photo generation in background
                if (generatedCaricature && voiceId) {
                  console.log('FRONTEND: Starting background talking photo generation on caricature page');

                  const talkingPhotoPromise = (async () => {
                    try {
                      console.log('FRONTEND: Background generation starting...');
                      const talkingPhotoResult = await apiService.generateTalkingPhoto(
                        generatedCaricature,
                        localStorage.getItem('userName') || 'User',
                        voiceId,
                        SCRIPTS.talkingPhotoGenerated,
                        'intro'
                      );

                      console.log('FRONTEND: Background generation completed:', talkingPhotoResult.videoUrl);
                      return talkingPhotoResult.videoUrl;
                    } catch (error) {
                      console.error('FRONTEND: Background generation failed:', error);
                      throw error;
                    }
                  })();

                  // Store the promise globally so TalkingPhotoGenerationPage can await it
                  (window as any).talkingPhotoGenerationPromise = talkingPhotoPromise;
                  console.log('FRONTEND: Background generation promise stored');
                }

                setCurrentPage(Page.TalkingPhotoGenerationIntro);
              }} variant="primary" size="lg">
                <span className="sm:hidden">{isEnglish() ? 'Continue' : '계속하기'}</span>
                <span className="hidden sm:inline">{isEnglish() ? 'Make It Talk!' : '말하게 만들기!'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Button>
            </div>
          </div>
        )}
      </Card>
    </PageLayout>
  );
};

export default CaricatureGenerationPage;
