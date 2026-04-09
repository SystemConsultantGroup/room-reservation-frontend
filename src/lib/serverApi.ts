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

  let host = '';
  let proto = 'https';
  let port = '443';

  const headerList = await headers();
  const hostWithPort = headerList.get('host') || '';
  const [splitHost, splitPort] = hostWithPort.split(':');

  host = splitHost || '';
  proto = headerList.get('x-forwarded-proto') || 'https';
  port = splitPort || (proto === 'https' ? '443' : '80');

  const fetchHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Forwarded-Proto': proto,
    'X-Forwarded-Port': port,
    ...(options?.headers as Record<string, string> || {}),
  };

  fetchHeaders['X-Forwarded-Host'] = host;

  const isStandardPort = (proto === 'http' && port === '80') || (proto === 'https' && port === '443');
  fetchHeaders['Origin'] = isStandardPort
    ? `${proto}://${host}`
    : `${proto}://${host}:${port}`;

  const res = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    next: {
      revalidate: 3600,
      tags,
      ...options?.next,
    },
    headers: fetchHeaders,
  });

  if (!res.ok) {
    console.error(`Failed to fetch: ${endpoint}`);
    console.error(`Status: ${res.status} ${res.statusText}`);
    console.error(`Request Headers Sent:`, JSON.stringify(fetchHeaders, null, 2));

    throw new Error(`Failed to fetch ${endpoint}: ${res.status} ${res.statusText}`);
  }

  return await res.json() as T;
}