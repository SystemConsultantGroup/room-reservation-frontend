import type { UserSummary } from './user';

export interface CreateReservationRequest {
  roomId: number;
  startTime: string;
  endTime: string;
  attendeeCount: number;
  purpose: string;
}

export interface ReservationDetail {
  id: number;
  user: UserSummary;
  startTime: string;
  endTime: string;
  attendeeCount: number;
  purpose: string;
}

export interface ReservationList {
  reservations: ReservationDetail[];
}
