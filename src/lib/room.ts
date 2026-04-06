import { AccessPolicy } from '@/types';

export const ACCESS_POLICIES = ['ONLY_FIRST_MAJOR', 'ALL', 'ONLY_FACULTY'] as const satisfies readonly AccessPolicy[];

export const getAccessPolicyLabel = (policy: AccessPolicy): string => {
  switch (policy) {
    case 'ONLY_FIRST_MAJOR':
      return '제1전공생 전용';
    case 'ONLY_FACULTY':
      return '교원 전용';
    case 'ALL':
      return '전체 허용';
    default:
      return policy;
  }
};
