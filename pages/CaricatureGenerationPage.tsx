import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import PageLayout from '../components/PageLayout.tsx';
import * as apiService from '../services/apiService.ts'; 
import { Page } from '../types.ts';
import { SCRIPTS } from '../constants.tsx';

interface CaricatureGenerationPageProps {
  setCurrentPage: (page: Page) => void;
  userImageUrl: string | null;
  caricatureUrl: string | null;
  setCaricatureUrl: (url: string) => void;
  onGoBack: () => void;
  canGoBack: boolean;
}

const CaricatureGenerationPage: React.FC<CaricatureGenerationPageProps> = ({
  setCurrentPage,
  userImageUrl,
  caricatureUrl,
  setCaricatureUrl,
  onGoBack,
  canGoBack,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("이미지 분석 중...");
  const [generatedCaricature, setGeneratedCaricature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const hasStartedGeneration = useRef(false);

  const generateCaricature = async () => {
    try {
      // Prevent multiple simultaneous generations
      if (hasStartedGeneration.current) {
        console.log('🛑 Generation already in progress, skipping duplicate call');
        return;
      }
      
      hasStartedGeneration.current = true;
      setIsLoading(true);
      setError(null);
      setGeneratedCaricature(null);
      
      console.log('🎨 Starting caricature generation...');
      setStatusMessage("이미지에서 얼굴 특징 분석 중...");
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      if (!userImageUrl) {
        throw new Error("사용자 이미지가 없습니다.");
      }
      
      const analysis = await apiService.analyzeFace(userImageUrl);
      console.log("얼굴 분석 결과:", analysis.facialFeatures);

      setStatusMessage("캐릭터 생성 중...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      const caricaturePrompt = `Create a vibrant full-color cartoon caricature portrait of a SINGLE PERSON ONLY. Disney-Pixar style with natural skin tones, exaggerated features, clean lines, bright colors, no background, solo portrait. Features: ${analysis.facialFeatures.uniqueFeatures?.join(', ') || 'as described'}. ONE PERSON PORTRAIT ONLY - no multiple people, no groups, just one individual with realistic skin color and vibrant appearance.`;
      const caricatureResult = await apiService.generateCaricature(analysis.facialFeatures, caricaturePrompt);
      
      // Set the result directly
      setGeneratedCaricature(caricatureResult.caricatureUrl);
      setCaricatureUrl(caricatureResult.caricatureUrl);
      setStatusMessage(SCRIPTS.caricatureGenerated);
      setIsLoading(false);
      console.log('✅ Caricature generation completed successfully');
    } catch (err) {
      console.error("캐리커처 생성 오류:", err);
      setError("캐리커처 생성에 실패했습니다. 네트워크 문제 또는 백엔드 서비스 사용 불가 때문일 수 있습니다. 다시 시도하거나, 가능하다면 이 단계를 건너뛰세요.");
      setStatusMessage("캐리커처 생성 중 오류 발생.");
    } finally {
      setIsLoading(false);
      hasStartedGeneration.current = false; // Reset the flag
    }
  };

  useEffect(() => {
    console.log('🔄 CaricatureGenerationPage useEffect triggered');
    console.log(`   - userImageUrl: ${userImageUrl ? 'EXISTS' : 'NULL'}`);
    console.log(`   - caricatureUrl: ${caricatureUrl ? 'EXISTS' : 'NULL'}`);
    console.log(`   - hasStartedGeneration: ${hasStartedGeneration.current}`);
    
    if (!userImageUrl) {
      console.log('❌ No user image URL, showing error');
      setError("사용자 이미지를 사용할 수 없습니다. 뒤로 돌아가 이미지를 업로드해주세요.");
      setIsLoading(false);
      return;
    }

    // If caricature already exists, show it instead of regenerating
    if (caricatureUrl) {
      console.log('✅ Caricature already exists, using cached version');
      setGeneratedCaricature(caricatureUrl);
      setStatusMessage(SCRIPTS.caricatureGenerated);
      setIsLoading(false);
      return;
    }

    // Only generate if we haven't started yet
    if (!hasStartedGeneration.current) {
      console.log('🚀 Starting caricature generation...');
      generateCaricature();
    }
  }, [userImageUrl]); // ✅ FIXED: Removed caricatureUrl from dependencies

 

  return (
    <PageLayout title="나만의 캐릭터 만들기">
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
            <p className="text-red-600 text-2xl mb-4 font-semibold">오류</p>
            <p className="text-slate-700 text-lg mb-8">{error}</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => {
                console.log('🔄 User clicked retry button after error');
                hasStartedGeneration.current = false; // Reset flag for retry
                generateCaricature();
              }} variant="primary" size="lg">
                다시 시도
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </Button>
              <Button onClick={() => setCurrentPage(Page.UserOnboarding)} variant="secondary" size="lg">
                설정으로 돌아가기
              </Button>
            </div>
          </div>
        )}
        {!isLoading && !error && generatedCaricature && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-orange-600 mb-6">캐릭터 준비 완료!</h2>
            <p className="text-slate-700 text-lg mb-8">{statusMessage}</p>
            <div className="my-8 p-3 bg-slate-100 inline-block rounded-xl shadow-lg border-2 border-slate-200">
                <img 
                    src={generatedCaricature} 
                    alt="생성된 캐리커처" 
                    className="rounded-lg w-72 h-72 md:w-80 md:h-80 object-contain mx-auto border-4 border-orange-500"
                />
            </div>
            <div className="flex justify-center gap-4">
              <Button onClick={() => {
                console.log('🔄 User clicked regenerate button');
                hasStartedGeneration.current = false; // Reset flag for manual regeneration
                generateCaricature();
              }} variant="secondary" size="lg">
                다시 생성
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 ml-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </Button>
              <Button onClick={() => setCurrentPage(Page.TalkingPhotoGeneration)} variant="primary" size="lg">
                말하게 만들기!
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
