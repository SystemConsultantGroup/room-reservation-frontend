import { InputHTMLAttributes } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'maxLength'> {
  label?: string;
  error?: string;
  suffix?: string;
  maxLength?: number;
}

export function Input({
  label,
  error,
  suffix,
  maxLength,
  className = '',
  ...props
}: InputProps) {
  const currentLength = typeof props.value === 'string'
    ? props.value.length
    : typeof props.defaultValue === 'string'
    ? props.defaultValue.length
    : 0;

  const isExceeded = maxLength !== undefined && currentLength > maxLength;
  const displayError = error || (isExceeded ? `최대 ${maxLength}자까지 입력 가능합니다.` : undefined);

  return (
    <div className="space-y-2 w-full">
      {(label || maxLength) && (
        <div className="flex justify-between items-end mb-1">
          {label ? (
            <label className="block text-xxs font-bold text-gray-400 uppercase tracking-widest ml-1">
              {label}
            </label>
          ) : <div />}
          {maxLength && (
            <span className={`text-xxs font-medium ${isExceeded ? 'text-red-500' : 'text-gray-400'} ml-2 mr-1`}>
              {currentLength.toLocaleString()}/{maxLength.toLocaleString()}
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <input
          className={`w-full bg-bg-base border ${
            displayError ? 'border-red-400 focus:ring-red-400/10' : 'border-ui-border focus:ring-brand-primary/10'
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
      {displayError && (
        <p className="text-xs text-red-500 mt-2 ml-1 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
          {displayError}
        </p>
      )}
    </div>
  );
}
