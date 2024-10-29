export const joinPathWithQuery = (
  path: string,
  query: Record<string, unknown>,
): string => {
  const queryString = Object.keys(query)
    .map((key) => `${key}=${query[key]}`)
    .join('&');

  return `${path}${queryString ? `?${queryString}` : ''}`;
};
