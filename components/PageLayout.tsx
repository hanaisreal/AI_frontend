
import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 pt-12 md:p-10 bg-gradient-to-br from-blue-50 via-white to-orange-50 text-gray-800">
      <div className="w-full max-w-4xl mx-auto">
        {title && (
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent leading-tight">{title}</h1>
          </header>
        )}
        <main className="space-y-10">
            {children}
        </main>
        <footer className="mt-20 text-center text-gray-500 text-lg">
            <p className="bg-white/60 backdrop-blur-sm rounded-full px-6 py-3 inline-block">&copy; {new Date().getFullYear()} AI 인식 프로젝트. 교육 목적으로만 사용됩니다.</p>
        </footer>
      </div>
    </div>
  );
};

export default PageLayout;
