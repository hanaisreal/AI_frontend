import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = "" 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center px-4 py-2 text-sm font-medium text-slate-700 
        bg-white border border-slate-300 rounded-lg shadow-sm 
        hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 
        focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 
        disabled:cursor-not-allowed disabled:hover:bg-white
        transition-colors duration-200
        ${className}
      `}
    >
      <svg 
        className="w-4 h-4 mr-2" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 19l-7-7 7-7" 
        />
      </svg>
      되돌아가기
    </button>
  );
};

export default BackButton;