import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bugService } from '../services/api';
import '../styles/BugList.css';

export default function BugList() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const getSeverityColor = (severity) => {
    const colors = {
      low: '#28a745',
      medium: '#ffc107',
      high: '#fd7e14',
      critical: '#dc3545',
    };
    return colors[severity] || '#6c757d';
  };

  if (loading) return <div className="loading">Loading bugs...</div>;

  return (
    <div className="bug-list-container">
      <div className="bug-list-header">
        <h2>Bug Tracker</h2>
        <button onClick={() => navigate('/bugs/new')} className="btn-create">
          + Create Bug
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {bugs.length === 0 ? (
        <div className="no-bugs">No bugs found. Create one to get started!</div>
      ) : (
        <div className="bugs-grid">
          {bugs.map((bug) => (
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
                <span className="status-badge">{bug.status}</span>
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
