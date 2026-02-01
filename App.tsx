
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

  // Fetch data from Supabase on mount
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: subjectsData, error: subjectsError } = await supabase
          .from('subjects')
          .select('*')
          .order('createdAt', { ascending: false });

        if (subjectsError) throw subjectsError;
        setSubjects(subjectsData || []);

        const { data: resultsData, error: resultsError } = await supabase
          .from('test_results')
          .select('*')
          .order('date', { ascending: false });

        if (resultsError) throw resultsError;
        setResults(resultsData || []);
      } catch (err) {
        console.error('Data fetching error:', err);
      } finally {
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
      alert('Bazaga saqlashda xatolik yuz berdi');
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
      setView(AppView.STUDENT_RESULT);
    } catch (err) {
      console.error('Error submitting result:', err);
      // Fallback local display if DB fails
      setLastResult(result);
      setView(AppView.STUDENT_RESULT);
    }
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-600 font-bold tracking-widest uppercase text-xs">Ma'lumotlar yuklanmoqda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center space-x-2 cursor-pointer" 
            onClick={() => setView(AppView.LANDING)}
          >
            <div className="bg-indigo-600 p-2 rounded-lg">
              <i className="fas fa-graduation-cap text-white text-xl"></i>
            </div>
            <span className="font-bold text-xl tracking-tight">TEST <span className="text-[10px] bg-indigo-50 text-indigo-500 px-2 py-0.5 rounded ml-1">GDPI</span></span>
          </div>
          
          <nav className="flex items-center space-x-4">
            {view !== AppView.LANDING && (
              <button 
                onClick={() => setView(AppView.LANDING)}
                className="text-gray-600 hover:text-indigo-600 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                Asosiy
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {view === AppView.LANDING && (
          <LandingPage setView={setView} />
        )}

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

        {view === AppView.STUDENT_LOGIN && (
          <StudentLogin onLogin={handleStudentLogin} />
        )}

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
          <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-100 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-check text-4xl text-green-600"></i>
            </div>
            <h2 className="text-3xl font-bold mb-2">Test Yakunlandi!</h2>
            <p className="text-gray-600 mb-6">Natijangiz serverga saqlandi.</p>
            <div className="bg-indigo-50 p-6 rounded-xl mb-8">
              <span className="text-5xl font-extrabold text-indigo-600">
                {lastResult.score} / {lastResult.total}
              </span>
              <p className="text-sm text-indigo-400 mt-2 font-semibold">To'g'ri javoblar</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-left text-sm mb-8">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-400">Talaba:</p>
                <p className="font-bold truncate">{lastResult.studentName}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-400">Guruh:</p>
                <p className="font-bold truncate">{lastResult.group}</p>
              </div>
            </div>
            <button 
              onClick={() => setView(AppView.LANDING)}
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200"
            >
              Asosiy sahifaga qaytish
            </button>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-gray-400 text-xs">
        <p>2026 GSPI</p>
      </footer>
    </div>
  );
};

export default App;