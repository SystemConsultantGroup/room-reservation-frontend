import { useQueryClient, QueryKey } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';

interface UseCachedSearchDebounceProps {
  searchTerm: string;
  resolveQueryKey: (keyword: string) => QueryKey;
  debounceTime?: number;
}

/**
 * 검색어를 디바운싱 처리하고, 캐시된 결과가 있다면 즉시 반환하는 커스텀 훅
 */
export function useCachedSearchDebounce<R = any>({
  searchTerm,
  resolveQueryKey,
  debounceTime = 300,
}: UseCachedSearchDebounceProps) {
  const queryClient = useQueryClient();
  const { debouncedValue, isDebouncing } = useDebounce(searchTerm, debounceTime);

  const cachedData = queryClient.getQueryData<R>(resolveQueryKey(searchTerm));
  const hasCachedData = !!cachedData;

  return {
    debouncedValue,
    cachedData,
    isDebouncing: isDebouncing && !hasCachedData,
  };
}
