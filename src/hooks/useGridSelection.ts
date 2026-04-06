import { useState, useEffect, useRef, useCallback } from 'react';

export function useGridSelection(
  canReserve: boolean,
  HOURS: string[],
  isSlotReserved: (day: Date, hour: string) => boolean,
  isOperatingHour: (day: Date, hour: string) => boolean,
  onSelectionComplete: (start: string, end: string, date: Date) => void
) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [activeDay, setActiveDay] = useState<string | null>(null);
  const [isTouchDrag, setIsTouchDrag] = useState(false);
  const [pressedCell, setPressedCell] = useState<{ dayISO: string; hourIndex: number } | null>(null);

  const stateRef = useRef({ isDragging, selectionStart, selectionEnd, activeDay });
  useEffect(() => {
    stateRef.current = { isDragging, selectionStart, selectionEnd, activeDay };
  }, [isDragging, selectionStart, selectionEnd, activeDay]);

  const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const touchStartPosRef = useRef<{ x: number; y: number } | null>(null);

  const completeSelection = useCallback(() => {
    const { isDragging, selectionStart, selectionEnd, activeDay } = stateRef.current;
    if (isDragging && selectionStart !== null && selectionEnd !== null && activeDay) {
      const startIdx = Math.min(selectionStart, selectionEnd);
      const endIdx = Math.max(selectionStart, selectionEnd);

      const startTimeStr = HOURS[startIdx];
      const endTimeRaw = parseInt(HOURS[endIdx].split(':')[0]) + 1;
      const endTimeStr = `${String(endTimeRaw).padStart(2, '0')}:00`;

      onSelectionComplete(startTimeStr, endTimeStr, new Date(activeDay));
    }
    setIsDragging(false);
    setIsTouchDrag(false);
    setSelectionStart(null);
    setSelectionEnd(null);
    setActiveDay(null);
    setPressedCell(null);
  }, [HOURS, onSelectionComplete]);

  const handleMouseDown = useCallback((day: Date, hourIndex: number) => {
    if (!canReserve) return;
    const hour = HOURS[hourIndex];
    if (!isOperatingHour(day, hour)) return;
    if (isSlotReserved(day, hour)) return;

    setIsDragging(true);
    setIsTouchDrag(false);
    setSelectionStart(hourIndex);
    setSelectionEnd(hourIndex);
    setActiveDay(day.toISOString());
  }, [canReserve, HOURS, isOperatingHour, isSlotReserved]);

  const handleMouseEnter = useCallback((day: Date, hourIndex: number) => {
    const { isDragging, activeDay, selectionStart } = stateRef.current;
    if (!isDragging || day.toISOString() !== activeDay || selectionStart === null) return;

    if (!isOperatingHour(day, HOURS[hourIndex])) return;

    const startIdx = Math.min(selectionStart, hourIndex);
    const endIdx = Math.max(selectionStart, hourIndex);
    for (let i = startIdx; i <= endIdx; i++) {
      if (isSlotReserved(day, HOURS[i])) return;
    }

    setSelectionEnd(hourIndex);
  }, [HOURS, isOperatingHour, isSlotReserved]);

  useEffect(() => {
    const handleMouseUpGlobal = () => completeSelection();
    window.addEventListener('mouseup', handleMouseUpGlobal);
    return () => window.removeEventListener('mouseup', handleMouseUpGlobal);
  }, [completeSelection]);

  const handleTouchStart = useCallback((e: React.TouchEvent, day: Date, hourIndex: number) => {
    if (!canReserve) return;
    const touch = e.touches[0];
    touchStartPosRef.current = { x: touch.clientX, y: touch.clientY };

    if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
    isLongPressRef.current = false;
    setPressedCell({ dayISO: day.toISOString(), hourIndex });

    touchTimeoutRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setIsDragging(true);
      setIsTouchDrag(true);
      setPressedCell(null);
      handleMouseDown(day, hourIndex);
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(50);
    }, 200);
  }, [canReserve, handleMouseDown]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];

    if (!isLongPressRef.current && touchStartPosRef.current) {
      const dist = Math.sqrt(
        Math.pow(touch.clientX - touchStartPosRef.current.x, 2) +
        Math.pow(touch.clientY - touchStartPosRef.current.y, 2)
      );
      if (dist > 10) {
        if (touchTimeoutRef.current) clearTimeout(touchTimeoutRef.current);
        setPressedCell(null);
        touchStartPosRef.current = null;
      }
      return;
    }

    if (!isLongPressRef.current || !stateRef.current.isDragging) return;

    const element = document.elementFromPoint(touch.clientX, touch.clientY);
    if (!element) return;

    const cell = element.closest('[data-hour-index]');
    if (!cell) return;

    const hourIndex = parseInt(cell.getAttribute('data-hour-index') || '-1');
    const dayISO = cell.getAttribute('data-day-iso');

    if (dayISO && dayISO === stateRef.current.activeDay && hourIndex !== -1) {
      handleMouseEnter(new Date(dayISO), hourIndex);
    }
  }, [handleMouseEnter]);

  const handleTouchEnd = useCallback(() => {
    if (touchTimeoutRef.current) {
      clearTimeout(touchTimeoutRef.current);
      touchTimeoutRef.current = null;
    }
    setPressedCell(null);
    touchStartPosRef.current = null;
    if (stateRef.current.isDragging) completeSelection();
  }, [completeSelection]);

  useEffect(() => {
    if (!isDragging) return;
    const handleTouchMoveGlobal = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
    };
    window.addEventListener('touchmove', handleTouchMoveGlobal, { passive: false });
    return () => window.removeEventListener('touchmove', handleTouchMoveGlobal);
  }, [isDragging]);

  return {
    isDragging, isTouchDrag, selectionStart, selectionEnd, activeDay, pressedCell,
    handleMouseDown, handleMouseEnter,
    handleTouchStart, handleTouchMove, handleTouchEnd, isLongPressRef
  };
}