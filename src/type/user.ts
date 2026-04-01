import type { UserType } from './common';
import type { MajorRequest, MajorInfo } from './major';

export interface OnboardingRequest {
  name: string;
  studentId?: string;
  userType: UserType;
  majors: MajorRequest[];
}

export interface UserSummary {
  id: number;
  name: string;
}

export interface UserInfo {
  id: number;
  email: string;
  name: string;
  studentId: string;
  type: UserType;
  majors: MajorInfo[];
}

export interface UserDetail {
  id: number;
  email: string;
  name: string;
  studentId: string;
  type: UserType;
  majors: MajorInfo[];
  managingUnitIds: number[];
}
