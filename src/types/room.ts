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
  roomNumber: string;
  accessPolicy: AccessPolicy;
  minAttendeeCount: number;
  maxAttendeeCount: number;
  minUsageMinutes: number;
  maxUsageMinutes: number;
  majorIds: number[];
  operatingHours: OperatingHoursDetail[];
}

export interface RoomUpdateRequest {
  name: string;
  roomNumber: string;
  accessPolicy: AccessPolicy;
  minAttendeeCount: number;
  maxAttendeeCount: number;
  minUsageMinutes: number;
  maxUsageMinutes: number;
  majorIds: number[];
  operatingHours: OperatingHoursDetail[];
}

export interface RoomSummary {
  id: number;
  name: string;
  canReserve: boolean;
}

export interface RoomSummaryList {
  rooms: RoomSummary[];
}

export interface RoomInfo {
  id: number;
  name: string;
  roomNumber: string;
  accessPolicy: AccessPolicy;
  minAttendeeCount: number;
  maxAttendeeCount: number;
  minUsageMinutes: number;
  maxUsageMinutes: number;
  majors: MajorSummary[];
}

export interface RoomResponse {
  id: number;
  name: string;
  roomNumber: string;
  accessPolicy: AccessPolicy;
  minAttendeeCount: number;
  maxAttendeeCount: number;
  minUsageMinutes: number;
  maxUsageMinutes: number;
  majors: MajorSummary[];
  operatingHours: OperatingHoursDetail[];
}

export interface DailyRoomScheduleResponse {
  id: number;
  name: string;
  roomNumber: string;
  openTime?: string;
  closeTime?: string;
  majors: MajorSummary[];
  reservations: ReservationDetail[];
}

export interface WeeklyRoomScheduleResponse {
  id: number;
  reservations: ReservationDetail[];
}
