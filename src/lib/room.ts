import { AccessPolicy } from '@/types';

export const ACCESS_POLICIES = ['ONLY_FIRST_MAJOR', 'ALL', 'ONLY_FACULTY'] as const satisfies readonly AccessPolicy[];

export const getAccessPolicyLabel = (policy: AccessPolicy): string => {
  switch (policy) {
    case 'ONLY_FIRST_MAJOR':
      return '원전공생 및 교원';
    case 'ONLY_FACULTY':
      return '교원 전용';
    case 'ALL':
      return '원전공생, 복수전공생 및 교원';
    default:
      return policy;
  }
};
