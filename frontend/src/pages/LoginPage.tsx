import React, { useState } from 'react';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


  const handleAuth = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  
  try {
    const loginData = {
      email: email,    
      password: password 
    };

    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(loginData) 
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', data.user_name || 'Пользователь');
      
      window.location.href = '/'; 
    } else {
      if (Array.isArray(data.detail)) {
        setError(data.detail[0].msg || "Ошибка валидации");
      } else {
        setError(data.detail || "Неверный логин или пароль");
      }
    }
  } catch (err) {
    setError('Сервер недоступен');
  } finally {
    setLoading(false);
  }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-md border border-gray-100 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-10">
          <div className="inline-block p-5 bg-blue-50 rounded-full text-blue-600 mb-4">
            <Lock size={40} strokeWidth={3} />
          </div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-gray-900 leading-none">ВХОД</h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl flex items-center gap-3 border border-red-100">
            <AlertCircle size={20} />
            <span className="text-sm font-bold uppercase italic">{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-5 top-5 text-gray-300" size={20} />
            <input 
              type="email" 
              placeholder="Введите Email"
              className="w-full p-5 pl-14 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-blue-600 outline-none font-bold text-sm transition-all"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-5 top-5 text-gray-300" size={20} />
            <input 
              type="password" 
              placeholder="Введите пароль"
              className="w-full p-5 pl-14 bg-gray-50 rounded-[1.5rem] border-2 border-transparent focus:border-blue-600 outline-none font-bold text-sm transition-all"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-6 bg-blue-600 text-white rounded-[1.8rem] font-black uppercase italic text-lg shadow-xl shadow-blue-100 hover:bg-black transition-all mt-6 disabled:opacity-50"
          >
            {loading ? "ВХОД..." : "ВОЙТИ ⚡"}
          </button>
        </form>
      </div>
    </div>
  );
};