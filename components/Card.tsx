import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={`bg-gradient-to-br from-white to-gray-50 shadow-lg hover:shadow-xl rounded-3xl p-8 md:p-12 transition-all duration-300 border-0 ${className || ''}`}>
      {title && <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-8 text-center leading-tight">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;