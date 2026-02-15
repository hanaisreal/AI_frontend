import React, { useState, useCallback, useEffect } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import FileUpload from '../components/FileUpload.tsx';
import VoiceRecorder from '../components/VoiceRecorder.tsx';
import PageLayout from '../components/PageLayout.tsx';
import PersonaTransitionSlide from '../components/PersonaTransitionSlide.tsx';
import * as apiService from '../services/apiService.ts';
import { Page, UserData } from '../types.ts';
import { PLACEHOLDER_USER_IMAGE, NARRATOR_VOICE_ID, SCRIPTS, UI_TEXT } from '../lang';
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
  const stepTitles = UI_TEXT.stepTitles;

  const getCurrentTitle = () => {
    return stepTitles[currentStep] || UI_TEXT.enterInfo;
  };
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(PLACEHOLDER_USER_IMAGE);
  const [audioBlob, setAudioBlobLocal] = useState<Blob | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string[]>([]); // For mobile debugging

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
${UI_TEXT.voiceRecordingInstruction}

${UI_TEXT.voiceQuestion1}
${UI_TEXT.voiceQuestion2}
${UI_TEXT.voiceQuestion3}
${UI_TEXT.voiceQuestion4}
${UI_TEXT.voiceQuestion5}

`;

  const addDebugInfo = useCallback((message: string) => {
    setDebugInfo(prev => [...prev.slice(-4), `${new Date().toLocaleTimeString()}: ${message}`]); // Keep last 5 messages
  }, []);

  // Compress image before upload (especially important for iPhone photos)
  const compressImage = useCallback((file: File, maxSizeMB = 2, quality = 0.7): Promise<File> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 1200px width/height)
        const maxDimension = 1200;
        let { width, height } = img;
        
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Draw compressed image
        ctx?.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            
            addDebugInfo(`🗜️ 이미지 압축: ${(file.size/1024/1024).toFixed(1)}MB → ${(compressedFile.size/1024/1024).toFixed(1)}MB`);
            resolve(compressedFile);
          } else {
            addDebugInfo(`⚠️ 이미지 압축 실패, 원본 사용`);
            resolve(file);
          }
        }, 'image/jpeg', quality);
      };
      
      img.onerror = () => {
        addDebugInfo(`❌ 이미지 로드 실패, 원본 사용`);
        resolve(file);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }, [addDebugInfo]);

  const handleImageSelect = useCallback(async (file: File) => {
    console.log('📸 Image selected:', file.name, file.size, file.type);
    addDebugInfo(`📸 이미지 선택: ${file.name} (${(file.size/1024/1024).toFixed(1)}MB, ${file.type})`);
    
    // Compress image if it's too large (especially for iPhone photos)
    let processedFile = file;
    if (file.size > 3 * 1024 * 1024) { // If larger than 3MB
      addDebugInfo(`🗜️ 이미지가 큽니다. 압축 중...`);
      try {
        processedFile = await compressImage(file);
      } catch (error) {
        console.error('❌ Image compression failed:', error);
        addDebugInfo(`❌ 이미지 압축 실패: ${error}`);
      }
    }
    
    setImageFile(processedFile);
    
    // iOS-compatible image preview generation
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result as string);
      console.log('✅ Image preview generated successfully');
      addDebugInfo('✅ 이미지 미리보기 생성 완료');
    };
    reader.onerror = (error) => {
      console.error('❌ Image preview failed:', error);
      addDebugInfo('❌ 이미지 미리보기 실패');
      // Still set the file even if preview fails
      setImagePreviewUrl(PLACEHOLDER_USER_IMAGE);
    };
    
    // iOS Safari compatibility for HEIC files
    try {
      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error('❌ FileReader error:', error);
      addDebugInfo('❌ FileReader 오류 발생');
      setImagePreviewUrl(PLACEHOLDER_USER_IMAGE);
    }
  }, [addDebugInfo, compressImage]);

  const handleRecordingComplete = useCallback((blob: Blob) => {
    console.log('🎵 Audio recording completed:', blob.size, blob.type);
    addDebugInfo(`🎵 음성 녹음 완료: ${(blob.size/1024/1024).toFixed(1)}MB, ${blob.type}`);
    setAudioBlobLocal(blob);
  }, [addDebugInfo]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !age.trim() || !gender || !imageFile || !audioBlob) {
      
      return;
    }
    setError(null);
    setDebugInfo([]); // Clear previous debug info
    setIsLoading(true);
    
    // Show device and browser info on screen
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const browser = navigator.userAgent.includes('Safari') ? 'Safari' : 
                   navigator.userAgent.includes('Chrome') ? 'Chrome' : 
                   navigator.userAgent.includes('Firefox') ? 'Firefox' : 'Unknown';
    
    addDebugInfo(`📱 기기: ${isIOS ? 'iOS' : 'Desktop'}, 브라우저: ${browser}`);
    addDebugInfo(`🚀 온보딩 제출 시작 (${name}, ${age}세, ${gender})`);

    try {
      const userData = { name, age, gender };
      
      // Complete onboarding in one atomic operation
      addDebugInfo(`📡 API 호출 중... (이미지: ${(imageFile.size/1024/1024).toFixed(1)}MB, 음성: ${(audioBlob.size/1024/1024).toFixed(1)}MB)`);
      const result = await apiService.completeOnboarding(userData, imageFile, audioBlob);
      addDebugInfo(`✅ API 응답 성공: 사용자 ID ${result.userId}`);
      
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
      
      // Add error to debug info for mobile visibility
      addDebugInfo(`❌ 오류 발생: ${err instanceof Error ? err.message : String(err)}`);
      
      // More specific error messages for iOS users
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      let errorMessage = "온보딩 중 오류가 발생했습니다. 다시 시도해주세요.";
      
      if (err instanceof Error) {
        // Show the actual error message for debugging
        addDebugInfo(`🔍 상세 오류: ${err.message.substring(0, 100)}...`);
        
        if (err.message.includes('Voice file must be an audio file')) {
          errorMessage = isIOS 
            ? "iOS Safari에서 음성 파일 형식 오류가 발생했습니다. 다시 녹음해주세요."
            : "음성 파일 형식이 올바르지 않습니다. 다시 녹음해주세요.";
        } else if (err.message.includes('Image file must be an image')) {
          errorMessage = isIOS 
            ? "iOS Safari에서 이미지 파일 형식 오류가 발생했습니다. 다른 이미지를 선택해주세요."
            : "이미지 파일 형식이 올바르지 않습니다. 다른 이미지를 선택해주세요.";
        } else if (err.message.includes('file too large') || err.message.includes('413') || err.message.includes('Request Entity Too Large')) {
          errorMessage = isIOS 
            ? "파일 크기가 너무 큽니다. iPhone 사진은 자동으로 압축되지만, 더 작은 파일을 선택하거나 다시 시도해주세요."
            : "파일 크기가 너무 큽니다. 더 작은 파일을 사용해주세요.";
        } else if (err.message.includes('corrupted or empty')) {
          errorMessage = "파일이 손상되었거나 비어있습니다. 다른 파일을 선택해주세요.";
        } else if (err.message.includes('network') || err.message.includes('fetch')) {
          errorMessage = isIOS 
            ? "네트워크 연결을 확인하고 다시 시도해주세요. iOS Safari에서는 WiFi 연결을 권장합니다."
            : "네트워크 연결을 확인하고 다시 시도해주세요.";
        } else if (err.message.includes('timeout')) {
          errorMessage = isIOS 
            ? "요청 시간이 초과되었습니다. iOS에서는 네트워크가 느릴 수 있습니다. 다시 시도해주세요."
            : "요청 시간이 초과되었습니다. 다시 시도해주세요.";
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
              {UI_TEXT.pleaseEnterInfo}
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-base font-semibold text-slate-700 mb-2">{UI_TEXT.nameLabel}</label>
                <input type="text" name="name" id="name" value={name} onChange={e => setName(e.target.value)} required 
                       className={getFieldClasses('name')} />
              </div>
              <div>
                <label htmlFor="age" className="block text-base font-semibold text-slate-700 mb-2">{UI_TEXT.ageLabel}</label>
                <input type="number" name="age" id="age" value={age} onChange={e => setAge(e.target.value)} required
                       className={getFieldClasses('age')} />
              </div>
              <div>
                <label htmlFor="gender" className="block text-base font-semibold text-slate-700 mb-2">{UI_TEXT.genderLabel}</label>
                <select name="gender" id="gender" value={gender} onChange={e => setGender(e.target.value)} required
                        className={`${getFieldClasses('gender')} appearance-none`}>
                  <option value="">{UI_TEXT.selectGender}</option>
                  <option value="female">{UI_TEXT.female}</option>
                  <option value="male">{UI_TEXT.male}</option>
                </select>
              </div>
              
              <div>
                <FileUpload
                  onFileSelect={handleImageSelect}
                  label={UI_TEXT.photoUpload} 
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
                  {UI_TEXT.pleaseSubmit}
                </p>
              )}

              {error && (
                <div className="space-y-3">
                  <p className="text-lg text-red-600 bg-red-100 p-4 rounded-lg border border-red-300">{error}</p>
                  
                  {/* Debug info only shows when there's an error */}
                  {debugInfo.length > 0 && (
                    <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                      <p className="text-sm font-semibold text-gray-700 mb-2">오류 상세 정보:</p>
                      {debugInfo.map((info, index) => (
                        <p key={index} className="text-xs text-gray-600 mb-1">{info}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <p className="text-center text-slate-500 text-sm mt-4">
                {UI_TEXT.submitConsent}
              </p>
              <div className="mt-8 flex justify-center">
                <Button type="submit" variant="primary" size="lg" disabled={!name.trim() || !age.trim() || !gender || !imageFile || !audioBlob || isLoading}>
                  {isLoading ? UI_TEXT.submitting : UI_TEXT.submitButton}
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
