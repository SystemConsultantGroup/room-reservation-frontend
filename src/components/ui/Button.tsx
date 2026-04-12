'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'outline-danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || isLoading;
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-bold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer";

  const variants = {
    primary: `bg-brand-primary text-white shadow-sm ${!isDisabled ? 'hover:opacity-90' : ''}`,
    secondary: `bg-brand-light text-brand-primary ${!isDisabled ? 'hover:bg-opacity-80' : ''}`,
    outline: `bg-white border border-ui-border text-gray-400 ${!isDisabled ? 'hover:bg-bg-base' : ''}`,
    ghost: `bg-transparent text-gray-400 ${!isDisabled ? 'hover:bg-bg-base hover:text-gray-600' : ''}`,
    danger: `bg-red-500 text-white ${!isDisabled ? 'hover:bg-red-600' : ''}`,
    'outline-danger': `bg-white border border-ui-border/60 text-gray-400 ${!isDisabled ? 'hover:text-red-500 hover:border-red-200 hover:bg-red-50' : ''}`,
  };

  const sizes = {
    xs: "px-2 py-1 text-micro",
    sm: "px-3 py-1.5 text-xxs",
    md: "px-4 py-2.5 text-xs",
    lg: "px-6 py-3.5 text-sm",
    xl: "px-8 py-4 text-base",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      disabled={isDisabled}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
}
