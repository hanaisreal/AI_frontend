
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', text }) => {
  const sizeClasses = {
    sm: 'h-10 w-10', // Larger for better visibility
    md: 'h-16 w-16', // More prominent
    lg: 'h-24 w-24', // Extra large
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <svg 
          className={`animate-spin text-orange-500 ${sizeClasses[size]} drop-shadow-lg`} 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full opacity-10 animate-pulse"></div>
      </div>
      {text && <p className="text-gray-600 text-xl font-medium">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;