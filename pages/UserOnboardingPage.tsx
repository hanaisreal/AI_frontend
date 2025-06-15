import React, { useState, useCallback } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import FileUpload from '../components/FileUpload.tsx';
import VoiceRecorder from '../components/VoiceRecorder.tsx';
import PageLayout from '../components/PageLayout.tsx';
import * as apiService from '../services/apiService.ts';
import { Page, UserData } from '../types.ts';
import { PLACEHOLDER_USER_IMAGE } from '../constants.tsx';


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
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(PLACEHOLDER_USER_IMAGE);
  const [audioBlob, setAudioBlobLocal] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scriptForVoiceRecording = `안녕하세요, 저는 AI 기술에 대해 이야기하고 있습니다. 
이 기술은 우리의 일상생활에 큰 영향을 미치고 있어요. 
특히 딥페이크와 음성 복제 기술은 매우 흥미롭지만, 동시에 주의가 필요합니다. 
우리는 이 기술들을 책임감 있게 사용해야 해요. 
이것은 단순한 실험일 뿐이며, 실제 상황에서는 더 많은 고려가 필요합니다. 
함께 이 기술의 장단점을 알아보고, 안전하게 사용하는 방법을 배워봅시다.`;

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

  return (
    <PageLayout >
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
              {isLoading ? '제출 중...' : '제출하고 모듈 시작하기'}
            </Button>
          </div>
        </form>
      </Card>
    </PageLayout>
  );
};

export default UserOnboardingPage;
