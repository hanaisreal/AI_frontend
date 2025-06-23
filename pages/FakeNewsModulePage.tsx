
import React from 'react';
import BaseModulePage from './BaseModulePage.tsx';
import { Page, UserData } from '../types.ts';
import { FAKE_NEWS_MODULE_STEPS, SCRIPTS } from '../constants.tsx';

interface FakeNewsModulePageProps {
  setCurrentPage: (page: Page) => void;
  onModuleComplete: () => void;
  userData: UserData | null;
  userImageUrl: string | null;
  caricatureUrl: string | null;
  talkingPhotoUrl: string | null;
  voiceId: string | null;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onGoBack: () => void;
  canGoBack: boolean;
  refreshUserData: () => Promise<void>;
}

const FakeNewsModulePage: React.FC<FakeNewsModulePageProps> = (props) => {
  return (
    <BaseModulePage
      moduleTitle="가짜 뉴스" // Translated title
      steps={FAKE_NEWS_MODULE_STEPS}
      moduleCompletionMessage={SCRIPTS.module1Complete} // Already translated in constants
      {...props}
    />
  );
};

export default FakeNewsModulePage;
