import { Link } from 'react-router-dom';

export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="text-3xl font-bold text-primary-600">
            Acadium
          </Link>
          {title && <h1 className="mt-4 text-2xl font-semibold text-gray-900">{title}</h1>}
          {subtitle && <p className="mt-2 text-sm text-gray-600">{subtitle}</p>}
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5 sm:p-8 shadow-lg">
          {children}
        </div>

      </div>
    </div>
  );
}
