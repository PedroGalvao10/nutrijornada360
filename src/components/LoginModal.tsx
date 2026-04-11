import React, { useState } from 'react';
import { useAuth } from '../context/AuthContextCore';
import { useNavigate } from 'react-router-dom';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { checkAuth } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok) {
        await checkAuth();
        onClose();
        navigate('/admin/dashboard');
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch {
      setError('Problema de rede. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#faf6f0] dark:bg-stone-900 rounded-2xl shadow-xl w-full max-w-sm p-8 border border-stone-200 dark:border-stone-800">
        <h2 className="text-2xl font-serif text-[#705c30] dark:text-amber-500 mb-6 text-center">Acesso Restrito</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-3 rounded-lg mb-4 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">E-mail</label>
            <input 
              id="email"
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 rounded-lg p-2 md:p-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#705c30]"
              required 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1">Senha</label>
            <input 
              id="password"
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 rounded-lg p-2 md:p-3 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#705c30]"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 bg-[#705c30] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-opacity flex justify-center items-center"
          >
            {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : 'Entrar no Painel'}
          </button>
        </form>
        <button onClick={onClose} className="mt-4 w-full text-center text-sm text-stone-500 hover:text-stone-800 underline">
          Voltar
        </button>
      </div>
    </div>
  );
}
