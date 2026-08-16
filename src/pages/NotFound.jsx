import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center card p-8 max-w-md w-full">
        <p className="text-6xl font-extrabold text-indigo-400 mb-2">404</p>
        <h1 className="text-2xl font-bold text-white mb-2">Səhifə tapılmadı</h1>
        <p className="text-slate-400 mb-6 text-sm">
          Axtardığınız ünvan mövcud deyil və ya silinib.
        </p>
        <Link to="/" className="btn-primary inline-flex">
          Ana səhifəyə qayıt
        </Link>
      </div>
    </div>
  );
}
