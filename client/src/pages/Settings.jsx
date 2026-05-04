import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/ConfirmDialog';

const defaultPreferences = {
  theme: 'light',
  emailNotifications: true,
  pushNotifications: false,
  weeklySummary: true,
  defaultSeverity: 'medium',
};

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem('bugTrackerPreferences');
    if (saved) {
      setPreferences(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem('bugTrackerPreferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    document.body.classList.toggle('bg-slate-950', preferences.theme === 'dark');
  }, [preferences.theme]);

  const handleToggleTheme = () => {
    setPreferences((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
    toast.success(`Switched to ${preferences.theme === 'light' ? 'dark' : 'light'} mode`);
  };

  const handleDeleteAccount = () => {
    setDialogOpen(true);
  };

  const confirmDelete = () => {
    setDialogOpen(false);
    toast.error('Account deletion is not enabled in this demo.');
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Settings</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">Preferences & account</h1>
              <p className="mt-2 text-sm text-slate-500">Customize your experience and manage account details.</p>
            </div>
            <div className="rounded-3xl bg-slate-50 px-5 py-4 text-sm text-slate-600 shadow-sm">
              Role: <span className="font-semibold text-slate-900">{user?.role || 'member'}</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Preferences</h2>
            <p className="mt-2 text-sm text-slate-500">Adjust your default behavior and notification settings.</p>

            <div className="mt-8 space-y-6">
              <div className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Theme</h3>
                    <p className="mt-1 text-sm text-slate-500">Switch between light and dark display styles.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleTheme}
                    className="rounded-full bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                  >
                    {preferences.theme === 'light' ? 'Light mode' : 'Dark mode'}
                  </button>
                </div>
              </div>

              <div className="grid gap-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
                    <p className="mt-1 text-sm text-slate-500">Control which notifications you want to receive.</p>
                  </div>
                </div>
                <label className="flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-4 shadow-sm">
                  <span className="text-sm font-medium text-slate-700">Email alerts</span>
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={() => setPreferences((prev) => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                    className="h-5 w-5 rounded border-slate-300 text-sky-600"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-4 shadow-sm">
                  <span className="text-sm font-medium text-slate-700">Push notifications</span>
                  <input
                    type="checkbox"
                    checked={preferences.pushNotifications}
                    onChange={() => setPreferences((prev) => ({ ...prev, pushNotifications: !prev.pushNotifications }))}
                    className="h-5 w-5 rounded border-slate-300 text-sky-600"
                  />
                </label>
                <label className="flex items-center justify-between gap-3 rounded-3xl bg-white px-4 py-4 shadow-sm">
                  <span className="text-sm font-medium text-slate-700">Weekly summary</span>
                  <input
                    type="checkbox"
                    checked={preferences.weeklySummary}
                    onChange={() => setPreferences((prev) => ({ ...prev, weeklySummary: !prev.weeklySummary }))}
                    className="h-5 w-5 rounded border-slate-300 text-sky-600"
                  />
                </label>
              </div>

              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">Default bug severity</h3>
                    <p className="mt-1 text-sm text-slate-500">Select the default priority for new bug reports.</p>
                  </div>
                  <select
                    value={preferences.defaultSeverity}
                    onChange={(e) => setPreferences((prev) => ({ ...prev, defaultSeverity: e.target.value }))}
                    className="rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none"
                  >
                    {severityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200">
              <h2 className="text-xl font-semibold text-slate-900">Account</h2>
              <p className="mt-2 text-sm text-slate-500">Your account credentials and role details.</p>
              <div className="mt-8 space-y-4 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <div>
                  <p className="text-sm text-slate-500">Email</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Role</p>
                  <p className="mt-2 text-base font-semibold text-slate-900">{user?.role || 'Member'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] border border-rose-200 bg-white p-8 shadow-lg shadow-slate-200">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Danger Zone</h2>
                  <p className="mt-2 text-sm text-slate-500">Delete your account and remove access permanently.</p>
                </div>
              </div>
              <div className="mt-8 rounded-[1.75rem] border border-rose-200 bg-rose-50 p-6">
                <p className="text-sm text-rose-700">Deleting your account is irreversible. This action cannot be undone.</p>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="mt-6 inline-flex items-center justify-center rounded-3xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
                >
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        title="Delete account"
        message="Are you sure you want to delete your account? This cannot be undone."
        onCancel={() => setDialogOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
