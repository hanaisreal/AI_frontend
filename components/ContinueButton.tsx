import React from 'react';
import Button from './Button';

// CSS for modern zoom animation
const continueButtonStyles = `
  @keyframes pulse-zoom {
    0%, 100% { 
      transform: scale(1);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    50% { 
      transform: scale(1.05);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    }
  }
`;

interface ContinueButtonProps {
  onClick: () => void;
  disabled?: boolean;
  text?: string;
  showAnimation?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({
  onClick,
  disabled = false,
  text = '계속하기',
  showAnimation = false,
  size = 'lg',
  className = '',
}) => {
  return (
    <>
      <style>{continueButtonStyles}</style>
      <Button
        onClick={onClick}
        disabled={disabled}
        size={size}
        variant="primary"
        className={`transition-all duration-300 ${
          showAnimation && !disabled
            ? 'shadow-lg' 
            : 'transition-opacity duration-500'
        } ${className}`}
        style={showAnimation && !disabled ? {
          animation: 'pulse-zoom 2s ease-in-out infinite',
        } : {}}
      >
        {text}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-6 h-6 ml-2"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" 
          />
        </svg>
      </Button>
    </>
  );
};

export default ContinueButton;