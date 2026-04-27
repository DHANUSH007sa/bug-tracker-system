import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bugService } from '../services/api';
import '../styles/BugDetail.css';

export default function BugDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (id && id !== 'new') {
      fetchBug();
    } else {
      setLoading(false);
      setFormData({ title: '', description: '', severity: 'medium', status: 'open', project: '' });
    }
  }, [id]);

  const fetchBug = async () => {
    try {
      const response = await bugService.getBugById(id);
      setBug(response.data);
      setFormData(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bug');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id === 'new') {
        await bugService.createBug(formData);
        alert('Bug created successfully!');
      } else {
        await bugService.updateBug(id, formData);
        alert('Bug updated successfully!');
      }
      navigate('/bugs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save bug');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="bug-detail-container">
      <button onClick={() => navigate('/bugs')} className="btn-back">
        ← Back to Bugs
      </button>

      {error && <div className="error-message">{error}</div>}

      {!isEditing && bug && !id?.includes('new') ? (
        <div className="bug-view">
          <h2>{bug.title}</h2>
          <div className="bug-info">
            <p><strong>Description:</strong> {bug.description}</p>
            <p><strong>Severity:</strong> <span className="badge">{bug.severity}</span></p>
            <p><strong>Status:</strong> <span className="badge">{bug.status}</span></p>
            <p><strong>Project:</strong> {bug.project}</p>
            <p><strong>Created By:</strong> {bug.createdBy?.name}</p>
            <p><strong>Assigned To:</strong> {bug.assignedTo?.name || 'Unassigned'}</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="btn-edit">
            Edit Bug
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bug-form">
          <h2>{id === 'new' ? 'Create Bug' : 'Edit Bug'}</h2>
          <input
            type="text"
            name="title"
            placeholder="Bug Title"
            value={formData.title || ''}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description || ''}
            onChange={handleChange}
            rows="4"
          ></textarea>
          <select name="severity" value={formData.severity || 'medium'} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select name="status" value={formData.status || 'open'} onChange={handleChange}>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <input
            type="text"
            name="project"
            placeholder="Project Name"
            value={formData.project || ''}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-save">
            Save Bug
          </button>
          {bug && (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
          )}
        </form>
      )}
    </div>
  );
}
