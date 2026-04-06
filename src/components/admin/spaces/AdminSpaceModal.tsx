'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useManagedMajorsQuery } from '@/hooks/queries/useMajor';
import { useRoomQuery } from '@/hooks/queries/useRoom';
import { RoomInfo, AccessPolicy, DayOfWeek, OperatingHoursDetail, RoomCreateRequest, RoomUpdateRequest } from '@/types';
import { getAccessPolicyLabel, ACCESS_POLICIES } from '@/lib/room';

const DAYS: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const DAY_LABELS: Record<DayOfWeek, string> = {
  MONDAY: '월요일',
  TUESDAY: '화요일',
  WEDNESDAY: '수요일',
  THURSDAY: '목요일',
  FRIDAY: '금요일',
  SATURDAY: '토요일',
  SUNDAY: '일요일',
};

type HourConfig = { active: boolean; open: string; close: string };
type HoursState = Record<DayOfWeek, HourConfig>;

interface AdminSpaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: RoomInfo | null;
  onSave: (data: RoomCreateRequest | RoomUpdateRequest) => void;
  isPending: boolean;
}

export function AdminSpaceModal({ isOpen, onClose, room, onSave, isPending }: AdminSpaceModalProps) {
  const { data: majors = [] } = useManagedMajorsQuery();

  const [name, setName] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [minAttendeeCount, setMinAttendeeCount] = useState<number>(1);
  const [maxAttendeeCount, setMaxAttendeeCount] = useState<number>(8);
  const [accessPolicy, setAccessPolicy] = useState<AccessPolicy>('ONLY_FIRST_MAJOR');
  const [selectedMajorIds, setSelectedMajorIds] = useState<number[]>([]);
  const [minUsageMinutes, setMinUsageMinutes] = useState<number>(30);
  const [maxUsageMinutes, setMaxUsageMinutes] = useState<number>(120);

  const [hours, setHours] = useState<HoursState>(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { active: true, open: '09:00', close: '22:00' }
    }), {} as HoursState)
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: roomDetail, isLoading: isDetailLoading } = useRoomQuery(room?.id || 0, {
    enabled: !!room && isOpen
  });

  useEffect(() => {
    setErrors({});
    if (room) {
      setName(room.name);
      setRoomNumber(room.roomNumber);
      setMinAttendeeCount(room.minAttendeeCount);
      setMaxAttendeeCount(room.maxAttendeeCount);
      setAccessPolicy(room.accessPolicy);
      setSelectedMajorIds(room.majors.map(m => m.id));
      setMinUsageMinutes(room.minUsageMinutes);
      setMaxUsageMinutes(room.maxUsageMinutes);

      if (roomDetail?.operatingHours) {
        const newHours = DAYS.reduce((acc, day) => {
          const detail = roomDetail.operatingHours.find(h => h.dayOfWeek === day);
          return {
            ...acc,
            [day]: {
              active: !!detail,
              open: detail?.openTime || '09:00',
              close: detail?.closeTime || '22:00'
            }
          };
        }, {} as HoursState);
        setHours(newHours);
      }
    } else {
      setName('');
      setRoomNumber('');
      setMinAttendeeCount(1);
      setMaxAttendeeCount(8);
      setAccessPolicy('ONLY_FIRST_MAJOR');
      setSelectedMajorIds([]);
      setMinUsageMinutes(30);
      setMaxUsageMinutes(120);
      setHours(DAYS.reduce((acc, day) => ({
        ...acc,
        [day]: { active: true, open: '09:00', close: '22:00' }
      }), {} as HoursState));
    }
  }, [room, isOpen, roomDetail]);

  const toggleMajor = (id: number) => {
    setSelectedMajorIds((prev: number[]) =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
    if (errors.majors) setErrors(prev => ({ ...prev, majors: '' }));
  };

  const handleHourChange = <K extends keyof HourConfig>(day: DayOfWeek, field: K, value: HourConfig[K]) => {
    setHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
    if (errors.hours && field === 'active' && value === true) {
      setErrors(prev => ({ ...prev, hours: '' }));
    }
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = '공간 이름을 입력해 주세요.';
    if (!roomNumber.trim()) newErrors.roomNumber = '공간 위치를 입력해 주세요.';

    if (minAttendeeCount <= 0) newErrors.attendeeCount = '최소 인원은 1명 이상이어야 합니다.';
    if (maxAttendeeCount < minAttendeeCount) newErrors.attendeeCount = '최대 인원은 최소 인원보다 커야 합니다.';

    if (minUsageMinutes <= 0) newErrors.usageMinutes = '최소 이용 시간은 1분 이상이어야 합니다.';
    if (maxUsageMinutes < minUsageMinutes) newErrors.usageMinutes = '최대 이용 시간은 최소 이용 시간보다 커야 합니다.';

    if (selectedMajorIds.length === 0) newErrors.majors = '적어도 하나의 학과를 선택해 주세요.';

    const operatingHours: OperatingHoursDetail[] = DAYS
      .filter(d => hours[d].active)
      .map(d => ({
        dayOfWeek: d,
        openTime: hours[d].open,
        closeTime: hours[d].close,
      }));

    if (operatingHours.length === 0) newErrors.hours = '적어도 하루 이상의 운영 시간을 설정해 주세요.';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    onSave({
      name,
      roomNumber,
      minAttendeeCount,
      maxAttendeeCount,
      accessPolicy,
      majorIds: selectedMajorIds,
      operatingHours,
      minUsageMinutes,
      maxUsageMinutes,
    });
  };

  const footer = (
    <>
      <Button
        variant="outline"
        onClick={onClose}
        fullWidth
        className="h-12 border-ui-border text-gray-500 rounded-2xl"
      >
        취소
      </Button>
      <Button
        onClick={handleSubmit}
        isLoading={isPending || (!!room && isDetailLoading)}
        fullWidth
        className="h-12 shadow-lg shadow-brand-primary/10 rounded-2xl"
      >
        저장하기
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={room ? '공간 정보 수정' : '새 공간 정보 입력'}
      footer={footer}
      maxWidth="max-w-[800px]"
    >
      <div className="space-y-8 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="이름"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
            }}
            placeholder="회의실 1"
            error={errors.name}
          />
          <Input
            label="위치"
            value={roomNumber}
            onChange={(e) => {
              setRoomNumber(e.target.value);
              if (errors.roomNumber) setErrors(prev => ({ ...prev, roomNumber: '' }));
            }}
            placeholder="22221"
            error={errors.roomNumber}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Major Checkbox Selection */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">학과</label>
            <div className={`bg-bg-base border ${errors.majors ? 'border-red-200' : 'border-ui-border'} rounded-2xl p-4 h-[160px] overflow-y-auto space-y-2 custom-scrollbar`}>
              {majors.map(m => (
                <label key={m.id} className="flex items-center gap-3 cursor-pointer group p-1 hover:bg-white rounded-lg transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedMajorIds.includes(m.id)}
                    onChange={() => toggleMajor(m.id)}
                    className="w-4 h-4 accent-brand-primary rounded"
                  />
                  <span className={`text-sm font-bold transition-colors ${selectedMajorIds.includes(m.id) ? 'text-brand-primary' : 'text-gray-600 group-hover:text-black'}`}>
                    {m.name}
                  </span>
                </label>
              ))}
            </div>
            {errors.majors && <p className="text-red-500 text-xxs font-bold ml-1">{errors.majors}</p>}
          </div>

          {/* Usage Permission */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">이용 권한</label>
            <div className="space-y-3 bg-bg-base border border-ui-border rounded-2xl p-4 h-[160px] flex flex-col">
              {ACCESS_POLICIES.map(policy => (
                <label key={policy} className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="perm"
                    value={policy}
                    checked={accessPolicy === policy}
                    onChange={() => setAccessPolicy(policy as AccessPolicy)}
                    className="w-4 h-4 accent-brand-primary cursor-pointer"
                  />
                  <span className={`text-sm font-bold transition-colors ${accessPolicy === policy ? 'text-brand-primary' : 'text-gray-600 group-hover:text-black'}`}>
                    {getAccessPolicyLabel(policy)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Capacity & Usage Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">이용 인원</label>
            <div className="flex items-start gap-4">
              <Input
                type="number"
                value={minAttendeeCount || ''}
                onChange={(e) => setMinAttendeeCount(Number(e.target.value))}
                placeholder="최소"
                suffix="명"
                className="flex-1"
              />
              <div className="pt-3 text-gray-300">-</div>
              <Input
                type="number"
                value={maxAttendeeCount || ''}
                onChange={(e) => setMaxAttendeeCount(Number(e.target.value))}
                placeholder="최대"
                suffix="명"
                className="flex-1"
              />
            </div>
            {errors.attendeeCount && <p className="text-red-500 text-xxs font-bold ml-1">{errors.attendeeCount}</p>}
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">이용 시간</label>
            <div className="flex items-start gap-4">
              <Input
                type="number"
                value={minUsageMinutes || ''}
                onChange={(e) => setMinUsageMinutes(Number(e.target.value))}
                placeholder="최소"
                suffix="분"
                className="flex-1"
              />
              <div className="pt-3 text-gray-300">-</div>
              <Input
                type="number"
                value={maxUsageMinutes || ''}
                onChange={(e) => setMaxUsageMinutes(Number(e.target.value))}
                placeholder="최대"
                suffix="분"
                className="flex-1"
              />
            </div>
            {errors.usageMinutes && <p className="text-red-500 text-xxs font-bold ml-1">{errors.usageMinutes}</p>}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">요일별 운영 시간 설정</label>
          <div className={`overflow-hidden border ${errors.hours ? 'border-red-200' : 'border-ui-border'} rounded-2xl shadow-sm`}>
            <table className="w-full text-xs">
              <thead className="bg-bg-base border-b border-ui-border text-gray-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">요일</th>
                  <th className="px-4 py-3 text-center w-20">운영 여부</th>
                  <th className="px-4 py-3 text-left">시작 시간</th>
                  <th className="px-4 py-3 text-left">종료 시간</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-border">
                {DAYS.map(day => (
                  <tr key={day} className={`transition-opacity duration-200 ${!hours[day].active ? 'opacity-40 bg-bg-base/50' : ''}`}>
                    <td className="px-4 py-3 font-bold text-gray-700">{DAY_LABELS[day]}</td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={hours[day].active}
                        onChange={(e) => handleHourChange(day, 'active', e.target.checked)}
                        className="w-4 h-4 accent-brand-primary cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        disabled={!hours[day].active}
                        value={hours[day].open}
                        onChange={(e) => handleHourChange(day, 'open', e.target.value)}
                        className="bg-white border border-ui-border rounded-lg px-3 py-1.5 font-bold text-xs focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 outline-none transition-all disabled:bg-bg-main disabled:cursor-not-allowed"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="time"
                        disabled={!hours[day].active}
                        value={hours[day].close}
                        onChange={(e) => handleHourChange(day, 'close', e.target.value)}
                        className="bg-white border border-ui-border rounded-lg px-3 py-1.5 font-bold text-xs focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 outline-none transition-all disabled:bg-bg-main disabled:cursor-not-allowed"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {errors.hours && <p className="text-red-500 text-xxs font-bold ml-1">{errors.hours}</p>}
        </div>
      </div>
    </Modal>
  );
}