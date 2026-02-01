
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
        image: q.optionImages ? q.optionImages[originalIdx] : undefined,
        isCorrect: originalIdx === 0
      }));
      const shuffledOptions = optionsWithMeta.sort(() => Math.random() - 0.5);
      return {
        ...q,
        options: shuffledOptions.map(o => o.text),
        optionImages: shuffledOptions.map(o => o.image),
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
      if (answers[q.id] === q.correctIndex) score++;
    });
    onComplete({
      id: `res-${Date.now()}`,
      studentName: student.name,
      group: student.group,
      subjectName: subject.name,
      score,
      total: questions.length,
      date: Date.now()
    });
  }, [questions, answers, student, subject, isFinished, onComplete]);

  useEffect(() => {
    if (timeLeft <= 0) { finishQuiz(); return; }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, finishQuiz]);

  if (questions.length === 0) return (
    <div className="flex flex-col items-center justify-center h-48">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-indigo-600 mb-2"></div>
      <p className="text-[8px] text-gray-400 font-black uppercase tracking-widest">Yuklanmoqda...</p>
    </div>
  );

  const currentQuestion = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-2xl mx-auto py-1">
      <div className="flex justify-between items-end mb-2 px-1">
        <div>
          <h2 className="text-xs font-black text-gray-900 truncate max-w-[150px] uppercase tracking-tight">{subject.name}</h2>
          <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">Savol {currentIdx + 1}/{questions.length}</span>
        </div>
        <div className={`px-2 py-1 rounded-lg font-black text-xs flex items-center ${timeLeft < 60 ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-white text-indigo-600 border border-gray-100'}`}>
          <i className="far fa-clock mr-1 text-[10px]"></i> {formatTime(timeLeft)}
        </div>
      </div>

      <div className="px-1 mb-3">
        <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
          <div className="bg-indigo-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
        <div className="mb-4">
          <h3 className="text-sm font-bold text-gray-800 leading-snug mb-3">{currentQuestion.text}</h3>
          {currentQuestion.image && (
            <div className="flex justify-center mb-3 bg-gray-50/50 rounded-lg p-2 border border-gray-100">
              <img src={currentQuestion.image} alt="Q" className="max-h-32 object-contain rounded-md" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-grow content-start">
          {currentQuestion.options.map((option, idx) => (
            <button 
              key={idx}
              onClick={() => setAnswers(prev => ({ ...prev, [currentQuestion.id]: idx }))}
              className={`flex flex-col items-start p-2 rounded-lg transition-all border ${
                answers[currentQuestion.id] === idx 
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' 
                : 'bg-white border-gray-100 text-gray-700 hover:border-indigo-100'
              }`}
            >
              <div className="flex items-center w-full">
                <span className={`w-5 h-5 rounded flex items-center justify-center font-black mr-2 text-[9px] flex-shrink-0 ${answers[currentQuestion.id] === idx ? 'bg-white/20' : 'bg-indigo-50 text-indigo-500'}`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-[11px] font-bold leading-tight">{option}</span>
              </div>
              {currentQuestion.optionImages && currentQuestion.optionImages[idx] && (
                <div className="mt-1.5 w-full flex justify-center bg-black/5 rounded p-1">
                   <img src={currentQuestion.optionImages[idx]} alt="O" className="max-h-16 object-contain rounded-sm" />
                </div>
              )}
            </button>
          ))}
        </div>

        <div className="mt-4 flex justify-between items-center gap-2 border-t border-gray-50 pt-3">
          <button 
            onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
            disabled={currentIdx === 0}
            className="px-2 py-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest disabled:opacity-10 hover:text-indigo-600 transition-colors"
          >
            Orqaga
          </button>
          <div className="flex gap-1.5">
            <button onClick={() => confirm("Bekor qilish?") && onCancel()} className="px-2 py-1.5 text-[9px] font-bold text-red-400 uppercase">Tugatish</button>
            {currentIdx === questions.length - 1 ? (
              <button onClick={finishQuiz} className="px-4 py-1.5 bg-green-600 text-white text-[10px] font-black rounded-lg shadow-sm uppercase tracking-wider">Topshirish</button>
            ) : (
              <button onClick={() => setCurrentIdx(currentIdx + 1)} className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black rounded-lg shadow-sm uppercase tracking-wider">Keyingi</button>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap justify-center gap-1 px-1 pb-4">
        {questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIdx(idx)}
            className={`w-6 h-6 rounded-md text-[8px] font-black transition-all ${
              currentIdx === idx ? 'bg-indigo-600 text-white' : answers[questions[idx].id] !== undefined ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-gray-200 border border-gray-100'
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
