import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  RotateCcw, 
  ArrowLeft,
  BookOpen, 
  Layers, 
  Target, 
  Trophy,
  AlertCircle,
  Loader2,
  CheckCircle2,
  XCircle,
  Home,
  Timer,
  Hash
} from 'lucide-react';
import { AppStep, QuizSettings, QuizResponse, Difficulty } from './types';
import { CLASSES, SUBJECTS, CLASS_TOPICS_MAP, LEVELS, QUIZ_LENGTHS } from './constants';
import { generateQuestion, generateImage } from './services/geminiService';

export default function App() {
  const [step, setStep] = useState<AppStep>(AppStep.CLASS_SELECTION);
  const [settings, setSettings] = useState<QuizSettings>({
    currentClass: '',
    subject: '',
    topic: '',
    difficulty: 'Medium',
    seed: Date.now().toString(),
    limit: 20,
    durationMinutes: 15
  });
  const [currentQuestion, setCurrentQuestion] = useState<QuizResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizImage, setQuizImage] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // Timer Effect
  useEffect(() => {
    if (step === AppStep.QUIZ_ACTIVE && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setStep(AppStep.QUIZ_RESULT);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getClassGroup = (cls: string) => {
    const n = parseInt(cls);
    if (n >= 6 && n <= 8) return 'Junior (6-8)';
    if (n >= 9 && n <= 10) return 'Secondary (9-10)';
    if (n >= 11 && n <= 12) return 'Senior (11-12)';
    return 'Junior (6-8)';
  };

  const handleClassSelect = (cls: string) => {
    setSettings({ ...settings, currentClass: cls });
    setStep(AppStep.SUBJECT_SELECTION);
  };

  const handleSubjectSelect = (sub: string) => {
    if (sub === 'All Subjects') {
      setSettings({ ...settings, subject: 'Mixed Subjects', topic: 'General' });
      setStep(AppStep.LEVEL_SELECTION);
    } else {
      setSettings({ ...settings, subject: sub });
      setStep(AppStep.TOPIC_SELECTION);
    }
  };

  const handleTopicSelect = (top: string) => {
    const topicValue = top === 'All Topics' ? 'Comprehensive' : top;
    setSettings({ ...settings, topic: topicValue });
    setStep(AppStep.LEVEL_SELECTION);
  };

  const handleLevelSelect = (lvl: string) => {
    setSettings({ ...settings, difficulty: lvl as Difficulty });
    setStep(AppStep.LENGTH_SELECTION);
  };

  const handleLengthSelect = (len: { count: number, minutes: number }) => {
    const newSettings = { 
      ...settings, 
      limit: len.count, 
      durationMinutes: len.minutes,
      seed: Date.now().toString() 
    };
    setSettings(newSettings);
    setTimeLeft(len.minutes * 60);
    setStep(AppStep.QUIZ_ACTIVE);
    fetchNewQuestion(newSettings);
  };

  const fetchNewQuestion = async (currentSettings: QuizSettings) => {
    setLoading(true);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizImage(null);
    try {
      const resp = await generateQuestion(currentSettings);
      setCurrentQuestion(resp);
      if (resp.question_box.has_image && resp.question_box.image_prompt) {
        const img = await generateImage(resp.question_box.image_prompt);
        setQuizImage(img);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedAnswer(option);
    setIsAnswered(true);
    setTotalQuestions(prev => prev + 1);
    if (option === currentQuestion?.question_box.answer) {
      setScore(prev => prev + 1);
    }
  };

  const resetQuiz = () => {
    setStep(AppStep.CLASS_SELECTION);
    setSettings({
      currentClass: '',
      subject: '',
      topic: '',
      difficulty: 'Medium',
      seed: Date.now().toString(),
      limit: 20,
      durationMinutes: 15
    });
    setScore(0);
    setTotalQuestions(0);
    setCurrentQuestion(null);
  };

  const nextQuestion = () => {
    if (totalQuestions >= settings.limit) {
      setStep(AppStep.QUIZ_RESULT);
      return;
    }
    const newSeed = Math.random().toString(36).substring(7);
    const newSettings = { ...settings, seed: newSeed };
    setSettings(newSettings);
    fetchNewQuestion(newSettings);
  };

  const handleBack = () => {
    if (step === AppStep.SUBJECT_SELECTION) setStep(AppStep.CLASS_SELECTION);
    else if (step === AppStep.TOPIC_SELECTION) setStep(AppStep.SUBJECT_SELECTION);
    else if (step === AppStep.LEVEL_SELECTION) {
      if (settings.subject === 'Mixed Subjects') setStep(AppStep.SUBJECT_SELECTION);
      else setStep(AppStep.TOPIC_SELECTION);
    }
    else if (step === AppStep.LENGTH_SELECTION) setStep(AppStep.LEVEL_SELECTION);
    else if (step === AppStep.QUIZ_ACTIVE) setStep(AppStep.LENGTH_SELECTION);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-8 px-4 sm:px-6">
      {/* Header */}
      <header className="w-full max-w-2xl mb-8 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-200">
            <BookOpen size={24} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-800 tracking-tight">OmniQuiz</h1>
        </div>
        <p className="text-slate-500 font-medium">Smart AI Learning Assistant</p>
      </header>

      {/* Progress / Info Bar */}
      {step !== AppStep.CLASS_SELECTION && step !== AppStep.QUIZ_RESULT && (
        <div className="w-full max-w-2xl mb-6 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center justify-between gap-4 overflow-hidden">
          <div className="flex items-center gap-2">
            <button 
              onClick={handleBack}
              className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all mr-2"
              title="Go Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-indigo-100/50">
                <Layers size={12} /> Class {settings.currentClass || '?'}
              </div>
              {settings.subject && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-100/50">
                  <Target size={12} /> {settings.subject}
                </div>
              )}
              {step === AppStep.QUIZ_ACTIVE && (
                <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-rose-100/50">
                  <Timer size={12} /> {formatTime(timeLeft)}
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={resetQuiz}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all"
            title="Start Over"
          >
            <Home size={20} />
          </button>
        </div>
      )}

      {/* Main Container */}
      <main className="w-full max-w-2xl flex-1 flex flex-col items-center">
        <AnimatePresence mode="wait">
          {/* Step 1: Class Selection */}
          {step === AppStep.CLASS_SELECTION && (
            <motion.div
              key="class-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-display font-bold text-slate-800">Select Your Class</h2>
                <p className="text-slate-500">Choose your academic level to start</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {CLASSES.map((cls) => (
                  <button
                    key={cls}
                    onClick={() => handleClassSelect(cls)}
                    className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-400 hover:shadow-md hover:shadow-indigo-50 transition-all flex flex-col items-center gap-2 group active:scale-95"
                  >
                    <span className="text-3xl font-display font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">#{cls}</span>
                    <span className="font-semibold text-slate-600">Class {cls}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Subject Selection */}
          {step === AppStep.SUBJECT_SELECTION && (
            <motion.div
              key="subject-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-display font-bold text-slate-800">Choose a Subject</h2>
                <p className="text-slate-500">What do you want to learn today?</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleSubjectSelect('All Subjects')}
                  className="col-span-2 p-6 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                >
                  <Trophy size={20} />
                  <span className="font-bold text-lg">All Subjects (Challenge)</span>
                </button>
                {SUBJECTS.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => handleSubjectSelect(sub)}
                    className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-400 hover:shadow-md transition-all flex items-center justify-between px-6 active:scale-95"
                  >
                    <span className="font-semibold text-slate-700">{sub}</span>
                    <ChevronRight size={18} className="text-slate-300" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Topic Selection */}
          {step === AppStep.TOPIC_SELECTION && (
            <motion.div
              key="topic-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-display font-bold text-slate-800">Select Topic</h2>
                <p className="text-slate-500">Pick a specific area or take them all</p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => handleTopicSelect('All Topics')}
                  className="p-5 bg-white rounded-2xl shadow-sm border-2 border-dashed border-slate-200 hover:border-indigo-400 text-slate-500 hover:text-indigo-600 transition-all font-bold text-lg active:scale-[0.99]"
                >
                  All Topics
                </button>
                {CLASS_TOPICS_MAP[getClassGroup(settings.currentClass)]?.[settings.subject]?.map((top) => (
                  <button
                    key={top}
                    onClick={() => handleTopicSelect(top)}
                    className="p-5 bg-white rounded-2xl shadow-sm border border-slate-100 hover:border-indigo-400 hover:shadow-md transition-all flex items-center justify-between px-6 active:scale-95"
                  >
                    <span className="font-semibold text-slate-700">{top}</span>
                    <ChevronRight size={18} className="text-slate-300" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4: Level Selection */}
          {step === AppStep.LEVEL_SELECTION && (
            <motion.div
              key="level-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-display font-bold text-slate-800">Difficulty Level</h2>
                <p className="text-slate-500">How challenging should it be?</p>
              </div>
              <div className="flex flex-col gap-4">
                {LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => handleLevelSelect(lvl)}
                    className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col items-center gap-2 active:scale-95"
                  >
                    <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-1 ${
                      lvl === 'Easy' ? 'bg-emerald-100 text-emerald-700' :
                      lvl === 'Medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {lvl}
                    </span>
                    <span className="text-xl font-bold text-slate-800">
                      {lvl === 'Easy' ? 'Beginner Friendly' : 
                       lvl === 'Medium' ? 'Challenging' : 
                       'Expert Level'}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* New Step: Length Selection */}
          {step === AppStep.LENGTH_SELECTION && (
            <motion.div
              key="length-selection"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full space-y-6"
            >
              <div className="text-center mb-4">
                <h2 className="text-xl font-display font-bold text-slate-800">Quiz Format</h2>
                <p className="text-slate-500">Choose the number of questions and duration</p>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {QUIZ_LENGTHS.map((len) => (
                  <button
                    key={len.count}
                    onClick={() => handleLengthSelect(len)}
                    className="p-8 bg-white rounded-3xl shadow-sm border border-slate-100 hover:border-indigo-600 hover:shadow-md transition-all flex items-center justify-between active:scale-95"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600">
                        <Hash size={24} />
                      </div>
                      <div className="text-left">
                        <span className="block text-xl font-bold text-slate-800">{len.count} Questions</span>
                        <span className="text-slate-500 font-medium">Full assessment session</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1.5 text-rose-500 font-bold">
                        <Timer size={18} />
                        <span>{len.minutes}m</span>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Timed Session</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 5: Quiz Active */}
          {step === AppStep.QUIZ_ACTIVE && (
            <motion.div
              key="quiz-active"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <div className="relative">
                    <Loader2 size={48} className="text-indigo-600 animate-spin" />
                    <div className="absolute inset-0 blur-lg bg-indigo-400/20 animate-pulse"></div>
                  </div>
                  <p className="text-slate-500 font-medium animate-pulse">Generating your professional question...</p>
                </div>
              ) : currentQuestion && (
                <div className="space-y-6">
                  {/* Scoreboard and Progress */}
                  <div className="flex flex-col gap-4 px-2 bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Question</span>
                        <span className="text-xl font-bold text-indigo-700">{totalQuestions + 1} / {settings.limit}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Time Remaining</span>
                        <span className={`text-xl font-mono font-bold ${timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-indigo-700'}`}>
                          {formatTime(timeLeft)}
                        </span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-indigo-100/50">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${((totalQuestions) / settings.limit) * 100}%` }}
                        className="h-full bg-indigo-500 rounded-full"
                      />
                    </div>
                  </div>

                  {/* Question Container */}
                  <div className="bg-white rounded-[32px] p-6 sm:p-10 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8 relative overflow-hidden">
                    {/* Decorative Blob */}
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-indigo-50 rounded-full blur-3xl opacity-60"></div>

                    {/* Image if available */}
                    {quizImage && (
                      <div className="w-full aspect-video rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center">
                        <img 
                          src={quizImage} 
                          alt="Quiz Diagram" 
                          className="max-h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    )}

                    <div className="space-y-4 relative">
                      <div className="flex items-start gap-3">
                        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-lg text-xs font-bold leading-none mt-1">Q</span>
                        <h3 className="text-xl font-display font-bold text-slate-800 leading-tight">
                          {currentQuestion.question_box.question}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 gap-3 pt-4">
                        {currentQuestion.question_box.options.map((option, idx) => {
                          const isCorrect = option === currentQuestion.question_box.answer;
                          const isSelected = selectedAnswer === option;
                          
                          let cardClasses = "p-5 rounded-2xl border-2 transition-all flex items-center justify-between group ";
                          if (!isAnswered) {
                            cardClasses += "bg-white border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 active:scale-[0.98]";
                          } else {
                            if (isCorrect) {
                              cardClasses += "bg-emerald-50 border-emerald-500 text-emerald-800 z-10 scale-[1.02] shadow-lg shadow-emerald-100";
                            } else if (isSelected) {
                              cardClasses += "bg-rose-50 border-rose-500 text-rose-800 z-10";
                            } else {
                              cardClasses += "bg-slate-50 border-slate-50 text-slate-400 opacity-60 grayscale";
                            }
                          }

                          return (
                            <button
                              key={idx}
                              onClick={() => handleAnswerSelect(option)}
                              disabled={isAnswered}
                              className={cardClasses}
                            >
                              <div className="flex items-center gap-4">
                                <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all ${
                                  isCorrect && isAnswered ? 'bg-emerald-500 text-white' :
                                  isSelected && !isCorrect ? 'bg-rose-500 text-white' :
                                  'bg-slate-100 text-slate-400 group-hover:bg-indigo-100 group-hover:text-indigo-600'
                                }`}>
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span className="font-semibold text-left">{option}</span>
                              </div>
                              {isAnswered && isCorrect && <CheckCircle2 size={24} className="text-emerald-500" />}
                              {isAnswered && isSelected && !isCorrect && <XCircle size={24} className="text-rose-500" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                      {isAnswered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="overflow-hidden"
                        >
                          <div className="pt-6 border-t border-slate-100 mt-6">
                            <div className="flex items-center gap-2 mb-3 text-indigo-600">
                              <AlertCircle size={18} />
                              <span className="font-bold text-sm uppercase tracking-wider">Expert Explanation</span>
                            </div>
                            <p className="text-slate-600 leading-relaxed text-sm bg-slate-50 p-4 rounded-2xl border border-slate-100">
                              {currentQuestion.question_box.explanation}
                            </p>
                            <button
                              onClick={nextQuestion}
                              className="w-full mt-6 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all active:scale-[0.98] shadow-lg shadow-slate-200"
                            >
                              {totalQuestions >= settings.limit ? 'View Results' : 'Next Question'} <ChevronRight size={18} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 6: Quiz Result */}
          {step === AppStep.QUIZ_RESULT && (
            <motion.div
              key="quiz-result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full flex flex-col items-center gap-8 py-10"
            >
              <div className="relative">
                <div className="w-48 h-48 rounded-full border-8 border-indigo-100 flex flex-col items-center justify-center bg-white shadow-2xl relative z-10">
                  <span className="text-5xl font-display font-bold text-indigo-600">{Math.round((score / Math.max(totalQuestions, 1)) * 100)}%</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Total Score</span>
                </div>
                <div className="absolute -inset-4 bg-indigo-400/10 rounded-full blur-2xl animate-pulse"></div>
              </div>

              <div className="text-center space-y-2">
                <h2 className="text-3xl font-display font-bold text-slate-800">Quiz Completed!</h2>
                <p className="text-slate-500 font-medium max-w-sm">
                  Great job! You've successfully finished your {settings.subject} assessment for Class {settings.currentClass}.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                  <span className="block text-2xl font-bold text-emerald-600">{score}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Correct Answers</span>
                </div>
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm text-center">
                  <span className="block text-2xl font-bold text-slate-800">{totalQuestions}</span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Total Attempted</span>
                </div>
              </div>

              <button
                onClick={resetQuiz}
                className="w-full py-5 bg-indigo-600 text-white rounded-[24px] font-bold text-lg shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                Restart Learning <RotateCcw size={20} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="w-full max-w-2xl mt-8 pt-8 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-400 font-medium">
          OmniQuiz &copy; 2026. Professional AI Assessment System.
        </p>
      </footer>
    </div>
  );
}
