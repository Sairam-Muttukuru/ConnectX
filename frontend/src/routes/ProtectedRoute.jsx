import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children, fallbackNavigate, isDark = true }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center transition-colors ${
          isDark ? 'bg-[#06080F] text-slate-100' : 'bg-[#fcfdfe] text-slate-900'
        }`}
      >
        <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-medium">Verifying authentication session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (fallbackNavigate) {
      fallbackNavigate('login');
      return null;
    }
    return null;
  }

  return children;
}
