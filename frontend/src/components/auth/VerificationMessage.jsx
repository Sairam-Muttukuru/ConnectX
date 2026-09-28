
import { CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

export default function VerificationMessage({
  type = 'info',
  title,
  message,
  actionText,
  onAction,
  isLoading = false,
  isDark = true,
}) {
  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div
      className={`p-5 rounded-2xl border transition-all ${
        isSuccess
          ? isDark
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : isError
          ? isDark
            ? 'bg-red-500/10 border-red-500/30 text-red-300'
            : 'bg-red-50 border-red-200 text-red-800'
          : isDark
          ? 'bg-purple-500/10 border-purple-500/30 text-purple-300'
          : 'bg-purple-50 border-purple-200 text-purple-800'
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          {isError && <AlertCircle className="w-5 h-5 text-red-400" />}
          {!isSuccess && !isError && <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />}
        </div>
        <div className="flex-1">
          {title && <h3 className="font-bold text-sm mb-1">{title}</h3>}
          <p className="text-xs leading-relaxed opacity-90">{message}</p>

          {actionText && onAction && (
            <button
              onClick={onAction}
              disabled={isLoading}
              className="mt-3.5 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              <span>{actionText}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
