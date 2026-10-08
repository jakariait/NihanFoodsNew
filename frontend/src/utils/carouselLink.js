export const MAX_LINK_LENGTH = 2048;

export const normalizeLink = (link) =>
  typeof link === 'string' ? link.trim() : '';

export const isRelativeLink = (link) => {
  const value = normalizeLink(link);
  return value.startsWith('/') && !value.startsWith('//');
};

export const isAbsoluteLink = (link) => {
  const value = normalizeLink(link);
  return /^https?:\/\//i.test(value);
};

export const isValidLink = (link) => {
  const value = normalizeLink(link);
  if (!value) return true;
  if (value.length > MAX_LINK_LENGTH) return false;
  return isRelativeLink(value) || isAbsoluteLink(value);
};