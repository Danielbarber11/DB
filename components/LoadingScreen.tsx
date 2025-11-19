import React from 'react';

interface LoadingScreenProps {
  topic: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ topic }) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600 mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800">ה-AI מכין את החידון שלך...</h2>
      <p className="text-gray-600 mt-2">נושא: {topic || "ידע כללי"}</p>
    </div>
  );
};
