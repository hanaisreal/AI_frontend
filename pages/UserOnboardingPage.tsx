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
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(PLACEHOLDER_USER_IMAGE);
  const [audioBlob, setAudioBlobLocal] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.log(`🎵 Scheduling preload for step ${currentStep + 1}`);
      const preloadTimer = scheduleNarrationPreload(nextScript, NARRATOR_VOICE_ID, 2000);
      return () => clearTimeout(preloadTimer);
    }
  }, [currentStep]);

  const scriptForVoiceRecording = `오늘 날씨가 정말 좋네요. 햇살이 따뜻하고 바람도 시원해요. 
이런 날에는 산책하기 딱 좋은 것 같아요. 
커피 한 잔 마시면서 친구랑 이야기하는 것도 좋겠고요. 
주말에는 뭐 하실 계획이세요? 
저는 새로 나온 영화를 보러 가려고 해요. 
요즘 영화관에서 상영하는 작품들이 꽤 재미있다고 하더라고요. 
음식도 맛있게 먹고, 좋은 사람들과 시간을 보내는 게 최고인 것 같아요.`;

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
    if (!name || !age || !gender || !imageFile || !audioBlob) {
      setError("모든 필드를 작성하고, 이미지를 업로드하고, 목소리를 녹음해주세요.");
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

      console.log("✅ Complete onboarding successful:", {
        userId: result.userId,
        imageUrl: result.imageUrl,
        voiceId: result.voiceId,
        voiceName: result.voiceName
      });

      setCurrentPage(Page.CaricatureGeneration);
    } catch (err) {
      console.error("Onboarding error:", err);
      setError("온보딩 중 오류가 발생했습니다. 다시 시도해주세요. 백엔드 서버가 실행 중인지 확인하세요.");
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
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label htmlFor="name" className="block text-base font-semibold text-slate-700 mb-1">성함</label>
                <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} required 
                       className="mt-1 block w-full bg-white border-slate-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-slate-800" />
              </div>
              <div>
                <label htmlFor="age" className="block text-base font-semibold text-slate-700 mb-1">나이</label>
                <input type="number" name="age" id="age" value={age} onChange={e => setAge(e.target.value)} required
                       className="mt-1 block w-full bg-white border-slate-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-slate-800" />
              </div>
              <div>
                <label htmlFor="gender" className="block text-base font-semibold text-slate-700 mb-1">성별</label>
                <select name="gender" id="gender" value={gender} onChange={e => setGender(e.target.value)} required
                        className="mt-1 block w-full bg-white border-slate-300 rounded-lg shadow-sm py-3 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg text-slate-800 appearance-none">
                  <option value="">선택...</option>
                  <option value="female">여성</option>
                  <option value="male">남성</option>
                </select>
              </div>
              
              <FileUpload onFileSelect={handleImageSelect} label="사진 업로드" previewUrl={imagePreviewUrl} />
              
              <VoiceRecorder onRecordingComplete={handleRecordingComplete} scriptToRead={scriptForVoiceRecording} maxDuration={60} />

              {error && <p className="text-lg text-red-600 bg-red-100 p-4 rounded-lg border border-red-300">{error}</p>}

              <p className="text-center text-slate-500 text-sm mt-4">
                제출 버튼을 누르면, 제공된 정보의 처리에 동의하는 것으로 간주됩니다.
              </p>
              <div className="mt-8 flex justify-center">
                <Button type="submit" variant="primary" size="lg" disabled={!name || !age || !gender || !imageFile || !audioBlob || isLoading}>
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
    <PageLayout >
      {renderCurrentStep()}
    </PageLayout>
  );
};

export default UserOnboardingPage;
