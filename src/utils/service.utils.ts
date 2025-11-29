async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
    ...options,
  });
  if (!res.ok) {
    const error_obj = JSON.parse(await res.text());
    throw new Error(`${error_obj.error}`);
  }
  return res.json() as Promise<T>;
}

export { fetchJson };
