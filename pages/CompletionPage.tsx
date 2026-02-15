
import React from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import PageLayout from '../components/PageLayout.tsx';
import { SCRIPTS, UI_TEXT } from '../lang';
import { Page } from '../types.ts';

interface CompletionPageProps {
  setCurrentPage: (page: Page) => void;
}

const CompletionPage: React.FC<CompletionPageProps> = ({ setCurrentPage }) => {
  return (
    <PageLayout title={UI_TEXT.projectComplete}>
      <Card>
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-24 h-24 text-green-500 mx-auto mb-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p className="text-xl md:text-2xl text-slate-700 mb-10 leading-relaxed">{SCRIPTS.allModulesComplete}</p>
          <div className="flex justify-center">
            <Button onClick={() => setCurrentPage(Page.Landing)} size="lg" variant="primary">
              {UI_TEXT.returnToWelcome}
            </Button>
          </div>
        </div>
      </Card>
    </PageLayout>
  );
};

export default CompletionPage;
