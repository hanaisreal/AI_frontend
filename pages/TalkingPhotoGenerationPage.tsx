import React, { useState, useEffect, useRef } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import LoadingSpinner from '../components/LoadingSpinner.tsx';
import PageLayout from '../components/PageLayout.tsx';
import * as apiService from '../services/apiService.ts';
import { Page, UserData } from '../types.ts';
import { SCRIPTS } from '../constants.tsx';

interface TalkingPhotoGenerationPageProps {
  setCurrentPage: (page: Page) => void;
  caricatureUrl: string | null;
  voiceId: string | null;
  userData: UserData | null;
  setTalkingPhotoUrl: (url: string) => void;
}

const TalkingPhotoGenerationPage: React.FC<TalkingPhotoGenerationPageProps> = ({
  setCurrentPage,
  caricatureUrl,
  voiceId,
  userData,
  setTalkingPhotoUrl,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState("말하는 사진 생성 준비 중...");
  const [generatedTalkingPhoto, setGeneratedTalkingPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [sampleVideoMessage, setSampleVideoMessage] = useState<string | null>(null);
  const hasStartedGeneration = useRef(false);


  useEffect(() => {
    if (!caricatureUrl) {
      setError("캐리커처를 사용할 수 없습니다. 이전 단계를 완료해주세요.");
      setIsLoading(false);
      return;
    }

    if (!userData?.name) {
      setError("사용자 정보를 사용할 수 없습니다. 온보딩을 다시 완료해주세요.");
      setIsLoading(false);
      return;
    }

    if (!voiceId) {
      setError("음성 정보를 사용할 수 없습니다. 음성 녹음을 다시 완료해주세요.");
      setIsLoading(false);
      return;
    }

    if (hasStartedGeneration.current) {
      return;
    }
    hasStartedGeneration.current = true;

    const generate = async () => {
      try {
        setStatusMessage("캐릭터가 말하는 비디오를 생성하고 있어요... (최대 4분 소요)");
        const result = await apiService.generateTalkingPhoto(caricatureUrl, userData?.name || "사용자", voiceId!);
        
        setTalkingPhotoUrl(result.videoUrl);
        setGeneratedTalkingPhoto(result.videoUrl); 
        
        // Check if this is a sample video due to API failure
        if (result.isSample && result.message) {
          setSampleVideoMessage(result.message);
          setStatusMessage("샘플 영상으로 진행합니다");
        } else {
          setStatusMessage(SCRIPTS.talkingPhotoGenerated);
        }
      } catch (err) {
        console.error("말하는 사진 생성 오류:", err);
        setError("말하는 사진 생성에 실패했습니다. 네트워크 또는 서비스 문제일 수 있습니다. 다시 시도해주세요.");
        setStatusMessage("말하는 사진 생성 중 오류 발생.");
      } finally {
        setIsLoading(false);
      }
    };

    generate();
  }, [caricatureUrl, voiceId, userData, setTalkingPhotoUrl]);

  return (
    <PageLayout title="캐릭터에 생명 불어넣기">
      <Card>
        {isLoading && (
          <div className="text-center py-10">
            <LoadingSpinner size="lg" />
            <p className="mt-6 text-xl text-orange-600">{statusMessage}</p>
            <p className="mt-4 text-slate-500">이 작업은 최대 4분까지 소요될 수 있습니다. 페이지를 나가지 마세요.</p>
          </div>
        )}
        
        {!isLoading && error && (
          <div className="text-center py-10">
            <p className="text-red-600 text-2xl mb-4 font-semibold">오류</p>
            <p className="text-slate-700 text-lg mb-8">{error}</p>
            <Button onClick={() => setCurrentPage(Page.CaricatureGeneration)} variant="secondary" size="lg">
              캐리커처로 돌아가기
            </Button>
          </div>
        )}
        {!isLoading && !error && generatedTalkingPhoto && (
          <div className="text-center">
            <h2 className="text-3xl font-semibold text-orange-600 mb-6">말하는 캐릭터 생성 완료!</h2>
            {sampleVideoMessage && (
              <div className="mb-4 p-3 bg-orange-100 border border-orange-300 rounded-lg">
                <p className="text-orange-800 font-medium">{sampleVideoMessage}</p>
              </div>
            )}
            
            <div className="my-8 p-3 bg-slate-100 inline-block rounded-xl shadow-lg">
                {!videoError ? (
                    <video 
                        src={generatedTalkingPhoto} 
                        className="rounded-lg w-64 h-96 md:w-80 md:h-[30rem] object-contain mx-auto border-4 border-orange-500"
                        controls
                        autoPlay
                        playsInline
                        crossOrigin="anonymous"
                        preload="auto"
                        disablePictureInPicture
                        controlsList="nodownload"
                        onError={(e) => {
                            console.error('Video load error:', e);
                            console.error('Video src:', generatedTalkingPhoto);
                            console.error('Video error code:', e.currentTarget.error?.code);
                            console.error('Video error message:', e.currentTarget.error?.message);
                            setVideoError(true);
                        }}
                        onLoadStart={() => console.log('Video loading started from:', generatedTalkingPhoto)}
                        onLoadedData={() => console.log('Video data loaded successfully')}
                        onCanPlay={() => console.log('Video ready to play')}
                        onPlay={() => console.log('Video started playing')}
                    />
                ) : (
                    <div className="w-64 h-96 md:w-80 md:h-[30rem] bg-gray-200 rounded-lg border-4 border-orange-500 flex flex-col items-center justify-center">
                        <p className="text-gray-600 text-center px-4">
                            동영상을 로드할 수 없습니다.<br/>
                            <span className="text-sm">CDN에서 처리 중일 수 있습니다.</span>
                        </p>
                        <button 
                            onClick={() => {
                                console.log('Retrying video load from:', generatedTalkingPhoto);
                                setVideoError(false);
                            }}
                            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                        >
                            다시 시도
                        </button>
                        <a 
                            href={generatedTalkingPhoto} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mt-2 text-sm text-blue-600 hover:underline"
                            onClick={(e) => {
                                e.preventDefault();
                                console.log('Opening direct link:', generatedTalkingPhoto);
                                window.open(generatedTalkingPhoto, '_blank');
                            }}
                        >
                            직접 링크로 열기
                        </a>
                    </div>
                )}
            </div>
            <p className="text-base text-slate-600 mb-10">(어떤가요? 말하는 캐릭터가 생겼어요!)</p>

            <div className="flex justify-center">
              <Button onClick={() => setCurrentPage(Page.DeepfakeIntroduction)} variant="primary" size="lg">
                딥페이크 이해하기
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

export default TalkingPhotoGenerationPage;
