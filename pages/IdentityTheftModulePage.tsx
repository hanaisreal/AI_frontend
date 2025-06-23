
import React from 'react';
import BaseModulePage from './BaseModulePage.tsx';
import { Page, UserData } from '../types.ts';
import { IDENTITY_THEFT_MODULE_STEPS, SCRIPTS } from '../constants.tsx';

interface IdentityTheftModulePageProps {
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

const IdentityTheftModulePage: React.FC<IdentityTheftModulePageProps> = (props) => {
  return (
    <BaseModulePage
      moduleTitle="신원 도용" // Translated title
      steps={IDENTITY_THEFT_MODULE_STEPS}
      moduleCompletionMessage={SCRIPTS.module2Complete} // Already translated in constants
      {...props}
    />
  );
};

export default IdentityTheftModulePage;
