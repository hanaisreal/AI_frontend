
import React, { useState, useCallback } from 'react';
import { Page, UserData } from './types.ts';
import { MOCK_CARICATURE_URL, MOCK_TALKING_PHOTO_URL, MOCK_VOICE_ID, PLACEHOLDER_USER_IMAGE } from './constants.tsx';

// Static imports for pages
import LandingPage from './pages/LandingPage.tsx';
import IntroductionEducationPage from './pages/IntroductionEducationPage.tsx';
import UserOnboardingPage from './pages/UserOnboardingPage.tsx';
import CaricatureGenerationPage from './pages/CaricatureGenerationPage.tsx';
import TalkingPhotoGenerationPage from './pages/TalkingPhotoGenerationPage.tsx';
import ModuleSelectionPage from './pages/ModuleSelectionPage.tsx';
import FakeNewsModulePage from './pages/FakeNewsModulePage.tsx';
import IdentityTheftModulePage from './pages/IdentityTheftModulePage.tsx';
import CompletionPage from './pages/CompletionPage.tsx';

// LoadingSpinner and PageLayout are components, not pages for lazy loading in this context

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [userImageUrl, setUserImageUrlState] = useState<string | null>(PLACEHOLDER_USER_IMAGE);
  const [userAudioBlob, setUserAudioBlobState] = useState<Blob | null>(null);
  const [voiceId, setVoiceIdState] = useState<string | null>(null);
  const [caricatureUrl, setCaricatureUrlState] = useState<string | null>(null);
  const [talkingPhotoUrl, setTalkingPhotoUrlState] = useState<string | null>(null);

  const [module1Completed, setModule1Completed] = useState(false);
  const [module2Completed, setModule2Completed] = useState(false);
  
  // This check can still be useful for other potential logic, even if not for Intro page nav
  // const isUserOnboarded = !!(userData && userImageUrl && userImageUrl !== PLACEHOLDER_USER_IMAGE && voiceId && caricatureUrl && talkingPhotoUrl);

  const setCurrentPageOptimized = useCallback((page: Page) => {
    console.log("Navigating to page:", Page[page]);
    if (page === Page.ModuleSelection && module1Completed && module2Completed) {
        setCurrentPage(Page.Completion);
        return;
    }
    setCurrentPage(page);
  }, [module1Completed, module2Completed]);

  const setUserData = useCallback((data: UserData) => {
    console.log("Setting user data:", data);
    setUserDataState(data);
  }, []);

  const setUserImageUrl = useCallback((url: string) => {
    console.log("Setting user image URL:", url);
    setUserImageUrlState(url);
  }, []);

  const setUserAudioBlob = useCallback((blob: Blob) => {
    console.log("Setting user audio blob, size:", blob.size);
    setUserAudioBlobState(blob);
  }, []);
  
  const setVoiceId = useCallback((id: string) => {
    console.log("Setting voice ID:", id);
    setVoiceIdState(id);
  }, []);

  const setCaricatureUrl = useCallback((url: string) => {
    console.log("Setting caricature URL:", url);
    setCaricatureUrlState(url);
  }, []);

  const setTalkingPhotoUrl = useCallback((url: string) => {
    console.log("Setting talking photo URL:", url);
    setTalkingPhotoUrlState(url);
  }, []);

  const handleCompleteModule1 = useCallback(() => {
    setModule1Completed(true);
  }, []);

  const handleCompleteModule2 = useCallback(() => {
    setModule2Completed(true);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case Page.Landing:
        return <LandingPage setCurrentPage={setCurrentPageOptimized} />;
      case Page.UserOnboarding: // Moved up effectively by LandingPage navigation change
        return <UserOnboardingPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  setUserData={setUserData}
                  setUserImageUrl={setUserImageUrl}
                  setUserAudioBlob={setUserAudioBlob}
                  setVoiceId={setVoiceId}
                />;
      case Page.CaricatureGeneration:
        return <CaricatureGenerationPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  userImageUrl={userImageUrl} 
                  setCaricatureUrl={setCaricatureUrl} 
                />;
      case Page.TalkingPhotoGeneration:
        return <TalkingPhotoGenerationPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  caricatureUrl={caricatureUrl} 
                  voiceId={voiceId}
                  userData={userData}
                  setTalkingPhotoUrl={setTalkingPhotoUrl}
                />;
      case Page.IntroductionEducation: // Now comes after personalization
        return <IntroductionEducationPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  userData={userData}
                  caricatureUrl={caricatureUrl}
                  voiceId={voiceId}
                  talkingPhotoUrl={talkingPhotoUrl}
                />;
      case Page.ModuleSelection:
        return <ModuleSelectionPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  module1Completed={module1Completed} 
                  module2Completed={module2Completed} 
                />;
      case Page.FakeNewsModule:
        return <FakeNewsModulePage 
                  setCurrentPage={setCurrentPageOptimized} 
                  onModuleComplete={handleCompleteModule1}
                  userData={userData}
                  userImageUrl={userImageUrl}
                  caricatureUrl={caricatureUrl}
                  voiceId={voiceId}
                />;
      case Page.IdentityTheftModule:
        return <IdentityTheftModulePage 
                  setCurrentPage={setCurrentPageOptimized} 
                  onModuleComplete={handleCompleteModule2}
                  userData={userData}
                  userImageUrl={userImageUrl}
                  caricatureUrl={caricatureUrl}
                  voiceId={voiceId}
                />;
      case Page.Completion:
        return <CompletionPage setCurrentPage={setCurrentPageOptimized} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPageOptimized} />;
    }
  };

  return (
      renderPage()
  );
};

export default App;
