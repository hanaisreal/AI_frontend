import React from 'react';

interface BackButtonProps {
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'ghost';
}

const BackButton: React.FC<BackButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = "",
  size = 'lg',
  variant = 'primary'
}) => {
  // Size classes (smaller like original)
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base', 
    lg: 'px-6 py-3 text-lg'
  };

  // Variant classes (previous gradient design)
  const variantClasses = {
    primary: 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 focus:ring-orange-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-700 focus:ring-gray-400 disabled:bg-gray-200 disabled:text-gray-500',
    ghost: 'bg-transparent hover:bg-orange-50 text-orange-600 hover:text-orange-700 focus:ring-orange-500 disabled:text-gray-400 shadow-none'
  };

  // Icon size based on button size
  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5', 
    lg: 'w-6 h-6'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-75 
        transition-all duration-200 ease-in-out flex items-center justify-center shadow-md hover:shadow-lg border-0
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <svg 
        className={`${iconSize[size]} mr-2`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        strokeWidth={1.5}
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" 
        />
      </svg>
      뒤로
    </button>
  );
};

export default BackButton;