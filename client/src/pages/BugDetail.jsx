import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { bugService } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import Skeleton from '../components/Skeleton';
import '../styles/BugDetail.css';

export default function BugDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [bug, setBug] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [statusValue, setStatusValue] = useState('open');
  const canModify = ['developer', 'admin'].includes(user?.role);

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
      setStatusValue(response.data.status || 'open');
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

  const handleStatusChange = (e) => {
    setStatusValue(e.target.value);
  };

  const handleStatusUpdate = async () => {
    if (!bug) return;

    try {
      await bugService.updateBug(id, { status: statusValue });
      setBug({ ...bug, status: statusValue });
      setError('');
      toast.success('Status updated successfully!');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update status';
      toast.error(message);
      setError(message);
    }
  };

  const handleConfirmDelete = async () => {
    if (!bug) return;
    try {
      await bugService.deleteBug(bug._id);
      toast.success('Bug deleted successfully!');
      setDeleteDialogOpen(false);
      setTimeout(() => navigate('/bugs'), 1000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete bug';
      toast.error(message);
      setError(message);
      setDeleteDialogOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id === 'new') {
        await bugService.createBug(formData);
        toast.success('Bug created successfully!');
      } else {
        await bugService.updateBug(id, formData);
        toast.success('Bug updated successfully!');
      }
      navigate('/bugs');
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to save bug';
      toast.error(message);
      setError(message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
        <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <Skeleton width="50%" height="2rem" className="mb-6" />
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="mb-6">
                <Skeleton width="30%" height="1rem" className="mb-3" />
                <Skeleton width="100%" height="4rem" />
              </div>
            ))}
          </div>
          <div className="rounded-[2rem] bg-white p-6 shadow-sm">
            <Skeleton width="40%" height="1.75rem" className="mb-6" />
            {[...Array(3)].map((_, idx) => (
              <Skeleton key={idx} width="100%" height="3.25rem" className="mb-4" />
            ))}
          </div>
        </div>
      </div>
    );

  return (
    <div className="bug-detail-container">
      <button onClick={() => navigate('/bugs')} className="btn-back">
        ← Back to Bugs
      </button>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="mb-6 rounded-[1.75rem] bg-emerald-50 px-6 py-4 text-sm text-emerald-700 shadow-sm">
          {successMessage}
        </div>
      )}

      {!isEditing && bug && !id?.includes('new') ? (
        <div className="bug-view">
          <h2>{bug.title}</h2>
          <div className="bug-info">
            <p><strong>Description:</strong> {bug.description}</p>
            <p>
              <strong>Severity:</strong>{' '}
              <span
                className="badge"
                style={{ backgroundColor: getSeverityColor(bug.severity) }}
              >
                {bug.severity.charAt(0).toUpperCase() + bug.severity.slice(1)}
              </span>
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className="badge"
                style={{ backgroundColor: getStatusColor(bug.status) }}
              >
                {getStatusLabel(bug.status)}
              </span>
            </p>
            <p><strong>Project:</strong> {bug.project}</p>
            <p><strong>Created By:</strong> {bug.createdBy?.name}</p>
            <p><strong>Assigned To:</strong> {bug.assignedTo?.name || 'Unassigned'}</p>
          </div>

          {canModify && (
            <div className="status-update">
              <label htmlFor="status-select">Update Status</label>
              <div className="status-actions">
                <select
                  id="status-select"
                  value={statusValue}
                  onChange={handleStatusChange}
                >
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <button onClick={handleStatusUpdate} className="btn-update-status">
                  Save Status
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {canModify && (
              <button onClick={() => setIsEditing(true)} className="btn-edit">
                Edit Bug
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => setDeleteDialogOpen(true)}
                className="btn-delete"
              >
                Delete Bug
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <ConfirmDialog
            open={deleteDialogOpen}
            title="Delete Bug?"
            message={`Are you sure you want to delete '${bug?.title}'? This action cannot be undone.`}
            onCancel={() => setDeleteDialogOpen(false)}
            onConfirm={handleConfirmDelete}
          />
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
      </>
      )}
    </div>
  );
}
