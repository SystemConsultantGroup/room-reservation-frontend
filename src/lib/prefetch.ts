import { QueryClient } from '@tanstack/react-query';
import { ManagementUnitDetail } from '@/type/managementUnit';
import { managementUnitKeys } from '@/hooks/queries';
import { serverFetch } from './serverApi';
import { MANAGEMENT_UNIT_CACHE_TAG } from '@/constants/cacheTags';

export async function prefetchManagementUnit(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: managementUnitKeys.all,
    queryFn: () => serverFetch<ManagementUnitDetail>('/managementUnit', [MANAGEMENT_UNIT_CACHE_TAG]),
  });
}
