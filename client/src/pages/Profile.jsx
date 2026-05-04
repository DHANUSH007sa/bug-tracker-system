import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { authService, bugService } from '../services/api';

const roleBadges = {
  admin: 'bg-rose-100 text-rose-700',
  developer: 'bg-sky-100 text-sky-700',
  reporter: 'bg-emerald-100 text-emerald-700',
};

function getUserId(user) {
  return user?.id || user?._id || '';
}

export default function Profile() {
  const { user, token, login } = useAuth();
  const [fullName, setFullName] = useState(user?.name || '');
  const [nameSaving, setNameSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [stats, setStats] = useState({ created: 0, assigned: 0, resolved: 0 });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    setFullName(user?.name || '');
  }, [user?.name]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoadingStats(true);
        const response = await bugService.getAllBugs();
        const bugs = response.data || [];
        const userId = getUserId(user);

        const created = bugs.filter(
          (bug) => String(bug.createdBy?._id || bug.createdBy) === String(userId)
        ).length;
        const assigned = bugs.filter(
          (bug) => String(bug.assignedTo?._id || bug.assignedTo) === String(userId)
        ).length;
        const resolved = bugs.filter(
          (bug) =>
            String(bug.assignedTo?._id || bug.assignedTo) === String(userId) &&
            bug.status === 'resolved'
        ).length;

        setStats({ created, assigned, resolved });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load profile stats');
      } finally {
        setLoadingStats(false);
      }
    };

    loadStats();
  }, [user]);

  const handleSaveName = async () => {
    if (!fullName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    try {
      setNameSaving(true);
      const response = await authService.updateProfile({ name: fullName.trim() });
      toast.success('Name updated successfully');
      login({ ...user, ...response.data }, token);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update name');
    } finally {
      setNameSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Please fill out all password fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }

    try {
      setPasswordSaving(true);
      await authService.updatePassword({ currentPassword, newPassword });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Failed to update password');
      toast.error(err.response?.data?.message || 'Failed to update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : 'N/A';

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-sky-500 text-4xl font-bold text-white shadow-xl shadow-sky-500/20">
                {user?.name?.trim()?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Profile</p>
                <h1 className="mt-3 text-3xl font-semibold text-slate-900">{user?.name || 'User'}</h1>
                <p className="mt-2 text-sm text-slate-600">Manage your account details, security, and bug stats.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4 shadow-sm">
              <p className="text-sm text-slate-500">Member since</p>
              <p className="mt-1 text-lg font-semibold text-slate-900">{memberSince}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6 rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Account details</h2>
                <p className="mt-2 text-sm text-slate-500">Update your name or change your password.</p>
              </div>
              <span className={`rounded-3xl px-4 py-2 text-sm font-semibold ${roleBadges[user?.role] || 'bg-slate-100 text-slate-800'}`}>
                {user?.role || 'Member'}
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  disabled={nameSaving}
                  className="rounded-3xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {nameSaving ? 'Saving...' : 'Change name'}
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-500 outline-none"
                />
              </div>
            </div>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-900">Security</h3>
              <p className="mt-2 text-sm text-slate-500">Secure your account with a strong password.</p>
              <form onSubmit={handleChangePassword} className="mt-6 space-y-4">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-slate-700">Current password</label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">New password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-slate-700">Confirm new password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full rounded-3xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                    />
                  </div>
                </div>
                {passwordError && <p className="text-sm text-rose-600">{passwordError}</p>}
                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="rounded-3xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {passwordSaving ? 'Saving...' : 'Save password'}
                </button>
              </form>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white p-8 shadow-lg shadow-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Activity summary</h2>
            <p className="mt-2 text-sm text-slate-500">A quick overview of your bug contributions.</p>
            <div className="mt-8 grid gap-4">
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Bugs created</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {loadingStats ? '—' : stats.created}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Bugs assigned</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {loadingStats ? '—' : stats.assigned}
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                <p className="text-sm text-slate-500">Resolved bugs</p>
                <p className="mt-3 text-3xl font-semibold text-slate-900">
                  {loadingStats ? '—' : stats.resolved}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
