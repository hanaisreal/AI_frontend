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
  const [currentStep, setCurrentStep] = useState(0);
  const [generatedTalkingPhoto, setGeneratedTalkingPhoto] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<boolean>(false);
  const [sampleVideoMessage, setSampleVideoMessage] = useState<string | null>(null);
  const hasStartedGeneration = useRef(false);

  // Progress steps with friendly messages
  const progressSteps = [
    "캐릭터 준비중...",
    "목소리 분석중...", 
    "비디오 생성중...",
    "마지막 터치 추가중...",
    "거의 완성됐어요!"
  ];

  // Progress animation effect
  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = (prev + 1) % progressSteps.length;
        setStatusMessage(progressSteps[nextStep]);
        return nextStep;
      });
    }, 12000); // Change message every 12 seconds for 4 minutes total

    return () => clearInterval(interval);
  }, [isLoading, progressSteps]);

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

    // Function to pre-cache deepfake introduction narration
    const preCacheDeepfakeIntroNarration = async () => {
      try {
        console.log('🚀 Pre-caching deepfake introduction narration...');
        
        // Generate the deepfake intro start narration using user's custom voice
        const result = await apiService.generateNarration(SCRIPTS.deepfakeIntroStart, voiceId);
        
        // Create audio blob and cache it
        const scriptKey = `${SCRIPTS.deepfakeIntroStart}-${voiceId}`;
        const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Initialize global cache if it doesn't exist
        (window as any).narrationCache = (window as any).narrationCache || new Map();
        (window as any).narrationCache.set(scriptKey, audioUrl);
        
        console.log('✅ Pre-cached deepfake introduction narration with user voice');
        console.log(`  - Cache key: ${scriptKey.substring(0, 50)}...`);
      } catch (error) {
        console.error('⚠️ Pre-cache failed for deepfake introduction narration:', error);
        // Pre-cache failure is non-critical, continue normally
      }
    };

    // Check if talking photo already exists by checking if we already have a generated photo
    // Since we don't have direct access to the database talking_photo_url, we'll check if
    // we already have a generatedTalkingPhoto or if we can fetch user data to check
    const checkExistingTalkingPhoto = async () => {
      try {
        if (userData?.userId) {
          console.log('🔍 Checking if talking photo already exists for user...');
          
          // Fetch current user data to check if talking photo URL exists
          const response = await fetch(`http://localhost:8000/api/users/${userData.userId}`);
          if (response.ok) {
            const currentUserData = await response.json();
            
            if (currentUserData.talking_photo_url) {
              console.log('✅ Talking photo already exists, using cached version');
              console.log(`   - Existing URL: ${currentUserData.talking_photo_url}`);
              console.log('   - Skipping regeneration to save API credits');
              
              setGeneratedTalkingPhoto(currentUserData.talking_photo_url);
              setTalkingPhotoUrl(currentUserData.talking_photo_url);
              setStatusMessage(SCRIPTS.talkingPhotoGenerated);
              setIsLoading(false);
              
              // Still pre-cache the deepfake introduction narration for better UX
              setTimeout(preCacheDeepfakeIntroNarration, 500);
              return true; // Indicates we found existing photo
            }
          }
        }
        return false; // No existing photo found
      } catch (error) {
        console.error('⚠️ Error checking existing talking photo:', error);
        return false; // Continue with generation on error
      }
    };

    if (hasStartedGeneration.current) {
      return;
    }
    hasStartedGeneration.current = true;

    const generate = async () => {
      // First check if talking photo already exists
      const hasExistingPhoto = await checkExistingTalkingPhoto();
      if (hasExistingPhoto) {
        return; // Skip generation
      }

      try {
        console.log('🎬 Starting talking photo generation...');
        console.log(`   - Caricature URL: ${caricatureUrl}`);
        console.log(`   - User: ${userData?.name}`);
        console.log(`   - Voice ID: ${voiceId}`);
        
        setStatusMessage(progressSteps[0]); // Start with first progress step
        setCurrentStep(0);
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

        console.log('✅ Talking photo generation completed');
        console.log(`   - Video URL: ${result.videoUrl}`);
        console.log(`   - Is Sample: ${result.isSample || false}`);

        // Pre-cache the deepfake introduction narration for instant experience
        setTimeout(preCacheDeepfakeIntroNarration, 1000);
        
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

  // Handler for continue button - triggers scenario generation and navigation
  const handleContinueToDeepfake = async () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 FRONTEND: Starting scenario generation from TalkingPhoto continue button...');
    console.log(`   - Voice ID: ${voiceId}`);
    console.log(`   - User ID: ${userData?.userId}`);
    console.log(`   - Trigger: Continue button clicked`);
    console.log('='.repeat(60));

    // Start scenario generation in background (fire and forget)
    if (voiceId && userData?.userId) {
      apiService.startScenarioGeneration(voiceId)
        .then(result => {
          console.log('\n✅ FRONTEND: Scenario generation started successfully!');
          console.log('   - API Response:', result);  
          console.log('   - Status:', result.status);
          console.log('🎬 Background processing started on server...');
          console.log('   - Face swaps, talking photos, and voice dubs will be generated');
          console.log('   - All URLs will be saved to database automatically');
          console.log('💡 Check server console for detailed generation logs');
        })
        .catch(error => {
          console.error('\n❌ FRONTEND: Failed to start scenario generation:', error);
          console.error('   - This is non-critical, user experience continues normally');
        });
    } else {
      console.warn('⚠️ Missing required data for scenario generation, skipping');
    }

    // Navigate immediately (don't wait for background task)
    setCurrentPage(Page.DeepfakeIntroduction);
  };

  return (
    <PageLayout title="캐릭터에 생명 불어넣기">
      <Card>
        {isLoading && (
          <div className="text-center py-10">
            <LoadingSpinner size="lg" />
            
            {/* Progress Steps Visual */}
            <div className="mt-8 mb-6">
              <div className="flex justify-center items-center space-x-2 mb-4">
                {progressSteps.map((_, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className={`w-3 h-3 rounded-full transition-colors duration-500 ${
                        index <= currentStep ? 'bg-orange-500' : 'bg-gray-300'
                      }`}
                    />
                    {index < progressSteps.length - 1 && (
                      <div 
                        className={`w-8 h-0.5 transition-colors duration-500 ${
                          index < currentStep ? 'bg-orange-500' : 'bg-gray-300'
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xl text-orange-600 font-medium">{statusMessage}</p>
            </div>
            
            <div className="bg-orange-50 rounded-lg p-4 mx-auto max-w-sm">
              <p className="text-orange-700 text-sm mb-2">🎬 캐릭터가 생생하게 살아나고 있어요!</p>
              <p className="text-slate-600 text-sm">페이지를 나가지 마세요</p>
            </div>
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
              <Button 
                onClick={handleContinueToDeepfake}
                variant="primary" 
                size="lg"
              >
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
