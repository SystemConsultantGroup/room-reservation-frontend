'use client';

import { useState, useEffect } from 'react';
import { useCreateReservationMutation } from '@/hooks/queries/useReservation';
import { toast } from '@/lib/toast';
import { useQueryClient } from '@tanstack/react-query';
import { roomKeys } from '@/hooks/queries/useRoom';
import { formatLocalDateTime } from '@/lib/date';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Input } from '@/components/ui/Input';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: number;
  selectedDate: Date;
  initialStartTime: string;
  initialEndTime: string;
  minAttendeeCount: number;
  maxAttendeeCount: number;
  minUsageMinutes: number;
  maxUsageMinutes: number;
}

const formatDuration = (mins: number) => {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0 && m > 0) return `${h}시간 ${m}분`;
  if (h > 0) return `${h}시간`;
  return `${m}분`;
};

export function ReservationModal({
  isOpen,
  onClose,
  roomId,
  selectedDate,
  initialStartTime,
  initialEndTime,
  minAttendeeCount,
  maxAttendeeCount,
  minUsageMinutes,
  maxUsageMinutes,
}: ReservationModalProps) {
  const queryClient = useQueryClient();
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [attendeeCount, setAttendeeCount] = useState(minAttendeeCount || 1);
  const [purpose, setPurpose] = useState('');
  const [errors, setErrors] = useState<{ purpose?: string; attendeeCount?: string; time?: string }>({});

  const createMutation = useCreateReservationMutation();

  useEffect(() => {
    setStartTime(initialStartTime);
    setEndTime(initialEndTime);
    setAttendeeCount(minAttendeeCount || 1);
    setErrors({});
  }, [initialStartTime, initialEndTime, isOpen, minAttendeeCount]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newErrors: { purpose?: string; attendeeCount?: string; time?: string } = {};

    if (!purpose.trim()) {
      newErrors.purpose = '예약 목적을 입력해 주세요.';
    }

    if (!attendeeCount || attendeeCount < minAttendeeCount) {
      newErrors.attendeeCount = `최소 ${minAttendeeCount}명 이상이어야 합니다.`;
    } else if (attendeeCount > maxAttendeeCount) {
      newErrors.attendeeCount = `최대 ${maxAttendeeCount}명을 초과할 수 없습니다.`;
    }

    const [sH, sM] = startTime.split(':').map(Number);
    const [eH, eM] = endTime.split(':').map(Number);
    const durationMinutes = (eH * 60 + eM) - (sH * 60 + sM);

    if (durationMinutes <= 0) {
      newErrors.time = '종료 시간은 시작 시간보다 늦어야 합니다.';
    } else if (durationMinutes < minUsageMinutes) {
      newErrors.time = `최소 예약 시간(${formatDuration(minUsageMinutes)})보다 짧을 수 없습니다.`;
    } else if (durationMinutes > maxUsageMinutes) {
      newErrors.time = `최대 예약 시간(${formatDuration(maxUsageMinutes)})을 초과할 수 없습니다.`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(sH, sM, 0, 0);

    const endDateTime = new Date(selectedDate);
    endDateTime.setHours(eH, eM, 0, 0);

    createMutation.mutate({
      roomId,
      startTime: formatLocalDateTime(startDateTime),
      endTime: formatLocalDateTime(endDateTime),
      attendeeCount,
      purpose,
    }, {
      onSuccess: () => {
        toast.success('예약이 신청되었습니다.');
        queryClient.invalidateQueries({ queryKey: roomKeys.schedules() });
        onClose();
      },
    });
  };

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      title="공간 예약하기"
      confirmText="예약하기"
      onConfirm={handleSubmit}
      isLoading={createMutation.isPending}
      content={
        <div className="space-y-6 pt-2">
          <div className="grid grid-cols-1 gap-4">
            <Input
              label="시작 시간"
              type="time"
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                if (errors.time) setErrors(prev => ({ ...prev, time: undefined }));
              }}
            />
            <Input
              label="종료 시간"
              type="time"
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                if (errors.time) setErrors(prev => ({ ...prev, time: undefined }));
              }}
            />
          </div>
          {errors.time && <p className="text-xs text-red-500 mt-[-16px] ml-1 font-medium">{errors.time}</p>}

          <Input
            label="예약 목적"
            type="text"
            value={purpose}
            onChange={(e) => {
              setPurpose(e.target.value);
              if (errors.purpose) setErrors(prev => ({ ...prev, purpose: undefined }));
            }}
            placeholder="예약 목적을 입력해주세요"
            maxLength={100}
            error={errors.purpose}
          />

          <Input
            label="예약 인원"
            type="number"
            value={attendeeCount}
            onChange={(e) => {
              setAttendeeCount(Number(e.target.value));
              if (errors.attendeeCount) setErrors(prev => ({ ...prev, attendeeCount: undefined }));
            }}
            min="1"
            suffix="명"
            error={errors.attendeeCount}
          />
        </div>
      }
    />
  );
}
