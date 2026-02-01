
import React, { useState } from 'react';

interface StudentLoginProps {
  onLogin: (name: string, group: string) => void;
}

const StudentLogin: React.FC<StudentLoginProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && group.trim()) {
      onLogin(name.trim(), group.trim());
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 text-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100">
          <i className="fas fa-user-graduate text-white text-4xl"></i>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Talaba Kirishi</h2>
        <p className="text-gray-500 mb-8">Testni boshlash uchun ma'lumotlaringizni kiriting</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-left">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">F.I.O (To'liq ism-sharif)</label>
            <div className="relative">
              <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Masalan: Azizov Anvar"
                required
              />
            </div>
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Guruh</label>
            <div className="relative">
              <i className="fas fa-users absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Masalan: 201-guruh"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-300 transform active:scale-[0.98]"
          >
            Kirish va Testni Tanlash
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
