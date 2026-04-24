import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center px-6 transition-all duration-1000 ${
      isDark 
        ? 'bg-slate-900' 
        : 'bg-gradient-to-br from-sky-50 via-white to-purple-50'
    }`}>
      <div className={`w-full max-w-md p-8 rounded-2xl backdrop-blur-sm border shadow-2xl transition-all duration-300 ${
        isDark 
          ? 'bg-slate-800/50 border-slate-700/50' 
          : 'bg-white/70 border-gray-200/50'
      }`}>
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isDark 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600' 
              : 'bg-gradient-to-r from-indigo-500 to-purple-500'
          }`}>
            <LogIn className="w-8 h-8 text-white" />
          </div>
          <h2 className={`text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}>
            Admin Login
          </h2>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Sign in to access the dashboard
          </p>
        </div>

        {error && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            isDark 
              ? 'bg-red-500/20 border border-red-500/50 text-red-400' 
              : 'bg-red-50 border border-red-200 text-red-600'
          }`}>
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Email
            </label>
            <div className="relative">
              <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400' 
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500'
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  isDark ? 'focus:ring-blue-500' : 'focus:ring-indigo-500'
                }`}
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Password
            </label>
            <div className="relative">
              <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDark 
                    ? 'bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 focus:border-blue-400' 
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-indigo-500'
                } focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                  isDark ? 'focus:ring-blue-500' : 'focus:ring-indigo-500'
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
              isDark 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

