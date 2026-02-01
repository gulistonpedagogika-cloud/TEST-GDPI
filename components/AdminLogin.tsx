
import React, { useState } from 'react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBack: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'gdpiu') {
      onLoginSuccess();
    } else {
      setError("Xato login yoki parol!");
      setPassword('');
    }
  };

  return (
    <div className="max-w-xs mx-auto py-6">
      <button 
        onClick={onBack}
        className="mb-4 text-gray-400 hover:text-indigo-600 flex items-center transition-colors font-bold text-[10px] uppercase tracking-wider"
      >
        <i className="fas fa-arrow-left mr-1.5"></i> Orqaga
      </button>

      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
        <div className="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mx-auto mb-4 shadow-md">
          <i className="fas fa-user-shield text-white text-xl"></i>
        </div>
        <h2 className="text-base font-black text-gray-900 mb-0.5 text-center uppercase tracking-tight">Admin Kirish</h2>
        <p className="text-[9px] text-gray-400 mb-6 text-center uppercase tracking-widest">Boshqaruv uchun kirish</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-500 p-2 rounded-lg text-[9px] font-bold border border-red-100 text-center uppercase">
              {error}
            </div>
          )}

          <div className="text-left">
            <label className="block text-[8px] font-black text-gray-400 mb-1 ml-0.5 uppercase tracking-wider">Login</label>
            <div className="relative">
              <i className="fas fa-user absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-[10px]"></i>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-50 bg-gray-50/50 outline-none text-xs font-medium focus:ring-1 focus:ring-indigo-500"
                placeholder="Login"
                required
              />
            </div>
          </div>
          
          <div className="text-left">
            <label className="block text-[8px] font-black text-gray-400 mb-1 ml-0.5 uppercase tracking-wider">Parol</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-[10px]"></i>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-50 bg-gray-50/50 outline-none text-xs font-medium focus:ring-1 focus:ring-indigo-500"
                placeholder="••••"
                required
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-black text-[10px] uppercase tracking-wider hover:bg-indigo-700 transition-all shadow active:scale-[0.98] mt-2"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
