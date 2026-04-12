import { useQueryClient, QueryKey } from '@tanstack/react-query';
import { useDebounce } from './useDebounce';

interface UseCachedSearchDebounceProps {
  searchTerm: string;
  resolveQueryKey: (keyword: string) => QueryKey;
  debounceTime?: number;
}

export function useCachedSearchDebounce<T>({
  searchTerm,
  resolveQueryKey,
  debounceTime = 300,
}: UseCachedSearchDebounceProps) {
  const queryClient = useQueryClient();
  const { debouncedValue, isDebouncing } = useDebounce(searchTerm, debounceTime);

  const cachedData = queryClient.getQueryData<T>(resolveQueryKey(searchTerm));
  const hasCachedData = !!cachedData;

  return {
    debouncedValue,
    cachedData,
    isDebouncing: isDebouncing && !hasCachedData,
  };
}
