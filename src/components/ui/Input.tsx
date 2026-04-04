import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  suffix?: string;
}

export function Input({
  label,
  error,
  suffix,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="block text-xxs font-bold text-gray-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          className={`w-full bg-bg-base border ${
            error ? 'border-red-400 focus:ring-red-400/10' : 'border-ui-border focus:ring-brand-primary/10'
          } rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 transition-all placeholder:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed ${
            suffix ? 'pr-12' : ''
          } ${className}`}
          {...props}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-2 ml-1 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
}
