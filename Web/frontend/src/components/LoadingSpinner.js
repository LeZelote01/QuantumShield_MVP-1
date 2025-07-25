import React from 'react';

const LoadingSpinner = ({ size = 'md', text = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`loading-spinner ${sizeClasses[size]}`}></div>
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner;