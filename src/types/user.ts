import type { UserType } from './common';
import type { MajorRequest, MajorInfo, MajorApplication } from './major';

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

export interface GetMeResponse {
  id: number;
  email: string;
  name: string;
  studentId: string;
  type: UserType;
  majors: MajorInfo[];
  managingUnitIds: number[];
}

export interface UserDetail {
  id: number;
  email: string;
  name: string;
  studentId: string;
  type: UserType;
  applications: MajorApplication[];
}

export interface UpdateMeRequest {
  name: string;
}