import React from 'react';
const renderLoading: React.FC = () => {
  return (
    <div className="flex justify-center h-10 pt-4">
      <div className="h-72 absolute">
        <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
      </div>
    </div>
  );
};

export default renderLoading;
