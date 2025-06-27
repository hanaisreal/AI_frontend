import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Page, UserData } from './types.ts';
import { PLACEHOLDER_USER_IMAGE } from './constants.tsx';
import * as apiService from './services/apiService.ts';

// Static imports for pages
import LandingPage from './pages/LandingPage.tsx';
import UserOnboardingPage from './pages/UserOnboardingPage.tsx';
import CaricatureGenerationIntroPage from './pages/CaricatureGenerationIntroPage.tsx';
import CaricatureGenerationPage from './pages/CaricatureGenerationPage.tsx';
import TalkingPhotoGenerationIntroPage from './pages/TalkingPhotoGenerationIntroPage.tsx';
import TalkingPhotoGenerationPage from './pages/TalkingPhotoGenerationPage.tsx';
import ModuleSelectionPage from './pages/ModuleSelectionPage.tsx';
import FakeNewsModulePage from './pages/FakeNewsModulePage.tsx';
import IdentityTheftModulePage from './pages/IdentityTheftModulePage.tsx';
import CompletionPage from './pages/CompletionPage.tsx';
import DeepfakeIntroductionPage from './pages/DeepfakeIntroductionPage.tsx';


// LoadingSpinner and PageLayout are components, not pages for lazy loading in this context

const App: React.FC = () => {
  // All hooks must be declared at the top level - never inside try/catch or conditionals
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
  const [error, setError] = useState<string | null>(null);
  
  // useRef hooks for debouncing must also be at top level
  const lastSaveRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Define loadUserProgress BEFORE any useEffect that calls it
  const loadUserProgress = useCallback(async (userIdParam: number) => {
    try {
      setIsLoadingProgress(true);
      const user = await apiService.getUserProgress(userIdParam);
      
      if (!user || !user.name) {
        localStorage.removeItem('userId');
        setUserId(null);
        setCurrentPage(Page.Landing);
        setUserDataState(null);
        setUserImageUrlState(PLACEHOLDER_USER_IMAGE);
        setVoiceIdState(null);
        setCaricatureUrlState(null);
        setTalkingPhotoUrlState(null);
        setIsLoadingProgress(false);
        setIsInitialLoad(false);
        return;
      }


      // Set user ID first
      setUserId(userIdParam);

      // Restore all user data and progress
      const userData = { 
        name: user.name, 
        age: user.age, 
        gender: user.gender, 
        userId: user.id.toString(),
        // Include scenario URLs from database
        lottery_video_url: user.lottery_video_url,
        crime_video_url: user.crime_video_url,
        lottery_faceswap_url: user.lottery_faceswap_url,
        crime_faceswap_url: user.crime_faceswap_url,
        investment_call_audio_url: user.investment_call_audio_url,
        accident_call_audio_url: user.accident_call_audio_url
      };
      setUserDataState(userData);
      
      if (user.image_url) {
        setUserImageUrlState(user.image_url);
      }
      if (user.voice_id) {
        setVoiceIdState(user.voice_id);
      }
      if (user.caricature_url) {
        setCaricatureUrlState(user.caricature_url);
      }
      if (user.talking_photo_url) {
        setTalkingPhotoUrlState(user.talking_photo_url);
      }
      
      // Enhanced page restoration logic with explicit mapping
      if (user.current_page) {
        let pageEnum: Page | undefined;
        
        // Create explicit page name mapping to handle all cases
        const pageNameToEnum: Record<string, Page> = {
          'Landing': Page.Landing,
          'UserOnboarding': Page.UserOnboarding,
          'CaricatureGenerationIntro': Page.CaricatureGenerationIntro,
          'CaricatureGeneration': Page.CaricatureGeneration,
          'TalkingPhotoGenerationIntro': Page.TalkingPhotoGenerationIntro,
          'TalkingPhotoGeneration': Page.TalkingPhotoGeneration,
          'DeepfakeIntroduction': Page.DeepfakeIntroduction,
          'ModuleSelection': Page.ModuleSelection,
          'FakeNewsModule': Page.FakeNewsModule,
          'IdentityTheftModule': Page.IdentityTheftModule,
          'Completion': Page.Completion
        };
        
        // Try direct mapping first (with trimming)
        if (typeof user.current_page === 'string') {
          const trimmedPageName = user.current_page.trim();
          if (pageNameToEnum[trimmedPageName]) {
            pageEnum = pageNameToEnum[trimmedPageName];
          }
          // Try case-insensitive mapping if direct mapping fails
          else {
            const lowerPageName = trimmedPageName.toLowerCase();
            const matchedKey = Object.keys(pageNameToEnum).find(key => key.toLowerCase() === lowerPageName);
            if (matchedKey) {
              pageEnum = pageNameToEnum[matchedKey];
            }
          }
        }
        // Try numeric value if it's a number
        else if (typeof user.current_page === 'number') {
          pageEnum = user.current_page as Page;
        }
        
        if (pageEnum !== undefined && pageEnum >= 0 && pageEnum <= 10) {
          setCurrentPage(pageEnum);
        } else {
          setCurrentPage(Page.ModuleSelection);
        }
      } else {
         setCurrentPage(Page.ModuleSelection);
      }

      if (user.current_step !== undefined) {
        setCurrentStep(user.current_step);
      } else {
        setCurrentStep(0);
      }
      if (user.completed_modules && Array.isArray(user.completed_modules)) {
        setModule1Completed(user.completed_modules.includes('module1'));
        setModule2Completed(user.completed_modules.includes('module2'));
      }
      
    } catch (error) {
      // Clear invalid user ID and start fresh
      localStorage.removeItem('userId');
      setUserId(null);
      setCurrentPage(Page.Landing);
      setUserDataState(null);
      setUserImageUrlState(PLACEHOLDER_USER_IMAGE);
      setVoiceIdState(null);
      setCaricatureUrlState(null);
      setTalkingPhotoUrlState(null);
    } finally {
      setIsLoadingProgress(false);
      setIsInitialLoad(false);
    }
  }, []); // No dependencies needed since this function doesn't depend on state

  const saveUserProgress = useCallback(async (updates: {
    currentPage?: Page;
    currentStep?: number;
    caricatureUrl?: string;
    talkingPhotoUrl?: string;
    completedModules?: string[];
  }) => {
    if (!userId || isInitialLoad) return;
    
    // Create a key to identify unique save operations
    const saveKey = JSON.stringify({ userId, ...updates });
    if (lastSaveRef.current === saveKey) {
      return;
    }
    
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    // Debounce the save operation
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const progressUpdate: any = {};
        
        if (updates.currentPage !== undefined) {
          progressUpdate.currentPage = Page[updates.currentPage];
        }
        if (updates.currentStep !== undefined) {
          progressUpdate.currentStep = updates.currentStep;
        }
        if (updates.caricatureUrl !== undefined) {
          progressUpdate.caricatureUrl = updates.caricatureUrl;
        }
        if (updates.talkingPhotoUrl !== undefined) {
          progressUpdate.talkingPhotoUrl = updates.talkingPhotoUrl;
        }
        if (updates.completedModules !== undefined) {
          progressUpdate.completedModules = updates.completedModules;
        }
        
        lastSaveRef.current = saveKey;
        await apiService.updateUserProgress(userId, progressUpdate);
      } catch (error) {
        lastSaveRef.current = ''; // Reset on error to allow retry
      }
    }, 500); // 500ms debounce
  }, [userId, isInitialLoad]);

  const setCurrentPageOptimized = useCallback((page: Page) => {
    
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

  // Helper function to clear all user data and start fresh
  const clearAllDataAndStartFresh = useCallback(() => {
    localStorage.removeItem('userId');
    setUserId(null);
    setCurrentPage(Page.Landing);
    setUserDataState(null);
    setUserImageUrlState(PLACEHOLDER_USER_IMAGE);
    setVoiceIdState(null);
    setCaricatureUrlState(null);
    setTalkingPhotoUrlState(null);
    setCurrentStep(0);
    setModule1Completed(false);
    setModule2Completed(false);
    setNavigationHistory([]);
    setIsLoadingProgress(false);
    setIsInitialLoad(false);
    setError(null);
  }, []);

  const setCurrentStepOptimized = useCallback((step: number) => {
    setCurrentStep(step);
    if (userId) {
      saveUserProgress({ currentStep: step });
    }
  }, [userId, saveUserProgress]);

  const setUserData = useCallback((data: UserData | any) => {
    
    // If this is called from saveUserInfo API, the data will have userId and success
    if (data && data.userId && data.success) {
      const userIdFromData = Number(data.userId);
      setUserId(userIdFromData);
      setUserDataState(data); // Also save the user's name, age, gender
      localStorage.setItem('userId', userIdFromData.toString());
    } else {
      // Regular user data update (name, age, gender)
      setUserDataState(data);
    }
  }, []);

  const setUserImageUrl = useCallback((url: string) => {
    setUserImageUrlState(url);
  }, []);

  const setUserAudioBlob = useCallback((blob: Blob) => {
    setUserAudioBlobState(blob);
  }, []);
  
  const setVoiceId = useCallback((id: string) => {
    setVoiceIdState(id);
  }, []);

  const setCaricatureUrl = useCallback((url: string) => {
    setCaricatureUrlState(url);
    if (userId) {
      saveUserProgress({ caricatureUrl: url });
    }
  }, [userId, saveUserProgress]);

  const setTalkingPhotoUrl = useCallback((url: string) => {
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

  // Function to refresh userData from the API to get updated scenario URLs
  const refreshUserData = useCallback(async () => {
    if (!userId) {
      return;
    }
    
    try {
      const user = await apiService.getUserProgress(userId);
      
      if (!user || !user.name) {
        return;
      }
      
      // Update userData with scenario URLs from database
      const updatedUserData = {
        name: user.name,
        age: user.age,
        gender: user.gender,
        userId: user.id.toString(),
        // Include scenario URLs from database
        lottery_video_url: user.lottery_video_url,
        crime_video_url: user.crime_video_url,
        lottery_faceswap_url: user.lottery_faceswap_url,
        crime_faceswap_url: user.crime_faceswap_url,
        investment_call_audio_url: user.investment_call_audio_url,
        accident_call_audio_url: user.accident_call_audio_url,
        pre_generation_status: user.pre_generation_status
      };
      
      
      setUserDataState(updatedUserData);
      
    } catch (error) {
    }
  }, [userId]);

  const renderPage = () => {
    
    switch (currentPage) {
      case Page.Landing:
        return <LandingPage setCurrentPage={setCurrentPageOptimized} />;
      case Page.UserOnboarding:
        return <UserOnboardingPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  setUserData={setUserData}
                  setUserImageUrl={setUserImageUrl}
                  setUserAudioBlob={setUserAudioBlob}
                  setVoiceId={setVoiceId}
                />;
      case Page.CaricatureGenerationIntro:
        return <CaricatureGenerationIntroPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  onGoBack={goBack}
                  canGoBack={canGoBack}
                />;
      case Page.CaricatureGeneration:
        return <CaricatureGenerationPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  userImageUrl={userImageUrl} 
                  caricatureUrl={caricatureUrl}
                  setCaricatureUrl={setCaricatureUrl}
                  voiceId={voiceId}
                  onGoBack={goBack}
                  canGoBack={canGoBack}
                />;
      case Page.TalkingPhotoGenerationIntro:
        return <TalkingPhotoGenerationIntroPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  onGoBack={goBack}
                  canGoBack={canGoBack}
                  caricatureUrl={caricatureUrl}
                  voiceId={voiceId}
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
                  refreshUserData={refreshUserData}
                />;
      case Page.ModuleSelection:
        return <ModuleSelectionPage 
                  setCurrentPage={setCurrentPageOptimized} 
                  module1Completed={module1Completed} 
                  module2Completed={module2Completed}
                  userData={userData}
                  voiceId={voiceId}
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
                  refreshUserData={refreshUserData}
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
                  refreshUserData={refreshUserData}
                />;
      case Page.Completion:
        return <CompletionPage setCurrentPage={setCurrentPageOptimized} />;
      default:
        return <LandingPage setCurrentPage={setCurrentPageOptimized} />;
    }
  };

  // Load progress from localStorage on app start
  useEffect(() => {
    try {
      const savedUserId = localStorage.getItem('userId');
      
      if (savedUserId && savedUserId !== 'null') {
        loadUserProgress(Number(savedUserId));
      } else {
        setIsLoadingProgress(false);
        setIsInitialLoad(false);
      }
    } catch (e) {
      setError('Failed to initialize app');
      setIsLoadingProgress(false);
      setIsInitialLoad(false);
    }
  }, [loadUserProgress]); // Add loadUserProgress as dependency

  // Add a render effect to see what's being rendered
  useEffect(() => {
  }, [currentPage, isLoadingProgress, userData]);

  // Move all remaining logic inside try block if needed
  try {

  } catch (e) {
    setError('Something went wrong. Please try refreshing the page.');
  }
  
  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="space-y-2">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Reload Page
            </button>
            <button 
              onClick={clearAllDataAndStartFresh} 
              className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Clear Data & Start Fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle loading state with timeout for Safari
  useEffect(() => {
    if (isLoadingProgress) {
      // Safari safety timeout - if still loading after 10 seconds, force landing page
      const timeout = setTimeout(() => {
        if (isLoadingProgress) {
          clearAllDataAndStartFresh();
        }
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [isLoadingProgress, clearAllDataAndStartFresh]);

  if (isLoadingProgress) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading user progress...</p>
          <button 
            onClick={clearAllDataAndStartFresh} 
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
          >
            Skip & Start Fresh
          </button>
        </div>
      </div>
    );
  }

  return renderPage();
};

export default App;
