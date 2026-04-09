import { UserType } from "@/types";

export const getUserTypeLabel = (policy: UserType): string => {
  switch (policy) {
    case 'STUDENT':
      return '학생';
    case 'FACULTY':
      return '교원';
    case 'GUEST':
      return '게스트';
    default:
      return policy;
  }
};