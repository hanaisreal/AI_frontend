
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
  voiceId: string | null;
}

const FakeNewsModulePage: React.FC<FakeNewsModulePageProps> = (props) => {
  return (
    <BaseModulePage
      moduleTitle="모듈 1: 가짜 뉴스 경험" // Translated title
      steps={FAKE_NEWS_MODULE_STEPS}
      moduleCompletionMessage={SCRIPTS.module1Complete} // Already translated in constants
      {...props}
    />
  );
};

export default FakeNewsModulePage;
