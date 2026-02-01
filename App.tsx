
import React, { useState, useEffect } from 'react';
import { AppView, Subject, TestResult } from './types.ts';
import { supabase } from './supabaseClient.ts';
import AdminPanel from './components/AdminPanel.tsx';
import AdminResults from './components/AdminResults.tsx';
import AdminLogin from './components/AdminLogin.tsx';
import StudentLogin from './components/StudentLogin.tsx';
import StudentSubjects from './components/StudentSubjects.tsx';
import QuizEngine from './components/QuizEngine.tsx';
import LandingPage from './components/LandingPage.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentStudent, setCurrentStudent] = useState<{ name: string; group: string } | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [lastResult, setLastResult] = useState<TestResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Yuklanishni maksimal 5 soniya kutamiz, keyin majburiy to'xtatamiz
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 5000);

      try {
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .order('createdAt', { ascending: false });

        if (!subjectsError) setSubjects(subjectsData || []);

        const { data: resultsData, error: resultsError } = await supabase
          .from('test_results')
          .select('*')
          .order('date', { ascending: false });

        if (!resultsError) setResults(resultsData || []);
      } catch (err) {
        console.error('Baza bilan bog‘lanishda xatolik:', err);
      } finally {
        clearTimeout(timeout);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const addSubject = async (newSubject: Subject) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert([newSubject])
        .select();

      if (error) throw error;
      setSubjects(prev => [data[0], ...prev]);
    } catch (err) {
      console.error('Error adding subject:', err);
      // Agar baza ishlamasa, mahalliy holatda qo'shib qo'yamiz (vaqtincha)
      setSubjects(prev => [newSubject, ...prev]);
      alert('Ma’lumot bazaga saqlanmadi, lekin vaqtincha ro‘yxatda ko‘rinadi.');
    }
  };

  const deleteSubject = async (id: string) => {
    if (!confirm("Haqiqatan ham o'chirmoqchimisiz?")) return;
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSubjects(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Error deleting subject:', err);
      setSubjects(prev => prev.filter(s => s.id !== id));
    }
  };

  const submitResult = async (result: TestResult) => {
    try {
      const { data, error } = await supabase
        .from('test_results')
        .insert([result])
        .select();

      if (error) throw error;
      setResults(prev => [data[0], ...prev]);
      setLastResult(data[0]);
    } catch (err) {
      console.error('Error submitting result:', err);
      setLastResult(result);
    }
    setView(AppView.STUDENT_RESULT);
  };

  const handleStudentLogin = (name: string, group: string) => {
    setCurrentStudent({ name, group });
    setView(AppView.STUDENT_SUBJECTS);
  };

  const startQuiz = (subject: Subject) => {
    setSelectedSubject(subject);
    setView(AppView.STUDENT_QUIZ);
  };

  if (isLoading && view === AppView.LANDING) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-600 font-black tracking-widest uppercase text-[9px] animate-pulse">Bog‘lanmoqda...</p>
        <button 
          onClick={() => setIsLoading(false)}
          className="mt-8 text-[10px] text-gray-400 underline uppercase font-bold"
        >
          Kutmasdan kirish
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/30">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-10 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => setView(AppView.LANDING)}
          >
            <div className="bg-indigo-600 p-1 rounded-md shadow-sm">
              <i className="fas fa-graduation-cap text-white text-[10px]"></i>
            </div>
            <span className="font-black text-xs tracking-tight uppercase">GDPI <span className="text-indigo-600">TEST</span></span>
          </div>
          
          <nav className="flex items-center">
            {view !== AppView.LANDING && (
              <button 
                onClick={() => setView(AppView.LANDING)}
                className="text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded text-[9px] font-black uppercase tracking-wider"
              >
                Chiqish <i className="fas fa-sign-out-alt ml-1"></i>
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-3 py-3">
        {view === AppView.LANDING && <LandingPage setView={setView} />}

        {view === AppView.ADMIN_LOGIN && (
          <AdminLogin 
            onLoginSuccess={() => setView(AppView.ADMIN_DASHBOARD)} 
            onBack={() => setView(AppView.LANDING)}
          />
        )}

        {view === AppView.ADMIN_DASHBOARD && (
          <AdminPanel 
            subjects={subjects} 
            addSubject={addSubject} 
            deleteSubject={deleteSubject}
            onGoToResults={() => setView(AppView.ADMIN_RESULTS)}
          />
        )}

        {view === AppView.ADMIN_RESULTS && (
          <AdminResults 
            results={results} 
            onBack={() => setView(AppView.ADMIN_DASHBOARD)}
          />
        )}

        {view === AppView.STUDENT_LOGIN && <StudentLogin onLogin={handleStudentLogin} />}

        {view === AppView.STUDENT_SUBJECTS && currentStudent && (
          <StudentSubjects 
            subjects={subjects} 
            onSelectSubject={startQuiz}
            studentName={currentStudent.name}
          />
        )}

        {view === AppView.STUDENT_QUIZ && selectedSubject && currentStudent && (
          <QuizEngine 
            subject={selectedSubject} 
            student={currentStudent}
            onComplete={submitResult}
            onCancel={() => setView(AppView.STUDENT_SUBJECTS)}
          />
        )}

        {view === AppView.STUDENT_RESULT && lastResult && (
          <div className="max-w-xs mx-auto bg-white p-6 rounded-2xl shadow-xl text-center border border-gray-100 animate-in zoom-in duration-200">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-check text-xl text-green-500"></i>
            </div>
            <h2 className="text-lg font-black mb-1">Natija tayyor!</h2>
            <div className="bg-indigo-50/50 p-4 rounded-xl mb-4 border border-indigo-100/50">
              <span className="text-3xl font-black text-indigo-600">
                {lastResult.score} / {lastResult.total}
              </span>
              <p className="text-[8px] text-indigo-400 mt-1 font-black uppercase tracking-widest">To'g'ri javoblar</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left text-[9px] mb-6">
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-400 font-bold uppercase mb-0.5">Talaba</p>
                <p className="font-black text-gray-800 truncate">{lastResult.studentName}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-400 font-bold uppercase mb-0.5">Guruh</p>
                <p className="font-black text-gray-800 truncate">{lastResult.group}</p>
              </div>
            </div>
            <button 
              onClick={() => setView(AppView.LANDING)}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
              Asosiy menyu
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-2.5 text-center text-gray-300 text-[8px] font-black uppercase tracking-[0.2em]">
        <p>&copy; 2026 GDPI - Online Test Platform</p>
      </footer>
    </div>
  );
};

export default App;
