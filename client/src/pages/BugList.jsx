import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { bugService } from '../services/api';
import '../styles/BugList.css';

export default function BugList() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: 'all', severity: 'all', project: '' });
  const navigate = useNavigate();

  const getSeverityColor = (severity) => {
    const colors = {
      low: '#22c55e',
      medium: '#f59e0b',
      high: '#f97316',
      critical: '#ef4444',
    };
    return colors[severity] || '#64748b';
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#3b82f6',
      'in-progress': '#facc15',
      resolved: '#22c55e',
      closed: '#64748b',
    };
    return colors[status] || '#64748b';
  };

  const getStatusLabel = (status) => {
    if (status === 'in-progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const response = await bugService.getAllBugs();
      setBugs(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bugs');
    } finally {
      setLoading(false);
    }
  };

  const filteredBugs = useMemo(() => {
    return bugs.filter((bug) => {
      if (filters.status !== 'all' && bug.status !== filters.status) {
        return false;
      }
      if (filters.severity !== 'all' && bug.severity !== filters.severity) {
        return false;
      }
      if (
        filters.project &&
        !bug.project?.toLowerCase().includes(filters.project.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [bugs, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ status: 'all', severity: 'all', project: '' });
  };

  const handleDeleteBug = async (id) => {
    if (confirm('Are you sure you want to delete this bug?')) {
      try {
        await bugService.deleteBug(id);
        setBugs(bugs.filter((bug) => bug._id !== id));
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete bug');
      }
    }
  };

  if (loading)
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );

  return (
    <div className="bug-list-container">
      <div className="bug-list-header">
        <h2>Bug Tracker</h2>
        <button onClick={() => navigate('/bugs/new')} className="btn-create">
          + Create Bug
        </button>
      </div>

      <div className="bug-filters">
        <div className="filter-item">
          <label>Status</label>
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
        <div className="filter-item">
          <label>Severity</label>
          <select name="severity" value={filters.severity} onChange={handleFilterChange}>
            <option value="all">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div className="filter-item filter-search">
          <label>Project</label>
          <input
            type="text"
            name="project"
            placeholder="Project name"
            value={filters.project}
            onChange={handleFilterChange}
          />
        </div>
        <button type="button" className="btn-reset" onClick={resetFilters}>
          Reset Filters
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {filteredBugs.length === 0 ? (
        <div className="no-bugs">No bugs found. Adjust filters or create one to get started!</div>
      ) : (
        <div className="bugs-grid">
          {filteredBugs.map((bug) => (
            <div key={bug._id} className="bug-card">
              <div className="bug-header">
                <h3>{bug.title}</h3>
                <span
                  className="severity-badge"
                  style={{ backgroundColor: getSeverityColor(bug.severity) }}
                >
                  {bug.severity}
                </span>
              </div>
              <p className="bug-description">{bug.description?.slice(0, 100)}...</p>
              <div className="bug-meta">
                <span className="status-badge" style={{ backgroundColor: getStatusColor(bug.status) }}>
                  {getStatusLabel(bug.status)}
                </span>
                <span className="project-name">{bug.project}</span>
              </div>
              <div className="bug-actions">
                <button
                  onClick={() => navigate(`/bugs/${bug._id}`)}
                  className="btn-view"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteBug(bug._id)}
                  className="btn-delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
