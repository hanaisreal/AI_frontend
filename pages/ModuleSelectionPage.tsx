
import React, { useEffect, useRef, useState } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import PageLayout from '../components/PageLayout.tsx';
import { SCRIPTS, NARRATOR_VOICE_ID, FAKE_NEWS_MODULE_STEPS, IDENTITY_THEFT_MODULE_STEPS } from '../constants.tsx';
import { Page, UserData } from '../types.ts';
import * as apiService from '../services/apiService.ts';

interface ModuleSelectionPageProps {
  setCurrentPage: (page: Page) => void;
  module1Completed: boolean;
  module2Completed: boolean;
  userData: UserData | null;
  voiceId: string | null;
}

const ModuleSelectionPage: React.FC<ModuleSelectionPageProps> = ({
  setCurrentPage,
  module1Completed,
  module2Completed,
  userData,
  voiceId,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioEnded, setAudioEnded] = useState(false);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);

  // Play background narration when component mounts
  useEffect(() => {
    const playBackgroundNarration = async () => {
      try {
        // Check if already cached (using user's voice)
        const scriptKey = `${SCRIPTS.moduleSelection}-${voiceId}`;
        const existingCache = (window as any).narrationCache?.get(scriptKey);
        
        if (existingCache) {
          // Use cached audio
          console.log('🎵 Using cached module selection narration');
          if (audioRef.current) {
            audioRef.current.src = existingCache;
            audioRef.current.onplay = () => setIsAudioPlaying(true);
            audioRef.current.onended = () => {
              setIsAudioPlaying(false);
              setAudioEnded(true);
            };
            audioRef.current.onloadeddata = () => setAudioLoaded(true);
            
            // Try to play with autoplay detection
            audioRef.current.play().catch((error) => {
              console.warn('🚫 Autoplay blocked:', error);
              setAutoplayBlocked(true);
              setAudioLoaded(true);
            });
          }
        } else {
          // Generate new audio with user's voice
          console.log('🎵 Generating module selection narration with user voice');
          const result = await apiService.generateNarration(SCRIPTS.moduleSelection, voiceId);
          
          // Create audio blob and URL
          const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
          const audioUrl = URL.createObjectURL(audioBlob);
          
          // Cache the audio
          if (!(window as any).narrationCache) {
            (window as any).narrationCache = new Map();
          }
          (window as any).narrationCache.set(scriptKey, audioUrl);
          
          // Play the audio
          if (audioRef.current) {
            audioRef.current.src = audioUrl;
            audioRef.current.onplay = () => setIsAudioPlaying(true);
            audioRef.current.onended = () => {
              setIsAudioPlaying(false);
              setAudioEnded(true);
            };
            audioRef.current.onloadeddata = () => setAudioLoaded(true);
            
            // Try to play with autoplay detection
            audioRef.current.play().catch((error) => {
              console.warn('🚫 Autoplay blocked:', error);
              setAutoplayBlocked(true);
              setAudioLoaded(true);
            });
          }
        }
      } catch (error) {
        console.error('Failed to play module selection narration:', error);
        setAudioLoaded(true);
        setAutoplayBlocked(true);
      }
    };

    // Add a safety timeout to prevent infinite waiting
    const safetyTimeout = setTimeout(() => {
      if (!audioEnded && !isAudioPlaying) {
        console.warn('⏰ Audio safety timeout - enabling buttons');
        setAudioLoaded(true);
        setAutoplayBlocked(true);
      }
    }, 5000); // 5 seconds timeout

    // Pre-cache first narrations of both modules
    const preCacheModuleNarrations = async () => {
      try {
        // Wait a moment for the module selection narration to start
        await new Promise(resolve => setTimeout(resolve, 5000));
        
        console.log('🎵 Pre-caching first narrations of both modules');
        
        // Get first scripts from both modules
        const fakeNewsFirstScript = FAKE_NEWS_MODULE_STEPS[0]?.narrationScript;
        const identityTheftFirstScript = IDENTITY_THEFT_MODULE_STEPS[0]?.narrationScript;
        
        // Initialize cache if needed
        if (!(window as any).narrationCache) {
          (window as any).narrationCache = new Map();
        }
        
        // Pre-cache fake news module first narration (using user's voice)
        if (fakeNewsFirstScript && voiceId) {
          const fakeNewsScriptKey = `${fakeNewsFirstScript}-${voiceId}`;
          const existingFakeNewsCache = (window as any).narrationCache.get(fakeNewsScriptKey);
          
          if (!existingFakeNewsCache) {
            console.log('🎵 Generating fake news module first narration');
            try {
              const fakeNewsResult = await apiService.generateNarration(fakeNewsFirstScript, voiceId);
              const fakeNewsBlob = new Blob([Uint8Array.from(atob(fakeNewsResult.audioData), c => c.charCodeAt(0))], { type: fakeNewsResult.audioType });
              const fakeNewsUrl = URL.createObjectURL(fakeNewsBlob);
              (window as any).narrationCache.set(fakeNewsScriptKey, fakeNewsUrl);
              console.log('✅ Fake news module first narration cached');
            } catch (error) {
              console.error('⚠️ Failed to cache fake news narration:', error);
            }
          } else {
            console.log('🎵 Fake news module first narration already cached');
          }
        }
        
        // Pre-cache identity theft module first narration (using user's voice)
        if (identityTheftFirstScript && voiceId) {
          const identityScriptKey = `${identityTheftFirstScript}-${voiceId}`;
          const existingIdentityCache = (window as any).narrationCache.get(identityScriptKey);
          
          if (!existingIdentityCache) {
            console.log('🎵 Generating identity theft module first narration');
            try {
              const identityResult = await apiService.generateNarration(identityTheftFirstScript, voiceId);
              const identityBlob = new Blob([Uint8Array.from(atob(identityResult.audioData), c => c.charCodeAt(0))], { type: identityResult.audioType });
              const identityUrl = URL.createObjectURL(identityBlob);
              (window as any).narrationCache.set(identityScriptKey, identityUrl);
              console.log('✅ Identity theft module first narration cached');
            } catch (error) {
              console.error('⚠️ Failed to cache identity theft narration:', error);
            }
          } else {
            console.log('🎵 Identity theft module first narration already cached');
          }
        }
        
        console.log('✅ Module narration pre-caching setup complete');
      } catch (error) {
        console.error('⚠️ Failed to pre-cache module narrations:', error);
      }
    };

    playBackgroundNarration();
    preCacheModuleNarrations();

    // Cleanup function
    return () => {
      clearTimeout(safetyTimeout);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);
  if (module1Completed && module2Completed) {
    return (
      <PageLayout title="모든 모듈 완료!">
        <Card>
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-green-500 mx-auto mb-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">{SCRIPTS.allModulesComplete}</p>
            <Button onClick={() => setCurrentPage(Page.Landing)} variant="primary" size="lg">
              시작으로 돌아가기
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="딥페이크가 어떻게 악용될까?">
      {/* Hidden audio element for background narration */}
      <audio ref={audioRef} hidden />
      
      <Card>
        {/* Audio indicator and manual controls */}
        <div className={`mb-8 text-center transition-all duration-500 ${
          isAudioPlaying || audioEnded || autoplayBlocked ? 'opacity-100 transform translate-y-0' : 
          'opacity-0 transform translate-y-2'
        }`}>
          {autoplayBlocked && !audioEnded ? (
            <div className="space-y-3">
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.play().then(() => {
                      setAutoplayBlocked(false);
                      setIsAudioPlaying(true);
                    }).catch(console.error);
                  }
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🎵 오디오 재생하기
              </button>
              <div className="text-sm text-gray-600">또는 아래 버튼을 바로 선택하셔도 됩니다</div>
            </div>
          ) : (
            <p className={`text-orange-600 text-lg font-semibold ${
              isAudioPlaying ? 'animate-pulse' : ''
            }`}>📚 학습하고 싶은 주제를 선택해주세요</p>
          )}
        </div>
        
        {/* Skip audio option when it's playing but user wants to proceed */}
        {isAudioPlaying && (
          <div className="mb-6 text-center">
            <button
              onClick={() => {
                setAudioEnded(true);
                setIsAudioPlaying(false);
                if (audioRef.current) {
                  audioRef.current.pause();
                }
              }}
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              ⏭️ 오디오 건너뛰기
            </button>
          </div>
        )}
        
        <div className="space-y-6">
          <Button
            onClick={() => setCurrentPage(Page.FakeNewsModule)}
            disabled={module1Completed || (!audioEnded && !autoplayBlocked && audioLoaded)}
            fullWidth
            size="lg"
            variant={module1Completed ? "secondary" : "primary"}
            className="!p-0"
          >
            <div className={`w-full flex items-center justify-between p-5 rounded-lg ${module1Completed ? "bg-slate-200 text-slate-600" : ""}`}>
              <div className="text-left">
                  <h3 className={`text-xl font-semibold ${module1Completed ? "text-slate-700" : "text-white"}`}>가짜 뉴스</h3>
                  <p className={`text-sm mt-1 ${module1Completed ? "text-slate-500" : "opacity-80 text-white"}`}>조작된 영상에 속는 위험성 이해하기.</p>
              </div>
              {module1Completed ? (
                   <span className="text-green-600 font-semibold ml-4 text-lg whitespace-nowrap">✓ 완료됨</span>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 ml-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
              )}
            </div>
          </Button>
          
          <Button
            onClick={() => setCurrentPage(Page.IdentityTheftModule)}
            disabled={module2Completed || (!audioEnded && !autoplayBlocked && audioLoaded)}
            fullWidth
            size="lg"
            variant={module2Completed ? "secondary" : "primary"}
             className="!p-0"
          >
            <div className={`w-full flex items-center justify-between p-5 rounded-lg ${module2Completed ? "bg-slate-200 text-slate-600" : ""}`}>
              <div className="text-left">
                  <h3 className={`text-xl font-semibold ${module2Completed ? "text-slate-700" : "text-white"}`}>신원 도용</h3>
                  <p className={`text-sm mt-1 ${module2Completed ? "text-slate-500" : "opacity-80 text-white"}`}>음성 복제의 위험성 이해하기.</p>
              </div>
              {module2Completed ? (
                  <span className="text-green-600 font-semibold ml-4 text-lg whitespace-nowrap">✓ 완료됨</span>
              ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 ml-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
              )}
            </div>
          </Button>
        </div>
      </Card>
    </PageLayout>
  );
};

export default ModuleSelectionPage;
