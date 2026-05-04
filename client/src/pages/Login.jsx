import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      const { user, token } = response.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 transition-all duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'} `}>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl sm:flex-row">
        <aside className="relative h-80 bg-slate-950 px-8 py-10 text-white sm:h-auto sm:w-[40%] sm:px-10 sm:py-12">
          <div className="flex h-full flex-col justify-center gap-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-3 rounded-full bg-white/10 px-4 py-3 text-lg font-semibold shadow-sm shadow-slate-950/20">
                <span>🐛</span>
                <span>BugTracker</span>
              </div>
              <h1 className="text-5xl font-bold leading-tight text-white">Track bugs. Ship faster.</h1>
            </div>

            <div className="space-y-4 text-sm text-slate-300">
              <p className="flex items-start gap-3">
                <span className="mt-1 text-emerald-400">✓</span>
                Track and manage bugs efficiently
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-1 text-emerald-400">✓</span>
                Collaborate with your team
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-1 text-emerald-400">✓</span>
                Role based access control
              </p>
            </div>
          </div>
        </aside>

        <main className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-xl rounded-[2rem] bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
            <div className="mb-8">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Welcome back</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Login to your account</h2>
              <p className="mt-2 text-sm text-slate-500">Enter your credentials to access your bug tracking workspace.</p>
            </div>

            {error && (
              <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 px-4 pr-12 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-slate-900"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <label className="inline-flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
                  />
                  Remember me
                </label>
                <Link to="#" className="text-sm font-medium text-sky-600 transition hover:text-sky-500">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-sky-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="h-3 w-16 rounded-full bg-slate-200 animate-pulse" />
                    Logging in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-slate-900 transition hover:text-slate-700">
                Register
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
