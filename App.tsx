import React, { useState, useCallback, useEffect } from 'react';
import { Page, UserData } from './types.ts';
import { PLACEHOLDER_USER_IMAGE } from './constants.tsx';
import * as apiService from './services/apiService.ts';

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
import DeepfakeIntroductionPage from './pages/DeepfakeIntroductionPage.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';

// LoadingSpinner and PageLayout are components, not pages for lazy loading in this context

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.Landing);
  const [userData, setUserDataState] = useState<UserData | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [userImageUrl, setUserImageUrlState] = useState<string | null>(PLACEHOLDER_USER_IMAGE);
  const [userAudioBlob, setUserAudioBlobState] = useState<Blob | null>(null);
  const [voiceId, setVoiceIdState] = useState<string | null>(null);
  const [caricatureUrl, setCaricatureUrlState] = useState<string | null>(null);
  const [talkingPhotoUrl, setTalkingPhotoUrlState] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [navigationHistory, setNavigationHistory] = useState<Page[]>([]);

  const [module1Completed, setModule1Completed] = useState(false);
  const [module2Completed, setModule2Completed] = useState(false);
  const [isLoadingProgress, setIsLoadingProgress] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Load progress from localStorage on app start
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      console.log(`Found saved user ID: ${savedUserId}. Loading progress...`);
      loadUserProgress(Number(savedUserId));
    } else {
      console.log("No saved user ID found. Starting fresh.");
      setIsLoadingProgress(false);
      setIsInitialLoad(false);
    }
  }, []);

  const loadUserProgress = async (userIdParam: number) => {
    try {
      const user = await apiService.getUserProgress(userIdParam);
      
      console.log('User progress loaded successfully:', user);

      // Set user ID first
      setUserId(userIdParam);

      // Restore all user data and progress
      if (user.name) {
        setUserDataState({ name: user.name, age: user.age, gender: user.gender, userId: user.id.toString() });
      }
      if (user.image_url) setUserImageUrlState(user.image_url);
      if (user.voice_id) setVoiceIdState(user.voice_id);
      if (user.caricature_url) setCaricatureUrlState(user.caricature_url);
      if (user.talking_photo_url) setTalkingPhotoUrlState(user.talking_photo_url);
      
      if (user.current_page) {
        const pageEnum = Page[user.current_page as keyof typeof Page];
        if (pageEnum !== undefined) {
          console.log(`Restoring page to: ${user.current_page} (${pageEnum})`);
          setCurrentPage(pageEnum);
        } else {
          console.warn(`Saved page "${user.current_page}" is not a valid page. Defaulting to Landing.`);
          setCurrentPage(Page.Landing);
        }
      } else {
         // If no page is saved, but user exists, they should be on the first page after onboarding
         setCurrentPage(Page.CaricatureGeneration);
      }

      if (user.current_step !== undefined) setCurrentStep(user.current_step);
      if (user.completed_modules && Array.isArray(user.completed_modules)) {
        setModule1Completed(user.completed_modules.includes('module1'));
        setModule2Completed(user.completed_modules.includes('module2'));
      }
      
    } catch (error) {
      console.error('Failed to load user progress:', error);
      // Clear invalid user ID and start fresh
      localStorage.removeItem('userId');
      setUserId(null);
      setCurrentPage(Page.Landing);
    } finally {
      setIsLoadingProgress(false);
      setIsInitialLoad(false);
    }
  };

  const saveUserProgress = useCallback(async (updates: {
    currentPage?: Page;
    currentStep?: number;
    caricatureUrl?: string;
    talkingPhotoUrl?: string;
    completedModules?: string[];
  }) => {
    if (!userId || isInitialLoad) return;
    
    try {
      const progressUpdate: any = {
        user_id: userId // Required by the schema
      };
      
      if (updates.currentPage !== undefined) {
        progressUpdate.current_page = Page[updates.currentPage];
      }
      if (updates.currentStep !== undefined) {
        progressUpdate.current_step = updates.currentStep;
      }
      if (updates.caricatureUrl !== undefined) {
        progressUpdate.caricature_url = updates.caricatureUrl;
      }
      if (updates.talkingPhotoUrl !== undefined) {
        progressUpdate.talking_photo_url = updates.talkingPhotoUrl;
      }
      if (updates.completedModules !== undefined) {
        progressUpdate.completed_modules = updates.completedModules;
      }
      
      await apiService.updateUserProgress(userId, progressUpdate);
      console.log('User progress saved successfully');
    } catch (error) {
      console.error('Failed to save user progress:', error);
    }
  }, [userId, isInitialLoad]);
  

  const setCurrentPageOptimized = useCallback((page: Page) => {
    console.log("Navigating to page:", Page[page]);
    
    // Add current page to history before navigating (unless it's the same page)
    if (page !== currentPage) {
      setNavigationHistory(prev => [...prev, currentPage]);
    }
    
    if (page === Page.ModuleSelection && module1Completed && module2Completed) {
        setCurrentPage(Page.Completion);
        setCurrentStep(0); // Reset step for new page
        if (userId) {
          saveUserProgress({ currentPage: Page.Completion, currentStep: 0 });
        }
        return;
    }
    setCurrentPage(page);
    setCurrentStep(0); // Reset step for new page
    if (userId) {
      saveUserProgress({ currentPage: page, currentStep: 0 });
    }
  }, [currentPage, module1Completed, module2Completed, userId, saveUserProgress]);

  const goBack = useCallback(() => {
    if (navigationHistory.length > 0) {
      const previousPage = navigationHistory[navigationHistory.length - 1];
      console.log("Going back to page:", Page[previousPage]);
      
      // Remove the last page from history
      setNavigationHistory(prev => prev.slice(0, -1));
      
      // Navigate to previous page
      setCurrentPage(previousPage);
      setCurrentStep(0); // Reset step when going back
      
      if (userId) {
        saveUserProgress({ currentPage: previousPage, currentStep: 0 });
      }
    }
  }, [navigationHistory, userId, saveUserProgress]);

  const canGoBack = navigationHistory.length > 0;

  const setCurrentStepOptimized = useCallback((step: number) => {
    console.log("Setting current step:", step);
    setCurrentStep(step);
    if (userId) {
      saveUserProgress({ currentStep: step });
    }
  }, [userId, saveUserProgress]);

  const setUserData = useCallback((data: UserData | any) => {
    console.log("Setting user data:", data);
    
    // If this is called from saveUserInfo API, the data will have userId and success
    if (data && data.userId && data.success) {
      const userIdFromData = Number(data.userId);
      setUserId(userIdFromData);
      setUserDataState(data); // Also save the user's name, age, gender
      localStorage.setItem('userId', userIdFromData.toString());
      console.log("User ID saved:", userIdFromData);
    } else {
      // Regular user data update (name, age, gender)
      setUserDataState(data);
    }
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
    if (userId) {
      saveUserProgress({ caricatureUrl: url });
    }
  }, [userId, saveUserProgress]);


  const setTalkingPhotoUrl = useCallback((url: string) => {
    console.log("Setting talking photo URL:", url);
    setTalkingPhotoUrlState(url);
    if (userId) {
      saveUserProgress({ talkingPhotoUrl: url });
    }
  }, [userId, saveUserProgress]);

  const handleCompleteModule1 = useCallback(() => {
    setModule1Completed(true);
    if (userId) {
      const completedModules = ['module1'];
      if (module2Completed) completedModules.push('module2');
      saveUserProgress({ completedModules });
    }
  }, [module2Completed, userId, saveUserProgress]);

  const handleCompleteModule2 = useCallback(() => {
    setModule2Completed(true);
    if (userId) {
      const completedModules = ['module2'];
      if (module1Completed) completedModules.push('module1');
      saveUserProgress({ completedModules });
    }
  }, [module1Completed, userId, saveUserProgress]);

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
                  caricatureUrl={caricatureUrl}
                  setCaricatureUrl={setCaricatureUrl}
                  onGoBack={goBack}
                  canGoBack={canGoBack}
                />;
      case Page.TalkingPhotoGeneration:
        return <TalkingPhotoGenerationPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  caricatureUrl={caricatureUrl} 
                  voiceId={voiceId}
                  userData={userData}
                  setTalkingPhotoUrl={setTalkingPhotoUrl}
                />;
      case Page.DeepfakeIntroduction:
        return <DeepfakeIntroductionPage 
                  setCurrentPage={setCurrentPageOptimized}
                  userData={userData}
                  caricatureUrl={caricatureUrl}
                  voiceId={voiceId}
                  talkingPhotoUrl={talkingPhotoUrl}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStepOptimized}
                  onGoBack={goBack}
                  canGoBack={canGoBack}
                />;
      case Page.IntroductionEducation: // Now comes after personalization
        return <IntroductionEducationPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  userData={userData}
                  caricatureUrl={caricatureUrl}
                  voiceId={voiceId}
                  talkingPhotoUrl={talkingPhotoUrl}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStepOptimized}
                  onGoBack={goBack}
                  canGoBack={canGoBack}
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
                  talkingPhotoUrl={talkingPhotoUrl}
                  voiceId={voiceId}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStepOptimized}
                  onGoBack={goBack}
                  canGoBack={canGoBack}
                />;
      case Page.IdentityTheftModule:
        return <IdentityTheftModulePage 
                  setCurrentPage={setCurrentPageOptimized} 
                  onModuleComplete={handleCompleteModule2}
                  userData={userData}
                  userImageUrl={userImageUrl}
                  caricatureUrl={caricatureUrl}
                  talkingPhotoUrl={talkingPhotoUrl}
                  voiceId={voiceId}
                  currentStep={currentStep}
                  setCurrentStep={setCurrentStepOptimized}
                  onGoBack={goBack}
                  canGoBack={canGoBack}
                />;
      case Page.Completion:
        return <CompletionPage setCurrentPage={setCurrentPageOptimized} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPageOptimized} />;
    }
  };

  // Show a full-screen loading spinner until the initial check is complete
  if (isLoadingProgress) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner text="사용자 진행 상황을 불러오는 중..." />
        </div>
      </div>
    );
  }

  return (
      renderPage()
  );
};

export default App;
