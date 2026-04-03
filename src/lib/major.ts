import { MajorType } from '@/type';

export const MAJOR_TYPES = ['FIRST', 'SECOND', 'THIRD'] as const satisfies readonly MajorType[];

export const MAJOR_TYPE_ORDER: Record<MajorType, number> = {
  FIRST: 1,
  SECOND: 2,
  THIRD: 3,
};

export const sortMajors = <T extends { type?: MajorType }>(majors: T[]): T[] => {
  return [...majors].sort((a, b) => {
    const orderA = a.type ? MAJOR_TYPE_ORDER[a.type] : 99;
    const orderB = b.type ? MAJOR_TYPE_ORDER[b.type] : 99;
    return orderA - orderB;
  });
};


export const getMajorTypeLabel = (type?: MajorType): string => {
  switch (type) {
    case 'FIRST': return '제1전공';
    case 'SECOND': return '제2전공';
    case 'THIRD': return '제3전공';
    default: return '';
  }
};
