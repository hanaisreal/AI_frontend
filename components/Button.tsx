
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  className,
  ...props
}) => {
  const baseStyles = "font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out flex items-center justify-center shadow-md";
  
  const variantStyles = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white focus:ring-orange-400 disabled:bg-orange-300",
    secondary: "bg-slate-300 hover:bg-slate-400 text-slate-700 focus:ring-slate-400 disabled:bg-slate-200 disabled:text-slate-500",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-400 disabled:bg-red-300",
    ghost: "bg-transparent hover:bg-orange-50 text-orange-600 hover:text-orange-700 focus:ring-orange-500 disabled:text-slate-400 shadow-none",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-base", // Formerly sm
    md: "px-5 py-2.5 text-lg", // Formerly md, now larger
    lg: "px-7 py-3.5 text-xl", // Formerly lg, now larger
  };

  const widthStyles = fullWidth ? "w-full" : "w-auto min-w-[180px]"; // Added min-width for non-fullWidth

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className || ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className={`animate-spin -ml-1 mr-3 h-5 w-5 ${variant === 'primary' || variant === 'danger' ? 'text-white' : 'text-orange-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;