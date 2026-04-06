import { DayOfWeek } from "@/types";

export const formatDate = (dateString: string): string => {
  if (!dateString) return '-';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/ /g, '').slice(0, -1);
  } catch (error) {
    return '-';
  }
};

export const getSunday = (d: Date): Date => {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(new Date(date.setDate(diff)).setHours(0, 0, 0, 0));
};

export const getSaturday = (d: Date): Date => {
  const sunday = getSunday(d);
  return new Date(new Date(sunday).setDate(sunday.getDate() + 6));
};

export const formatApiDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getWeekDays = (d: Date): Date[] => {
  const sunday = getSunday(d);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(sunday);
    date.setDate(sunday.getDate() + i);
    return date;
  });
};


export const formatTime = (time: string): string => {
  if (!time) return '';
  const [h, m, s] = time.split(':').map(Number);
  const date = new Date();
  date.setHours(h, m, s || 0);

  return new Intl.DateTimeFormat('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

export const getDayOfWeekLabel = (day: DayOfWeek): string => {
  const dayMap: Record<DayOfWeek, string> = {
    MONDAY: '월요일',
    TUESDAY: '화요일',
    WEDNESDAY: '수요일',
    THURSDAY: '목요일',
    FRIDAY: '금요일',
    SATURDAY: '토요일',
    SUNDAY: '일요일',
  };
  return dayMap[day];
};

export const SUNDAY_FIRST_DAYS: DayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
];

export const sortOperatingHours = <T extends { dayOfWeek: DayOfWeek }>(hours: T[]): T[] => {
  return [...hours].sort((a, b) => {
    return SUNDAY_FIRST_DAYS.indexOf(a.dayOfWeek) - SUNDAY_FIRST_DAYS.indexOf(b.dayOfWeek);
  });
};

export const formatLocalDateTime = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};
export const getEnumDayOfWeek = (date: Date): DayOfWeek => {
  return SUNDAY_FIRST_DAYS[date.getDay()];
};
