'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useManagedMajorsQuery } from '@/hooks/queries/useMajor';
import { useRoomQuery } from '@/hooks/queries/useRoom';
import { RoomInfo, AccessPolicy, DayOfWeek, OperatingHoursDetail, RoomCreateRequest, RoomUpdateRequest } from '@/type';
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
  const [capacity, setCapacity] = useState<number>(0);
  const [accessPolicy, setAccessPolicy] = useState<AccessPolicy>('ONLY_FIRST_MAJOR');
  const [selectedMajorIds, setSelectedMajorIds] = useState<number[]>([]);
  const [hours, setHours] = useState<Record<DayOfWeek, { active: boolean; open: string; close: string }>>(
    DAYS.reduce((acc, day) => ({
      ...acc,
      [day]: { active: true, open: '09:00', close: '22:00' }
    }), {} as any)
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
      setCapacity(room.capacity);
      setAccessPolicy(room.accessPolicy);
      setSelectedMajorIds(room.majors.map(m => m.id));

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
        }, {} as any);
        setHours(newHours);
      }
    } else {
      setName('');
      setRoomNumber('');
      setCapacity(0);
      setAccessPolicy('ONLY_FIRST_MAJOR');
      setSelectedMajorIds([]);
      setHours(DAYS.reduce((acc, day) => ({
        ...acc,
        [day]: { active: true, open: '09:00', close: '22:00' }
      }), {} as any));
    }
  }, [room, isOpen, roomDetail]);

  const toggleMajor = (id: number) => {
    setSelectedMajorIds(prev =>
      prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]
    );
    if (errors.majors) setErrors(prev => ({ ...prev, majors: '' }));
  };

  const handleHourChange = (day: DayOfWeek, field: 'active' | 'open' | 'close', value: any) => {
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
    if (capacity <= 0) newErrors.capacity = '수용 인원은 1명 이상이어야 합니다.';
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
      capacity,
      accessPolicy,
      majorIds: selectedMajorIds,
      operatingHours,
      maxBookingMinutes: 120,
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
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">이름</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              placeholder="공간 이름을 입력하세요"
              className={`w-full bg-bg-base border ${errors.name ? 'border-red-200' : 'border-ui-border'} rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 transition-all`}
            />
            {errors.name && <p className="text-red-500 text-xxs font-bold ml-1">{errors.name}</p>}
          </div>
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">위치</label>
            <input
              type="text"
              value={roomNumber}
              onChange={(e) => {
                setRoomNumber(e.target.value);
                if (errors.roomNumber) setErrors(prev => ({ ...prev, roomNumber: '' }));
              }}
              placeholder="예: 경영관 지하 1층"
              className={`w-full bg-bg-base border ${errors.roomNumber ? 'border-red-200' : 'border-ui-border'} rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 transition-all`}
            />
            {errors.roomNumber && <p className="text-red-500 text-xxs font-bold ml-1">{errors.roomNumber}</p>}
          </div>
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

          {/* Usage Permission & Capacity */}
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">이용 권한</label>
              <div className="space-y-3 bg-bg-base border border-ui-border rounded-2xl p-4">
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
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">수용 인원</label>
              <div className="relative">
                <input
                  type="number"
                  value={capacity || ''}
                  onChange={(e) => {
                    setCapacity(Number(e.target.value));
                    if (errors.capacity) setErrors(prev => ({ ...prev, capacity: '' }));
                  }}
                  placeholder="수용 인원"
                  className={`w-full bg-bg-base border ${errors.capacity ? 'border-red-200' : 'border-ui-border'} rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-brand-primary/10 focus:border-brand-primary/20 transition-all pr-12`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">명</span>
              </div>
              {errors.capacity && <p className="text-red-500 text-xxs font-bold ml-1">{errors.capacity}</p>}
            </div>
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
