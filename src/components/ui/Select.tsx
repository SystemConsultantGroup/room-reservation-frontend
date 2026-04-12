'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';

interface Option<T extends string | number> {
  value: T;
  label: string;
  rightElement?: ReactNode;
}

interface SelectProps<T extends string | number> {
  options: Option<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  error?: boolean;
  className?: string;
  disabled?: boolean;
  leftIcon?: ReactNode;
}

export function Select<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = '선택해 주세요',
  error = false,
  className = '',
  disabled = false,
  leftIcon,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    if (isOpen) {
      updateCoords();
      window.addEventListener('scroll', closeDropdown, true);
      window.addEventListener('resize', closeDropdown);
    }
    return () => {
      window.removeEventListener('scroll', closeDropdown, true);
      window.removeEventListener('resize', closeDropdown);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateCoords = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  const closeDropdown = () => setIsOpen(false);

  const handleSelect = (val: T) => {
    onChange(val);
    setIsOpen(false);
  };

  if (!mounted) return null;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            updateCoords();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full flex items-center justify-between bg-white border ${error ? 'border-red-400 focus:ring-red-400/10' : 'border-ui-border focus:ring-brand-primary/10'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-300'
          } rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition-all focus:outline-none focus:ring-4`}
      >
        <div className="flex items-center">
          {leftIcon && <div className="mr-3 text-brand-primary">{leftIcon}</div>}
          <span className={selectedOption ? 'text-gray-800' : 'text-gray-300'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: coords.top + 4,
              left: coords.left,
              width: coords.width,
            }}
            className="z-[200] bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-ui-border overflow-hidden origin-top"
          >
            <div className="max-h-[240px] overflow-y-auto overflow-x-hidden py-1 custom-scrollbar">
              {options.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-400 text-sm font-medium">
                  옵션이 없습니다.
                </div>
              ) : (
                options.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-left transition-all hover:bg-bg-base group ${opt.value === value ? 'text-brand-primary bg-brand-primary/5' : 'text-gray-600'
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{opt.label}</span>
                      {opt.rightElement && <div className="flex-shrink-0">{opt.rightElement}</div>}
                    </div>
                    {opt.value === value && <Check className="w-4 h-4" />}
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
