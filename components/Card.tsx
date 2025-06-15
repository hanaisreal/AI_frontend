
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, className, title }) => {
  return (
    <div className={`bg-white shadow-xl rounded-xl p-6 md:p-8 ${className || ''}`}>
      {title && <h2 className="text-2xl md:text-3xl font-bold text-orange-600 mb-6 text-center md:text-left">{title}</h2>}
      {children}
    </div>
  );
};

export default Card;