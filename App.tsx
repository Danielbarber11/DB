import React, { useState, useCallback, useEffect } from 'react';
import { ResultsScreen } from './components/ResultsScreen';
import { generateQuiz } from './services/geminiService';
import { QuizData, UserAnswers, UserInfo, QuizResult } from './types';
import { Send, ShieldCheck, X, User, Trash2, PlayCircle } from 'lucide-react';

type Step = 'auth' | 'loading' | 'quiz' | 'results';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>('auth');
  const [userInfo, setUserInfo] = useState<UserInfo>({ username: '', topic: 'שועלים' });
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [userAnswers, setUserAnswers] = useState<UserAnswers>({});
  const [loadingError, setLoadingError] = useState<boolean>(false);

  // Admin & Persistence State
  const [clickCount, setClickCount] = useState(0);
  const [showAdmin, setShowAdmin] = useState(false);
  const [history, setHistory] = useState<QuizResult[]>([]);
  const [userLocked, setUserLocked] = useState(false);

  // Load data from local storage on mount
  useEffect(() => {
    // Check for new username key first, fall back to old email key if needed
    const savedUser = localStorage.getItem('quiz_username') || localStorage.getItem('quiz_user_email');
    
    if (savedUser) {
      setUserInfo(prev => ({ ...prev, username: savedUser, topic: 'שועלים' }));
      setUserLocked(true); // Simulate "Auto Connected" state
    }

    const savedHistory = localStorage.getItem('quiz_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Handle Title Click (Easter Egg)
  const handleTitleClick = () => {
    setClickCount(prev => {
      const newCount = prev + 1;
      if (newCount >= 10) {
        setShowAdmin(true);
        return 0;
      }
      return newCount;
    });
  };

  const handleStartQuiz = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userInfo.username) return;

    // Save username to local storage
    localStorage.setItem('quiz_username', userInfo.username);

    // Immediately start quiz logic without loading screen
    setLoadingError(false);
    
    try {
      const data = await generateQuiz('שועלים'); // Returns static quiz immediately
      if (data && data.questions.length > 0) {
        setQuizData(data);
        setStep('quiz');
      } else {
        setLoadingError(true);
        setStep('auth');
      }
    } catch (err) {
      console.error(err);
      setLoadingError(true);
      setStep('auth');
    }
  };

  const handleOptionSelect = (questionId: string, optionId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const calculateScore = useCallback(() => {
    if (!quizData) return 0;
    let correctCount = 0;
    quizData.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctOptionId) {
        correctCount++;
      }
    });
    return correctCount;
  }, [quizData, userAnswers]);

  const handleSubmitQuiz = () => {
    const score = calculateScore();
    const totalQuestions = quizData?.questions.length || 0;

    // Save Result
    const result: QuizResult = {
      username: userInfo.username,
      topic: 'שועלים',
      score,
      totalQuestions,
      timestamp: Date.now()
    };

    const newHistory = [result, ...history];
    setHistory(newHistory);
    localStorage.setItem('quiz_history', JSON.stringify(newHistory));

    setStep('results');
  };

  const handleReset = () => {
    setStep('auth');
    setQuizData(null);
    setUserAnswers({});
    // Keep username, reset topic if we weren't hardcoding it
  };

  const handleLogout = () => {
    localStorage.removeItem('quiz_username');
    localStorage.removeItem('quiz_user_email'); // Clean up old key if exists
    setUserInfo({ ...userInfo, username: '' });
    setUserLocked(false);
  };

  const clearHistory = () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את כל ההיסטוריה?')) {
      setHistory([]);
      localStorage.removeItem('quiz_history');
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('he-IL');
  };

  return (
    <div className="min-h-screen bg-[#f0ebf8] py-8 px-4 font-sans" dir="rtl">
      <div className="max-w-3xl mx-auto">
        
        {/* Admin Modal */}
        {showAdmin && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b bg-gray-50 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <ShieldCheck className="w-6 h-6 text-purple-700" />
                   <h2 className="text-xl font-bold text-gray-800">לוח בקרה - היסטוריית חידונים</h2>
                </div>
                <button onClick={() => setShowAdmin(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="overflow-auto p-6 flex-1">
                {history.length === 0 ? (
                  <div className="text-center text-gray-500 py-10">עדיין לא בוצעו חידונים.</div>
                ) : (
                  <table className="w-full text-right border-collapse">
                    <thead className="bg-gray-100 text-gray-600 text-sm sticky top-0">
                      <tr>
                        <th className="p-3 rounded-tr-lg">משתמש (שם/אימייל)</th>
                        <th className="p-3">נושא</th>
                        <th className="p-3">ציון (0-100)</th>
                        <th className="p-3 rounded-tl-lg">תאריך</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {history.map((item, idx) => {
                         const grade = Math.round((item.score / item.totalQuestions) * 100);
                         return (
                          <tr key={idx} className="hover:bg-gray-50">
                            <td className="p-3 text-gray-800 font-medium">{item.username}</td>
                            <td className="p-3 text-gray-600">{item.topic}</td>
                            <td className="p-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                grade >= 80 ? 'bg-green-100 text-green-700' : 
                                grade >= 60 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {grade}
                              </span>
                            </td>
                            <td className="p-3 text-gray-500 text-sm">{formatDate(item.timestamp)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="p-4 border-t bg-gray-50 flex justify-end">
                 <button 
                   onClick={clearHistory}
                   className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm transition-colors"
                 >
                   <Trash2 className="w-4 h-4" />
                   נקה היסטוריה
                 </button>
              </div>
            </div>
          </div>
        )}

        {step === 'auth' && (
          <>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
              <div className="h-2 bg-purple-700 w-full absolute top-0 left-0"></div>
              
              <div className="p-8">
                <h1 
                  onClick={handleTitleClick}
                  className="text-3xl font-bold text-gray-900 mb-2 select-none cursor-pointer active:scale-95 transition-transform"
                  title="לחץ 10 פעמים למצב מנהל"
                >
                  חידון שועלים 🦊
                </h1>
                <p className="text-gray-600 mb-8">
                  בואו לבדוק כמה אתם באמת יודעים על החיה הערמומית והחמודה ביותר בטבע. ענו על 5 שאלות לקבלת ציון 100!
                </p>
                
                <hr className="border-gray-100 mb-8" />

                <form onSubmit={handleStartQuiz} className="space-y-6">
                  
                  {/* Auth Section - Simulating Auto Connect */}
                  {userLocked ? (
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 flex flex-col items-start gap-3">
                       <div className="flex items-center gap-2 text-purple-800 font-medium">
                          <ShieldCheck className="w-5 h-5" />
                          <span>מחובר אוטומטית</span>
                       </div>
                       <div className="text-gray-600 text-sm">
                          שלום, <b>{userInfo.username}</b>. החידון מוכן עבורך.
                       </div>
                       <button 
                         type="button"
                         onClick={handleLogout}
                         className="text-xs text-gray-400 underline hover:text-gray-600"
                       >
                         התנתק והחלף משתמש
                       </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                        שם מלא או אימייל
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <User className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          autoComplete="username email"
                          required
                          className="block w-full pr-10 border-b-2 border-gray-300 bg-gray-50 focus:border-purple-700 focus:bg-purple-50 focus:outline-none py-2 transition-colors text-gray-800"
                          placeholder="לדוגמה: ישראל ישראלי"
                          value={userInfo.username}
                          onChange={(e) => setUserInfo({...userInfo, username: e.target.value})}
                        />
                      </div>
                      <p className="text-xs text-gray-500">
                        * המערכת תשמור את פרטיך לחידונים הבאים
                      </p>
                    </div>
                  )}

                  {loadingError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                      אירעה שגיאה בטעינת החידון. אנא נסה שוב.
                    </div>
                  )}

                  <div className="pt-4 flex justify-between items-center">
                     <button
                      type="submit"
                      className="bg-purple-700 text-white px-8 py-3 rounded hover:bg-purple-800 transition-colors shadow-md font-medium flex items-center gap-2 text-lg"
                    >
                      <span>התחל בחידון</span>
                      {userLocked ? <PlayCircle className="w-5 h-5" /> : <Send className="w-4 h-4 rotate-180" />}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="mt-6 text-center text-gray-400 text-xs">
               נבנה בעזרת Google Gemini • מחובר ל-GitHub Pages
            </div>
          </>
        )}

        {/* Removed Loading Screen Component Usage */}

        {step === 'quiz' && quizData && (
          <div className="space-y-6">
             {/* Quiz Title Card */}
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden">
               <div className="h-2 bg-purple-700 w-full absolute top-0 left-0"></div>
               <h1 className="text-2xl font-bold text-gray-900 mb-2">{quizData.title}</h1>
               <p className="text-gray-600">{quizData.description}</p>
               <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500 flex justify-between items-center">
                 <div>נבחן: <span className="font-medium text-gray-800">{userInfo.username}</span></div>
                 <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">נושא: שועלים</span>
               </div>
             </div>

             {/* Questions */}
             {quizData.questions.map((q, index) => (
               <div key={q.id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                 <h3 className="text-lg font-medium text-gray-800 mb-4 flex gap-2">
                   <span className="font-bold">{index + 1}.</span>
                   <span>{q.text}</span>
                   <span className="mr-auto text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded h-fit">20 נק'</span>
                 </h3>
                 <div className="space-y-2">
                   {q.options.map((opt) => (
                     <label 
                       key={opt.id} 
                       className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                         userAnswers[q.id] === opt.id 
                           ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-500' 
                           : 'hover:bg-gray-50 border-transparent'
                       }`}
                     >
                       <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                         userAnswers[q.id] === opt.id ? 'border-purple-700' : 'border-gray-400'
                       }`}>
                         {userAnswers[q.id] === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-purple-700" />}
                       </div>
                       <span className="text-gray-700">{opt.text}</span>
                       <input 
                         type="radio" 
                         name={q.id} 
                         value={opt.id}
                         checked={userAnswers[q.id] === opt.id}
                         onChange={() => handleOptionSelect(q.id, opt.id)}
                         className="hidden"
                       />
                     </label>
                   ))}
                 </div>
               </div>
             ))}

             <div className="flex justify-between items-center pt-4 pb-12">
                <button 
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(userAnswers).length < quizData.questions.length}
                  className={`px-8 py-3 rounded shadow-md font-medium transition-colors ${
                    Object.keys(userAnswers).length < quizData.questions.length 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-purple-700 text-white hover:bg-purple-800'
                  }`}
                >
                  שלח תשובות וקבל ציון
                </button>
                
                <div className="h-1 w-32 bg-gray-200 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-green-500 transition-all duration-300"
                     style={{ width: `${(Object.keys(userAnswers).length / quizData.questions.length) * 100}%` }}
                   ></div>
                </div>
             </div>
          </div>
        )}

        {step === 'results' && quizData && (
          <ResultsScreen 
            quizData={quizData} 
            userAnswers={userAnswers} 
            score={calculateScore()} 
            onReset={handleReset} 
          />
        )}

      </div>
    </div>
  );
};

export default App;