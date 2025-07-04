import React, { useState, useCallback, useEffect } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import FileUpload from '../components/FileUpload.tsx';
import VoiceRecorder from '../components/VoiceRecorder.tsx';
import PageLayout from '../components/PageLayout.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import * as apiService from '../services/apiService.ts';
import { Page, UserData } from '../types.ts';
import { PLACEHOLDER_USER_IMAGE, NARRATOR_VOICE_ID, SCRIPTS } from '../constants.tsx';
import { scheduleNarrationPreload } from '../utils/narrationPreloader.ts';


interface UserOnboardingPageProps {
  setCurrentPage: (page: Page) => void;
  setUserData: (data: UserData | any) => void;
  setUserImageUrl: (url: string) => void;
  setUserAudioBlob: (blob: Blob) => void; 
  setVoiceId: (id: string) => void;
}

const UserOnboardingPage: React.FC<UserOnboardingPageProps> = ({
  setCurrentPage,
  setUserData,
  setUserImageUrl,
  setUserAudioBlob,
  setVoiceId,
}) => {
  // Step management: 0 = welcome, 1 = explanation, 2 = form
  const [currentStep, setCurrentStep] = useState(0);
  
  // Define step titles
  const stepTitles = [
    "환영합니다",
    "안내 사항",
    "사용자 정보 입력 및 음성 녹음"
  ];
  
  const getCurrentTitle = () => {
    return stepTitles[currentStep] || "사용자 정보 입력";
  };
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(PLACEHOLDER_USER_IMAGE);
  const [audioBlob, setAudioBlobLocal] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to determine which field should be highlighted
  const getCurrentActiveField = () => {
    if (!name.trim()) return 'name';
    if (!age.trim()) return 'age';
    if (!gender) return 'gender';
    if (!imageFile) return 'image';
    if (!audioBlob) return 'voice';
    return null; // All fields completed
  };

  const getFieldClasses = (fieldName: string) => {
    const activeField = getCurrentActiveField();
    const baseClasses = "mt-1 block w-full border-2 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-slate-800 transition-all duration-300";
    
    if (activeField === fieldName) {
      return `${baseClasses} bg-orange-50 border-orange-300 animate-pulse shadow-md`;
    } else {
      return `${baseClasses} bg-slate-50 border-slate-300 hover:border-orange-500 hover:bg-orange-50`;
    }
  };

  // Preload next step narration when current step starts
  useEffect(() => {
    const getNextScript = () => {
      switch (currentStep) {
        case 0: return SCRIPTS.onboardingExplanation; // Preload step 1
        case 1: return null; // Step 2 is form, no narration to preload
        default: return null;
      }
    };

    const nextScript = getNextScript();
    if (nextScript) {
      const preloadTimer = scheduleNarrationPreload(nextScript, NARRATOR_VOICE_ID, 2000);
      return () => clearTimeout(preloadTimer);
    }
  }, [currentStep]);

  const scriptForVoiceRecording = `
  안녕하세요, 여러분. 
오늘은 인공지능 기술에 대해 함께 알아보는 시간을 가져보겠습니다.

최근 인공지능 기술이 빠르게 발전하면서, 
우리 일상생활에도 많은 변화가 일어나고 있습니다.
음성인식부터 자동 번역기, 자동 주차까지, 
인공지능은 이미 우리 곁에 가까이 있어요.

하지만 이런 기술들이 항상 좋은 목적으로만 사용되는 것은 아닙니다.
때로는 사람들을 속이거나 잘못된 정보를 퍼뜨리는 데 악용되기도 해요.
그래서 우리가 이런 기술들을 올바르게 이해하고, 
현명하게 대처하는 방법을 배우는 것이 중요합니다.

오늘 함께 배우는 내용이 여러분께 도움이 되기를 바랍니다. 그럼 함께 시작 해볼까요?
`;

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRecordingComplete = useCallback((blob: Blob) => {
    setAudioBlobLocal(blob);
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !age.trim() || !gender || !imageFile || !audioBlob) {
      
      return;
    }
    setError(null);
    setIsLoading(true);

    try {
      const userData = { name, age, gender };
      
      // Complete onboarding in one atomic operation
      const result = await apiService.completeOnboarding(userData, imageFile, audioBlob);
      
      // Set all the data from the single response
      setUserData({ ...userData, userId: result.userId, success: result.success });
      setUserImageUrl(result.imageUrl);
      setVoiceId(result.voiceId);
      setUserAudioBlob(audioBlob);

      // Complete onboarding successful

      // Pre-cache narration and start caricature generation in parallel
      
      const preloadPromises = [];
      
      // 1. Pre-cache narration for CaricatureGenerationIntro page
      const narrationPromise = (async () => {
        try {
          const narrationResult = await apiService.generateNarration(SCRIPTS.caricatureGenerationStart, NARRATOR_VOICE_ID);
          const audioBlob = new Blob([Uint8Array.from(atob(narrationResult.audioData), c => c.charCodeAt(0))], { type: narrationResult.audioType });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          // Cache the audio with narrator voice ID
          if (!(window as any).narrationCache) {
            (window as any).narrationCache = new Map();
          }
          const scriptKey = `${SCRIPTS.caricatureGenerationStart}-${NARRATOR_VOICE_ID}`;
          (window as any).narrationCache.set(scriptKey, audioUrl);
        } catch (error) {
          // Failed to pre-cache CaricatureGenerationIntro narration
        }
      })();
      
      // 2. Start caricature generation in background
      const caricaturePromise = (async () => {
        try {
          // First analyze the face
          const faceAnalysisResult = await apiService.analyzeFace(result.imageUrl);
          
          // Then generate caricature
          const caricatureResult = await apiService.generateCaricature(faceAnalysisResult.facialFeatures, "Create a caricature based on the user's facial features");
          
          return caricatureResult.caricatureUrl;
          
        } catch (error) {
          throw error; // Let the generation page handle the error
        }
      })();
      
      // Store the promise globally so CaricatureGenerationPage can await it
      (window as any).caricatureGenerationPromise = caricaturePromise;
      
      preloadPromises.push(narrationPromise, caricaturePromise);
      
      // Wait for narration (critical for next page), but don't wait for caricature
      await narrationPromise;
      
      setCurrentPage(Page.CaricatureGenerationIntro);
    } catch (err) {
      console.error("Onboarding error:", err);
      
      // More specific error messages for iOS users
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      let errorMessage = "온보딩 중 오류가 발생했습니다. 다시 시도해주세요.";
      
      if (err instanceof Error) {
        if (err.message.includes('Voice file must be an audio file')) {
          errorMessage = isIOS 
            ? "iOS Safari에서 음성 파일 형식 오류가 발생했습니다. 다시 녹음해주세요."
            : "음성 파일 형식이 올바르지 않습니다. 다시 녹음해주세요.";
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = "네트워크 연결을 확인하고 다시 시도해주세요.";
        } else if (err.message.includes('timeout')) {
          errorMessage = "요청 시간이 초과되었습니다. 다시 시도해주세요.";
        }
      }
      
      if (isIOS) {
        errorMessage += " iOS Safari에서 문제가 발생할 수 있습니다.";
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: // Welcome step with narrator
        return (
          <Card>
            <PersonaTransitionSlide
              onNext={() => setCurrentStep(1)}
              userData={null}
              caricatureUrl={PLACEHOLDER_USER_IMAGE} // Use placeholder for narrator
              voiceId={NARRATOR_VOICE_ID}
              talkingPhotoUrl={null}
              script={SCRIPTS.onboardingWelcome}
              showScript={true}
              chunkedDisplay={true}
            />
          </Card>
        );

      case 1: // Explanation step with narrator
        return (
          <Card>
            <PersonaTransitionSlide
              onNext={() => setCurrentStep(2)}
              onPrevious={() => setCurrentStep(0)}
              userData={null}
              caricatureUrl={PLACEHOLDER_USER_IMAGE} // Use placeholder for narrator
              voiceId={NARRATOR_VOICE_ID}
              talkingPhotoUrl={null}
              script={SCRIPTS.onboardingExplanation}
              showScript={true}
              chunkedDisplay={true}
            />
          </Card>
        );

      case 2: // Form step
        return (
          <Card>
            <p className="text-slate-700 text-lg leading-relaxed mb-8 text-center">
              인적사항을 입력해주세요. 
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-base font-semibold text-slate-700 mb-2">성함</label>
                <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} required 
                       className={getFieldClasses('name')} />
              </div>
              <div>
                <label htmlFor="age" className="block text-base font-semibold text-slate-700 mb-2">나이</label>
                <input type="number" name="age" id="age" value={age} onChange={e => setAge(e.target.value)} required
                       className={getFieldClasses('age')} />
              </div>
              <div>
                <label htmlFor="gender" className="block text-base font-semibold text-slate-700 mb-2">성별</label>
                <select name="gender" id="gender" value={gender} onChange={e => setGender(e.target.value)} required
                        className={`${getFieldClasses('gender')} appearance-none`}>
                  <option value="">선택...</option>
                  <option value="female">여성</option>
                  <option value="male">남성</option>
                </select>
              </div>
              
              <div>
                <FileUpload 
                  onFileSelect={handleImageSelect} 
                  label="사진 업로드" 
                  previewUrl={imagePreviewUrl} 
                  isActive={getCurrentActiveField() === 'image'}
                />
              </div>
              
              <div>
                <VoiceRecorder 
                  onRecordingComplete={handleRecordingComplete} 
                  scriptToRead={scriptForVoiceRecording} 
                  maxDuration={60} 
                  isActive={getCurrentActiveField() === 'voice'}
                />
              </div>

              {/* Show success message when all fields are completed */}
              {getCurrentActiveField() === null && (
                <p className="text-lg text-green-600 bg-green-100 p-4 rounded-lg border border-green-300 text-center font-semibold">
                  제출하기 버튼을 눌러주세요.
                </p>
              )}

              {error && <p className="text-lg text-red-600 bg-red-100 p-4 rounded-lg border border-red-300">{error}</p>}

              <p className="text-center text-slate-500 text-sm mt-4">
                제출 버튼을 누르면, 제공된 정보의 처리에 동의하는 것으로 간주됩니다.
              </p>
              <div className="mt-8 flex justify-center">
                <Button type="submit" variant="primary" size="lg" disabled={!name.trim() || !age.trim() || !gender || !imageFile || !audioBlob || isLoading}>
                  {isLoading ? '제출 중...' : '제출하기'}
                </Button>
              </div>
            </form>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <PageLayout title={getCurrentTitle()}>
      {renderCurrentStep()}
    </PageLayout>
  );
};

export default UserOnboardingPage;
