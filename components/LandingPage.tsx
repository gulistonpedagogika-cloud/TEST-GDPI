
import React from 'react';
import { AppView } from '../types.ts';

interface LandingPageProps {
  setView: (view: AppView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
  return (
    <div className="max-w-3xl mx-auto py-2 px-2">
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 tracking-tight">
          Testlash <span className="text-indigo-600">Tizimi</span>
        </h1>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Bilimingizni sinash uchun ixcham va qulay platforma.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          onClick={() => setView(AppView.STUDENT_LOGIN)}
          className="group relative bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200"
        >
          <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-indigo-600 transition-colors">
            <i className="fas fa-user-graduate text-indigo-600 text-base group-hover:text-white transition-colors"></i>
          </div>
          <h2 className="text-base font-bold mb-1 group-hover:text-indigo-600 transition-colors">Talaba</h2>
          <p className="text-[11px] text-gray-500 leading-snug">
            Testlarni yechish va bilim darajangizni aniqlash.
          </p>
          <div className="mt-3 flex items-center text-indigo-600 font-bold text-[10px] uppercase tracking-wider">
            Kirish <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>

        <div 
          onClick={() => setView(AppView.ADMIN_LOGIN)}
          className="group relative bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:border-emerald-400 hover:shadow-md transition-all duration-200"
        >
          <div className="bg-emerald-50 w-10 h-10 rounded-lg flex items-center justify-center mb-3 group-hover:bg-emerald-600 transition-colors">
            <i className="fas fa-user-shield text-emerald-600 text-base group-hover:text-white transition-colors"></i>
          </div>
          <h2 className="text-base font-bold mb-1 group-hover:text-emerald-600 transition-colors">Admin</h2>
          <p className="text-[11px] text-gray-500 leading-snug">
            Testlar yuklash va natijalarni tahlil qilish.
          </p>
          <div className="mt-3 flex items-center text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
            Boshqaruv <i className="fas fa-arrow-right ml-1 group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center space-x-6">
        <div className="flex flex-col items-center">
          <div className="text-indigo-400 mb-1 bg-indigo-50/50 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
            <i className="fas fa-bolt"></i>
          </div>
          <h3 className="font-bold text-[9px] uppercase tracking-tighter text-gray-400">Tezkor</h3>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-emerald-400 mb-1 bg-emerald-50/50 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3 className="font-bold text-[9px] uppercase tracking-tighter text-gray-400">Xavfsiz</h3>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-amber-400 mb-1 bg-amber-50/50 w-6 h-6 rounded-full flex items-center justify-center text-[10px]">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3 className="font-bold text-[9px] uppercase tracking-tighter text-gray-400">Analitika</h3>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
