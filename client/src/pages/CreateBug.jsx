import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { bugService, userService } from '../services/api';
import Skeleton from '../components/Skeleton';

const projectOptions = ['Frontend', 'Backend', 'Database', 'API', 'UI/UX', 'Other'];
const severityOptions = [
  { value: 'low', label: 'Low', color: 'bg-emerald-100 text-emerald-700' },
  { value: 'medium', label: 'Medium', color: 'bg-amber-100 text-amber-700' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-700' },
  { value: 'critical', label: 'Critical', color: 'bg-rose-100 text-rose-700' },
];
const statusOptions = [
  { value: 'open', label: 'Open', color: 'text-sky-700' },
  { value: 'in-progress', label: 'In Progress', color: 'text-amber-700' },
  { value: 'resolved', label: 'Resolved', color: 'text-emerald-700' },
  { value: 'closed', label: 'Closed', color: 'text-slate-700' },
];

export default function CreateBug() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    severity: 'low',
    status: 'open',
    assignedTo: '',
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setUsersLoading(true);
      setUsersError('');

      try {
        const response = await userService.getUsers();
        setUsers(response.data);
      } catch (err) {
        setUsersError('Unable to load users');
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const validate = () => {
    const validationErrors = {};
    if (!formData.title.trim()) {
      validationErrors.title = 'Title is required.';
    } else if (formData.title.trim().length < 3) {
      validationErrors.title = 'Title must be at least 3 characters.';
    }

    if (!formData.project) {
      validationErrors.project = 'Project is required.';
    }

    if (!formData.description.trim()) {
      validationErrors.description = 'Description is required.';
    } else if (formData.description.trim().length < 10) {
      validationErrors.description = 'Description must be at least 10 characters.';
    }

    if (!['low', 'medium', 'high', 'critical'].includes(formData.severity)) {
      validationErrors.severity = 'Select a valid severity.';
    }

    if (!['open', 'in-progress', 'resolved', 'closed'].includes(formData.status)) {
      validationErrors.status = 'Select a valid status.';
    }

    return validationErrors;
  };

  const fieldErrors = useMemo(() => validate(), [formData]);
  const isFormValid = Object.keys(fieldErrors).length === 0;
  const showSkeleton = usersLoading && users.length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'title' && value.length > 100) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSeverityChange = (value) => {
    setFormData((prev) => ({ ...prev, severity: value }));
    if (errors.severity) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.severity;
        return next;
      });
    }
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
      const payload = { ...formData };
      if (!payload.assignedTo) {
        delete payload.assignedTo;
      }

      await bugService.createBug(payload);
      toast.success('Bug created successfully!');
      setSuccessMessage('Bug created successfully!');
      setTimeout(() => navigate('/bugs'), 1000);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create bug';
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (showSkeleton)
    return (
      <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] bg-white px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10 sm:py-10">
          <div className="mb-8">
            <Skeleton width="8rem" height="2rem" className="mb-4" />
            <Skeleton width="14rem" height="1rem" />
          </div>

          <div className="space-y-6">
            <Skeleton width="100%" height="4rem" />
            <Skeleton width="100%" height="4rem" />
            <Skeleton width="100%" height="12rem" />
            <Skeleton width="100%" height="4rem" />
            <Skeleton width="100%" height="4rem" />
            <Skeleton width="100%" height="4rem" />
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl rounded-[2rem] bg-white px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10 sm:py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3 text-slate-900">
              <span className="text-3xl">🐛</span>
              <h1 className="text-3xl font-semibold">Create New Bug</h1>
            </div>
            <p className="mt-2 text-sm text-slate-500">Add a new issue and assign it to a team member.</p>
          </div>
          <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 shadow-sm">
            {usersLoading ? 'Loading users...' : `${users.length} users available`}
          </div>
        </div>

        {successMessage && (
          <div className="mb-6 rounded-2xl bg-emerald-500 px-5 py-4 text-sm font-semibold text-white shadow-lg">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700 shadow-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Title</label>
              <div className="mt-2 flex items-center gap-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter bug title"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
                />
                <span className="text-sm text-slate-500">{formData.title.length}/100</span>
              </div>
              {(errors.title || fieldErrors.title) && (
                <p className="mt-2 text-sm text-rose-600">{errors.title || fieldErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Project</label>
              <select
                name="project"
                value={formData.project}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                <option value="">Select a project</option>
                {projectOptions.map((project) => (
                  <option key={project} value={project}>
                    {project}
                  </option>
                ))}
              </select>
              {(errors.project || fieldErrors.project) && (
                <p className="mt-2 text-sm text-rose-600">{errors.project || fieldErrors.project}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Describe the bug in detail... steps to reproduce, expected vs actual behavior"
                className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              />
              {(errors.description || fieldErrors.description) && (
                <p className="mt-2 text-sm text-rose-600">{errors.description || fieldErrors.description}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700">Severity</label>
              <div className="mt-2 flex flex-wrap gap-3">
                {severityOptions.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    onClick={() => handleSeverityChange(option.value)}
                    className={`rounded-3xl border px-4 py-2 text-sm font-medium transition ${
                      formData.severity === option.value
                        ? `border-slate-900 bg-slate-900 text-white`
                        : `border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-400 hover:bg-slate-100`
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {(errors.severity || fieldErrors.severity) && (
                <p className="mt-2 text-sm text-rose-600">{errors.severity || fieldErrors.severity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value} className={option.color}>
                    {option.label}
                  </option>
                ))}
              </select>
              {(errors.status || fieldErrors.status) && (
                <p className="mt-2 text-sm text-rose-600">{errors.status || fieldErrors.status}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Assign To</label>
              <select
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
                disabled={usersLoading}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                <option value="">Unassigned</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
              {usersError && (
                <p className="mt-2 text-sm text-rose-600">{usersError}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={() => navigate('/bugs')}
              className="inline-flex items-center justify-center rounded-3xl border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {loading ? (
                <span className="flex items-center gap-3">
                  <span className="h-3 w-12 rounded-full bg-slate-200 animate-pulse" />
                  Creating...
                </span>
              ) : (
                'Create Bug'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
