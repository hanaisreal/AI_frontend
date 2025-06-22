import React from 'react';

interface ModuleProgressBarProps {
  currentSection: string;
  moduleType: 'fakeNews' | 'identityTheft';
  className?: string;
}

const ModuleProgressBar: React.FC<ModuleProgressBarProps> = ({
  currentSection,
  moduleType,
  className = '',
}) => {
  // Define the sections for both modules
  const sections = [
    { id: '개념', label: '개념', icon: '💡' },
    { id: '사례', label: '사례', icon: '📹' },
    { id: '실습', label: '실습', icon: '🎭' },
    { id: '대응', label: '대응', icon: '🛡️' },
    { id: '퀴즈', label: '퀴즈', icon: '🎯' },
  ];

  // Find current section index
  const currentIndex = sections.findIndex(section => section.id === currentSection);
  const progressPercentage = currentIndex >= 0 ? ((currentIndex + 1) / sections.length) * 100 : 0;

  return (
    <div className={`w-full max-w-4xl mx-auto mb-6 ${className}`}>
      {/* Progress Bar Container */}
      <div className="relative">
        {/* Background Track */}
        <div className="h-2 bg-gray-200 rounded-full relative overflow-hidden">
          {/* Active Progress Bar */}
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-700 ease-in-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Bus Stops (Section Indicators) */}
        <div className="flex justify-between items-center mt-4">
          {sections.map((section, index) => {
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={section.id} className="flex flex-col items-center">
                {/* Bus Stop Circle */}
                <div 
                  className={`
                    w-12 h-12 rounded-full border-4 flex items-center justify-center text-lg font-bold transition-all duration-500
                    ${isCurrent 
                      ? 'bg-orange-500 border-orange-600 text-white scale-110 shadow-lg' 
                      : isActive 
                        ? 'bg-orange-200 border-orange-400 text-orange-800' 
                        : 'bg-gray-100 border-gray-300 text-gray-500'
                    }
                  `}
                >
                  {section.icon}
                </div>
                
                {/* Section Label */}
                <div 
                  className={`
                    mt-2 text-sm font-medium transition-all duration-300
                    ${isCurrent 
                      ? 'text-orange-600 font-bold' 
                      : isActive 
                        ? 'text-orange-500' 
                        : 'text-gray-400'
                    }
                  `}
                >
                  {section.label}
                </div>
                
                {/* Current Step Indicator */}
                {isCurrent && (
                  <div className="mt-1">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Connection Lines between Bus Stops */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-10">
          <div 
            className="h-full bg-orange-400 transition-all duration-700 ease-in-out"
            style={{ width: `${Math.max(0, (currentIndex / (sections.length - 1)) * 100)}%` }}
          />
        </div>
      </div>

      {/* Module Title */}
      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          {moduleType === 'fakeNews' ? '가짜 뉴스 모듈' : '신원 도용 모듈'} • 
          {currentIndex >= 0 ? ` ${currentIndex + 1}/${sections.length} 단계` : ' 준비 중...'}
        </p>
      </div>
    </div>
  );
};

export default ModuleProgressBar;