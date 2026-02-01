
import React, { useState, useEffect, useCallback } from 'react';
import { Subject, Question, TestResult } from '../types.ts';

interface QuizEngineProps {
  subject: Subject;
  student: { name: string; group: string };
  onComplete: (result: TestResult) => void;
  onCancel: () => void;
}

const QuizEngine: React.FC<QuizEngineProps> = ({ subject, student, onComplete, onCancel }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(subject.settings.timeLimitMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const selectedQuestions = [...subject.questions]
      .sort(() => Math.random() - 0.5)
      .slice(0, subject.settings.questionCount);

    const fullyRandomized = selectedQuestions.map(q => {
      const optionsWithMeta = q.options.map((text, originalIdx) => ({
        text,
        isCorrect: originalIdx === 0
      }));

      const shuffledOptions = optionsWithMeta.sort(() => Math.random() - 0.5);

      return {
        ...q,
        options: shuffledOptions.map(o => o.text),
        correctIndex: shuffledOptions.findIndex(o => o.isCorrect)
      };
    });

    setQuestions(fullyRandomized);
  }, [subject]);

  const finishQuiz = useCallback(() => {
    if (isFinished) return;
    setIsFinished(true);

    let score = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correctIndex) {
        score++;
      }
    });

    const result: TestResult = {
      id: `res-${Date.now()}`,
      studentName: student.name,
      group: student.group,
      subjectName: subject.name,
      score,
      total: questions.length,
      date: Date.now()
    };

    onComplete(result);
  }, [questions, answers, student, subject, isFinished, onComplete]);

  useEffect(() => {
    if (timeLeft <= 0) {
      finishQuiz();
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finishQuiz]);

  if (questions.length === 0) return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600 border-opacity-25 mb-4"></div>
      <p className="text-gray-500 font-bold">Savollar yuklanmoqda...</p>
    </div>
  );

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSelect = (optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionIdx }));
  };

  return (
    <div className="max-w-3xl mx-auto py-2">
      <div className="flex justify-between items-center mb-4 px-4">
        <div>
          <h2 className="text-xl font-black text-gray-900 leading-tight">{subject.name}</h2>
          <div className="flex items-center mt-1">
            <span className="bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider mr-3">
              Savol {currentIdx + 1} / {questions.length}
            </span>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl font-black text-lg flex items-center shadow-md transform transition-all ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse scale-105 shadow-red-100' : 'bg-white text-indigo-600 border border-gray-100'}`}>
          <i className="far fa-clock mr-2"></i> {formatTime(timeLeft)}
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden shadow-inner">
          <div 
            className="bg-indigo-600 h-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(79,70,229,0.5)]" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-xl border border-gray-100 min-h-[400px] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        
        <div className="mb-8">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black uppercase rounded-full mb-4 tracking-widest border border-indigo-100">
            Savol Mazmuni
          </span>
          <h3 className="text-xl md:text-2xl font-bold text-gray-800 leading-snug">
            {currentQuestion.text}
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-3.5 flex-grow">
          {currentQuestion.options.map((option, idx) => (
            <button 
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`group flex items-center p-4 rounded-2xl text-left transition-all duration-300 border-2 ${
                answers[currentQuestion.id] === idx 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg translate-y-[-1px]' 
                : 'bg-white border-gray-100 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50/20'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black mr-4 text-sm transition-colors flex-shrink-0 ${
                answers[currentQuestion.id] === idx ? 'bg-white/20 text-white' : 'bg-gray-100 text-indigo-500'
              }`}>
                {String.fromCharCode(65 + idx)}
              </div>
              <span className="text-base md:text-lg font-semibold flex-grow leading-tight">{option}</span>
              {answers[currentQuestion.id] === idx && (
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center animate-in fade-in zoom-in ml-2">
                  <i className="fas fa-check text-white text-xs"></i>
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-10 flex flex-col md:flex-row justify-between items-center gap-4">
          <button 
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="w-full md:w-auto px-6 py-3 text-gray-400 font-black uppercase tracking-widest text-[10px] flex items-center justify-center disabled:opacity-20 hover:text-indigo-600 transition-colors"
          >
            <i className="fas fa-long-arrow-alt-left mr-2 text-base"></i> Oldingi
          </button>
          
          <div className="flex gap-3 w-full md:w-auto">
            <button 
              onClick={() => { if(confirm("Testni to'xtatmoqchimisiz?")) onCancel(); }}
              className="px-5 py-3 text-red-500 font-bold text-sm hover:bg-red-50 rounded-xl transition-all"
            >
              To'xtatish
            </button>
            
            {currentIdx === questions.length - 1 ? (
              <button 
                onClick={finishQuiz}
                className="flex-grow md:flex-none px-8 py-3 bg-green-600 text-white font-black rounded-xl shadow-lg shadow-green-100 hover:bg-green-700 hover:scale-[1.01] transition-all flex items-center justify-center text-sm"
              >
                YAKUNLASH <i className="fas fa-flag-checkered ml-2"></i>
              </button>
            ) : (
              <button 
                onClick={() => setCurrentIdx(currentIdx + 1)}
                className="flex-grow md:flex-none px-8 py-3 bg-indigo-600 text-white font-black rounded-xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:scale-[1.01] transition-all flex items-center justify-center text-sm"
              >
                KEYINGI <i className="fas fa-long-arrow-alt-right ml-2 text-base"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-2 px-4">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`w-9 h-9 rounded-xl font-black text-[10px] transition-all transform ${
              currentIdx === idx 
              ? 'bg-indigo-600 text-white shadow-md scale-110 z-10' 
              : answers[questions[idx].id] !== undefined 
                ? 'bg-indigo-50 text-indigo-600 border-2 border-indigo-200'
                : 'bg-white text-gray-300 border border-gray-100 hover:bg-gray-50'
            }`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizEngine;