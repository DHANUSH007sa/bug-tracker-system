import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bugService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ total: 0, open: 0, inProgress: 0, resolved: 0 });
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
      setRecentBugs(bugs.slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <p>Role: <strong>{user?.role}</strong></p>
      </div>

      {error && <div className="error-message">{error}</div>}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Bugs</h3>
          <p className="stat-number">{stats.total}</p>
        </div>
        <div className="stat-card open">
          <h3>Open</h3>
          <p className="stat-number">{stats.open}</p>
        </div>
        <div className="stat-card progress">
          <h3>In Progress</h3>
          <p className="stat-number">{stats.inProgress}</p>
        </div>
        <div className="stat-card resolved">
          <h3>Resolved</h3>
          <p className="stat-number">{stats.resolved}</p>
        </div>
      </div>

      <div className="recent-bugs">
        <h2>Recent Bugs</h2>
        {recentBugs.length === 0 ? (
          <p>No bugs yet</p>
        ) : (
          <ul>
            {recentBugs.map((bug) => (
              <li key={bug._id} onClick={() => navigate(`/bugs/${bug._id}`)}>
                <strong>{bug.title}</strong>
                <span className="badge">{bug.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => navigate('/bugs')} className="btn-view-all">
        View All Bugs
      </button>
    </div>
  );
}
