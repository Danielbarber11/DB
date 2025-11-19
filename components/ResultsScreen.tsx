import React from 'react';
import { QuizData, UserAnswers } from '../types';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface ResultsScreenProps {
  quizData: QuizData;
  userAnswers: UserAnswers;
  score: number;
  onReset: () => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({ quizData, userAnswers, score, onReset }) => {
  // Calculate percentage grade (0-100)
  const finalGrade = Math.round((score / quizData.questions.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto pb-10">
      {/* Score Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden relative">
        <div className="h-2 bg-purple-700 w-full absolute top-0 left-0"></div>
        <div className="p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{quizData.title}</h2>
          <p className="text-gray-600 mb-6">התוצאה שלך נשלחה בהצלחה</p>
          
          <div className="flex justify-center items-baseline gap-2 mb-2">
            <span className="text-6xl font-bold text-purple-700">{finalGrade}</span>
            <span className="text-xl text-gray-400">/ 100</span>
          </div>
          
          <p className="text-sm text-gray-500">
            ענית נכון על {score} מתוך {quizData.questions.length} שאלות
          </p>
        </div>
      </div>

      {/* Review Questions */}
      <div className="space-y-4">
        {quizData.questions.map((q, index) => {
          const selectedOptionId = userAnswers[q.id];
          const isCorrect = selectedOptionId === q.correctOptionId;
          
          return (
            <div key={q.id} className={`bg-white rounded-xl border p-6 shadow-sm ${isCorrect ? 'border-gray-200' : 'border-red-200'}`}>
              <h3 className="text-lg font-medium text-gray-800 mb-4 flex gap-2">
                <span>{index + 1}.</span>
                <span>{q.text}</span>
                <span className="mr-auto text-sm font-normal text-gray-400">20 נקודות</span>
              </h3>

              <div className="space-y-2">
                {q.options.map((option) => {
                  const isSelected = option.id === selectedOptionId;
                  const isTheCorrectAnswer = option.id === q.correctOptionId;
                  
                  let bgClass = "bg-gray-50";
                  let borderClass = "border-transparent";
                  let icon = null;

                  if (isSelected && isCorrect) {
                    bgClass = "bg-green-50";
                    borderClass = "border-green-500";
                    icon = <CheckCircle className="w-5 h-5 text-green-600 ml-2" />;
                  } else if (isSelected && !isCorrect) {
                    bgClass = "bg-red-50";
                    borderClass = "border-red-500";
                    icon = <XCircle className="w-5 h-5 text-red-600 ml-2" />;
                  } else if (!isSelected && isTheCorrectAnswer && !isCorrect) {
                     // Show correct answer if user missed it
                     bgClass = "bg-gray-100";
                     borderClass = "border-transparent text-gray-500";
                  }

                  return (
                    <div 
                      key={option.id}
                      className={`flex items-center p-3 rounded-lg border ${bgClass} ${borderClass} transition-colors`}
                    >
                      {icon}
                      <span className={`${isSelected && !isCorrect ? 'text-red-700' : isSelected && isCorrect ? 'text-green-700' : 'text-gray-700'} ${isTheCorrectAnswer && !isCorrect ? 'font-medium text-gray-900' : ''}`}>
                        {option.text} 
                        {isTheCorrectAnswer && !isCorrect && <span className="text-xs text-gray-500 mr-2">(התשובה הנכונה)</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onReset}
        className="mt-8 mx-auto flex items-center justify-center gap-2 text-purple-700 font-medium hover:bg-purple-50 px-6 py-3 rounded-lg transition-colors"
      >
        <RotateCcw className="w-4 h-4" />
        נסה שוב לשיפור הציון
      </button>
    </div>
  );
};