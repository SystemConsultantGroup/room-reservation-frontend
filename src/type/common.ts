export interface PageResponse<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export type AccessPolicy = 'ONLY_FIRST_MAJOR' | 'ONLY_FACULTY' | 'ALL';

export type UserType = 'STUDENT' | 'FACULTY' | 'GUEST';

export type MajorType = 'FIRST' | 'SECOND' | 'THIRD';
