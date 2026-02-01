
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
    // Parol: gdpiu (Foydalanuvchi talabi asosida)
    if (username === 'admin' && password === 'gdpiu') {
      onLoginSuccess();
    } else {
      setError("Login yoki parol noto'g'ri!");
      setPassword('');
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <button 
        onClick={onBack}
        className="mb-6 text-gray-500 hover:text-indigo-600 flex items-center transition-colors font-bold"
      >
        <i className="fas fa-arrow-left mr-2"></i> Asosiyga qaytish
      </button>

      <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
        <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-100">
          <i className="fas fa-user-shield text-white text-4xl"></i>
        </div>
        <h2 className="text-3xl font-black text-gray-900 mb-2 text-center">Admin Kirish</h2>
        <p className="text-gray-500 mb-8 text-center">Tizimga kirish uchun login va parolni kiriting</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold animate-shake border border-red-100">
              <i className="fas fa-exclamation-circle mr-2"></i> {error}
            </div>
          )}

          <div className="text-left">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Foydalanuvchi nomi</label>
            <div className="relative">
              <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="Login"
                required
                autoComplete="username"
              />
            </div>
          </div>
          
          <div className="text-left">
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Parol</label>
            <div className="relative">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-300 transform active:scale-[0.98]"
          >
            Tizimga Kirish
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>
    </div>
  );
};

export default AdminLogin;