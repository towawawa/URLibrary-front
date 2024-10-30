export const joinPathWithQuery = (
  path: string,
  query: Record<string, unknown>,
): string => {
  // null の値は含めないように除外
  const queryString = Object.entries(query)
    .filter(([, value]) => value !== null)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return `${path}${queryString ? `?${queryString}` : ''}`;
};
