import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

const roleOptions = [
  { value: 'reporter', label: 'Reporter', icon: '📝' },
  { value: 'developer', label: 'Developer', icon: '💻' },
  { value: 'admin', label: 'Admin', icon: '👑' },
];

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'reporter',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const passwordStrength = useMemo(() => {
    const password = formData.password;
    if (password.length === 0) return { label: '', value: 0, color: 'bg-slate-200' };
    if (password.length < 6) return { label: 'Weak', value: 33, color: 'bg-rose-500' };
    const medium = /(?=.*[A-Za-z])(?=.*\d)/.test(password);
    const strong = /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])/.test(password);
    if (strong) return { label: 'Strong', value: 100, color: 'bg-emerald-500' };
    if (medium) return { label: 'Medium', value: 66, color: 'bg-amber-400' };
    return { label: 'Weak', value: 33, color: 'bg-rose-500' };
  }, [formData.password]);

  const validate = () => {
    const validationErrors = {};
    if (!formData.name.trim()) {
      validationErrors.name = 'Full name is required.';
    } else if (formData.name.trim().length < 3) {
      validationErrors.name = 'Name must be at least 3 characters.';
    }

    if (!formData.email.trim()) {
      validationErrors.email = 'Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      validationErrors.email = 'Enter a valid email address.';
    }

    if (!formData.password) {
      validationErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      validationErrors.password = 'Password should be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      validationErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.confirmPassword !== formData.password) {
      validationErrors.confirmPassword = 'Passwords do not match.';
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  };

  const handleRoleChange = (role) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await authService.register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      const { user, token } = response.data;
      login(user, token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-slate-100 transition-all duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl sm:flex-row">
        <aside className="relative h-96 bg-slate-950 px-8 py-10 text-white sm:h-auto sm:w-[40%] sm:px-10 sm:py-12">
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
              <p className="text-sm uppercase tracking-[0.3em] text-sky-500">Create your account</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">Register for BugTracker</h2>
              <p className="mt-2 text-sm text-slate-500">Start tracking issues and collaborating with your team today.</p>
            </div>

            {error && (
              <div className="mb-6 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                {errors.name && <p className="mt-2 text-sm text-rose-600">{errors.name}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📧</span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full rounded-full ${passwordStrength.color}`} style={{ width: `${passwordStrength.value}%` }} />
                  </div>
                  <span className="min-w-[64px] text-right text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {passwordStrength.label}
                  </span>
                </div>
                {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password}</p>}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  required
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 py-3 px-4 text-sm text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                {errors.confirmPassword && <p className="mt-2 text-sm text-rose-600">{errors.confirmPassword}</p>}
              </div>

              <div>
                <p className="mb-3 text-sm font-medium text-slate-700">Role</p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {roleOptions.map((option) => {
                    const selected = formData.role === option.value;
                    return (
                      <button
                        type="button"
                        key={option.value}
                        onClick={() => handleRoleChange(option.value)}
                        className={`rounded-3xl border p-4 text-left transition ${selected ? 'border-slate-900 bg-slate-950 text-white shadow-lg shadow-slate-900/10' : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-slate-100'}`}
                      >
                        <div className="mb-2 text-2xl">{option.icon}</div>
                        <div className="text-sm font-semibold">{option.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-3xl bg-gradient-to-r from-slate-900 to-slate-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="h-3 w-16 rounded-full bg-slate-200 animate-pulse" />
                    Creating account...
                  </span>
                ) : (
                  'Register'
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-slate-900 transition hover:text-slate-700">
                Login
              </Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}
