'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { Portal } from './Portal';

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  delay?: number;
  className?: string;
}

export function Tooltip({ children, content, delay = 0, className = "" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const calculatePosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        left: rect.left + rect.width / 2,
        top: rect.top - 8,
      });
    }
  };

  const showTooltip = () => {
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return;
    calculatePosition();
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => hideTooltip();
      window.addEventListener('scroll', handleScroll, true);
      return () => window.removeEventListener('scroll', handleScroll, true);
    }
  }, [isVisible]);

  return (
    <div
      className={`relative ${className}`}
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}
      {isVisible && (
        <Portal>
          <div
            className="fixed z-[200] px-3 py-2 text-xxs font-bold text-white bg-gray-900 backdrop-blur-md rounded-lg shadow-2xl animate-in fade-in duration-150 pointer-events-none whitespace-nowrap"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            {content}
            {/* Arrow */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-gray-900 rotate-45 shadow-sm" />
          </div>
        </Portal>
      )}
    </div>
  );
}
