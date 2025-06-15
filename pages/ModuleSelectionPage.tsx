
import React from 'react';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import PageLayout from '../components/PageLayout.tsx';
import { SCRIPTS } from '../constants.tsx';
import { Page } from '../types.ts';

interface ModuleSelectionPageProps {
  setCurrentPage: (page: Page) => void;
  module1Completed: boolean;
  module2Completed: boolean;
}

const ModuleSelectionPage: React.FC<ModuleSelectionPageProps> = ({
  setCurrentPage,
  module1Completed,
  module2Completed,
}) => {
  if (module1Completed && module2Completed) {
    return (
      <PageLayout title="모든 모듈 완료!">
        <Card>
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-green-500 mx-auto mb-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">{SCRIPTS.allModulesComplete}</p>
            <Button onClick={() => setCurrentPage(Page.Landing)} variant="primary" size="lg">
              시작으로 돌아가기
            </Button>
          </div>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="경험 선택하기">
      <Card>
        <p className="text-slate-700 text-lg mb-10 text-center leading-relaxed">{SCRIPTS.moduleSelection}</p>
        <div className="space-y-6">
          <Button
            onClick={() => setCurrentPage(Page.FakeNewsModule)}
            disabled={module1Completed}
            fullWidth
            size="lg"
            variant={module1Completed ? "secondary" : "primary"}
            className="!p-0"
          >
            <div className={`w-full flex items-center justify-between p-5 rounded-lg ${module1Completed ? "bg-slate-200 text-slate-600" : ""}`}>
              <div className="text-left">
                  <h3 className={`text-xl font-semibold ${module1Completed ? "text-slate-700" : "text-white"}`}>모듈 1: 가짜 뉴스</h3>
                  <p className={`text-sm mt-1 ${module1Completed ? "text-slate-500" : "opacity-80 text-white"}`}>잘못된 정보 속 AI 탐색하기.</p>
              </div>
              {module1Completed ? (
                   <span className="text-green-600 font-semibold ml-4 text-lg whitespace-nowrap">✓ 완료됨</span>
              ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 ml-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
              )}
            </div>
          </Button>
          
          <Button
            onClick={() => setCurrentPage(Page.IdentityTheftModule)}
            disabled={module2Completed}
            fullWidth
            size="lg"
            variant={module2Completed ? "secondary" : "primary"}
             className="!p-0"
          >
            <div className={`w-full flex items-center justify-between p-5 rounded-lg ${module2Completed ? "bg-slate-200 text-slate-600" : ""}`}>
              <div className="text-left">
                  <h3 className={`text-xl font-semibold ${module2Completed ? "text-slate-700" : "text-white"}`}>모듈 2: 신원 도용</h3>
                  <p className={`text-sm mt-1 ${module2Completed ? "text-slate-500" : "opacity-80 text-white"}`}>AI 음성 복제 사기 위험 이해하기.</p>
              </div>
              {module2Completed ? (
                  <span className="text-green-600 font-semibold ml-4 text-lg whitespace-nowrap">✓ 완료됨</span>
              ) : (
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7 ml-4 text-white">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
              )}
            </div>
          </Button>
        </div>
      </Card>
    </PageLayout>
  );
};

export default ModuleSelectionPage;
