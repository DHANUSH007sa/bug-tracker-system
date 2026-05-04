import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white px-8 py-16 shadow-2xl shadow-slate-900/10 sm:px-16">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-5xl text-slate-900">
            🔒
          </div>
          <p className="text-6xl font-bold tracking-tight text-slate-900">403</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Access Denied</h1>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            You don&apos;t have permission to view this page. If you believe this is an error, contact your administrator.
          </p>
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
