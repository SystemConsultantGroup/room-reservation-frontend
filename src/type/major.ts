import type { MajorType } from './common';
import { UserInfo } from './user';

export interface MajorRequest {
  id: number;
  type?: MajorType;
}

export interface MajorApplicationRequest {
  majors: MajorRequest[];
}

export interface MajorSummary {
  id: number;
  name: string;
}

export interface MajorInfo {
  id: number;
  name: string;
  type: MajorType;
}

export interface MajorApplication {
  id: number;
  major: MajorSummary;
  type: MajorType;
}

export interface MajorApplicationDetail {
  user: UserInfo;
  applications: MajorApplication[];
}
