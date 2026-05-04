import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bugService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
  const [allBugs, setAllBugs] = useState([]);
  const [recentBugs, setRecentBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await bugService.getAllBugs();
      const bugs = response.data;
      setError('');

      const bugStats = {
        total: bugs.length,
        open: bugs.filter((b) => b.status === 'open').length,
        inProgress: bugs.filter((b) => b.status === 'in-progress').length,
        resolved: bugs.filter((b) => b.status === 'resolved').length,
      };

      setStats(bugStats);
      setAllBugs(bugs);
      setRecentBugs(bugs.slice(0, 6));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityLabel = (severity) => {
    if (!severity) return 'N/A';
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  const getStatusLabel = (status) => {
    if (status === 'in-progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const getSeverityCounts = () => {
    const severityCount = allBugs.reduce((acc, item) => {
      const key = item.severity || 'medium';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const sorted = Object.entries(severityCount).sort((a, b) => b[1] - a[1]);
    return sorted.length > 0 ? getSeverityLabel(sorted[0][0]) : 'N/A';
  };

  const bugsThisWeek = allBugs.filter((bug) => {
    if (!bug.createdAt) return false;
    const createdDate = new Date(bug.createdAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return createdDate >= weekAgo;
  }).length;

  if (loading)
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
      <div className="overflow-hidden rounded-[2rem] bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-600 p-8 text-white shadow-xl shadow-slate-500/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-sky-100/80">Dashboard overview</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">Welcome, {user?.name}!</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-100/90 sm:text-base">
              Manage your bugs, release status updates, and keep your team aligned with the latest issue data.
            </p>
          </div>
          <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm font-medium text-white shadow-sm shadow-slate-900/10">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-xl">👤</span>
            <span>{user?.role?.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-4 xl:grid-cols-4">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">🐞</div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">Total</span>
          </div>
          <div className="mt-8">
            <p className="text-sm text-slate-500">Total Bugs</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{stats.total}</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">●</div>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">Open</span>
          </div>
          <div className="mt-8">
            <p className="text-sm text-slate-500">Open Bugs</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{stats.open}</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">⏱️</div>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">In Progress</span>
          </div>
          <div className="mt-8">
            <p className="text-sm text-slate-500">In Progress</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{stats.inProgress}</p>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-center justify-between">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">✅</div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Resolved</span>
          </div>
          <div className="mt-8">
            <p className="text-sm text-slate-500">Resolved Bugs</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900">{stats.resolved}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">This Week</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{bugsThisWeek}</p>
          <p className="mt-2 text-sm text-slate-500">Total bugs created in the last 7 days</p>
        </div>
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Most common severity</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900">{getSeverityCounts()}</p>
          <p className="mt-2 text-sm text-slate-500">Based on recent issues</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-[2rem] bg-white shadow-sm">
        <div className="border-b border-slate-200 px-6 py-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Recent Bugs</h2>
              <p className="mt-1 text-sm text-slate-500">Review recent issues and click any row for details.</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/bugs')}
              className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              View all bugs
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead className="bg-slate-50 text-sm text-slate-600 uppercase tracking-[0.15em]">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Project</th>
              </tr>
            </thead>
            <tbody>
              {recentBugs.map((bug, index) => (
                <tr
                  key={bug._id}
                  onClick={() => navigate(`/bugs/${bug._id}`)}
                  className={`cursor-pointer transition hover:bg-slate-50 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}
                >
                  <td className="px-6 py-5 align-middle text-sm text-slate-900">{bug.title}</td>
                  <td className="px-6 py-5 align-middle text-sm text-slate-700">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor:
                          bug.severity === 'critical'
                            ? '#fee2e2'
                            : bug.severity === 'high'
                            ? '#ffedd5'
                            : bug.severity === 'medium'
                            ? '#fef3c7'
                            : '#dcfce7',
                        color:
                          bug.severity === 'critical'
                            ? '#b91c1c'
                            : bug.severity === 'high'
                            ? '#c2410c'
                            : bug.severity === 'medium'
                            ? '#a16207'
                            : '#166534',
                      }}
                    >
                      {getSeverityLabel(bug.severity)}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-middle text-sm text-slate-700">
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        backgroundColor:
                          bug.status === 'open'
                            ? '#dbeafe'
                            : bug.status === 'in-progress'
                            ? '#fef3c7'
                            : bug.status === 'resolved'
                            ? '#dcfce7'
                            : '#e2e8f0',
                        color:
                          bug.status === 'open'
                            ? '#1d4ed8'
                            : bug.status === 'in-progress'
                            ? '#92400e'
                            : bug.status === 'resolved'
                            ? '#166534'
                            : '#475569',
                      }}
                    >
                      {getStatusLabel(bug.status)}
                    </span>
                  </td>
                  <td className="px-6 py-5 align-middle text-sm text-slate-900">{bug.project}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-[1.75rem] bg-rose-50 px-6 py-4 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      )}
    </div>
  );
}
