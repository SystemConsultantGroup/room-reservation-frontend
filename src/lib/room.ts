import { AccessPolicy } from '@/type';

export const ACCESS_POLICIES: AccessPolicy[] = ['ONLY_FIRST_MAJOR', 'ALL', 'ONLY_FACULTY'];

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
