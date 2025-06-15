
import React, { useState, useEffect } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import PageLayout from '../components/PageLayout.tsx';
import * as caricatureService from '../services/apiService.ts'; 
import { Page } from '../types.ts';
import { SCRIPTS } from '../constants.tsx';

interface CaricatureGenerationPageProps {
  setCurrentPage: (page: Page) => void;
  userImageUrl: string | null;
  setCaricatureUrl: (url: string) => void;
}

const CaricatureGenerationPage: React.FC<CaricatureGenerationPageProps> = ({
  setCurrentPage,
  userImageUrl,
  setCaricatureUrl,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("이미지 분석 중...");
  const [generatedCaricature, setGeneratedCaricature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userImageUrl) {
      setError("사용자 이미지를 사용할 수 없습니다. 뒤로 돌아가 이미지를 업로드해주세요.");
      setIsLoading(false);
      return;
    }

    const generate = async () => {
      try {
        setStatusMessage("이미지에서 얼굴 특징 분석 중...");
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        const analysis = await caricatureService.analyzeFace(userImageUrl);
        console.log("얼굴 분석 결과:", analysis.facialFeatures);

        setStatusMessage("캐릭터 생성 중...");
        await new Promise(resolve => setTimeout(resolve, 2500));
        const caricaturePrompt = `흑백 라인 아트 캐리커처 초상화를 만드세요. 과장된 특징, 단순한 선, 음영 없음, 배경 없음, 특징: ${analysis.facialFeatures.uniqueFeatures?.join(', ') || '설명된 대로'} 사람과 유사하게.`;
        const caricatureResult = await caricatureService.generateCaricature(analysis.facialFeatures, caricaturePrompt);
        
        setCaricatureUrl(caricatureResult.caricatureUrl);
        setGeneratedCaricature(caricatureResult.caricatureUrl);
        setStatusMessage(SCRIPTS.caricatureGenerated); // Already translated in constants
      } catch (err) {
        console.error("캐리커처 생성 오류:", err);
        setError("캐리커처 생성에 실패했습니다. 네트워크 문제 또는 백엔드 서비스 사용 불가 때문일 수 있습니다. 다시 시도하거나, 가능하다면 이 단계를 건너뛰세요.");
        setStatusMessage("캐리커처 생성 중 오류 발생.");
      } finally {
        setIsLoading(false);
      }
    };

    generate();
  }, [userImageUrl, setCaricatureUrl]); 

  return (
    <PageLayout title="캐리커처 만들기">
      <Card>
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
            <Button onClick={() => setCurrentPage(Page.UserOnboarding)} variant="secondary" size="lg">
              설정으로 돌아가기
            </Button>
          </div>
        )}
        {!isLoading && !error && generatedCaricature && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-green-600 mb-6">캐리커처 준비 완료!</h2>
            <p className="text-slate-700 text-lg mb-8">{statusMessage}</p>
            <div className="my-8 p-3 bg-slate-100 inline-block rounded-xl shadow-lg border-2 border-slate-200">
                <img 
                    src={generatedCaricature} 
                    alt="생성된 캐리커처" 
                    className="rounded-lg w-72 h-72 md:w-80 md:h-80 object-contain mx-auto border-4 border-orange-500"
                />
            </div>
            <Button onClick={() => setCurrentPage(Page.TalkingPhotoGeneration)} variant="primary" size="lg">
              다음: 말하게 만들기!
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </div>
        )}
      </Card>
    </PageLayout>
  );
};

export default CaricatureGenerationPage;
