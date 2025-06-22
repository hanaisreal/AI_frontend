import React, { useEffect } from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import PageLayout from '../components/PageLayout.tsx';
import { SCRIPTS, NARRATOR_VOICE_ID } from '../constants.tsx';
import { Page } from '../types.ts';
import * as apiService from '../services/apiService.ts';

interface LandingPageProps {
  setCurrentPage: (page: Page) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setCurrentPage }) => {
  
  // Pre-cache the onboarding welcome narration when landing page loads
  useEffect(() => {
    const preCacheOnboardingNarration = async () => {
      try {
        console.log('🚀 Pre-caching onboarding welcome narration...');
        
        // Generate the first onboarding narration using Jenny's voice
        const result = await apiService.generateNarration(SCRIPTS.onboardingWelcome, NARRATOR_VOICE_ID);
        
        // Create audio blob and cache it
        const scriptKey = `${SCRIPTS.onboardingWelcome}-${NARRATOR_VOICE_ID}`;
        const audioBlob = new Blob([Uint8Array.from(atob(result.audioData), c => c.charCodeAt(0))], { type: result.audioType });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Initialize global cache if it doesn't exist
        (window as any).narrationCache = (window as any).narrationCache || new Map();
        (window as any).narrationCache.set(scriptKey, audioUrl);
        
        console.log('✅ Pre-cached onboarding welcome narration');
        console.log(`  - Cache key: ${scriptKey.substring(0, 50)}...`);
      } catch (error) {
        console.error('⚠️ Pre-cache failed for onboarding narration:', error);
        // Pre-cache failure is non-critical, continue normally
      }
    };
    
    // Start pre-caching after a short delay to not block the landing page render
    setTimeout(preCacheOnboardingNarration, 1000);
  }, []);

  return (
    <PageLayout>
      <Card>
        <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-orange-500 mx-auto mb-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          <p className="text-xl md:text-2xl text-slate-700 mb-10 leading-relaxed">{SCRIPTS.welcome}</p>
          <div className="flex justify-center">
            <Button onClick={() => setCurrentPage(Page.UserOnboarding)} size="lg" variant="primary">
              시작하기
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 ml-2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Button>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
};

export default LandingPage;
