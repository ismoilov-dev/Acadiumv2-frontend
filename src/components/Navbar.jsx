import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const navLinks = [
  { to: '/', label: 'Bosh sahifa' },
  { to: '/lessons', label: 'Darslar' },
  { to: '/lessons/generate', label: 'Yangi dars' },
  { to: '/profile', label: 'Profil' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <nav className="relative border-b border-gray-200 bg-white shadow-sm z-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        {/* Brand Logo */}
        <Link to="/" className="text-xl font-bold text-primary-600 tracking-tight flex items-center gap-1">
          <span className="bg-primary-600 text-white px-2 py-0.5 rounded-md text-base font-extrabold shadow-sm">A</span>
          <span>Acadium</span>
        </Link>

        {/* Desktop Links (Hidden on Mobile) */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${
                location.pathname === to
                  ? 'bg-primary-50 text-primary-700 font-semibold'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop User Info & Logout (Hidden on Mobile) */}
        <div className="hidden items-center gap-4 md:flex">
          {user && (
            <span className="text-sm font-medium text-gray-700">
              {user.full_name || user.email}
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-950 tap-target flex items-center justify-center"
          >
            Chiqish
          </button>
        </div>

        {/* Mobile Hamburger Button (Hidden on Desktop) */}
        <div className="flex items-center md:hidden">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-950 focus:outline-none tap-target"
            aria-expanded={isOpen}
            aria-label="Menuni ochish"
          >
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Dropdown (Hidden on Desktop) */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white py-3 shadow-lg md:hidden animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="space-y-1.5 px-4 pb-3 pt-2">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-4 py-3 text-base font-medium transition-colors ${
                  location.pathname === to
                    ? 'bg-primary-50 text-primary-700 font-semibold'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-950'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 px-4 py-4">
            {user && (
              <div className="mb-4 flex items-center gap-3 rounded-xl bg-gray-50 p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700 shadow-sm">
                  {(user.full_name || user.email)?.[0]?.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {user.full_name || 'Foydalanuvchi'}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {user.email || `@${user.username}`}
                  </p>
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg bg-red-50 border border-red-100 py-3 text-center text-sm font-semibold text-red-600 transition-colors hover:bg-red-100 hover:text-red-700 tap-target flex items-center justify-center"
            >
              Chiqish
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

