'use client';

import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'warning' | 'danger' | 'success' | 'ghost';
  size?: 'xs' | 'sm';
  rounded?: 'lg' | 'full';
  className?: string;
}

export function Badge({
  children,
  variant = 'primary',
  size = 'xs',
  rounded = 'lg',
  className = ''
}: BadgeProps) {
  const baseStyles = 'inline-flex items-center justify-center font-bold uppercase tracking-tight transition-all';

  const sizeStyles = {
    xs: 'px-2 py-1 text-xxs',
    sm: 'px-3 py-1.5 text-xs',
  };

  const roundedStyles = {
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const variantStyles = {
    primary: 'bg-brand-primary/5 border border-brand-primary/10 text-brand-primary shadow-xs',
    outline: 'bg-white border border-ui-border text-gray-500 shadow-xs',
    warning: 'bg-amber-50 border border-amber-100 text-amber-500 shadow-xs',
    danger: 'bg-red-50 border border-red-100 text-red-500 shadow-xs',
    success: 'bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-xs',
    ghost: 'bg-bg-base border border-ui-border text-gray-400 shadow-xs',
  };

  return (
    <span className={`${baseStyles} ${sizeStyles[size]} ${roundedStyles[rounded]} ${variantStyles[variant]} ${className}`}>
      {children}
    </span>
  );
}
