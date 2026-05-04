import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-white px-8 py-16 shadow-2xl shadow-slate-900/10 sm:px-16">
        <div className="relative">
          <div className="absolute -right-10 -top-10 text-6xl text-slate-200 animate-bounce">🐛</div>
          <div className="mb-10 text-center">
            <p className="text-7xl font-bold tracking-tight text-transparent bg-gradient-to-r from-sky-500 via-indigo-500 to-fuchsia-500 bg-clip-text">
              404
            </p>
            <p className="mt-4 text-3xl font-semibold text-slate-900">Oops! Page Not Found</p>
            <p className="mt-3 max-w-2xl mx-auto text-sm leading-7 text-slate-500 sm:text-base">
              The page you are looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Go to Dashboard
            </Link>
            <Link
              to="/bugs"
              className="inline-flex items-center justify-center rounded-3xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
            >
              View Bugs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
