import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: ReactNode;
  subtitle?: ReactNode;
  icon?: ReactNode;
  centerHeader?: boolean;
}

export function Card({
  children,
  className = '',
  title,
  subtitle,
  icon,
  centerHeader = false,
}: CardProps) {
  return (
    <div
      className={`bg-white p-8 md:p-12 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-ui-border w-full animate-in fade-in slide-in-from-bottom-4 duration-500 ${className}`}
    >
      {(title || subtitle || icon) && (
        <div className={`mb-10 ${centerHeader ? 'text-center' : ''}`}>
          {icon && <div className="mb-6">{icon}</div>}
          {title && (
            <h2 className="text-2xl font-extrabold text-black tracking-tight leading-tight">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-gray-400 text-sm mt-1 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
