/**
 * Creates a URL-safe slug from English or Bangla text.
 * Bangla characters are kept as-is (Unicode URLs work in modern browsers).
 */
function createSlug(text, { lower = true, replacement = '-' } = {}) {
  let slug = String(text ?? '').trim();

  // Keep letters (Latin + Bangla), marks (matras), and digits; replace the rest
  slug = slug.replace(/[^\p{L}\p{M}\p{N}]+/gu, replacement);

  // Collapse repeated separators and trim edges
  const sep = replacement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  slug = slug.replace(new RegExp(`${sep}{2,}`, 'g'), replacement);
  slug = slug.replace(new RegExp(`^${sep}|${sep}$`, 'g'), '');

  if (lower) {
    slug = slug.toLowerCase();
  }

  return slug;
}

module.exports = createSlug;
