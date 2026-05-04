import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bugService } from '../services/api';

export default function BugList() {
  const { user } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', severity: 'all', project: '' });
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const canDelete = user?.role === 'admin';

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

  const filteredAndSearchedBugs = useMemo(() => {
    let result = bugs.filter((bug) => {
      if (filters.status !== 'all' && bug.status !== filters.status) return false;
      if (filters.severity !== 'all' && bug.severity !== filters.severity) return false;
      if (
        filters.project &&
        !bug.project?.toLowerCase().includes(filters.project.toLowerCase())
      )
        return false;
      if (
        searchTerm &&
        !bug.title?.toLowerCase().includes(searchTerm.toLowerCase())
      )
        return false;
      return true;
    });

    // Sort
    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [bugs, filters, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSearchedBugs.length / itemsPerPage);
  const paginatedBugs = filteredAndSearchedBugs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction:
        prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc',
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({ status: 'all', severity: 'all', project: '' });
    setSearchTerm('');
    setCurrentPage(1);
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getSeverityBadgeColor = (severity) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };
    return colors[severity] || 'bg-slate-100 text-slate-800';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-slate-100 text-slate-800',
    };
    return colors[status] || 'bg-slate-100 text-slate-800';
  };

  const getStatusLabel = (status) => {
    if (status === 'in-progress') return 'In Progress';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span className="text-slate-300">⇅</span>;
    return sortConfig.direction === 'asc' ? (
      <span className="text-sky-600">↑</span>
    ) : (
      <span className="text-sky-600">↓</span>
    );
  };

  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-slate-200 border-t-sky-500" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-10 sm:px-6 lg:px-10">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900">Bug Tracker</h1>
          <p className="mt-2 text-slate-600">Manage and track all your project bugs</p>
        </div>
        <button
          onClick={() => navigate('/bugs/new')}
          className="rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
        >
          + Create Bug
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search bugs by title..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full rounded-[1.75rem] border border-slate-200 px-6 py-3 text-slate-900 placeholder-slate-500 shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/10"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4">
        <select
          name="status"
          value={filters.status}
          onChange={handleFilterChange}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition focus:border-sky-500 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          name="severity"
          value={filters.severity}
          onChange={handleFilterChange}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 shadow-sm transition focus:border-sky-500 focus:outline-none"
        >
          <option value="all">All Severity</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <input
          type="text"
          name="project"
          placeholder="Project name"
          value={filters.project}
          onChange={handleFilterChange}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 placeholder-slate-500 shadow-sm transition focus:border-sky-500 focus:outline-none"
        />

        <button
          onClick={resetFilters}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Clear All
        </button>
      </div>

      {error && (
        <div className="mb-6 rounded-[1.75rem] bg-rose-50 px-6 py-4 text-sm text-rose-700 shadow-sm">
          {error}
        </div>
      )}

      {/* Summary Bar */}
      <div className="mb-6 rounded-[1.75rem] border border-slate-200 bg-white px-6 py-4 shadow-sm">
        <p className="text-sm font-medium text-slate-700">
          Showing{' '}
          <span className="font-semibold text-slate-900">{paginatedBugs.length}</span> of{' '}
          <span className="font-semibold text-slate-900">
            {filteredAndSearchedBugs.length}
          </span>{' '}
          bugs
        </p>
      </div>

      {/* Empty State */}
      {filteredAndSearchedBugs.length === 0 ? (
        <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-[2rem] bg-white">
          <div className="text-6xl">🐞</div>
          <h3 className="mt-6 text-2xl font-semibold text-slate-900">No bugs found</h3>
          <p className="mt-2 text-slate-600">
            {searchTerm || Object.values(filters).some((v) => v !== 'all' && v !== '')
              ? 'Try adjusting your search or filters'
              : 'No bugs yet. Create one to get started!'}
          </p>
          <button
            onClick={() => navigate('/bugs/new')}
            className="mt-6 rounded-full bg-sky-600 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
          >
            + Create First Bug
          </button>
        </div>
      ) : (
        <>
          {/* Table */}
          <div className="overflow-hidden rounded-[2rem] bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="px-6 py-4">#</th>
                    <th
                      className="cursor-pointer px-6 py-4 hover:bg-slate-100"
                      onClick={() => handleSort('title')}
                    >
                      <div className="inline-flex items-center gap-2">
                        Title <SortIcon columnKey="title" />
                      </div>
                    </th>
                    <th className="px-6 py-4">Project</th>
                    <th
                      className="cursor-pointer px-6 py-4 hover:bg-slate-100"
                      onClick={() => handleSort('severity')}
                    >
                      <div className="inline-flex items-center gap-2">
                        Severity <SortIcon columnKey="severity" />
                      </div>
                    </th>
                    <th
                      className="cursor-pointer px-6 py-4 hover:bg-slate-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="inline-flex items-center gap-2">
                        Status <SortIcon columnKey="status" />
                      </div>
                    </th>
                    <th className="px-6 py-4">Assigned To</th>
                    <th
                      className="cursor-pointer px-6 py-4 hover:bg-slate-100"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="inline-flex items-center gap-2">
                        Created <SortIcon columnKey="createdAt" />
                      </div>
                    </th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {paginatedBugs.map((bug, index) => (
                    <tr
                      key={bug._id}
                      className={`transition hover:bg-slate-50 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-slate-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td
                        className="cursor-pointer px-6 py-4 font-medium text-slate-900"
                        onClick={() => navigate(`/bugs/${bug._id}`)}
                      >
                        {bug.title}
                      </td>
                      <td className="px-6 py-4 text-slate-700">{bug.project}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getSeverityBadgeColor(
                            bug.severity
                          )}`}
                        >
                          {bug.severity?.charAt(0).toUpperCase() + bug.severity?.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeColor(
                            bug.status
                          )}`}
                        >
                          {getStatusLabel(bug.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {bug.assignedTo?.name || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-700">
                        {formatDate(bug.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/bugs/${bug._id}`)}
                            className="rounded-lg bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 transition hover:bg-sky-200"
                          >
                            View
                          </button>
                          {canDelete && (
                            <button
                              onClick={() => handleDeleteBug(bug._id)}
                              className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-200"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition disabled:opacity-50 hover:bg-slate-50"
              >
                ← Previous
              </button>
              <div className="text-sm font-medium text-slate-700">
                Page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
                <span className="font-semibold text-slate-900">{totalPages}</span>
              </div>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition disabled:opacity-50 hover:bg-slate-50"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
