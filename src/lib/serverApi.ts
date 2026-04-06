import { headers } from 'next/headers';

export async function serverFetch<T>(
  endpoint: string,
  tags: string[] = [],
  options?: RequestInit & { next?: NextFetchRequestConfig }
): Promise<T> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    throw new Error('NEXT_PUBLIC_API_URL is not defined');
  }

  const headerList = await headers();
  const hostWithPort = headerList.get('host') || '';
  const [host, hostPort] = hostWithPort.split(':');
  const proto = headerList.get('x-forwarded-proto') || 'https';
  const port = hostPort || (proto === 'https' ? '443' : '80');

  const res = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    next: {
      revalidate: 3600,
      tags,
      ...options?.next,
    },
    headers: {
      'Content-Type': 'application/json',
      'X-Forwarded-Host': host,
      'X-Forwarded-Proto': proto,
      'X-Forwarded-Port': port,
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
  }

  return await res.json() as T;
}
