import type { DayOfWeek, AccessPolicy } from './common';
import type { MajorSummary } from './major';
import type { ReservationDetail } from './reservation';

export interface OperatingHoursDetail {
  dayOfWeek: DayOfWeek;
  openTime: string;
  closeTime: string;
}

export interface RoomCreateRequest {
  name: string;
  capacity: number;
  roomNumber: string;
  accessPolicy: AccessPolicy;
  maxBookingMinutes: number;
  majorIds: number[];
  operatingHours: OperatingHoursDetail[];
}

export interface RoomUpdateRequest {
  name: string;
  capacity: number;
  roomNumber: string;
  accessPolicy: AccessPolicy;
  maxBookingMinutes: number;
  majorIds: number[];
  operatingHours: OperatingHoursDetail[];
}

export interface RoomSummary {
  id: number;
  name: string;
}

export interface RoomSummaryList {
  content: RoomSummary[];
}

export interface RoomInfo {
  id: number;
  name: string;
  capacity: number;
  roomNumber: string;
  accessPolicy: AccessPolicy;
  maxBookingMinutes: number;
  majors: MajorSummary[];
}

export interface RoomResponse {
  id: number;
  name: string;
  capacity: number;
  roomNumber: string;
  accessPolicy: AccessPolicy;
  maxBookingMinutes: number;
  canReserve: boolean;
  majors: MajorSummary[];
  operatingHours: OperatingHoursDetail[];
}

export interface DailyRoomScheduleResponse {
  id: number;
  name: string;
  capacity: number;
  accessPolicy: AccessPolicy;
  openTime: string;
  closeTime: string;
  majors: MajorSummary[];
  reservations: ReservationDetail[];
}

export interface WeeklyRoomScheduleResponse {
  id: number;
  reservations: ReservationDetail[];
}
