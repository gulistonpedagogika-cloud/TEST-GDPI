
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
    <div className="max-w-xs mx-auto py-6">
      <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 text-center">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-3 shadow-md">
          <i className="fas fa-user-graduate text-white text-lg"></i>
        </div>
        <h2 className="text-base font-black text-gray-900 mb-0.5">Kirish</h2>
        <p className="text-[9px] text-gray-400 mb-5 uppercase font-bold tracking-widest">Ma'lumotlarni to'ldiring</p>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="text-left">
            <label className="block text-[8px] font-black text-gray-400 mb-1 ml-0.5 uppercase tracking-wider">Foydalanuvchi</label>
            <div className="relative">
              <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-[10px]"></i>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-50 bg-gray-50/50 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-xs font-medium"
                placeholder="F.I.SH"
                required
              />
            </div>
          </div>
          
          <div className="text-left">
            <label className="block text-[8px] font-black text-gray-400 mb-1 ml-0.5 uppercase tracking-wider">Guruh</label>
            <div className="relative">
              <i className="fas fa-users absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-[10px]"></i>
              <input 
                type="text" 
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-50 bg-gray-50/50 focus:ring-1 focus:ring-indigo-500 outline-none transition-all text-xs font-medium"
                placeholder="Guruh"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-black text-[10px] uppercase tracking-wider hover:bg-indigo-700 transition-all shadow active:scale-[0.98] mt-2"
          >
            Davom etish
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;
