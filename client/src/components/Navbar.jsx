import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/bugs', label: 'Bugs', icon: '🐛' },
  { to: '/bugs/new', label: 'Create Bug', icon: '➕' },
];

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);
  const toggleMobile = () => setMobileOpen((prev) => !prev);

  const initials = user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U';
  const userName = user?.name?.toUpperCase() || 'USER';
  const userRole = user?.role || 'member';

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-900/10 bg-slate-950/95 shadow-xl shadow-slate-950/20 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-900/80 px-3 py-2 text-2xl shadow-sm shadow-slate-950/40">🐛</div>
          <Link to="/" className="inline-flex flex-col leading-tight">
            <span className="text-lg font-bold tracking-tight text-white">BugTracker</span>
            <span className="text-sm font-semibold text-transparent bg-gradient-to-r from-sky-300 via-purple-300 to-fuchsia-300 bg-clip-text">
              Issue management
            </span>
          </Link>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated &&
            navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <div className="relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-900/95 px-3 py-2 transition hover:border-slate-500"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold uppercase text-white shadow-sm">
                  {initials}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold text-white">{userName}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{userRole}</p>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-44 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/95 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/profile');
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
                  >
                    <span>👤</span>
                    Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      navigate('/settings');
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
                  >
                    <span>⚙️</span>
                    Settings
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm text-rose-400 transition hover:bg-slate-900"
                  >
                    <span>🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-700"
              >
                Register
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={toggleMobile}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-700 bg-slate-900/95 text-xl text-slate-200 transition hover:border-slate-500 md:hidden"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileOpen && isAuthenticated && (
        <div className="border-t border-slate-800 bg-slate-950/95 px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-slate-800 text-white' : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                  }`
                }
              >
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-3xl border border-slate-800 bg-slate-900/90 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-sm font-semibold uppercase text-white shadow-sm">
              {initials}
            </div>
            <div>
              <p className="font-semibold text-white">{userName}</p>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{userRole}</p>
            </div>
          </div>
          <div className="mt-3 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate('/profile');
              }}
              className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
            >
              <span>👤</span>
              Profile
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                navigate('/settings');
              }}
              className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-900"
            >
              <span>⚙️</span>
              Settings
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm text-rose-400 transition hover:bg-slate-900"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
