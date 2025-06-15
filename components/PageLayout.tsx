
import React from 'react';
import { APP_TITLE } from '../constants.tsx';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  showAppTitle?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title, showAppTitle = true }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-10 md:p-8 bg-slate-100 text-slate-800">
      <div className="w-full max-w-3xl mx-auto">
        {showAppTitle && (
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-orange-600">{APP_TITLE}</h1>
            {title && <p className="text-xl md:text-2xl text-slate-600 mt-3">{title}</p>}
          </header>
        )}
        {!showAppTitle && title && (
             <h1 className="text-3xl md:text-4xl font-bold text-orange-600 mb-8 text-center">{title}</h1>
        )}
        <main className="space-y-8">
            {children}
        </main>
        <footer className="mt-16 text-center text-slate-500 text-base">
            <p>&copy; {new Date().getFullYear()} AI 인식 프로젝트. 교육 목적으로만 사용됩니다.</p>
        </footer>
      </div>
    </div>
  );
};

export default PageLayout;
