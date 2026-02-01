
import React from 'react';
import { AppView } from '../types.ts';

interface LandingPageProps {
  setView: (view: AppView) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ setView }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">
          Testlash Tizimiga <span className="text-indigo-600">Xush Kelibsiz</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Bilimingizni sinash uchun qulay platforma. Testlarni bajaring, natijalarni kuzating va mahoratingizni oshiring.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div 
          onClick={() => setView(AppView.STUDENT_LOGIN)}
          className="group relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100 cursor-pointer hover:border-indigo-500 hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className="fas fa-user-graduate text-9xl"></i>
          </div>
          <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors">
            <i className="fas fa-user-graduate text-indigo-600 text-2xl group-hover:text-white transition-colors"></i>
          </div>
          <h2 className="text-2xl font-bold mb-4 group-hover:text-indigo-600 transition-colors">Talaba Paneli</h2>
          <p className="text-gray-500 leading-relaxed">
            Testlarni yechish, natijalarni ko'rish va o'z bilim darajangizni aniqlash uchun bu yerdan kiring.
          </p>
          <div className="mt-8 flex items-center text-indigo-600 font-bold">
            Kirish <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>

        <div 
          onClick={() => setView(AppView.ADMIN_LOGIN)}
          className="group relative bg-white p-8 rounded-3xl shadow-lg border border-gray-100 cursor-pointer hover:border-emerald-500 hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className="fas fa-user-shield text-9xl"></i>
          </div>
          <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
            <i className="fas fa-user-shield text-emerald-600 text-2xl group-hover:text-white transition-colors"></i>
          </div>
          <h2 className="text-2xl font-bold mb-4 group-hover:text-emerald-600 transition-colors">Admin Panel</h2>
          <p className="text-gray-500 leading-relaxed">
            Yangi testlar yuklash, savollar bazasini boshqarish va talabalar natijalarini tahlil qilish.
          </p>
          <div className="mt-8 flex items-center text-emerald-600 font-bold">
            Kirish <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center p-6">
          <div className="text-indigo-500 mb-4 bg-indigo-50 w-12 h-12 rounded-full flex items-center justify-center">
            <i className="fas fa-bolt"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Tezkorlik</h3>
          <p className="text-gray-500 text-sm">Testlarni yuklash va yechish bir necha soniyada.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <div className="text-emerald-500 mb-4 bg-emerald-50 w-12 h-12 rounded-full flex items-center justify-center">
            <i className="fas fa-shield-alt"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Xavfsizlik</h3>
          <p className="text-gray-500 text-sm">Barcha ma'lumotlar maxfiy va xavfsiz saqlanadi.</p>
        </div>
        <div className="flex flex-col items-center text-center p-6">
          <div className="text-amber-500 mb-4 bg-amber-50 w-12 h-12 rounded-full flex items-center justify-center">
            <i className="fas fa-chart-line"></i>
          </div>
          <h3 className="font-bold text-lg mb-2">Statistika</h3>
          <p className="text-gray-500 text-sm">Natijalarni tahlil qilish uchun chuqur statistika.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
